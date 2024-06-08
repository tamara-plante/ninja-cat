/**
 * Where we generate fancy nuggets (and more) or damaging items!
 */
const goodTypes = [
    {name: "nugget", coord_x:0, coord_y:0, fwidth:48, fheight:51, width:32, height:34, points:10},
    {name: "fish", coord_x:48, coord_y:0, fwidth:90, fheight:96, width:45, height:48, points:5}
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
    constructor(aGoodTypeItem, aSpeed)
    {
        super();

        this.sprite = itemsSprite;
        this.name = aGoodTypeItem.name;
        this.speed = aSpeed;
        this.width = aGoodTypeItem.width;
        this.height = aGoodTypeItem.height;
        this.points = aGoodTypeItem.points;

        // Set up frame width/height to item width and height 
        // if the scaling value is missing.
        if (typeof aGoodTypeItem.fwidth !== "number")
            aGoodTypeItem.fwidth = this.width;
        if (typeof aGoodTypeItem.fheight !== "number")
            aGoodTypeItem.fheight = this.height;

        // Setup where the image should be clipped at.
        this.updateSheetCoords(aGoodTypeItem.coord_x, aGoodTypeItem.coord_y, aGoodTypeItem.fwidth, aGoodTypeItem.fheight);
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
            splash: [{col:4, row:0}, {col:5, row:0, delay:200}, {col:6, row:0, delay:200}]
        }

        // Start the animation
        this.animation.play();
    }

    /**
     * Play out the death animation and flag for removal.
     */
    destroy() 
    {
        this.animation.update("splash");
        // Setup flag so it can be removed from the game.items.destroy array
        setTimeout(() => {// Arrow allows this to be preserved.
            this.animation.stop();
            this.destroyed = true;
        }, 400) 
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
        item = new Item(randomizer(), randomSpeed);
    }
    // No spawn this time
    else return;

    // Random position on the x axis.
    item.x = Math.floor(Math.random() * (canvas.width - item.width));

    // Add to the active array
    game.items.active.push(item);
}

/**
 * Draw the items in the active and destroyed array.
 */
game.items.draw = function()
{
    for (let item of this.active) {
        item.draw();
    }
    for (let item of this.destroy) {
        item.draw();
    }
}

/**
 * Reset the array of active and destroyed items.
 */
game.items.clear = function()
{
    game.items.active = [];
    game.items.destroy = [];
}

/** TODO: Is it needed?
 * Remove an item from the active array.
 * @param {number} anIndex the index in the array to remove
 * @returns the removed item
 */
game.items.remove = function(anIndex)
{
    return this.active.splice(anIndex, 1);
}

/**
 * Destroy the items when they are ready to be destroyed 
 * (after destroyed=true)
 */
game.items.clearDestroyed = function()
{
    for (let i in this.destroy) {
        let item = this.destroy[i];

        // Item is ready to be destroyed.
        if (item.destroyed) {
            this.destroy.splice(i, 1);
        }
    }
}