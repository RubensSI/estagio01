import 'phaser';
import logo from "../../assets/logo.png";
import pole from "../../assets/pole.png";
import powerbar from '../../assets/powerbar.png';
import chaoImg from "../../assets/chao.png";
import background from "../../assets/BG.png";
import ilha from "../../assets/platform.png";
import Water from "../../assets/water.png";
import Dymi from "../../assets/Dymi.png";
import DymiJson from "../../assets/Dymi.json";


var ninja;
var ninjaGravity = 600;
var ninjaJumpPower;
var score = 0;
var scoreText;
var topScore;
var powerBar;
var estPulando = false;
var powerTween;
var placedPoles;
var poleGroup;
var minPoleGap = 200;
var maxPoleGap = 350;
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
    this.load.atlas('ninja', Dymi, DymiJson);
    this.load.image("pole", pole);
    this.load.image("powerbar", powerbar);
    this.load.image("chao", chaoImg);
    this.load.image("ilha", ilha);
    this.load.image('water', Water);
  }

  create() {
    game = this;

    const music = this.sound.add('bgMusic', { volume: 0.05, loop: true });

    music.play();
    //Adição do background
    this.add.image(500, 300, 'background');
    //  The platforms group contains the ground and the 2 ledges we can jump on
    chaoGroup = this.physics.add.staticGroup();
    let chao = chaoGroup.create(400, 630, 'chao').setScale(10, 1).refreshBody();
    var wat0 = this.add.tileSprite(300, 570, 128 * 8, 99, 'water');
    chao.setImmovable(true);
    //chao.setCollideWorldBounds(true);

    const quit = this.add.text(10, 50, 'Quit', { font: "bold 16px Arial" });
    quit.setInteractive();

    quit.on('pointerdown', () => {this.sound.stopAll(), this.scene.start('Title'); });
    
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

    ninja = this.physics.add.sprite(80, 200, "ninja");
    var frameNames = this.textures.get('ninja').getFrameNames();
    console.log(frameNames);

    this.anims.create({
      key: 'Up',
      frames: [
        { key: 'ninja', frame: 'penguin_jump01.png' },
        { key: 'ninja', frame: 'penguin_jump02.png' },
        { key: 'ninja', frame: 'penguin_jump03.png' }
      ],
      frameRate: 5,
      repeat: 8
    });

    this.anims.create({
      key: 'Stop',
      frames: [
        { key: 'ninja', frame: 'penguin_walk04.png' }
      ],
      frameRate: 5,
      repeat: 8
    });
    this.anims.create({
      key: 'Morreu',
      frames: [
        { key: 'ninja', frame: 'penguin_die03.png' },
        { key: 'ninja', frame: 'penguin_die04.png' }
      ],
      frameRate: 5,
      repeat: 8
    });


    ninja.body.setGravityY(ninjaGravity);
    ninja.setVelocityY(0);
    this.physics.add.collider(ninja, chaoGroup, this.die, null, this);
    ninja.lastPole = 1;
    this.addPole(80);
    this.input.keyboard.on('keydown', this.prepareToJump);
    this.anims.play('true')

    var wat = this.add.tileSprite(400, 620, 128 * 8, 99, 'water');
  }
  updateScore() {
    scoreText.text = "Score: " + score + "\nBest: " + topScore;
  }
  update() {
    game.physics.add.collider(ninja, poleGroup, this.checkLanding, null, this);
  }

  prepareToJump() {
    ninja.body.velocity.x = 0;
    if (!estPulando) {
      if (ninja.body.velocity.y <= 25) {
        ninja.play('Stop', true);
        powerBar = game.add.image(ninja.x + 50, ninja.y - 50, 'powerbar');
        estPulando = true;
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
  }

  jump() {
    if (estPulando) {
      ninjaJumpPower = -powerBar.width * 3 - 100;
      powerBar.destroy();
      estPulando = false;
      powerTween.stop();
      powerTween.remove();
      ninja.body.velocity.y = ninjaJumpPower * 2;
      ninja.body.velocity.x = 0;
      ninjaJumping = true;
      ninja.play('Up', true);
      game.input.keyboard.off('keyup', game.jump);
      game.input.keyboard.on('keydown', game.prepareToJump);
    }
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
      var pole = new Pole(game, poleX, 344, 'ilha');
      pole.setOrigin(0.5, 0);
      pole.setScale(0.8);
      //pole.setScale(1, 1 / Phaser.Math.RND.between(2, 2));
      poleGroup.add(pole);
      var nextPolePosition = poleX + Phaser.Math.RND.between(minPoleGap, maxPoleGap);
      this.addPole(nextPolePosition);
    }
  }

  die() {
    ninja.play('Morreu', true);
    this.sound.stopAll();
    for (let index = 0; index < 8000; index++) {
      //const element = array[index];
    }
    localStorage.setItem("topFlappyScore", Math.max(score, topScore));
    game.scene.start("Game");
  }

  checkLanding(n, p) {
    ninja.play('Stop', true);
    if (p.y >= n.y + n.height / 2) {
      var border = n.x - p.x
      if (Math.abs(border) > 30) {
        n.body.velocity.x = border * 2;
        //n.body.velocity.x = 0;
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
class Pole extends Phaser.GameObjects.TileSprite {

  constructor(scene, x, y, texture) {

    //super(scene, x, y ,32 * Phaser.Math.RND.between(1, 3), 32 * 15, texture);
    super(scene, x, y, 64, 64 * 14, texture);
    this.poleNumber = placedPoles;
    scene.add.existing(this);
    scene.physics.add.existing(this);

  }

  preUpdate(time, delta) {
    this.update();
  }

  update() {
    this.body.velocity.y = 0;
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