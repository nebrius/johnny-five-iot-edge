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
    (next) => client.getTwin(next)
  ], (twin, err) => {
    if (err) {
      cb(err);
      return;
    }

    twin.on('properties.desired', (delta) => {
      console.log(delta);
      // TODO: processConfig()
    });

    client.on('inputMessage', (inputName, msg) => client.complete(msg, (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(result);
      // TODO: processWrite()
    }));

    connected = true;
    cb();
  });
}

function sendMessage(alias, message, cb) {
  if (!connected) {
    throw new Error('Cannot send messages before connecting to IoT Edge');
  }
  client.sendOutputEvent(alias, new Message(message), cb);
}
