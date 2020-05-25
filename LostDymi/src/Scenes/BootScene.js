import 'phaser';
import Logo from '../../assets/logoImg.png';
import Ground from '../../assets/bg_menu.png';

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