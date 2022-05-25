const socket = io("http://localhost:4000/");
// const socket = io("https://oddoneoutgame.herokuapp.com/");

console.log("socket.io connected");

let sendEventButton = document.getElementById("event");
let squares = document.querySelectorAll(".square");

//change square colour on hover
for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener("mouseover", function() {
        socket.emit("square-hover", {square: squares[i].id});
        //make the square change colour
        squares[i].style.backgroundColor = 'black';
    });
    //make white when mouse leaves square
    squares[i].addEventListener("mouseout", function() {
        socket.emit("square-unhover", {square: squares[i].id});
        //make the square change colour
        squares[i].style.backgroundColor = "white";
    });
}

sendEventButton.addEventListener("click", function() {
    console.log("button clicked");
    socket.emit("button-click", {message: "button clicked"});
});

socket.on("message", function(data) {
    console.log("message received");
    console.log(data);
});

socket.on("colour-change", ({colour}) => {
    console.log("colour changed");
    console.log(colour);
    document.body.style.backgroundColor = colour;
    switchTextColour(colour);
})

socket.on("square-hover", ({square}) => {
    document.getElementById(square).style.backgroundColor = 'black';
});

socket.on("square-unhover", ({square}) => {
    document.getElementById(square).style.backgroundColor = 'white';
});

//FUNCTIONS

function isColourBright(colour) {
    //determing if hex colour is bright or dark
    let rgb = hexToRgb(colour);
    let brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 125;
}

function switchTextColour(colour) {
    if (isColourBright(colour)) {
        document.body.style.color = "black";
    } else {
        document.body.style.color = "white";
    }
}

function hexToRgb(hex) {
    //convert hex colour to rgb
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function generateRandomColour(){
    let letters = '0123456789ABCDEF';
    let colour = '#';
    for (let i = 0; i < 6; i++) {
      colour += letters[Math.floor(Math.random() * 16)];
    }
    return colour;
}