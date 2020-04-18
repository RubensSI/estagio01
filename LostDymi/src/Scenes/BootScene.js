import 'phaser';
import Logo from '../../assets/zenva_logo.png';
import Ground from '../../assets/ground.png';

export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Boot');
  }

  preload () {
    this.load.image('logo', Logo);
    this.load.image('ground', Ground);
  }

  create () {
    this.scene.start('Preloader');
  }
};