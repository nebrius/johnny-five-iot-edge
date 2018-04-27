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

const { Mqtt: Transport } = require('azure-iot-device-mqtt');
const { Client, Message } = require('azure-iot-device');

const edgeHubConnectionString = process.env.EdgeHubConnectionString;
if (typeof edgeHubConnectionString !== 'string') {
  throw new Error(`Environment variable "EdgeHubConnectionString" is not defined`);
}

client = Client.fromConnectionString(edgeHubConnectionString, Transport);

client.on('error', (err) => console.error(err.message));

client.open((err) => {
  if (err) {
    console.error(err);
    process.exit(-1);
    return;
  }

  let ledOn = false;

  client.onDeviceMethod('read', (request, response) => {
    const message = request.payload;
    console.debug(`Received read message: ${JSON.stringify(message)}`);
    response.send(200, 'OK', (err) => {
      if (err) {
        console.error(`Could not acknowledge read message: ${err}`);
        return;
      }
      switch (message.peripheral.type) {
        case 'Button':
          ledOn = !ledOn;
          const payload = {
            peripheral: {
              name: 'alarm',
              type: 'Led'
            },
            state: {
              method: ledOn ? 'on' : 'off'
            }
          };
          client.invokeDeviceMethod(alias, {
            methodName: 'read',
            payload,
            timeoutInSeconds: SEND_MESSAGE_TIMEOUT_IN_SECONDS
          }, cb);
          break;
        case 'Thermometer':
          // TODO
          break;
      }
    });
  });
});
