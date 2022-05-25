let express = require('express'),
  app = express(),
  http = require('http'),
  socketIO = require('socket.io'),
  server, io;

app.use(express.static(__dirname + '/app'));

app.get('/', function(req, res) {
  res.sendFile("app");
});

server = http.Server(app);
server.listen(process.env.PORT || 4000);

io = socketIO(server);

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

});