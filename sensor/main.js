var GrovePi = require('node-grovepi').GrovePi;
var Board = GrovePi.board;
var LoudnessAnalogSensor = GrovePi.sensors.LoudnessAnalog
var DigitalButtonSensor = GrovePi.sensors.DigitalButton

var board = new Board({
  debug: true,
  onError: function(err) {
    console.log('Error', err);
  },
  onInit: function(res) {
    if (res) {
      console.log("REEAADDYY")
      var loudness = new LoudnessAnalogSensor(0);
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
    } else {
      console.log("FAIL TO INITAILZIE")
    }
  }
});
board.init();
