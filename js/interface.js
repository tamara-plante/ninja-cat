/**
 * All the interface functions to help create the gui.
 */

// Background image
let heart = document.getElementById('heart');
let pulseStartTime;
let pulsing = false;
const pulseDuration = 2000; // 2 seconds
const scaleMin = 0.8;
const scaleMax = 1.2;

// Game over
let gameOverDiv = document.getElementById('gameOver');
let gameOverMsg = document.getElementById('gameOverMsg');


function updateOverlay(aTitle, aText=undefined, aHeight=undefined)
{
    document.querySelector("#gameOver h2").innerHTML = aTitle;
    
    // Hide the message box
    if (typeof aText === "undefined") {
        gameOverMsg.style.display = "none"
    }
    // Show the message box
    else {
        gameOverMsg.innerHTML = aText;
        gameOverMsg.style.display = "block"
    }

    if (typeof aHeight !== "undefined") {
        gameOverDiv.style.height = aHeight;
    }
}

/**
 * Display the overlay. Hide = true to hide the overlay instead.
 * @param {boolean} [hide] hide the display
 */
function displayOverlay(hide=false) {
    gameOverDiv.style.display = (hide) ? "none" : "block";
}