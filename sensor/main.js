var GrovePi = require('node-grovepi').GrovePi;
var Board = GrovePi.board;

var board = new Board({
  debug: true,
  onInit: function(res) {
    console.log(res);
  }
});
