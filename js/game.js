/**
 * Ninja Cat training
 * Game: Catching items falling from the sky.
 * 
 * Points are accumulated when catching good items.
 * Lives are lost when getting hit by a bad item.
 * 
 * @author Alexie LaGarde, Iana Setrakova, Tamara Plante
 */

"use strict"; // only allow strict code
let game = {
    secondsPassed: null,
    oldTimeStamp: null,
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

// Background image
let heart = document.getElementById('heart');
let pulseStartTime;
let pulsing = false;
const pulseDuration = 2000; // 2 seconds
const scaleMin = 0.8;
const scaleMax = 1.2;


/**
 * Initialize the game and the default values.
 */
game.init = function()
{
    // Disable start game button
    start.disabled = "true";
    drawBackground(); 

    // Set up initial game values
    game.points = 0;
    game.lives = 9;
    game.secondsPassed = null;
    game.oldTimeStamp = null;
    game.items.clear();
    game.drawLives();

    // Get a reference to our main elements
    player.init();

    // Start the gameLoop
    window.requestAnimationFrame(game.loop);
    game.items.generate();
}

/**
 * When the game ends.
 */
game.end = function() 
{
    game.clearCanvas();
    game.drawGameOver();
    // Enable start game button
    start.disabled = "";
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

    // Remove items after their death animation.
    game.items.clearDestroyed();

    let items = game.items.active;

    // Update item positions and check collisions
    for (let i = items.length - 1; i >= 0; i--) {
        let fallingItem = items[i];

        if (fallingItem.y + fallingItem.height > canvas.height) {
            // Remove items that fall beyond the canvas
            items.splice(i, 1);
        } else {
            if (player.isColliding(fallingItem)) {
                // Remove collided items and add points
                let removedItem = items.splice(i, 1)[0];

                if (fallingItem instanceof Water) {
                    player.damage.activate();
                    game.items.destroy.push(removedItem);
                    fallingItem.destroy();
                    game.lives--;
                    /*console.log("Remaining lives: " + game.lives);*/
                    onLivesChange();

                    if (game.lives == 0) {
                        return game.end();
                    }
                }
                else {
                    if (fallingItem.name == "nugget") {
                        player.powerUp.activate();
                    }
                    else if (fallingItem.name == "pepper") {
                        player.stun.activate();
                    }
                    else if (fallingItem.name == "donut") {
                        player.slow.activate();
                    }
                    game.points += removedItem.points;
                    //console.log("Current points: " + game.points);
                }
            }
        }
        fallingItem.update(game.secondsPassed); // Update the position
    }

    // Add new items randomly
    game.items.generate();

    // Update player
    player.update(game.secondsPassed);

    // Clear canvas
    game.clearCanvas();

    // Draw items and player
    game.draw();

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
    helpContext.arc(25, 25, 20, 0, 2 * Math.PI);    
    helpContext.fillStyle = '#5FCFD4';
    helpContext.fill();

    helpContext.beginPath();
    helpContext.arc(25, 25, 20, 0, 2 * Math.PI);    
    helpContext.strokeStyle = '#222034';
    helpContext.lineWidth = 1;
    helpContext.stroke();

    helpContext.beginPath();
    helpContext.arc(25, 25, 18, 0, 2 * Math.PI);    
    helpContext.strokeStyle = '#bfbfbf';
    helpContext.lineWidth = 3;
    helpContext.stroke();

    
    
    // Set text properties
    helpContext.font = '14px "Press Start 2P"'; 
    helpContext.fillStyle = '#222034'; 

    // Draw the score on the GUI canvas
    helpContext.fillText("?", 19, 33); // Text and position (x: 10, y: 30)


}


game.drawGameOver = function() {
    // Clear the canvas
    /*context.clearRect(0, 0, canvas.width, canvas.height);*/

    // Create a gradient
    // Create a vertical gradient for the text fill
    let gradient = context.createLinearGradient(
        canvas.width / 2 -100, canvas.height / 2 + 12, // x0, y0 (bottom of the text)
        canvas.width / 2 -100, canvas.height / 2 -16 // x1, y1 (top of the text)    
    );  
    gradient.addColorStop(0, '#AA373C'); 
    gradient.addColorStop(1, '#E9B23D');

    // Draw the text backround stroke 1 
    context.strokeStyle = '#5FCFD4'; // Border color #306082
    context.lineWidth = 4; // Border width
    context.strokeRect(canvas.width / 2 - 150, canvas.height / 2 - 24, 300, 44);

    
    // Draw the text backround stroke 2 
    context.strokeStyle = '#000000'; // Border color #306082
    context.lineWidth = 1; // Border width
    context.strokeRect(canvas.width / 2 - 152, canvas.height / 2 - 26, 304, 48);

    // Draw "GAME OVER" text
    context.font = '30px "Press Start 2P"';
    context.fillStyle = gradient; // Set the gradient as the fill style

    context.strokeStyle = '#000000'; // Text stroke color
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Fill and stroke the text
    context.fillText('GAME OVER',canvas.width / 2, canvas.height / 2);
    context.strokeText('GAME OVER', canvas.width / 2, canvas.height / 2);

   
};
