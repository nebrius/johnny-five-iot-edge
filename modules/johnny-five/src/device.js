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

const five = require('johnny-five');
const Raspi = require('raspi-io');
const { validateConfig, validateRead, validateWrite } = require('./payloadValidator');

const { create: createButton } = require('./devices/button');
const { create: createLed } = require('./devices/led');
const { create: createThermometer } = require('./devices/thermometer');

module.exports = {
  init,
  processConfig,
  processWrite
};

let board;
let peripherals = {};
let sendMessage;

function init(send, cb) {
  sendMessage = send;
  board = new five.Board({
    io: new Raspi({ enableSoftPwm: true }),
    repl: false
  });
  board.on('ready', cb);
}

function instantiatePeripheral(config) {
  switch (config.type) {
    case 'Led':
      return createLed(config);
    case 'Thermometer':
      return createThermometer(config);
    case 'Button':
      return createButton(config);
    default:
      throw new Error(`Unknown peripheral type ${config.type}`);
  }
}

function processConfig(configMessage) {
  validateConfig(configMessage);
  for (const peripheral of configMessage.peripherals) {
    if (!peripherals[peripheral.name]) {
      peripherals[peripheral.name] = instantiatePeripheral(peripheral);
      peripherals[peripheral.name].on('state-change', (state) => sendMessage(peripheral.outputAlias, {
        name: peripheral.name,
        type: peripheral.type,
        state
      }));
    }
  }
}

function processWrite(writeMessage) {
  validateWrite(writeMessage);
  if (!peripherals[writeMessage.peripheral.name]) {
    throw new Error(`Unknown peripheral ${writeMessage.peripheral.name}`);
  }
  peripherals[writeMessage.peripheral.name].updateState(writeMessage.state);
}
