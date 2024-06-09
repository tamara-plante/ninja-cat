/**
 * Initialize the html elements we need to setup the game.
 * When the start button triggers, game.init (game.js) is called.
 * 
 */

let canvas;
let context;
let start;

// background canvas
let bgCanvas;
let bgContext;
let playerCanvas;
let playerContext;

// gui canvas for displaying score
let guiCanvas;
let guiContext;



// lives canvas
let livesCanvas;
let livesContext;

// help canvas
let helpCanvas;
let helpContext;

// How to p[lay instruction (help)
let helpInfo = document.getElementById('helpInfo');

// Close help
let closeHelp = document.getElementById('closeHelp');

let rightPressed = false;
let leftPressed = false;

window.onload = init;

function init() 
{   

    intro();

    start = document.getElementById("start");
    canvas = document.getElementById("game");
    context = canvas.getContext("2d");

    //  background canvas
    bgCanvas = document.getElementById("bgCanvas");
    bgContext = bgCanvas.getContext("2d"); 

    playerCanvas = document.getElementById("playerCanvas");
    playerContext = playerCanvas.getContext("2d", { willReadFrequently: true }); // willReadFrequently=true - for the shader

    // gui canvas for displaying score
    guiCanvas = document.getElementById('guiCanvas');
    guiContext = guiCanvas.getContext('2d');
    
    // lives canvas
    livesCanvas = document.getElementById('livesCanvas');
    livesContext = livesCanvas.getContext('2d');
    
    // canvas for help icon
    helpCanvas = document.getElementById('helpCanvas');
    helpContext = helpCanvas.getContext('2d');


    start.addEventListener("click", game.init, false);

    helpCanvas.addEventListener("click", function() {
        helpInfo.style.display = 'block';
    });

    closeHelp.addEventListener("click", function() {
        helpInfo.style.display = 'none';
    });

    // Setup the key listeners
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    //window.addEventListener('resize', resizeCanvas, false);
    //resizeCanvas(); // call the first time page is loaded
    drawHelp();
}

/*function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}*/


/**
 * Catch keyboard on key down events.
 * @param {Event} e the event
 */
function keyDownHandler(e) 
{
    switch (e.key) {
        case "Right":
        case "ArrowRight":
        case "d":
        case "D":
            rightPressed = true;
            break;
        case "Left":
        case "ArrowLeft":
        case "a":
        case "A":
            leftPressed = true;
    }
}
/**
 * Catch keyboard on key up events.
 * @param {Event} e the event
 */
function keyUpHandler(e) 
{
    switch (e.key) {
        case "Right":
        case "ArrowRight":
        case "d":
        case "D":
            rightPressed = false;
            break;
        case "Left":
        case "ArrowLeft":
        case "a":
        case "A":
            leftPressed = false;
            break;
        case "p":
            game.pause();
    }
}
