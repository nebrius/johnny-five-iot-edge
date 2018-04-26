'use strict';

var Transport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var fs = require('fs');
const { processConfig, processWrite } = require('./device');

module.exports = {
  init,
  sendMessage
};

function init(cb) {
  // TODO
  setImmediate(cb);

  // Testing code
  setTimeout(() => {
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
  }, 2000);

  return;

  var connectionString = process.env.EdgeHubConnectionString;
  var caCertFile = process.env.EdgeModuleCACertificateFile;

  var client = Client.fromConnectionString(connectionString, Transport);
  console.log("Connection String: " + connectionString);

  client.on('error', function (err) {
    console.error(err.message);
  });

  client.setOptions({
    ca: fs.readFileSync(caCertFile).toString('ascii')
  }, function (err) {
    if (err) {
      console.log('error:' + err);
    } else {
      // connect to the edge instance
      client.open(function (err) {
        if (err) {
          console.error('Could not connect: ' + err.message);
        } else {
          console.log('IoT Hub module client initialized');

          // Act on input messages to the module.
          client.on('inputMessage', function (inputName, msg) {
            pipeMessage(inputName, msg);
          });
        }
      });
    }
  });

  // This function just pipes the messages without any change.
  function pipeMessage(inputName, msg) {
    client.complete(msg, printResultFor('Receiving message:'));

    if (inputName === 'input1') {
      var message = msg.getBytes().toString('utf8');
      if (message) {
        var outputMsg = new Message(message);
        client.sendOutputEvent('output1', outputMsg, printResultFor('Sending received message'));
      }
    }
  }

  // Helper function to print results in the console
  function printResultFor(op) {
    return function printResult(err, res) {
      if (err) {
        console.log(op + ' error: ' + err.toString());
      }
      if (res) {
        console.log(op + ' status: ' + res.constructor.name);
      }
    };
  }
}

function sendMessage(payload, cb) {
  // TODO
  console.log(payload);
  if (cb) {
    setImmediate(cb);
  }
}
