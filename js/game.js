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
    item.y = canvas.height - item.sheet.frameHeight - 15;
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
    // Calculate the number of seconds passed since the last loop 
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
            item.x = Math.floor(Math.max(0, Math.random() * (canvas.width - item.sheet.frameWidth))); 
            setTimeout(function() {items.push(item)}, 3000);
        }
    }

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Update our objects
    player.update(game.secondsPassed);
    // Draw to canvas
    game.draw();

    // Draw the score on the GUI canvas
    game.drawScore();


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

game.drawScore = function() {
    // Clear the GUI canvas
    guiContext.clearRect(0, 0, guiCanvas.width, guiCanvas.height);


    // Draw the button
    guiContext.fillStyle = '#5FCFD4'; // Background color

    // Draw the button background
    guiContext.fillRect(10, 10, 110, 30); // x, y, width, height

    // strokes
    guiContext.strokeStyle = '#222034'; // Border color #306082
    guiContext.lineWidth = 1; // Border width
   // guiContext.strokeRect(10, 10, 110, 30);  // complete stroke of the button

    // gray highlights 
    guiContext.fillStyle = '#bfbfbf'; 
    guiContext.fillRect(11, 11, 108, 2);
    guiContext.fillRect(115, 11, 4, 28);

    // Draw the lines
    // left border line 
    guiContext.beginPath(); // Start a new path
    guiContext.moveTo(10, 11); // Move to the starting point
    guiContext.lineTo(10, 38); // Draw a line to the ending point
    guiContext.stroke(); // Stroke the line

    // top border line 
    guiContext.beginPath(); // Start a new path
    guiContext.moveTo(11, 10); // Move to the starting point
    guiContext.lineTo(119, 10); // Draw a line to the ending point
    guiContext.stroke(); // Stroke the line


    // right border line 
    guiContext.beginPath(); // Start a new path
    guiContext.moveTo(120, 11); // Move to the starting point
    guiContext.lineTo(120, 38); // Draw a line to the ending point
    guiContext.stroke(); // Stroke the line

    // bottom border line 
    guiContext.beginPath(); // Start a new path
    guiContext.moveTo(11, 40); // Move to the starting point
    guiContext.lineTo(119, 40); // Draw a line to the ending point
    guiContext.stroke(); // Stroke the line

    // lightgray highlights 
    guiContext.fillStyle = '#e0e0e0'; 
    guiContext.fillRect(11, 11, 4, 28);
    guiContext.fillRect(11, 37, 108, 2);

    
    // Set text properties
    guiContext.font = '9px "Press Start 2P"'; 
    guiContext.fillStyle = '#222034'; 

    // Draw the score on the GUI canvas
    guiContext.fillText('Score: ' + game.points, 20, 30); // Text and position (x: 10, y: 30)
};


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
