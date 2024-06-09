/**
 * All the interface functions to help create the gui.
 */

// Background image
let bgImg = document.getElementById('bgImg');

// Lives remaining
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

// image background
function drawBackground() {
    bgContext.drawImage(bgImg, 0, 0,  (bgImg.width * bgCanvas.height/ bgImg.height), bgCanvas.height);
   
}

function onLivesChange() {
    pulseStartTime = performance.now();
    pulsing = true;
    requestAnimationFrame(pulseHeart);
}
// Pulse animation function
function pulseHeart(timestamp) {
    if (!pulseStartTime) pulseStartTime = timestamp;
    const elapsed = timestamp - pulseStartTime;
    const progress = elapsed / pulseDuration;

    if (progress < 1) {
        const scale = scaleMin + (scaleMax - scaleMin) * Math.sin(progress * Math.PI);
        game.drawLives(scale);
        requestAnimationFrame(pulseHeart);
    } else {
        pulsing = false;
        game.drawLives(); // draw normally after pulse ends
    }
}
game.drawLives = function(scale = 1) {  
    // Clear the lives canvas
    livesContext.clearRect(0, 0, livesCanvas.width, livesCanvas.height);  

    // Draw the heart image with scaling
    const heartWidth = heart.width / 4 * scale;
    const heartHeight = heart.height / 4 * scale;
    const heartX = 160 - (heartWidth / 2 - heart.width / 8);
    const heartY = 15 - (heartHeight / 2 - heart.height / 8);

    livesContext.drawImage(
        heart, 
        heartX, heartY, heartWidth, heartHeight
    );

    // Set text properties
    livesContext.font = '14px "Press Start 2P"'; 
    livesContext.fillStyle = '#222034'; 

    // Draw the score on the GUI canvas
    livesContext.fillText(game.lives, 200, 34); // Text and position (x: 200, y: 34)
}


// draw on help canvas
function drawHelp() {
    helpContext.beginPath();
    helpContext.arc(22, 22, 18, 0, 2 * Math.PI);    
    helpContext.fillStyle = '#5FCFD4';
    helpContext.fill();

    helpContext.beginPath();
    helpContext.arc(22, 22, 18, 0, 2 * Math.PI);    
    helpContext.strokeStyle = '#222034';
    helpContext.lineWidth = 1;
    helpContext.stroke();

    helpContext.beginPath();
    helpContext.arc(22, 22, 16, 0, 2 * Math.PI);    
    helpContext.strokeStyle = '#bfbfbf';
    helpContext.lineWidth = 3;
    helpContext.stroke();

    
    
    // Set text properties
    helpContext.font = '14px "Press Start 2P"'; 
    helpContext.fillStyle = '#222034'; 

    // Draw the score on the GUI canvas
    helpContext.fillText("?", 16, 30); // Text and position (x: 10, y: 30)


}


game.drawScore = function() {
    // Clear the GUI canvas
    guiContext.clearRect(0, 0, guiCanvas.width, guiCanvas.height);


    // Draw the button
    guiContext.fillStyle = '#5FCFD4'; // Background color

    // Draw the button background
    guiContext.fillRect(10, 10, 116, 30); // x, y, width, height

    // strokes
    guiContext.strokeStyle = '#222034'; // Border color #306082
    guiContext.lineWidth = 1; // Border width
   // guiContext.strokeRect(10, 10, 110, 30);  // complete stroke of the button


    // Draw the lines
    // left border line 
    guiContext.beginPath(); // Start a new path
    guiContext.moveTo(10, 11); // Move to the starting point
    guiContext.lineTo(10, 38); // Draw a line to the ending point
    guiContext.stroke(); // Stroke the line

    // top border line 
    guiContext.beginPath(); // Start a new path
    guiContext.moveTo(11, 10); // Move to the starting point
    guiContext.lineTo(125, 10); // Draw a line to the ending point
    guiContext.stroke(); // Stroke the line


    // right border line 
    guiContext.beginPath(); // Start a new path
    guiContext.moveTo(126, 11); // Move to the starting point
    guiContext.lineTo(126, 38); // Draw a line to the ending point
    guiContext.stroke(); // Stroke the line

    // bottom border line 
    guiContext.beginPath(); // Start a new path
    guiContext.moveTo(11, 40); // Move to the starting point
    guiContext.lineTo(125, 40); // Draw a line to the ending point
    guiContext.stroke(); // Stroke the line

    
    // gray highlights 
    guiContext.fillStyle = '#bfbfbf'; 
    guiContext.fillRect(11, 11, 114, 2);
    guiContext.fillRect(121, 11, 4, 28);
    
    // lightgray highlights 
    guiContext.fillStyle = '#e0e0e0'; 
    guiContext.fillRect(11, 11, 4, 28);
    guiContext.fillRect(11, 37, 114, 2);

    
    // Set text properties
    guiContext.font = '9px "Press Start 2P"'; 
    guiContext.fillStyle = '#222034'; 

    // Draw the score on the GUI canvas
    guiContext.fillText('Score: ' + game.points, 20, 30); // Text and position (x: 10, y: 30)
};