var GrovePi = require('node-grovepi').GrovePi;
var Board = GrovePi.board;
var LoudnessAnalogSensor = GrovePi.sensors.LoudnessAnalog

var board = new Board({
  debug: true,
  onError: function(err) {
    console.log('Error', err);
  },
  onInit: function(res) {
    if (res) {
      console.log("REEAADDYY")
      var loudness = new LoudnessAnalogSensor(2);
      loudness.start();
      setInterval(() => {
        console.log(loudness.readAvgMax());
      }, 500);
    } else {
      console.log("FAIL TO INITAILZIE")
    }
  }
});
board.init();
