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
    items.push(newItem());

    // Start the gameLoop
    window.requestAnimationFrame(game.loop);
}



/**
 * The main game loop.
 * @param {number} timeStamp the timestamp
 */
game.loop = function(timeStamp) {
  game.secondsPassed = (timeStamp - game.oldTimeStamp) / 1000;
  game.oldTimeStamp = timeStamp;

  // Update item positions and check collisions
  for (let i = items.length - 1; i >= 0; i--) {
      let fallingItem = items[i];
      fallingItem.y += 6; // Adjust speed

      if (fallingItem.y > canvas.height) {
          // Remove items that fall beyond the canvas
          items.splice(i, 1);
      } else {
          if (player.isColliding(fallingItem)) {
              // Remove collided items and add points
              items.splice(i, 1);
              game.points += fallingItem.points;
              console.log("Current points: " + game.points);
          }
      }
  }

  // Add new items randomly
  if (Math.random() < 0.055) {
      items.push(newItem());
  }

  // Clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Update player
  player.update(game.secondsPassed);

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
    // Draw all items
    for (let i of items) {
      context.drawImage(i.sprite, i.x, i.y);
    }
    player.draw();
}


