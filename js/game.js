/**
 * Ninja Cat training
 * Game: Catching items falling from the sky.
 * 
 * Points are accumulated when catching good items.
 * Lives are lost when getting hit by a bad item.
 * 
 * @author Tamara Plante, Alexie LaGarde, Iana Setrakova
 */

"use strict"; // only allow strict code
let game = {
    secondsPassed: null,
    oldTimeStamp: null,
    points: 0
};
let player;
let item;
let items = [];

/**
 * Initialize the game.
 */
game.init = function()
{
    start.disabled = "true";
    // Get a reference to our main elements
    player.sprite = document.getElementById("player");
    item.sprite = document.getElementById("item");

    // Initialize the player
    player.y = canvas.height - player.sheet.frameHeight;
    player.animation.timerAnim = setInterval(player.animate, 100);

    // Initialize items
    items.push(item);

    // Start the gameLoop
    window.requestAnimationFrame(game.loop);
}

/**
 * The main game loop.
 * @param {number} timeStamp the timestamp
 */
game.loop = function (timeStamp) 
{
    // Calculate the number of seconds passed since the last frame
    game.secondsPassed = (timeStamp - game.oldTimeStamp) / 1000;
    game.oldTimeStamp = timeStamp;

    // Check collision between player and items
    for (let i in items) {
        if (player.isColliding(items[i])) {
            // Remove from the items and add points.
            let removed = items.splice(i, 1)[0];
            game.points += removed.points;
            console.log("current points: " + game.points);
            
            // random spawn on the x axis for the next nugget.
            item.x = Math.floor(Math.max(0, Math.random() * canvas.width - item.width)); 
            setTimeout(function() {items.push(item)}, 3000);
        }
    }

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Update our objects
    player.update(game.secondsPassed);
    // Draw to canvas
    game.draw();
    // Keep requesting new frames
    window.requestAnimationFrame(game.loop);
}

/**
 * Drawing function.
 */
game.draw = function()
{
    // Draw all items
    for (let i of items) {
        i.draw();
    }
    player.draw();
}

// testing an object collision
item = {
    sprite: null,
    sheet: {
        frameWidth: 96,
        frameHeight: 96
    },
    x: 250,
    y: 585-55+30,
    width: 42, // actual image size without empty space around
    height: 45,
    points: 10 // added to the score
}

item.draw = function()
{
    context.drawImage(item.sprite, item.x, item.y);
}
