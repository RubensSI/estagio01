import 'phaser';
import logoImg from '../assets/zenva_logo.png';

export default class BootScene extends Pheser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('logo', logoImg)
    }

    create() {
        this.scene.start('Preloader');
    }
};
