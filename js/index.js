/**
 * Initialize the html elements we need to setup the game.
 * When the start button triggers, game.init (game.js) is called.
 * 
 * Support keyboard, touchscreen
 */

let rightPressed = false;
let leftPressed = false;
let startBtn, pauseBtn, helpBtn, touchLeftBtn, touchRightBtn;

// How to play instruction (help)
let helpInfo, closeHelp, scrollIndicator;

// Main Game canvas
let canvas, context;
// Background canvas
let bgCanvas, bgContext;
// Player canvas
let playerCanvas, playerContext;
// gui canvas for displaying score
let guiCanvas, guiContext;
// lives canvas
let livesCanvas, livesContext;


window.onload = init;

function init() 
{   
    // Show the splash intro
    intro();

    // Setup the import elements variables
    startBtn = document.getElementById("start");
    pauseBtn = document.getElementById("pause");
    touchLeftBtn = document.getElementById("buttonLeft");
    touchRightBtn = document.getElementById("buttonRight");
    helpBtn = document.getElementById("help");
    helpInfo = document.getElementById("helpInfo");
    scrollIndicator = document.getElementById("scrollIndicator");
    closeHelp = document.getElementById("closeHelp");

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

    // Setup instruction listeners
    helpBtn.addEventListener("click", function() {
        let active = helpInfo.style.display == "block";

        // Only activate/disable pause if the pause overlay isn't active
        // Disable the pause button while displaying instruction
        pauseBtn.disabled = (!active) ? "true": "";
        if (game.isInit && !game.activePauseOverlay) {
            game.pause(!active, true);
        }

        // Toggle info screen
        helpInfo.style.display = (active) ? "none" : "block";
    });
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
    // Game listener
    pauseBtn.addEventListener("click", function() {game.pause()});
    startBtn.addEventListener("click", game.init, false);
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

/**
 * Display the touch controls container
 * but hide the controls until the game starts.
 * Setup the event listeners for touchscreen.
 */
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

/**
 * Catch touch down events on the mobile player controls.
 * Prevent default touch screen gestures/behaviors.
 * @param {Event} e the event
 */
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
    e.preventDefault();
}
/**
 * Catch touch up events on the mobile player controls.
 * Prevent default touch screen gestures/behaviors.
 * @param {Event} e the event
 */
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
    e.preventDefault();
}

