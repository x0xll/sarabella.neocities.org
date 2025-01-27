let nextSceneName = "Level"
let nextScreen = false

class StartScreen extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'StartScreen' });
    }

    preload ()
    {
        this.load.atlas('music_button', './images/music.png', './images/music.json');

        this.load.image('startscreen', './images/start_screen.png') 
        this.load.image('menu_button', './images/purple_button.png')
    }

    create (data)
    {
        this.data = data // Used to get data into update()

        // Start screen
        this.add.image(0, 0, "startscreen").setOrigin(0)

        // Intro Text
        let introTextStyle = 
        {
            fontFamily: "Arial",
            align: "left",
            wordWrap: { width: 270 },
            fontSize: "11px",
            color: "#OOOOOO",
            lineSpacing: 12
        }

        this.add.text(70, 270, "Help the Citrustacks journey across Canter Hollow to bring Mother Comfort's candy to the Faire for the Winter Festival!", introTextStyle)
        this.add.text(70, 360, "     The journey might take you a few days, but don't worry: you'll start again right where you left off!", introTextStyle)


        let buttonTextStyle = {fontFamily: 'Arial', fontSize: '18px', color: '#000000', align: 'center'}
        // Story Button
        const storyBtn = this.add.image(444, 310, "menu_button").setOrigin(.5).setInteractive({ pixelPerfect: true })
        const storyBtnTxt = this.add.text(446, 312, "Story Mode", buttonTextStyle).setOrigin(.5)

        storyBtn.on('pointerover', () => { onBtnOver(storyBtnTxt); });
        storyBtn.on('pointerout', () => { onBtnOut(storyBtnTxt); });
        storyBtn.on('pointerdown', () => 
        { 
            nextSceneName = "StoryMap"
            nextScreen = true;
        });

        // Practice Button
        const practiceBtn = this.add.image(444, 350, "menu_button").setOrigin(.5).setInteractive({ pixelPerfect: true })
        const practiceBtnTxt = this.add.text(446, 352, "Practice Mode", buttonTextStyle).setOrigin(.5)

        practiceBtn.on('pointerover', () => { onBtnOver(practiceBtnTxt); });
        practiceBtn.on('pointerout', () => { onBtnOut(practiceBtnTxt); });
        practiceBtn.on('pointerdown', () => 
        { 
            nextSceneName = "Level"
            nextScreen = true;
        });

        // Help Button
        const helpBtn = this.add.image(444, 390, "menu_button").setOrigin(.5).setInteractive({ pixelPerfect: true })
        const helpBtnTxt = this.add.text(446, 392, "Help", buttonTextStyle).setOrigin(.5)

        helpBtn.on('pointerover', () => { onBtnOver(helpBtnTxt); });
        helpBtn.on('pointerout', () => { onBtnOut(helpBtnTxt); });
        helpBtn.on('pointerdown', () => 
        { 
            // TODO : Open help UI
        });

        // Button over / out
        function onBtnOver(btnTxt)
        {
            // TODO : handle particles
            btnTxt.setColor("#ffffff")
        }

        function onBtnOut(btnTxt)
        {
            // TODO : handle particles
            btnTxt.setColor("#000000")
        }

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
            this.scene.start('Level', {backgroundMusic: this.data.backgroundMusic, runningSound: this.data.runningSound, playMusic: this.data.playMusic});
        }
    }

}