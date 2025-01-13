class StartScreen extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'StartScreen' });
    }

    preload ()
    {
        this.load.image('start', './images/start_screen.png');
        // this.load.image('levelSelectRef', './images/Level Screens/levelSelectRef.jpg');
        this.load.image('levelSelect', './images/levelSelectScreen.jpg');
        this.load.image('levelHover', './images/levelHover.png');
        this.load.image('levelBella', './images/levelBella.png');
        this.load.image('levelFiona', './images/levelFiona.png');
        this.load.image('levelJewel', './images/levelJewel.png');
        this.load.image('levelThunder', './images/levelThunder.png');
        this.load.image('UI', './images/UI.png');
        this.load.atlas('music_button', './images/music.png', './images/music.json');
        this.load.plugin('rexclockplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexclockplugin.min.js', true);

    }

    create (data)
    {
        this.data = data // Used to get data into update()
        let game = this

        // Start screen
        const start = this.add.image(444, 234, 'start').setScrollFactor(0)
        const startInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(286, 274, 325, 45), Phaser.Geom.Rectangle.Contains);
            startInteractive.on('pointerdown', function (pointer)
            {
                data.started = true
            });

        
        function showSelect() {
            this.levelSelect.setVisible(true)
            // this.levelSelectRef.setVisible(true)
            for (let index = 0; index < this.levels.length; index++) {
                const element = this.levels[index];
                element.setVisible(true)
                if (this.data.levelUnlocked[index]) {
                    element.setAlpha(1).setInteractive({ pixelPerfect: true })
                    element.on('pointerover', function (pointer) { levelHover.setVisible(true).setPosition(element.x, element.y)});
                    element.on('pointerout', function (pointer) { levelHover.setVisible(false)});
                } else {
                    element.setAlpha(.5)
                }
            }
            this.levelLabels.forEach(element => {
                element.setVisible(true)
            });
        }
        this.showSelect = showSelect
            

        // Text for start button
        this.startText = this.add.text(450, 295, 'Static Text Object', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff', align: 'center' });
        this.startText.text = langData.start_game;
        this.startText.setOrigin(.5,0.5)

        
        // Level select
        this.levelSelect = game.add.image(444, 234, 'levelSelect').setScrollFactor(0).setVisible(false)
        // this.levelSelectRef = game.add.image(444, 234, 'levelSelectRef').setScrollFactor(0).setVisible(false)
        const levelBella = game.add.image(213, 240, 'levelBella').setScrollFactor(0).setVisible(false)
            levelBella.on('pointerdown', function (pointer) { nextScreen = 'LevelOne'});
        const levelFiona = game.add.image(365, 240, 'levelFiona').setScrollFactor(0).setVisible(false)
            levelFiona.on('pointerdown', function (pointer) { nextScreen = 'LevelTwo'});
        const levelJewel = game.add.image(520, 240, 'levelJewel').setScrollFactor(0).setVisible(false)
            // levelJewel.on('pointerdown', function (pointer) { nextScreen = 'LevelThree'});
        const levelThunder = game.add.image(670, 240, 'levelThunder').setScrollFactor(0).setVisible(false)
            // levelThunder.on('pointerdown', function (pointer) { nextScreen = 'LevelFour'});
        const levelHover = game.add.image(444, 240, 'levelHover').setScrollFactor(0).setVisible(false)
        this.levels = [levelBella,levelFiona, levelJewel, levelThunder]

        this.levelsText = this.add.text(444, 155, 'Static Text Object', { fontFamily: 'Arial', fontSize: 16, color: '#ffffff', align: 'center' }).setVisible(false);
        this.levelsText.text = langData.levels;
        this.levelsText.setOrigin(.5,.5)
        this.level1Text = this.add.text(215, 188, 'Static Text Object', { fontFamily: 'Arial', fontSize: 16, color: '#ffffff', align: 'center' }).setVisible(false);
        this.level1Text.text = langData.level_one;
        this.level1Text.setOrigin(.5,.5)
        this.level2Text = this.add.text(367, 188, 'Static Text Object', { fontFamily: 'Arial', fontSize: 16, color: '#ffffff', align: 'center' }).setVisible(false);
        this.level2Text.text = langData.level_two;
        this.level2Text.setOrigin(.5,.5)
        this.level3Text = this.add.text(522, 188, 'Static Text Object', { fontFamily: 'Arial', fontSize: 16, color: '#ffffff', align: 'center' }).setVisible(false);
        this.level3Text.text = langData.level_three;
        this.level3Text.setOrigin(.5,.5)
        this.level4Text = this.add.text(672, 188, 'Static Text Object', { fontFamily: 'Arial', fontSize: 16, color: '#ffffff', align: 'center' }).setVisible(false);
        this.level4Text.text = langData.level_four;
        this.level4Text.setOrigin(.5,.5)
        this.levelsText.setOrigin(.5,.5)
        this.level1NameText = this.add.text(215, 300, 'Static Text Object', { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' }).setVisible(false);
        this.level1NameText.text = langData.level_one_name;
        this.level1NameText.setOrigin(.5,.5)
        this.level2NameText = this.add.text(367, 300, 'Static Text Object', { fontFamily: 'Arial', fontSize: 16, color: '#ffffff', align: 'center' }).setVisible(false);
        this.level2NameText.text = langData.level_two_name;
        this.level2NameText.setOrigin(.5,.5)
        this.level3NameText = this.add.text(520, 300, 'Static Text Object', { fontFamily: 'Arial', fontSize: 16, color: '#ffffff', align: 'center' }).setVisible(false);
        this.level3NameText.text = langData.level_three_name;
        this.level3NameText.setOrigin(.5,.5)
        this.level4NameText = this.add.text(675, 300, 'Static Text Object', { fontFamily: 'Arial', fontSize: 16, color: '#ffffff', align: 'center' }).setVisible(false);
        this.level4NameText.text = langData.level_four_name;
        this.level4NameText.setOrigin(.5,.5)
        this.levelLabels = [this.levelsText,this.level1Text, this.level2Text, this.level3Text, this.level4Text, this.level1NameText, this.level2NameText, this.level3NameText, this.level4NameText]


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
        if (this.data.started) {
            this.showSelect()
        }

        if (nextScreen) {
            let levelSelected = nextScreen
            nextScreen = false
            this.scene.start(levelSelected, this.data);
        }
    }

}