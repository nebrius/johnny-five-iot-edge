# Sample code

![Fritzing diagram](fritzing.png)

This hardware example consists of four main components attached to the Raspberry Pi:
  - The I2C temperature sensor (far left) constantly reads ambient temperature.
  - The OLED screen (middle left) displays a message indicating whether the temperature detected is over or under the given threshold, which in this project is 25 degrees C. If the system is disabled, the OLED will display a "System disabled" message.
  - The button (middle right) toggles whether the system is enabled (default) or disabled.
  - The LED (far right) is on when the temperature is below the threshold, flashing when the temperature is above threshold, and off when the system is disabled.


## Example payload
This payload defines a thermometer controller "MCP9809", a LED at pin PI-7, and a LED at pin PI-9.

    {
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
    }
  
