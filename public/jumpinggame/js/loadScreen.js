nextScreen = false



class Load extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'Load' });
    }

    preload ()
    {
        this.load.audio('background_music', ['./sounds/game_soundtrack.mp3']);
        this.load.audio('running_sound', ['./sounds/running.mp3']);

    }

    create ()
    {
        this.playMusic = true
        this.levelUnlocked = [true, false, false, false]
        if (this.physics.config.debug) { 
            this.levelUnlocked = [true, true, false, false]
        }

        // Music
        this.backgroundMusic = this.sound.add('background_music');
        this.backgroundMusic.loop = true; 
        this.backgroundMusic.play();

        this.runningSound = this.sound.add('running_sound');
        this.runningSound.loop = true; 

        this.scene.start('StartScreen', {backgroundMusic: this.backgroundMusic, runningSound: this.runningSound, playMusic: this.playMusic, levelUnlocked: this.levelUnlocked, started: false});
    }
}