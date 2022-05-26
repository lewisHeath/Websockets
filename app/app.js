const socket = io("http://localhost:4000/");
// const socket = io("https://websockets-lewis.herokuapp.com/");

console.log("socket.io connected");

let GLOBAL_COLOUR = "#000000";

let sendEventButton = document.getElementById("event");
let squares = document.querySelectorAll(".square");
let colourBoxes = document.querySelectorAll(".colour-box");
let currentColour = document.getElementById("current-colour");

currentColour.style.backgroundColor = GLOBAL_COLOUR;

//make the squares white
for(let i = 0; i < squares.length; i++){
    squares[i].style.backgroundColor = "white";
}

//change square colour on hover
for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener("mouseover", function() {
        console.log(squares[i].style.backgroundColor);
        if(this.style.backgroundColor == 'white'){
            socket.emit("square-hover", {square: squares[i].id});
            //make the square change colour
            squares[i].style.backgroundColor = 'black';
        }
    });
    //make white when mouse leaves square
    squares[i].addEventListener("mouseout", function() {
        if(squares[i].style.backgroundColor == 'black'){
            socket.emit("square-unhover", {square: squares[i].id});
            //make the square change colour
            squares[i].style.backgroundColor = "white";
        }
    });
    //make the square change to current colour when clicked
    squares[i].addEventListener("click", function() {
        socket.emit("square-click", {square: squares[i].id, colour: GLOBAL_COLOUR});
        squares[i].style.backgroundColor = GLOBAL_COLOUR;
    });
}


for(let i = 0; i < colourBoxes.length; i++){
    colourBoxes[i].addEventListener("click", function(){
        console.log("colour box clicked: " + colourBoxes[i].style.backgroundColor);
        //find the colour of the box clicked
        GLOBAL_COLOUR = colourBoxes[i].style.backgroundColor;
        //change the current colour square to this colour 
        currentColour.style.backgroundColor = GLOBAL_COLOUR;
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

socket.on("square-click", ({square, colour}) => {
    document.getElementById(square).style.backgroundColor = colour;
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