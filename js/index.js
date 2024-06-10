/**
 * Initialize the html elements we need to setup the game.
 * When the start button triggers, game.init (game.js) is called.
 * 
 * Support keyboard, touchscreen
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


// How to p[lay instruction (help)
let helpInfo = document.getElementById('helpInfo');

// Get the helpInfo and scrollIndicator elements
let scrollIndicator = document.getElementById('scrollIndicator');

// Add scroll event listener to helpInfo
helpInfo.addEventListener('scroll', () => {
    // Check if the content is at the top
    if (helpInfo.scrollTop === 0) {
        // If at the top, show the scroll indicator
        scrollIndicator.style.display = 'flex';
    } else {
        // If not at the top, hide the scroll indicator
        scrollIndicator.style.display = 'none';
    }
});


// Close help
let closeHelp = document.getElementById('closeHelp');

let rightPressed = false;
let leftPressed = false;
let pauseBtn, touchLeftBtn, touchRightBtn;

window.onload = init;

function init() 
{   

    intro();

    start = document.getElementById("start");
    canvas = document.getElementById("game");
    context = canvas.getContext("2d");

    // Background canvas
    bgCanvas = document.getElementById("bgCanvas");
    bgContext = bgCanvas.getContext("2d"); 

    // Player canvas
    playerCanvas = document.getElementById("playerCanvas");
    playerContext = playerCanvas.getContext("2d", { willReadFrequently: true }); // willReadFrequently=true - for the shader

    // gui canvas for displaying score
    guiCanvas = document.getElementById("guiCanvas");
    guiContext = guiCanvas.getContext("2d");
    
    // lives canvas
    livesCanvas = document.getElementById("livesCanvas");
    livesContext = livesCanvas.getContext("2d");

    pauseBtn = document.getElementById("pause");
    touchLeftBtn = document.getElementById("buttonLeft");
    touchRightBtn = document.getElementById("buttonRight");

    // Setup menu listeners
    pauseBtn.addEventListener("click", function() {game.pause()});
    
    document.getElementById("help")
        .addEventListener("click", function() {
            if (game.isInit) {
                game.pause(true);
            }
            // Toggle
            helpInfo.style.display = (helpInfo.style.display == "block") ? "none" : "block";
        })
    
    start.addEventListener("click", game.init, false);

    closeHelp.addEventListener("click", function() {
        helpInfo.style.display = 'none';
    });

    // Setup the key listeners
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    // Setup touchscreen buttons
    if (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement) {
        setupTouchscreen();
    }

    

    //window.addEventListener('resize', resizeCanvas, false);
    //resizeCanvas(); // call the first time page is loaded
}


function setupTouchscreen() 
{
    document.getElementById("touchControl").style.display = "block";
    game.toggleMobileControls(true);
    for (let btn of [touchLeftBtn, touchRightBtn]) {
        btn.addEventListener("touchstart", touchDownHandler, false);
        btn.addEventListener("touchend", touchUpHandler, false);
    }
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

function touchDownHandler(e)
{
    if (e.srcElement.id == "buttonLeft") {
        leftPressed = true;
        touchLeftBtn.style.backgroundColor = "red";
    }
    else if (e.srcElement.id == "buttonRight") {
        rightPressed = true;
        touchRightBtn.style.backgroundColor = "green";
    }
}

function touchUpHandler(e)
{
    if (e.srcElement.id === "buttonLeft") {
        leftPressed = false;
        touchLeftBtn.style.backgroundColor = "#0000ff59";
    }
    else if (e.srcElement.id == "buttonRight") {
        rightPressed = false;
        touchRightBtn.style.backgroundColor = "#00ffc860";
    }
}

