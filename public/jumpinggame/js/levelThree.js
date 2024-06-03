// Placeholder level
class LevelThree extends Phaser.Scene 
{

    constructor ()
    {
        super({ key: 'LevelThree' });
    }

    create (data)
    { 
        this.data = data
        this.scene.start('StartScreen', {backgroundMusic: this.data.backgroundMusic, playMusic: this.data.playMusic});
    }
}