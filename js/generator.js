/**
 * Where we generate fancy nuggets (and more) or damaging items!
 */
const goodTypes = [
    {name: "nugget", coord_x:0, coord_y:0, fwidth:48, fheight:51, points:10},
    {name: "fish", coord_x:48, coord_y:0, fwidth: 90, fheight:96, width:45, height:48, points:5}
]
const badTypes = ["water"];
const itemsSprite = document.getElementById("items");
const waterSprite = document.getElementById("water");


/**
 * Get a random item.
 * @returns a random entry from goodTypes
 */
function randomizer() 
{
    let random = Math.floor(Math.random() * goodTypes.length);
    return goodTypes[random];
}


/**
 * Generate good static items.
 */
class Item extends GameObject
{
    constructor(aName, aSpeed, aCoordX, aCoordY, aFrameWidth, aFrameHeight, aWidth, aHeight, points)
    {
        super();

        this.sprite = itemsSprite;
        this.name = aName;
        this.speed = aSpeed;
        this.width = aWidth;
        this.height = aHeight;
        this.points = points;

        // Setup where the image should be clipped at.
        this.updateSheetCoords(aCoordX, aCoordY, aFrameWidth, aFrameHeight);
    }
}

/**
 * Generate animated water drops.
 */
class Water extends GameAnimatedObject
{
    constructor(aSpeed) 
    {
        super();
        
        this.sprite = waterSprite;
        this.width = 42;
        this.height = 54;
        this.speed = aSpeed;

        // Setup the spritesheet
        this.updateSheetFrames(7, 1, 63, 81);

        // Set up the animations
        this.animation.currentAnim = "idle";
        this.animation.animations = {
            idle: [{col:0, row:0}, {col:1, row:0}, {col:0, row:0}, {col:2, row:0}],
            splash: [{col:2, row:0}, {col:3, row:0}, {col:4, row:0}, {col:5, row:0, delay:200}, {col:6, row:0}]
        }

        // Start the animation
        this.animation.play();
    }

    destroy() 
    {
        this.destroyed = true;
        this.animation.update("splash");
        //setTimeout(this.remove.bind(this), 500)
    }
    remove = function() 
    {
        //console.log("remove me!")
    }
}


/**
 * Function to randomly create new items that start at a random x position and above the canvas
 * that start from the start at a random x position
 * Add New item to the active items array.
 */
game.items.generate = function() 
{
    let randomSpeed = Math.floor((Math.random() * 300) + 100);
    let item;

    // Try to spawn a bad item
    if (Math.random() < 0.01) {
        item = new Water(randomSpeed);
    }
    // Add new items randomly
    else if (Math.random() < 0.045)  { 
        let data = randomizer();
        item = new Item(data.name, randomSpeed, 
                        data.coord_x, data.coord_y, 
                        data.fwidth, data.fheight, 
                        data.width || data.fwidth, 
                        data.height || data.fheight, 
                        data.points);
    }
    // No spawn this time
    else return;

    // Random position on the x axis.
    item.x = Math.floor(Math.random() * (canvas.width - item.width));

    // Add to the active array
    game.items.active.push(item);
}