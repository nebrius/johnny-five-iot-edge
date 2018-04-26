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

const { init: initDevice, processConfig, processRead } = require('./device');
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

  // Testing code
  processConfig({
    peripherals: [{
      type: "Thermometer",
      name: "myThermometer",
      settings: {
        controller: "MCP9808"
      },
      outputAlias: "alias1"
    }, {
      type: "Button",
      name: "myButton",
      settings: {
        pin: "GPIO20"
      },
      outputAlias: "alias2"
    }, {
      type: "Led",
      name: "myLed",
      settings: {
        pin: "GPIO18"
      },
      outputAlias: "alias1"
    }]
  });
  processWrite({
    peripheral: {
      name: "myLed",
      type: "Led",
    },
    state: {
      method: "pulse",
      period: 500,
    }
  });
});
