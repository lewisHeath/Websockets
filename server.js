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

    //emit a message to all clients
    io.emit('colour-change', {colour: cycleColour()});

    socket.on('disconnect', function () {
        console.log('user disconnected');
        io.emit('colour-change', {colour: cycleColour()});
    });

    socket.on("button-click", function(data) {
        console.log("ID of " + socket.id + " button clicked");
        //get the id of the socket 
        let socketId = socket.id;
        io.emit("message", {id: socketId, message: data.message});
        io.emit("colour-change", {colour: cycleColour()});
    });

    socket.on("square-hover", function({square}) {
        console.log("ID of " + socket.id + " square hovered");
        io.emit("square-hover", {square: square});
    });

    socket.on("square-unhover", function({square}) {
        console.log("ID of " + socket.id + " square hovered");
        io.emit("square-unhover", {square: square});
    });

    socket.on("square-click", function({square, colour}) {
        console.log("ID of " + socket.id + " square clicked");
        io.emit("square-click", {square: square, colour: colour});
    });

});

//GLOBAL VARIABLES FOR FUNCTIONS

let colours = [
    '#19d3ff',
    '#3dfc70',
    '#ffa82c',
    '#ff0081',
    '#a300ff',
]

let currentColour = 0;

function generateRandomColour(){
    let letters = '0123456789ABCDEF';
    let colour = '#';
    for (let i = 0; i < 6; i++) {
      colour += letters[Math.floor(Math.random() * 16)];
    }
    return colour;
}

function cycleColour(){
    currentColour++;
    if(currentColour > colours.length - 1){
        currentColour = 0;
    }
    console.log(colours[currentColour]);
    return colours[currentColour];
}
