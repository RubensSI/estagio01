import 'phaser';
import logo from '../../assets/logo.png';
import ninjaImage from '../../assets/ninja.png';
import pole from '../../assets/pole.png';
import powerbar from '../../assets/powerbar.png';


var ninja;
var ninjaGravity = 800;
var ninjaJumpPower;
var score = 0;
var scoreText;
var topScore;
var powerBar;
var powerTween;
var placedPoles;
var poleGroup;
var minPoleGap = 100;
var maxPoleGap = 300;
var ninjaJumping;
var ninjaFallingDown;

/* var Pole = function (game, x, y) {
  Phaser.Sprite.call(this, game, x, y, "pole");
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.immovable = true;
  this.poleNumber = placedPoles;
};
Pole.prototype = Object.create(Phaser.Sprite.prototype);
Pole.prototype.constructor = Pole;
Pole.prototype.update = function () {
  if (ninjaJumping && !ninjaFallingDown) {
    this.body.velocity.x = ninjaJumpPower;
  }
  else {
    this.body.velocity.x = 0
  }
  if (this.x < -this.width) {
    this.destroy();
    //addNewPoles();
  }
}
 */

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    // load images
    this.load.image('logo', logo);
    this.load.image("ninja", ninjaImage);
    this.load.image("pole", pole);
    this.load.image("powerbar", powerbar);
  }

  create() {
    this.add.image(400, 300, 'ground');
    /* this.add.image(400, 300, 'logo');
    this.add.image(100, 300, 'ninja');
    this.add.image(200, 300, 'pole');
    this.add.image(300, 300, 'powerbar'); */
    ninjaJumping = false;
    ninjaFallingDown = false;
    score = 0;
    placedPoles = 0;
    poleGroup = this.physics.add.staticGroup();
    topScore = localStorage.getItem("topFlappyScore") == null ? 0 : localStorage.getItem("topFlappyScore");
    scoreText = this.add.text(10, 10, "-", {
      font: "bold 16px Arial"
    });
    this.updateScore();
    //game.stage.backgroundColor = "#87CEEB";

    ninja = this.physics.add.sprite(80, 0, "ninja");
    //ninja.setOrigin(0.5);
    //ninja.setBounce(0.08);
    ninja.lastPole = 1;
    ninja.body.setGravityY(ninjaGravity);
    ninja.setCollideWorldBounds(true);
    
    this.addPole(80);
    
    this.physics.add.collider(ninja, poleGroup);

  }
  updateScore() {
    scoreText.text = "Score: " + score + "\nBest: " + topScore;
  }
  prepareToJump() {
    if (ninja.body.velocity.y == 0) {
      powerBar = game.add.sprite(ninja.x, ninja.y - 50, "powerbar");
      powerBar.width = 0;
      powerTween = game.add.tween(powerBar).to({
        width: 100
      }, 1000, "Linear", true);
      game.input.onDown.remove(prepareToJump, this);
      game.input.onUp.add(jump, this);
    }
  }
  jump() {
    ninjaJumpPower = -powerBar.width * 3 - 100
    powerBar.destroy();
    game.tweens.removeAll();
    ninja.body.velocity.y = ninjaJumpPower * 2;
    ninjaJumping = true;
    powerTween.stop();
    game.input.onUp.remove(jump, this);
  }
  addNewPoles() {
    var maxPoleX = 0;
    poleGroup.forEach(function (item) {
      maxPoleX = Math.max(item.x, maxPoleX);
    });
    var nextPolePosition = maxPoleX + game.rnd.between(minPoleGap, maxPoleGap);
    addPole(nextPolePosition);
  }

  addPole(poleX) {
    if (poleX < this.game.config.width * 2) {
      placedPoles++;
      //var pole = new Pole(game, poleX, this.rnd.between(250, 380));
      var pole = poleGroup.create(poleX, Phaser.Math.RND.between(220,350) * 2, 'pole');
      //this.add.existing(pole);
      //pole.setOrigin(0.5, 0);
      //poleGroup.add(pole);
      var nextPolePosition = poleX + Phaser.Math.RND.between(minPoleGap, maxPoleGap);
      this.addPole(nextPolePosition);
    }
  }
  die() {
    localStorage.setItem("topFlappyScore", Math.max(score, topScore));
    game.state.start("Play");
  }

  checkLanding(n, p) {
    if (p.y >= n.y + n.height / 2) {
      var border = n.x - p.x
      if (Math.abs(border) > 20) {
        n.body.velocity.x = border * 2;
        n.body.velocity.y = -200;
      }
      var poleDiff = p.poleNumber - n.lastPole;
      if (poleDiff > 0) {
        score += Math.pow(2, poleDiff);
        updateScore();
        n.lastPole = p.poleNumber;
      }
      if (ninjaJumping) {
        ninjaJumping = false;
        game.input.onDown.add(prepareToJump, this);
      }
    }
    else {
      ninjaFallingDown = true;
      poleGroup.forEach(function (item) {
        item.body.velocity.x = 0;
      });
    }
  }
};
