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
      fallingItem.y += 7; // Adjust speed

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
  if (Math.random() < 0.06) {
      items.push(newItem());
  }

  // Clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Update player
  player.update(game.secondsPassed);

  // Draw items and player
  game.draw();
  
  // Draw the score on the GUI canvas
  game.drawScore();

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

game.drawGameOver = function() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

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
