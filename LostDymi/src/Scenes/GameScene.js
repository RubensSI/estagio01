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
			poleGroup = this.add.group();
			topScore = localStorage.getItem("topFlappyScore")==null?0:localStorage.getItem("topFlappyScore");
			scoreText = this.add.text(10,10,"-",{
				font:"bold 16px Arial"
			});
			//updateScore();
      //game.stage.backgroundColor = "#87CEEB";

			ninja = this.physics.add.sprite(80,0,"ninja");
			ninja.setOrigin(0.5);
      ninja.setBounce(0.08);
			ninja.lastPole = 1;
      ninja.body.setGravityY(ninjaGravity);
      ninja.setCollideWorldBounds(true);
  }
};
