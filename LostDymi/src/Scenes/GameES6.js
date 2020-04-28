import 'phaser';
import backgroundImg from './assets/sky.png';
import poleImg from './assets/pole.png';
import pingImg from './assets/ninja.png';
import powerbarImg from './assets/powerbar.png';

var game;
var ping;
var pingGravity = 800;
var pingJumpPower;
var score = 0;
var scoreText;
var powerBar;
var powerTween;
var placedPoles;
var poleGroup;
var minPoleGap = 100;
var maxPoleGap = 300;
var pingJumping;
var pingFallingDown;
var jumps;
var maxExtraJumps = 1;
//var player;

window.onload = function () {
    let gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: this.Phaser.Scale.CENTER_BOTH,
            parent: 'thegame',
            width: 800,
            height: 600
        },
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
        scene: GameScene
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        // loads elements
        this.load.image('Background', backgroundImg);
        this.load.image('Pole', poleImg);
        this.load.image('Ping', pingImg);
        this.load.image('Powerbar', powerbarImg);
    }

    create() {
        // config player
        this.add.image(400, 300, 'Background');
        ping = this.physics.add.sprite(80, 0, 'Ping');
        ping.body.setGravityY(pingGravity);
        ping.setOrigin(0.5);
        ping.setBounce(0.08);
        ping.setCollideWorldBounds(true);

        pingJumping = false;
        pingFallingDown = false;

        poleGroup = this.physics.add.staticGroup();

    }

    update() {

    }

    prepareToJump() {
        if (ping.body.velocity.y == 0 || jumps < maxExtraJumps) {
            jumps++;
            powerBar = this.add.sprite(ping.x, ping.y-50, "Powerbar");
            powerBar.width = 0;
            powerTween = this.tweens(powerBar).to({
                width:100
             }, 1000, "Linear",true); 
        }
    }

    jump() {

    }
}