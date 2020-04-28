import 'phaser';

export default {
  type: Phaser.AUTO,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 100 },
      debug: true
    }
  }
};
