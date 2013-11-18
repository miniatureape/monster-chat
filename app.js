var express = require('express')
, app = express()
, server = require('http').createServer(app)
, io = require('socket.io').listen(server);

server.listen(8000);

app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

// This is where the fun happens
var monsters = {};

io.sockets.on('connection', function (socket) {

  socket.on('new monster', function (data) {
      monsters[data.name] = data;
      socket.broadcast.emit('new monster', data);
      socket.emit('current monsters', monsters);
  });

  socket.on('move', function (data) {
      monsters[data.name] = data;
      socket.broadcast.emit('move', data);
  });

  socket.on('say', function (data) {
      socket.broadcast.emit('say', data);
  });

});
