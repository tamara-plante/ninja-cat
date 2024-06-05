player = 
{
    sprite: null,
    direction: "right",
    movingSpeed: 250,
    x: 0, // current position-x
    y: 30, // current position-y
    width: 66, // collision size
    height: 81, // collision size
    sheet: {
        columns: 4,
        rows: 2,
        frameWidth: 66,
        frameHeight: 81
    },
    animation: {
        timerAnim: null, // setInterval of 100ms that controls animations, should run forever.
        timerFrame: null, // setTimeout to control the frame delay value if it exists.
        currentFrame: 0,
        currentAnim: "idleRight",
        idleLeft: [{col:0, row:0, delay:600}, {col:1, row:0, delay:300}],
        idleRight: [{col:0, row:1, delay:600}, {col:1, row:1, delay:300}],
        movingLeft: [{col:2, row:0}, {col:3, row:0}],
        movingRight: [{col:2, row:1}, {col:3, row:1}]
    }
};

/**
 * Draw the player to canvas based on it's position and animation frame.
 */
player.draw = function()
{   
    let frameWidth = player.sheet.frameWidth;
    let frameHeight = player.sheet.frameHeight;
    let frame = player.animation.getFrame();

    context.drawImage
    (
        player.sprite, 
        frame.col * frameWidth, frame.row * frameHeight, // clip sprite at
        frameWidth, frameHeight,  // how big is the clip
        player.x, player.y, // position
        frameWidth, frameHeight // scaling
    );
}

/**
 * Verify if an item (item.x and item.y) is colliding with the player.
 * @param {object} item the object collision to validate
 * @returns true if the item is colliding the player.
 */
player.isColliding = function(item) 
{
    // Add padding to collision so the character has to overlap more visually to count as a collision. 
    /*return ( 
        player.y <= item.y + item.height && // top
        item.x < player.x + player.width && // right
        player.x < item.x + item.width-10 // left
        
        (player.y + player.height) >= item.y &&
        player.y <= (item.y + item.height) &&
        (player.x + player.width) >= item.x &&
        player.x <= (item.x + item.width)
    );*/
    return (
        item.y <= (player.y + player.height) &&
        player.y <= (item.y + item.height) &&
        item.x <= (player.x + player.width) &&
        player.x <= (item.x + item.width)
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

        let distance = player.movingSpeed * secondsPassed;
        let posX;

        // Set the new x, while accounting for canvas boundary. Round to nearest int.
        if (rightPressed) {
            posX = Math.min(player.x + distance, canvas.width - player.sheet.frameWidth);
            player.direction = "right";
            player.animation.update("movingRight");
        }
        // leftPressed
        else {
            posX = Math.max(player.x - distance, 0);
            player.direction = "left";
            player.animation.update("movingLeft");
        }
        player.x = Math.floor(posX);
    }
    // Set the idle state based on the player.direction
    else if (player.direction == "right") {
        player.animation.update("idleRight");
    }
    else if (player.direction == "left") {
        player.animation.update("idleLeft");
    }
}

/**
 * setInterval function to animate every 100ms.
 */
player.animate = function() 
{
    let anim = player.animation;
    // If there's no delayed frame in progress...
    if (!anim.timerFrame) {

        // Pick a new frame and account for frame loop
        if (++anim.currentFrame > anim[anim.currentAnim].length - 1){
            anim.currentFrame = 0;
        }
        // Get the animation frame and set a delay if there is one.
        let frame = anim.getFrame();
        if (frame.delay) {
            anim.timerFrame = setTimeout(anim.cancel, frame.delay);
        }
    }
}

/**
 * Uodate the playing animation and reset state.
 * @param {string} animation the animation key-name
 */
player.animation.update = function(animation) 
{
    let anim = player.animation;
    // If the new animation is different from the current one...
    if (anim.currentAnim != animation) {
        anim.cancel();
        anim.currentAnim = animation;
        anim.currentFrame = 0;
    }
}

/**
 * Stop the timer for the current animation frame.
 */
player.animation.cancel = function() 
{
    clearTimeout(player.animation.timerFrame);
    player.animation.timerFrame = null;
}

/**
 * Get the current frame parameters.
 * @returns the current frame parameters
 */
player.animation.getFrame = function()
{
    let anim = player.animation;
    return anim[anim.currentAnim][anim.currentFrame];
}
