const Raspi = require('raspi-io');
const five = require('johnny-five');
const Oled = require('oled-js');
const board = new five.Board({
  io: new Raspi()
});
let ledStatus = "off"

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

  // Blink LED at 500ms interval
  //led.blink(500);

  // Clear OLED
  oled.fillRect(1, 1, 128, 64, 1);

  // Print temperature to console and OLED
  temperature.on("data", function(){
      let tempCelcius = this.C
      console.log("celsius: " + tempCelcius);
      if (tempCelcius > 25) {
        ledStatus = "blink"
      }
      else {
        led.on();
        oled.setCursor(1, 1);
        oled.writeString(font, 1, "Temp", 1, true, 2);
      } 

  });
     

  led.blink(500);

  // Increase LED blink rate on button press
  button.on("press", function() {
    console.log( "Button pressed" );
    led.blink(100);
  });

  

});
