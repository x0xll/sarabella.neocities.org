// Placeholder level
class LevelFour extends Phaser.Scene 
{

    constructor ()
    {
        super({ key: 'LevelFour' });
    }

    create (data)
    { 
        this.data = data
        this.scene.start('StartScreen', {backgroundMusic: this.data.backgroundMusic, playMusic: this.data.playMusic});
    }
}