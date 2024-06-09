/**
 * Ninja Cat training
 * Game: Catching items falling from the sky.
 * 
 * Points are accumulated when catching good items.
 * Lives are lost when getting hit by a bad item.
 * 
 * @author Alexie Lagarde, Iana Setrakova, Tamara Plante
 */

"use strict"; // only allow strict code
let game = {
    isEnded: false,
    isPaused: false,
    secondsPassed: null,
    oldTimeStamp: null,
    highScore: localStorage.getItem('highScore') || 0,
    points: 0,
    lives: 0,
    items: {
        active: [],
        destroy: [] // For animated items showing destroy animation
    }
};
let player;


// Background image
let bgImg = document.getElementById('bgImg');


/**
 * Initialize the game and the default values.
 */
game.init = function()
{
    // Set key press and disable start game button and hide the game over.
    gameOverDiv.style.display = "none";
    leftPressed = false;
    rightPressed = false;
    start.disabled = "true";

    // Set up initial game values
    game.isEnded = false;
    game.isPaused = false;
    game.points = 0;
    game.lives = 9;
    game.secondsPassed = null;
    game.oldTimeStamp = null;
    drawBackground(); 
    game.drawLives();

    // Get a reference to our main elements
    player.init();

    // Start the gameLoop
    window.requestAnimationFrame(game.loop);
    game.items.generate();
}

/**
 * Toggle pause state
 */
game.pause = function()
{
    game.isPaused = !game.isPaused;

    // Activate
    if (game.isPaused) {
        updateOverlay("PAUSED", undefined, "90px");
        displayOverlay();
    }
    // Disable
    else displayOverlay(true);
}

/**
 * When the game ends.
 */
game.end = function() 
{
    player.cancelAnimationsAndEffects();
    game.items.clear();
    game.clearCanvas();
   
    // Enable start game button
    start.disabled = "";

    // Check and update high score
    let msg = "";
    let highScore = game.highScore;
    if (game.points > highScore) {
        highScore = game.points;
        localStorage.setItem('highScore', highScore);
        msg = "<span>New High Score!</span> <br>" + highScore + "points!";
    } else {
        msg = "Your score: " + game.points + "<br>High Score: " + highScore;
    }
   // alert(msg); // A
    // display the game over message in the gameOver div
    updateOverlay("GAME OVER", msg, "180px");
    displayOverlay();
    
    /*
    // Disable start game button (if you have one)
    let startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.disabled = "";
    }
    */
}

/**
 * Check collisions between items and the player and items and the ground.
 */
game.checkCollision = function() 
{
    let items = game.items.active;

    // Update item positions and check collisions
    for (let i in items) {
        let item = items[i];

        // Remove items that fall beyond the canvas bottom edge
        if (item.y + item.height > canvas.height) {
            items.splice(i, 1);
        }
        // Remove the item colliding with the player,
        // add points and activate special effects
        else if (player.isColliding(item)) {
            let removed = items.splice(i, 1)[0];

            // Take damage
            if (removed instanceof Water) {
                player.damage.activate();
                // Play the death animation
                game.items.destroy.push(removed);
                removed.destroy();

                if (!game.loseLife()) return; // Game over.
            }
            // Add points
            else {
                game.points = Math.max(0, game.points + removed.points);
                // Trigger special effects
                if (removed.name == "nugget") player.powerUp.activate();
                else if (removed.name == "pepper") player.stun.activate();
                else if (removed.name == "donut") player.slow.activate();
            }
        }
        // Update the item position
        else item.update(game.secondsPassed);
    }
}

/**
 * Lose a life. If no more life, set the flag game.isEnded = true. 
 * You are a cat so you have more lives... hopefully.
 * @returns false if there's no more lives.
 */
game.loseLife = function()
{
    game.lives--;
    onLivesChange();

    if (game.lives == 0) {
        game.isEnded = true;
        return false;
    }
    return true;
}

/**
 * The main game loop.
 * Called from requestAnimationFrame.
 * @param {number} timeStamp the timestamp
 */
game.loop = function(timeStamp) 
{
    game.secondsPassed = (timeStamp - game.oldTimeStamp) / 1000;
    game.oldTimeStamp = timeStamp;

    if (!game.isPaused) {
        // Remove items after their death animation.
        game.items.clearDestroyed();

        // Check for collision and update items position.
        game.checkCollision();

        // Game over! No more lives after collision check.
        if (game.isEnded) return game.end();

        // Add new items randomly
        game.items.generate();

        // Update player
        player.update(game.secondsPassed);

        // Clear canvas
        game.clearCanvas();

        // Draw items and player
        game.draw();
    }

    // Request next frame
    window.requestAnimationFrame(game.loop);
}

/**
 * Drawing function.
 */
game.draw = function()
{
    game.items.draw();
    player.draw();

    // Draw the score on the GUI canvas
    game.drawScore();
}

/**
 * Clear all the game related canvas
 */
game.clearCanvas = function()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    playerContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
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

// image background
function drawBackground() {
    bgContext.drawImage(bgImg, 0, 0,  (bgImg.width * bgCanvas.height/ bgImg.height), bgCanvas.height);
   
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

