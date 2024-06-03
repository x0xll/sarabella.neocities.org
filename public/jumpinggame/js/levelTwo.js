// Placeholder level
class LevelTwo extends Phaser.Scene 
{

    constructor ()
    {
        super({ key: 'LevelTwo' });
    }

    create (data)
    { 
        this.data = data
        this.scene.start('StartScreen', {backgroundMusic: this.data.backgroundMusic, playMusic: this.data.playMusic});
    }
}