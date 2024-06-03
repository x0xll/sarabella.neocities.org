nextScreen = false


class Load extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'Load' });
    }

    preload ()
    {
        this.load.audio('background_music', ['./game_soundtrack.mp3']);

    }

    create ()
    {
        this.playMusic = true

        // Music
        this.backgroundMusic = this.sound.add('background_music');
        this.backgroundMusic.loop = true; 
        this.backgroundMusic.play();

        this.scene.start('StartScreen', {backgroundMusic: this.backgroundMusic, playMusic: this.playMusic});
    }
}