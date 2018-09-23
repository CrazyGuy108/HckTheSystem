var GrovePi = require('node-grovepi').GrovePi;
var Board = GrovePi.board;

var board = new Board({
  debug: true,
  onError: function(err) {
    console.log(err);
  },
  onInit: function(res) {
    console.log(res);
  }
});
