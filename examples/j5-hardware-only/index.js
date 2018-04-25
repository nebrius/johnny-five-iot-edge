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

const Raspi = require('raspi-io');
const five = require('johnny-five');
const Oled = require('oled-js');
const board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
  const led = new five.Led("GPIO4");
  const button = new five.Button("GPIO17");
  const temperature = new five.Thermometer({
    controller: "MCP9808"
  });
  const opts = {
    width: 128,
    height: 64,
    address: 0x3C
  };
  const oled = new Oled(board, five, opts);
  const font = require('oled-font-5x7');
  let ledStatus = "on";
  let isMonitoring = true;

  // Turn on LED and set up OLED
  led.on();
  oled.fillRect(1, 1, 128, 64, 0);
  oled.setCursor(1, 1);
  oled.writeString(font, 1, "System enabled.", 1, true, 2);


  // Toggle monitoring with button press
  button.on("press", function() {
    console.log( "Button pressed" );
    isMonitoring = !isMonitoring;
    oled.fillRect(1, 1, 128, 64, 0);
    oled.setCursor(1, 1);
    oled.writeString(font, 1, "Temperature OK.", 1, true, 2);
  });

  // Print temperature to console and OLED
  temperature.on("data", function(){
    let tempCelcius = this.C
    //console.log("celsius: " + tempCelcius);
    // If system is too hot, blink LED and display warning
    if (tempCelcius > 25  && isMonitoring && ledStatus !== "blink") {
      led.blink(500);
      ledStatus = "blink";
      oled.setCursor(1, 1);
      oled.writeString(font, 1, "ALERT! Temperature too high.", 1, true, 2);
    }
    // If system temperature is OK, leave LED on and display message
    else if (tempCelcius <= 25 && isMonitoring && ledStatus !== "on" ) {
      ledStatus === "blink" ? led.stop().on() : led.on();
      ledStatus = "on";
      oled.setCursor(1, 1);
      oled.writeString(font, 1, "Temperature OK.", 1, true, 2);
    }
      // If system is disabled, turn LED off and display message
    else if (!isMonitoring) {
      led.stop().off();
      ledStatus = "off";
      oled.setCursor(1, 1);
      oled.writeString(font, 1, "System disabled.", 1, true, 2);
    }
      
    console.log("LED Status: " + ledStatus + ", Monitoring?: " + isMonitoring + ", Temperature: " + tempCelcius + " deg C");

  });
     
});
