import 'phaser';
import logo from "../../assets/logo.png";
import ninjaImage from "../../assets/ninjasp.png";
import pole from "../../assets/pole.png";
import powerbar from '../../assets/powerbar.png';
import chaoImg from "../../assets/chao.png";
import background from "../../assets/BG.png";
import ilha from "../../assets/pole.png";

var ninja;
var ninjaGravity = 600;
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
var chaoGroup;
var game;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    // load images
    this.load.image('background', background)
    this.load.image('logo', logo);
    this.load.image("pole", ilha)
    this.load.image("ninja", ninjaImage);
    this.load.image("pole", pole);
    this.load.image("powerbar", powerbar);
    this.load.image("chao", chaoImg);
  }

  create() {
    //Adição do background
    this.add.image(500, 300, 'background');
    //  The platforms group contains the ground and the 2 ledges we can jump on
    chaoGroup = this.physics.add.staticGroup();
    let chao = chaoGroup.create(400, 600, 'chao').setScale(10, 1).refreshBody();
    //chao.setCollideWorldBounds(true);

    game = this;
    ninjaJumping = false;
    ninjaFallingDown = false;
    score = 0;
    placedPoles = 0;
    poleGroup = this.physics.add.group();

    this.physics.add.collider(poleGroup, chaoGroup);

    topScore = localStorage.getItem("topFlappyScore") == null ? 0 : localStorage.getItem("topFlappyScore");
    scoreText = this.add.text(10, 10, "-", {
      font: "bold 16px Arial"
    });
    this.updateScore();
    //game.stage.backgroundColor = "#87CEEB";

    ninja = this.physics.add.sprite(80, 0, "ninja");
    //ninja.setOrigin(0.5,);
    ninja.lastPole = 1;
    ninja.body.setGravityY(ninjaGravity);
    //ninja.setCollideWorldBounds(true);
    ninja.setVelocityY(0);
    this.physics.add.collider(ninja, chaoGroup, this.die, null, this);
    this.addPole(80);
    this.input.keyboard.on('keydown', this.prepareToJump);
    
  }
  updateScore() {
    scoreText.text = "Score: " + score + "\nBest: " + topScore;
  }
  update() {
    game.physics.add.collider(ninja, poleGroup, this.checkLanding, null, this);
  }

  prepareToJump() {
    if (ninja.body.velocity.y <= 25) {
      //game.physics.add.sprite(100, 450, 'powerbar');
      powerBar = game.add.image(ninja.x + 50, ninja.y - 50, 'powerbar');
      //powerBar.setScale(0.9).refreshBody();
      powerBar.scaleX = 0;

      powerTween = game.tweens.add({
        targets: powerBar,
        scaleX: { from: 0, to: 1.5 },
        width: { from: 0, to: 100 },
        ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 1000,
        repeat: 0,            // -1: infinity
        yoyo: false
      });
      game.input.keyboard.off('keydown', game.prepareToJump);
      game.input.keyboard.on('keyup', game.jump);
    }
  }
  jump() {
    ninjaJumpPower = -powerBar.width * 3 - 100
    powerBar.destroy();
    powerTween.stop();
    powerTween.remove();
    ninja.body.velocity.y = ninjaJumpPower * 2;
    ninjaJumping = true;
    game.input.keyboard.off('keyup', game.jump);
    game.input.keyboard.on('keydown', game.prepareToJump);
  }

  addNewPoles() {
    var maxPoleX = 0;
    poleGroup.children.iterate(function (item) {
      maxPoleX = Math.max(item.x, maxPoleX);
    });
    var nextPolePosition = maxPoleX + Phaser.Math.RND.between(minPoleGap, maxPoleGap);
    this.addPole(nextPolePosition);
  }

  /**
   * Adiciona os postes
   * @param {*} poleX Posição inical do primeiro poste
   */
  addPole(poleX) {
    if (poleX < this.game.config.width * 2) {
      placedPoles++;
      //var pole = new Pole(game, poleX, this.rnd.between(250, 380));
      var pole = new Pole(game, poleX, 345, 'pole');
      //var pole = poleGroup.create(poleX, Phaser.Math.RND.between(220, 350) * 2, 'pole');
      pole.setOrigin(0.5, 0);
      //pole.setCollideWorldBounds(true);
      pole.setScale(1, 1 / Phaser.Math.RND.between(2, 2));
      poleGroup.add(pole);
      var nextPolePosition = poleX + Phaser.Math.RND.between(minPoleGap + 30, maxPoleGap);
      this.addPole(nextPolePosition);
    }
  }
  die() {
    localStorage.setItem("topFlappyScore", Math.max(score, topScore));
    game.scene.start("Game");
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
        this.updateScore();
        n.lastPole = p.poleNumber;
      }
      if (ninjaJumping) {
        ninjaJumping = false;
        //game.input.onDown.add(this.prepareToJump, this);
        game.input.keyboard.on('keydown', game.prepareToJump);
      }
    }
    else {
      ninjaFallingDown = true;
      poleGroup.children.iterate(function (item) {
        item.body.velocity.x = 0;
      });
    }
  }
};
/**
 * Classe que representa o poste
 */
class Pole extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, texture, ) {
    super(scene, x, y);
    this.poleNumber = placedPoles;
    this.setTexture(texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);    
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.update();
  }

  update() {
    if (ninjaJumping && !ninjaFallingDown) {
      this.body.velocity.x = ninjaJumpPower;
    }
    else {
      this.body.velocity.x = 0;
    }
    if (this.x < -this.width) {
      this.destroy();
      game.addNewPoles();
    }
  }
};