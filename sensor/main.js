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
      var loudness = new LoudnessAnalogSensor(0);
      loudness.on('change', function(res) {
        console.log('noise', res);
      })
      loudness.watch();
    }
  }
});
board.init();
