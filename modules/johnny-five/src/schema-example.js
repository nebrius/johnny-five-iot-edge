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

const { validateConfig, validateRead, validateWrite } = require('./payloadValidator');

try {
  const config = {
    peripherals: [{
      type: "Thermometer",
      name: "motor1thermometer",
      settings: {
        controller: "MCP9808"
      },
      outputAlias: "alias1"
    }, {
      type: "Led",
      name: "alarm1",
      settings: {
        pin: "P1-7"
      },
      outputAlias: "alias2"
    }, {
      type: "Led",
      name: "alarm2",
      settings: {
        pin: "P1-9"
      },
      outputAlias: "alias1"
    }]
  };
  validateConfig(config);
  console.log('Success');
} catch(errors) {
  console.error(JSON.stringify(errors, null, '  '));
}

try {
  const read = {
    peripheral: {
      name: "motor1thermometer",
      type: "Thermometer",
    },
    state: {
      celsius: 0,
      fahrenheit: 32,
      kelvin: 273
    }
  };
  validateRead(read);
  console.log('Success');
} catch(errors) {
  console.error(JSON.stringify(errors, null, '  '));
}

try {
  const write = {
    peripheral: {
      name: "alarm1",
      type: "Led",
    },
    state: {
      method: "on"
    }
  };
  validateWrite(write);
  console.log('Success');
} catch(errors) {
  console.error(JSON.stringify(errors, null, '  '));
}
