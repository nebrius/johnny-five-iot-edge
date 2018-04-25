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
  let ledStatus = "off";
  let isMonitoring = true;

  // Clear OLED
  oled.fillRect(1, 1, 128, 64, 0);

  // Increase LED blink rate on button press
  button.on("press", function() {
    console.log( "Button pressed" );
    if (isMonitoring) { isMonitoring == false; }
    else { isMonitoring == true; }
  });

  // Print temperature to console and OLED
  temperature.on("data", function(){
      let tempCelcius = this.C
      console.log("celsius: " + tempCelcius);
      if (tempCelcius > 25  && isMonitoring) {
        ledStatus = "blink";
        oled.setCursor(1, 1);
        oled.writeString(font, 1, "ALERT TEMP TOO HIGH.", 1, true, 2);
      }
      else if (tempCelcius <= 25 && isMonitoring) {
        ledStatus = "on";
        oled.setCursor(1, 1);
        oled.writeString(font, 1, "Temp OK.", 1, true, 2);
      } 
      else {
        ledStatus = "off";
        oled.setCursor(1, 1);
        oled.writeString(font, 1, "System disabled.", 1, true, 2);
      }

  });
     
  if (ledStatus == "on") { led.on(); }
  else if (ledStatus == "blink") { led.blink(500); }
  else { led.off(); }



  

});
