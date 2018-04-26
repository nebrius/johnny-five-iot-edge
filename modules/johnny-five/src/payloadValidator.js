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

const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');

module.exports = {
  validateConfig,
  validateRead,
  validateWrite
};

// Create a validator with the latest JSON Schema spec as of this writing
const configAjv = new Ajv();
configAjv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
const configValidator = configAjv.compile(
  JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'schema', 'config.json')).toString()
  )
);

// Create a validator with the latest JSON Schema spec as of this writing
const readAjv = new Ajv();
readAjv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
const readValidator = readAjv.compile(
  JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'schema', 'read.json')).toString()
  )
);

// Create a validator with the latest JSON Schema spec as of this writing
const writeAjv = new Ajv();
writeAjv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
const writeValidator = writeAjv.compile(
  JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'schema', 'write.json')).toString()
  )
);

function validateConfig(message) {
  if (!configValidator(message)) {
    throw configValidator.errors;
  }
}

function validateRead(message) {
  if (!readValidator(message)) {
    throw readValidator.errors;
  }
}

function validateWrite(message) {
  if (!writeValidator(message)) {
    throw writeValidator.errors;
  }
}
