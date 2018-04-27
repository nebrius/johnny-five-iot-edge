/*
MIT License

Copyright (c) 2018 Johnny-Five IoT Edge contributors

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
const { Client } = require('azure-iot-device');
const { Message } = require('azure-iot-device');
const { waterfall } = require('async');
const { processConfig, processWrite } = require('./device');
const { getEnvironmentVariable } = require('./util');

module.exports = {
  init,
  sendMessage
};

let client;
let connected = false;

function init(cb) {
  client = Client.fromConnectionString(getEnvironmentVariable('EdgeHubConnectionString'), Transport);
  client.on('error', (err) => console.error(err.message));

  waterfall([
    (next) => client.open((err) => next(err)), // there's an extra argument we don't care about
    (next) => client.getTwin(next),
    (twin, whatIsThis, next) => { // Seriously, what is that argument and where is it coming from?
      let { config } = twin.properties.desired;
      if (!config) {
        console.warn('No device configuration available in device twin, creating empty config');
        config = JSON.stringify({ peripherals: [] });
      }
      const patch = { config };
      if (twin.properties.desired.$version !== twin.properties.reported.$version) {
        twin.properties.reported.update(patch, (err) => next(err, twin));
      } else {
        next(undefined, twin);
      }
    }
  ], (err, twin) => {
    if (err) {
      cb(err);
      return;
    }
    client.on('message', (msg) => {
      processWrite(JSON.parse(msg.data.toString()));
      client.complete(msg);
    });
    connected = true;
    processConfig(JSON.parse(twin.properties.reported.config));
    cb();
  });
}

function sendMessage(alias, message, cb) {
  if (!connected) {
    throw new Error('Cannot send messages before connecting to IoT Edge');
  }
  client.sendOutputEvent(alias, new Message(JSON.stringify(message)), cb);
}
