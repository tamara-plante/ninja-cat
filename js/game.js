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
    isInit: false,
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

/**
 * Initialize the game and the default values.
 */
game.init = function()
{
    // Set key press and disable start game button and hide the game over.
    game.isInit = true;
    gameOverDiv.style.display = "none";
    leftPressed = false;
    rightPressed = false;
    start.style.display = "none";
    pauseBtn.style.visibility = "visible";


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
 * @param {boolean} [quiet] if we should display the overlay
 */
game.pause = function(quiet = false)
{
    game.isPaused = !game.isPaused;

    if (!quiet) {
        // Activate
        if (game.isPaused) {
            updateOverlay("PAUSED", undefined, "90px");
            displayOverlay();
        }
        // Disable
        else displayOverlay(true);
    }
    
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
    start.style.display = "block";
    pause.style.visibility = "hidden";

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
    // display the game over message in the gameOver div
    updateOverlay("GAME OVER", msg, "180px");
    displayOverlay();    
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








