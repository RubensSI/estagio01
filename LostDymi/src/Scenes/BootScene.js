import 'phaser';
import logoImg from '../assets/zenva_logo.png';

export default class BootScene extends Pheser.Scene {
    constructor () {
        super('Boot');
    }

    preload() {
        this.image('logo', logoImg)
    }

    create() {
        this.scene.start('Preloader');
    }
};
