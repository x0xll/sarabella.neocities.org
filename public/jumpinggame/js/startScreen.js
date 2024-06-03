class StartScreen extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'StartScreen' });
    }

    preload ()
    {
        this.load.image('start', './images/start_screen.png');
        this.load.image('UI', './images/UI.png');
        this.load.atlas('music_button', './images/music.png', './images/music.json');
        this.load.audio('background_music', ['./game_soundtrack.mp3']);
        this.load.plugin('rexclockplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexclockplugin.min.js', true);

    }

    create (data)
    {
        this.data = data // Used to get data into update()

        // Start screen
        const start = this.add.image(444, 234, 'start').setScrollFactor(0)
        const startInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(286, 274, 325, 45), Phaser.Geom.Rectangle.Contains);
            startInteractive.on('pointerdown', function (pointer)
            {
                nextScreen = true
            });


        // Text for start button
        this.startText = this.add.text(443, 234, 'Static Text Object', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff', align: 'center' });
        this.startText.text = langData.start_game;
        this.startText.setPosition(450-this.startText.width/2, 295-this.startText.height/2);


        // UI
        const UI = this.add.image(443, 234, 'UI').setScrollFactor(0)
        // Music button
        const musicButton = this.add.sprite(871, 453, 'music_button', 'music_on').setInteractive({ pixelPerfect: true }).setScale(0.7).setScrollFactor(0);
            musicButton.on('pointerdown', function (pointer)
            {
                if (data.playMusic) {
                    data.backgroundMusic.stop()
                    this.setFrame('music_off_hover')
                }
                else {
                    data.backgroundMusic.play()
                    this.setFrame('music_on_hover')
                }
                data.playMusic = !data.playMusic
            });
            musicButton.on('pointerover', function (pointer) { this.setFrame(`music_${data.playMusic ? 'on' : 'off'}_hover`)});
            musicButton.on('pointerout', function (pointer) { this.setFrame(`music_${data.playMusic ? 'on' : 'off'}`) });
    }

    update () 
    {
        if (nextScreen) {
            nextScreen = false
            this.scene.start('LevelOne', {backgroundMusic: this.data.backgroundMusic, playMusic: this.data.playMusic});
        }
    }

}