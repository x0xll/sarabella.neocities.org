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
        this.load.audio('horseshoe_sound', ['./sounds/497.mp3']);
        this.load.audio('canter_sound', ['./sounds/1550_canter.mp3']);
        this.load.audio('buttslide_sound', ['./sounds/1553_buttslide.mp3']);
        this.load.audio('running_sound', ['./sounds/1556_run.mp3']);
        this.load.audio('blue_gem_sound', ['./sounds/1559_blueGemAudio.mp3']);
        this.load.audio('pink_gem_sound', ['./sounds/1562_pinkGemAudio.mp3']);
        this.load.audio('yellow_gem_sound', ['./sounds/1565_yellowGemAudio.mp3']);

    }

    create ()
    {
        this.playMusic = true
        this.levelUnlocked = [true, false, false, false]
        let savedLoadedLevel = loadData("level", getGameID("SpectacularJumpingGame"));
        for (let i = 0; i <= savedLoadedLevel; i++)
        {
            // TODO : Remove this when the levels are finished
            if (i > 1) continue;

            this.levelUnlocked[i] = true;
        }

        if (this.physics.config.debug) { 
            this.levelUnlocked = [true, true, true, false]
        }

        // Music
        this.backgroundMusic = this.sound.add('background_music');
        this.backgroundMusic.loop = true; 
        this.backgroundMusic.play();

        this.canterSound = this.sound.add('canter_sound');
        this.canterSound.loop = true;
        this.buttslideSound = this.sound.add('buttslide_sound');
        this.buttslideSound.loop = true;
        this.runningSound = this.sound.add('running_sound');
        this.runningSound.loop = true;
        this.horseshoeSound = this.sound.add('horseshoe_sound');
        this.blueGemSound = this.sound.add('blue_gem_sound');
        this.pinkGemSound = this.sound.add('pink_gem_sound');
        this.yellowGemSound = this.sound.add('yellow_gem_sound');

        this.scene.start('StartScreen', {backgroundMusic: this.backgroundMusic, canterSound: this.canterSound, buttslideSound: this.buttslideSound, runningSound: this.runningSound, horseshoeSound: this.horseshoeSound, blueGemSound: this.blueGemSound, pinkGemSound: this.pinkGemSound, yellowGemSound: this.yellowGemSound, playMusic: this.playMusic, levelUnlocked: this.levelUnlocked, started: false});
    }
}