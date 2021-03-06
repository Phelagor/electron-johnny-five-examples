var Readable = require('stream').Readable  
var util = require('util')  
var five = require('johnny-five')

util.inherits(MyStream, Readable)  
function MyStream(opt) {  
  Readable.call(this, opt)
}
MyStream.prototype._read = function() {};  
// hook in our stream
process.__defineGetter__('stdin', function() {  
  if (process.__stdin) return process.__stdin
  process.__stdin = new MyStream()
  return process.__stdin
})

var board = new five.Board()

var input = document.getElementById('position-input')
var position = 90 
var str = null
var state = false
var canvas = document.getElementById('servo-horn')
var ctx = canvas.getContext('2d')
horn(position-90, '#e7e7e7')

board.on('ready', function() {
  document.getElementById('board-status').src = 'icons/ready.png'
  input.className = 'input'
  input.readOnly = false
  var servo = new five.Servo({pin: 10, startAt: 90, range: [45, 135]});
  horn(position-90, '#505050')

  input.addEventListener('change', function () {
    var str = input.value
    if (!isNaN(Number(str))) {
      position = Number(str)
    }
    else if (str.charCodeAt(str.length-1) === 176){
      if (!isNaN(Number(str.substring(0,str.length-1)))) {
        console.log('number + degree')
        position = Number(str.substring(0,str.length-1))
      }
    }
    if (position < 45) position = 45
    if (position > 135) position = 135
    position = Math.round(position)
    input.value = String(position) + String.fromCharCode(176)

    servo.to(position)
    horn(position-90, '#505050')
  })
})

function horn(angle, color) {
  ctx.fillStyle = color
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.translate(65,65);
  ctx.rotate(angle * Math.PI / 180);
  ctx.beginPath();
  ctx.moveTo(-12, 0);
  ctx.lineTo(-4,-60);
  ctx.lineTo(4,-60);
  ctx.lineTo(12, 0);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0,-60,4,0,2*Math.PI);
  ctx.fill()
  ctx.beginPath();
  ctx.arc(0,0,12,0,2*Math.PI);
  ctx.fill()
  ctx.fillStyle = 'white'
  ctx.beginPath();
  ctx.arc(0,0,6,0,2*Math.PI);
  ctx.fill()
}

