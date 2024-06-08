let canvas;
let context;
let start;

// background canvas
let bgCanvas;
let bgContext;

// gui canvas for displaying score
let guiCanvas;
let guiContext;

// help canvas
let helpCanvas;
let helpContext;

// How to p[lay instruction (help)
let helpInfo = document.getElementById('helpInfo');

let rightPressed = false;
let leftPressed = false;


window.onload = init;



function init() 
{   
    intro();

    start = document.getElementById("start");
    canvas = document.getElementById("game");
    context = canvas.getContext("2d");//, { willReadFrequently: true });

    //  background canvas
    bgCanvas = document.getElementById("bgCanvas");
    bgContext = bgCanvas.getContext("2d"); 

    // gui canvas for displaying score
    guiCanvas = document.getElementById('guiCanvas');
    guiContext = guiCanvas.getContext('2d');
    
    // canvas for help icon
    helpCanvas = document.getElementById('helpCanvas');
    helpContext = helpCanvas.getContext('2d');


    start.addEventListener("click", game.init, false);

    helpCanvas.addEventListener("click", function() {
        helpInfo.style.display = 'block';
    });

    // Setup the key listeners
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    //window.addEventListener('resize', resizeCanvas, false);
    //resizeCanvas(); // call the first time page is loaded
}

/*function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}*/



function keyDownHandler(e) 
{
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } 
    else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}
  
function keyUpHandler(e) 
{
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } 
    else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

