let canvas;
let context;
let start;

let rightPressed = false;
let leftPressed = false;


window.onload = init;

/**
 * Intro - Ninja cat designed by 
 */
function intro() {
    let splash = document.getElementById("splash");
    let startButton = document.getElementById("start");

    // Hide splash when start is clicked
    startButton.addEventListener("click", function() {
        // Fade out the splash element
        splash.style.transition = "opacity 0.8s ease";
        splash.style.opacity = "0";
        
        // Start the game after fade out
        setTimeout(function() {
            splash.style.display = "none"; 
        }, 600); 
    });
};

function init() 
{  
    intro();
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

