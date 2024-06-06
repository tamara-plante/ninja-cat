/**
 * Function to create new items that start at a random x position and above the canva
 * @returns New items that start from the start at a random x position
 */
function newItem() {
  return {
      sprite: item.sprite,
      sheet: item.sheet,
      x: Math.floor(Math.random() * (canvas.width - item.sheet.frameWidth)), 
      y: 0 - item.sheet.frameHeight, 
      width: item.width,
      height: item.height,
      points: item.points
  };
}

// item specification
item = {
  sprite: null,
  sheet: {
      frameWidth: 96,
      frameHeight: 96
  },
  x: 250,
  y: 585-55+30,
  width: 42, 
  height: 45,
  points: 10 
}


item.draw = function()
{
    context.drawImage(item.sprite, item.x, item.y);
}