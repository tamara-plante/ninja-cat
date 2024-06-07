/**
 * Create a game object which includes a position, size including a sprite.
 */
class GameObject
{
    constructor() 
    {
        this.sprite = null;
        this.speed = 0;
        this.x = 0;
        this.y = 0;
        this.width = 10;
        this.height = 10;
        this.sheet = {
            coordX: null,
            coordY: null,
            frameWidth: 10,
            frameHeight: 10
        }
    }

    /**
     * Set a different canvas context to draw to.
     * @param {object} aContext the canvas context
     */
    setContext(aContext) {
        this.context = aContext;
    }

    /**
     * If we want to clip a sprite sheet, give the coordinates.
     * @param {number} aCoordX 
     * @param {number} aCoordY
     * @param {number} frameWidth spritesheet frame width
     * @param {number} frameHeight spritesheet frame height
     */
    updateSheetCoords(aCoordX, aCoordY, frameWidth, frameHeight) {
        this.sheet.coordX = aCoordX;
        this.sheet.coordY = aCoordY;
        this.sheet.frameWidth = frameWidth;
        this.sheet.frameHeight = frameHeight;
    }

    /**
     * Update the position of the update based on the speed * secondsPassed
     * since the last game loop.
     * @param {number} secondsPassed the seconds since the last game loop
     */
    update(secondsPassed) 
    {
        this.y += this.speed * secondsPassed; // distance
    }

    /**
     * Draw the object to the canvas
     */
    draw() 
    {
        let ctx = this.context || context;

        let coordX = this.sheet.coordX;
        let coordY = this.sheet.coordY;

        if (typeof coordX === "number" && typeof coordY === "number") {
            ctx.drawImage
            (
                this.sprite, 
                coordX, coordY, // clip sprite at
                this.sheet.frameWidth, this.sheet.frameHeight,  // how big is the clip
                this.x, this.y, // position
                this.width, this.height // scaling
            );
        }
        else {
            ctx.drawImage(this.sprite, this.x, this.y);
        }
    }
}

/**
 * Create a Game Animated Object that is set up for animations.
 */
class GameAnimatedObject extends GameObject 
{
    constructor() 
    {
        super();

        this.updateSheetFrames(1, 1, 10, 10);
        this.animation = {
            timerAnim: null, // setInterval of 100ms that controls animations, should run forever.
            timerFrame: null, // setTimeout to control the frame delay value if it exists.
            currentFrame: 0,
            currentAnim: "",// "idleLeft"
            animations: {}, // {idleLeft: [{col:0, row:0, delay:600}, {col:1, row:0, delay:300}]},
            
            /**
             * Start the animation setInterval 100s or a custom value.
             * @param {number} [anInterval] the interval speed
             */
            play: function(anInterval=100) {
                this.timerAnim = setInterval(this.animate.bind(this), anInterval);
            },
            
            /**
             * Change the playing animation and reset state.
             * @param {string} anAnimation the animation key-name
             */
            update: function(anAnimation) 
            {
                // If the new animation is different from the current one...
                if (this.currentAnim != anAnimation) {
                    this.cancel();
                    this.currentAnim = anAnimation;
                    this.currentFrame = 0;
                }
            },

            /**
             * Stop the timer for the current animation frame.
             */
            cancel: function() 
            {
                clearTimeout(this.timerFrame);
                this.timerFrame = null;
            },

            /**
             * setInterval function to animate every 100ms.
             */
            animate: function() 
            {
                // If there's no delayed frame in progress...
                if (!this.timerFrame) {

                    // Pick a new frame and account for frame loop
                    if (++this.currentFrame > this.animations[this.currentAnim].length - 1){
                        this.currentFrame = 0;
                    }
                    // Get the animation frame and set a delay if there is one.
                    let frame = this.getFrame();
                    if (frame.delay) {
                        this.timerFrame = setTimeout(this.cancel.bind(this), frame.delay); // Pass the object to the function callback
                    }
                }
            },

            /**
             * Get the current frame parameters.
             * @returns the current frame parameters
             */
            getFrame: function()
            {
                return this.animations[this.currentAnim][this.currentFrame];
            }
        }
        return; // required for class that extends
    }

    /**
     * Update the spritesheet parameters.
     * @param {number} columns spritesheet total columns
     * @param {number} rows spritesheet total rows
     * @param {number} frameWidth spritesheet frame width
     * @param {number} frameHeight spritesheet frame height
     */
    updateSheetFrames(columns, rows, frameWidth, frameHeight) {
        this.sheet.columns = columns;
        this.sheet.rows = rows;
        super.updateSheetCoords(this.sheet.coordX, this.sheet.coordY, frameWidth, frameHeight);
    }


    /**
     * Draw the game object to canvas based on it's position and animation frame.
     */
    draw()
    {   
        let ctx = this.context || context;

        let frameWidth = this.sheet.frameWidth;
        let frameHeight = this.sheet.frameHeight;
        let frame = this.animation.getFrame();

        ctx.drawImage
        (
            this.sprite, 
            frame.col * frameWidth, frame.row * frameHeight, // clip sprite at
            frameWidth, frameHeight,  // how big is the clip
            this.x, this.y, // position
            this.width, this.height // scaling
        );
    }
}
