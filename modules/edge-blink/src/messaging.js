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
const { Client, Message } = require('azure-iot-device');
const { waterfall } = require('async');
const { readFile } = require('fs');
const { getEnvironmentVariable } = require('./util');

module.exports = {
  init
};

let client;
let connected = false;

const SEND_MESSAGE_TIMEOUT_IN_SECONDS = 30;

function init(cb) {
  const caCertFilePath = getEnvironmentVariable('EdgeModuleCACertificateFile');
  const connectionString = getEnvironmentVariable('EdgeHubConnectionString');

  client = Client.fromConnectionString(connectionString, Transport);

  waterfall([
    (next) => {
      console.debug('Reading caCertFile...');
      readFile(caCertFilePath, "utf-8", (err, contents)=>{
        if(err){
          next(err);
          return;
        }
        console.debug('CaCertFile read successfully');
        next(undefined, contents);
      });
    },
    (caCertFileContents, next) => {
      console.debug('Setting CaCert options for client...');
      client.setOptions({
        ca: caCertFileContents
      }, (err) => {
        if(err){
          next(err);
          return;
        }
        console.debug('CaCertOptions set successfully')
        next();
      });
    },
    (next) => {
      console.debug('Connecting to IoT Edge...');
      client.open((err) => { // Note: do not pass `next` in directly here, there's some extra ghost args
        if(err){
          next(err);
          return;
        }
        console.debug('Connected to IoT Edge');
        next();
      });
    },
    (next) => {
      console.debug('Setting up J5Messages route listener...');

      // Act on input messages to the module.
      client.on('J5Messages', function (inputName, msg) {
        pipeMessage(inputName, msg);
      });
      next();
    },
    (next) => {
      console.debug('Configured J5Messages route listener');
    }
  ], (err) => {
    if (err) {
      cb(err);
      return;
    }

    client.on('error', (err) => console.error(`Client error: ${err}`));

    connected = true;
    
    cb();
  });
}

function pipeMessage(inputName, msg) {
  client.complete(msg, printResultFor('Receiving J5 Module message:'));

//  if (inputName === 'buttonPress') {
    var message = msg.getBytes().toString('utf8');
    if (message) {
      var outputMsg = new Message(message);
      client.sendOutputEvent('output', outputMsg, printResultFor('Sending received message'));
    }
  }
//}

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) {
      console.debug(op + ' error: ' + err.toString());
    }
    if (res) {
      console.debug(op + ' status: ' + res.constructor.name);
    }
  };
}