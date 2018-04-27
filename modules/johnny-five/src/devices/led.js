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
const { EventEmitter } = require('events');

module.exports = {
  create
};

function create(config) {
  const emitter = new EventEmitter();

  const led = emitter.instance = new five.Led(config.settings);

  emitter.updateState = (newState) => {

    if (typeof newState.brightness === 'number') {
      led.brightness(newState.brightness);
    }

    switch (newState.method) {
      case 'on':
        led.on();
        break;
      case 'off':
        led.off();
        break;
      case 'strobe':
      case 'blink':
        led.strobe(newState.period);
        break;
      case 'pulse':
        led.pulse(newState.period);
        break;
    }
  };

  return emitter;
}
