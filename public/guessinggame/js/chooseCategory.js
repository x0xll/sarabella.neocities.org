// Variables to be used throughout scene
playMusic = true;
currentGuessingFile = "../datas/adventure.json";

// Actual game start
class ChooseCategory extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: 'chooseCategory'
        });
    }

    preload ()
    {  
        // Display Loading Bar
        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0x35a3d5, 1);
            progressBar.fillRect(389, 337, 100 * value, 6);
        });    
        this.add.image(444, 261, 'card_back');  
        this.add.graphics().fillStyle(0x000000).fillRect(386, 334, 116, 12);
        const progressBar = this.add.graphics();
        const progressText = this.add.text(344, 133, '', { fontFamily: 'Arial', fontSize: 12, color: '#ffffff', align: 'center' });
            
        // Load in images and sounds
        this.load.image('bella_test', './images/horses/adventure/Bella_Adventures.png');
        this.load.image('button', './images/nameplate.png');
        this.load.image('container', './images/InfoBox.png');
        this.load.image('background', './images/background.png')
    }

    create ()
    {
        //  If you disable topOnly it will fire events for all objects the pointer is over, regardless of place on the display list
        this.input.topOnly = true;

        this.add.image(0, 0, 'background').setOrigin(0, 0);

        const globalTextSettings = {
            font: 'bold 25px Arial',
            color: 'white',
            align: 'center',
        }

        // Aventure choice
        const adventureChoice = this.add.image(150, 261, "container")
                                        .setInteractive({pixelPerfect: true});
        this.add.image(150, 261, 'bella_test').setScale(0.5);
        this.add.image(150, 440, "button").setScale(1.4);
        this.add.text(83, 428, localeData.categoryAdventure, globalTextSettings)

        adventureChoice.on('pointerdown', () => 
        {
            const sharedDatas = {
                category: "Adventure"
            }
            this.scene.start('guessing', sharedDatas);
        });    

        // Cards choice
        const cardsChoice = this.add.image(738, 261, "container")
                                    .setInteractive({pixelPerfect: true});
        this.add.image(738, 261, 'bella_test').setScale(0.5);
        this.add.image(738, 440, "button").setScale(1.4);
        this.add.text(671, 428, localeData.categoryCards, globalTextSettings)

        cardsChoice.on('pointerdown', () => 
            {
                const sharedDatas = {
                    category: "Cards"
                }
                this.scene.start('guessing', sharedDatas);
            });
    }
}