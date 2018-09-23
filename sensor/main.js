var GrovePi = require('node-grovepi').GrovePi;
var Board = GrovePi.board;
var LoudnessAnalogSensor = GrovePi.sensors.LoudnessAnalog
var DigitalButtonSensor = GrovePi.sensors.DigitalButton
var LightAnalogSensor = GrovePi.sensors.LightAnalog

var board = new Board({
  debug: true,
  onError: function(err) {
    console.log('Error', err);
  },
  onInit: function(res) {
    if (res) {
      console.log("REEAADDYY")
      var loudness = new LoudnessAnalogSensor(160);
      loudness.start();
      setInterval(() => {
        console.log(loudness.readAvgMax());
      }, 500);

      var buttonSensor = new DigitalButtonSensor(29);
        //Digital Port 4
        // Button sensor
        console.log('Digital Button Sensor (start watch)')
        buttonSensor.on('down', function (res) {
          //res will be either singlepress or longpress
          console.log('Button onDown, data=' + res)
        })
        buttonSensor.watch()

        var lightSensor = new LightAnalogSensor(12)
          // Analog Port 3
          // Light Sensor
          console.log('Light Analog Sensor (start watch)')
          lightSensor.on('change', function (res) {
            console.log('Light onChange value=' + res)
          })
          lightSensor.watch()
    } else {
      console.log("FAIL TO INITAILZIE")
    }
  }
});
board.init();
