'use strict';

var Client = require('azure-iothub').Client;

var connectionString = '{iothub connection string}';
var methodName = 'write';
var deviceId = '{devicdId{}}';
var moduleId = '{Johnny5IoTEdgeModuleId}';

const write = {
    peripheral: {
      name: "alarm",
      type: "Led",
    },
    state: {
      method: "on"
    }
  };

var client = Client.fromConnectionString(connectionString);

var methodParams = {
    methodName: methodName,
    payload: write,
    timeoutInSeconds: 30
};

client.invokeDeviceMethod(deviceId, moduleId, methodParams, function (err, result) {
    if (err) {
        console.error('Failed to invoke method \'' + methodName + '\': ' + err.message);
    } else {
        console.log(methodName + ' on ' + deviceId + ':');
        console.log(JSON.stringify(result, null, 2));
    }
});