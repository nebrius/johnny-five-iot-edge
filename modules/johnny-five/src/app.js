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

const { init: initDevice, processTwin } = require('./device');
const { parallel } = require('async');

parallel([
  initDevice
], (err) => {
  if (err) {
    console.err(err);
    process.exit(-1);
    return;
  }
  console.log('running');
  processTwin({
    peripherals: [{
      type: "Thermometerssss",
      name: "motor1thermometer",
      settings: {
        controller: "MCP9808"
      },
      state: {
        celsius: 0,
        faherenheit: 32,
        kelvin: 217
      },
      outputAlias: "alias1"
    }, {
      type: "Led",
      name: "alarm1",
      settings: {
        pin: "p1-7"
      },
      state: {
        pulse: 500
      },
      outputAlias: "alias2"
    }, {
      type: "Led",
      name: "alarm2",
      settings: {
        pin: "p1-9"
      },
      state: {
        pulse: 500
      },
      outputAlias: "alias1"
    }]
  });
});
