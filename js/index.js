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

    // Load game canvases
    [canvas, context] = loadCanvas("game"); // main, with items
    // Background canvas
    [bgCanvas, bgContext] = loadCanvas("bgCanvas");
    // Player canvas
    [playerCanvas, playerContext] = loadCanvas("playerCanvas", true);
    // Gui canvas for displaying score
    [guiCanvas, guiContext] = loadCanvas("guiCanvas");
    // Lives canvas
    [livesCanvas, livesContext] = loadCanvas("livesCanvas");

    start = document.getElementById("start");
    pauseBtn = document.getElementById("pause");
    touchLeftBtn = document.getElementById("buttonLeft");
    touchRightBtn = document.getElementById("buttonRight");

    // Setup menu listeners
    pauseBtn.addEventListener("click", function() {game.pause()});
    
    document.getElementById("help")
        .addEventListener("click", function() {
            let active = helpInfo.style.display == "block";

            // Only activate/disable pause if the pause overlay isn't active
            // Disable the pause button while displaying instruction
            pauseBtn.disabled = (!active) ? "true": "";
            if (game.isInit && !game.activePauseOverlay) {
                game.pause(!active, true);
            }

            // Toggle
            helpInfo.style.display = (active) ? "none" : "block";
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
}

/**
 * Get our canvas and context object and return them.
 * @param {string} aName the name of the canvas
 * @param {boolean} [isFrequentlyRead] if willReadFrequently should be activated (for shaders)
 * @returns the canvas and context
 */
function loadCanvas(aName, isFrequentlyRead=false) 
{
    let canvas = document.getElementById(aName);
    let context = canvas.getContext("2d", (isFrequentlyRead) ? { willReadFrequently: true } : undefined);

    return [canvas, context];
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
        touchLeftBtn.classList.add("pressed");
    }
    else if (e.srcElement.id == "buttonRight") {
        rightPressed = true;
        touchRightBtn.classList.add("pressed");
    }
    e.preventDefault(); // Prevent touch screen gestures
}

function touchUpHandler(e)
{
    if (e.srcElement.id === "buttonLeft") {
        leftPressed = false;
        touchLeftBtn.classList.remove("pressed");
    }
    else if (e.srcElement.id == "buttonRight") {
        rightPressed = false;
        touchRightBtn.classList.remove("pressed");
    }
    e.preventDefault(); // Prevent touch screen gestures
}

