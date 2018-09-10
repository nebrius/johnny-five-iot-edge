/*
MIT License

Copyright (c) 2018 IoT Edge for Makers module contributors contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict';

const { Mqtt: Transport } = require('azure-iot-device-mqtt');
const { ModuleClient, Message } = require('azure-iot-device');
const { waterfall } = require('async');
const { readFile } = require('fs');
const { processConfig, processWrite } = require('./device');
const { getEnvironmentVariable } = require('./util');

module.exports = {
  init,
  sendMessage
};

let client;
let connected = false;

const SEND_MESSAGE_TIMEOUT_IN_SECONDS = 30;

function init(cb) {
  
  console.debug('Connecting to IoT Edge...');
  ModuleClient.fromEnvironment(Transport, (err, moduleClient) => {
    if (err) {
      console.error(`IoT Edge Connection error: ${err}`);
      cb(err);
    }
    client = moduleClient;
    console.debug('Connected to IoT Edge');
    configure(cb);
  });
}

function configure(cb) {
  waterfall([
    (next) => {
      console.debug('Fetching device twin...');
      client.getTwin((err, twin) => {
        console.debug('Fetched device twin');
        next(err, twin);
      });
    },
    (twin, next) => {
      let { config } = twin.properties.desired;
      // if (!config) {
      //   console.warn('No device configuration available in device twin, creating empty config');
      //   config = JSON.stringify({ peripherals: [] });
      // }
      const patch = { config };
      if (twin.properties.desired.$version !== twin.properties.reported.$version) {
        console.debug('Updating reported device twin properties...');
        twin.properties.reported.update(patch, (err) => {
          console.debug('Updated reported device twin properties');
          next(err, twin);
        });
      } else {
        console.debug('Reported device twin properties already up to date, skipping update');
        next(undefined, twin);
      }
    }
  ], (err, twin) => {
    if (err) {
      cb(err);
      return;
    }

    client.on('error', (err) => console.error(`Client error: ${err}`));

    client.onMethod('write', (request, response) => {
      console.debug(`Received write message: ${JSON.stringify(request.payload)}`);
      try {
        processWrite(request.payload);
        response.send(200, 'OK', (err) => {
          if (err) {
            console.error(`An error ocurred when sending a method response: ${err}`);
          }
        });
      } catch(e) {
        response.send(400, 'Invalid Write Message', (err) => {
          if (err) {
            console.error(`An error ocurred when sending a method response: ${err}`);
          }
        });
      }
    });

    connected = true;
    let config;
    try {
      config = JSON.parse(twin.properties.reported.config);
    } catch(e) {
      console.error(`Received invalid device twin ${JSON.stringify(twin.properties)}: ${e}`);
      cb(e);
      return;
    }
    processConfig(config);
    cb();
  });
}

function sendMessage(alias, payload, cb) {
  if (!connected) {
    throw new Error('Cannot send messages before connecting to IoT Edge');
  }
  console.debug(`Sending read message: ${JSON.stringify(payload)}`);
  const message = new Message(JSON.stringify(payload));
  client.sendEvent(message, cb);
}
