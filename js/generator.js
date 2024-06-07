/**
 * Where we generate fancy nuggets (and more) or damaging items!
 */
const goodTypes = [
    {name: "nugget", coord_x:0, coord_y:0, width:48, height:51, points:10},
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
    constructor(aGoodTypeItem, aSpeed)
    {
        super();

        this.sprite = itemsSprite;
        this.name = aGoodTypeItem.name;
        this.speed = aSpeed;
        this.width = aGoodTypeItem.width;
        this.height = aGoodTypeItem.height;
        this.points = aGoodTypeItem.points;

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
        item = new Item(randomizer(), randomSpeed);
    }
    // No spawn this time
    else return;

    // Random position on the x axis.
    item.x = Math.floor(Math.random() * (canvas.width - item.width));

    // Add to the active array
    game.items.active.push(item);
}