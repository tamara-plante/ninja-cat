let canvas;
let context;
let start;

let rightPressed = false;
let leftPressed = false;

window.onload = init;

function init() 
{
    start = document.getElementById("start");
    canvas = document.getElementById("game");
    context = canvas.getContext("2d");//, { willReadFrequently: true });

    start.addEventListener("click", game.init, false);

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