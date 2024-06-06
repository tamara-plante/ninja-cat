const HEIGHT = 400;
const WIDTH = 500;

const randomX = () => {
  return Math.ceil(Math.random() * WIDTH);
};



class Nugget {
  constructor(symbol, x) {
    this.symbol = symbol;
    this.x = x;
    this.y = 50;
  }

  render(ctx) {
    ctx.font = '40px serif'
    ctx.fillText(this.symbol, this.x, this.y)
  }

  fall(diff) {
    this.y += diff;
  }
}


class Game {
  constructor(canvas, difficulty, difficultyDelta) {
    this.score = 0;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.nuggets = [];
    this.difficulty = difficulty;
    this.difficultyDelta = difficultyDelta;

    this.nuggetsInterval = setInterval(() => {
      this.dropNuggets(Math.ceil(this.difficulty));
      // this.dropNuggets(1);
      this.difficulty += this.difficultyDelta;
    }, 1500);
  }



  dropNuggets(n) {
    const nuggets = document.getElementById("item")
    const numNuggets = Math.ceil(Math.random() * n)
    for(let i = 0; i < numNuggets; i++) {
      this.nuggets.push(new Rock(nuggets[Math.floor(Math.random() * nuggets.length)], randomX()));
    }
  }


  render() {
    this.nuggets.forEach((r) => {
      r.fall(this.difficulty);
      r.render(this.ctx)
    })
  }
}

var canvas = document.getElementById("game");
