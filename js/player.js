/**
 * Create the player and animate it.
 * @author Tamara Plante
 */
player = new GameAnimatedObject();

/**
 * Initialize the player.
 */
player.init = function() 
{
    this.sprite = document.getElementById("player");
    this.direction = "right";
    this.speed = 250;
    this.width = 66;
    this.height = 81;
    this.y = canvas.height - this.height;

    // Update the spritesheet
    this.updateSheetFrames(4, 2, 66, 81);

    // Add the animations
    this.animation.animations = {
        idleLeft: [{col:0, row:0, delay:600}, {col:1, row:0, delay:300}],
        idleRight: [{col:0, row:1, delay:600}, {col:1, row:1, delay:300}],
        movingLeft: [{col:2, row:0}, {col:3, row:0}],
        movingRight: [{col:2, row:1}, {col:3, row:1}]
    };

    // Start the animation
    this.animation.play();
}

/**
 * Verify if an item (item.x and item.y) is colliding with the player.
 * @param {object} item the object collision to validate
 * @returns true if the item is colliding the player.
 */
player.isColliding = function(item) 
{
    // Add padding to collision so the character has to overlap more visually to count as a collision.
    let padding = 10;
    return (
        item.y <= (this.y + this.height) - padding &&
        this.y <= (item.y + item.height) - padding &&
        item.x <= (this.x + this.width) - padding &&
        this.x <= (item.x + item.width) - padding
    );
}

/**
 * Update the player position and animation. 
 * If the player is moving, adjust the movement to the frame rate.
 * @param {number} secondsPassed the number of seconds passed since the last frame redraw
 */
player.update = function(secondsPassed) 
{    
    if (rightPressed || leftPressed) {

        let distance = this.speed * secondsPassed;
        let posX;

        // Set the new x, while accounting for canvas boundary.
        if (rightPressed) {
            posX = Math.min(this.x + distance, canvas.width - this.sheet.frameWidth);
            this.direction = "right";
            this.animation.update("movingRight");
        }
        // leftPressed
        else {
            posX = Math.max(this.x - distance, 0);
            this.direction = "left";
            this.animation.update("movingLeft");
        }
        // Round to nearest int.
        this.x = Math.floor(posX);
    }
    // Set the idle state based on the player.direction
    else if (this.direction == "right") {
        this.animation.update("idleRight");
    }
    else if (this.direction == "left") {
        this.animation.update("idleLeft");
    }
}
