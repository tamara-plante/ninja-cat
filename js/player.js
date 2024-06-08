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
    this.setContext(playerContext);

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

player._draw = player.draw; // original draw method preserved
/**
 * Draw the player, with special effects if needed.
 */
player.draw = function() {
    this._draw(); // Call the original draw method, no super?!

    if (this.damage.active) {
        this.shader(this.damage.shader);
        this.damage.timer = setTimeout(() => {
            this.damage.active = false;
            this.damage.timer = null;
        }, 100);
    }
    if (this.powerUp.active) {
        // Keep shader active
        this.shader(this.powerUp.shader);

        // Set up the timer
        if (!this.powerUp.timer) {
            this.speed = 500;
            this.powerUp.timer = setTimeout(() => {
                this.speed = 250;
                this.powerUp.active = false;
                this.powerUp.timer = null;
            }, 3000);
        }
    }
}

/**
 * When the player takes damage, 
 * use this object to activate the shader.
 * active = true
 * the timer is set in the drawing phase
 */
player.damage = {
    active: false,
    timer: null,
    shader: function(i, data) {
        // The area that is not transparent, make white.
        if (data[i + 3] != 0) {
            data[i] = 255
            data[i + 1] = 255
            data[i + 2] = 255
        }
    }
}

/**
 * When the player should power up,
 * use this object to activate the shader
 * active = true
 * the timer is set in the drawing phase
 */
player.powerUp = {
    active: false,
    timer: null,
    shader: function(i, data) {
        // Blue fur convert to yellow.
        if ((data[i] == 95 && data[i + 1] == 205 && data[i + 2] == 228)) {
            data[i] = 251
            data[i + 1] = 242
            data[i + 2] = 54
        }
        // Highlight in fur and red belt to orange.
        else if ((data[i] == 91 && data[i + 1] == 110 && data[i + 2] == 225) || data[i] == 222) {
            data[i] = 248
            data[i + 1] = 134
            data[i + 2] = 58
        }
    }
}

/**
 * Manipulate pixels to make cool effects.
 * Pass a callback function that will take 
 * the index and data of the individual pixel
 * 
 * values between 0-255
 * data[i] = red, data[i+1] = green, 
 * data[i+2] = blue, data[i+3] = alpha
 * @param {function} aCallback 
 */
player.shader = function(aCallback) 
{
    const imageData = this.context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        aCallback(i, data);
    }
    
    this.context.putImageData(imageData, 0, 0);
}
