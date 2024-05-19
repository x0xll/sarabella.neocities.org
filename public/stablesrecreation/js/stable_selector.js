// list of all horses
const horses = [
    'peter',
    'amor',
    'anemone',
    'aphaia',
    'beran',
    'blossom',
    'bosi',
    'cantaro',
    'chitra',
    'clio',
    'colour',
    'cosima',
    'echo',
    'epona',
    'falcha',
    'faxon',
    'fiona',
    'hercules',
    'icarus',
    'ivy',
    'jaida',
    'jewel',
    'juno',
    'kendra',
    'lillova',
    'mellonie',
    'nike',
    'nori',
    'nuala',
    'persephone',
    'sarah',
    'savros',
    'sleipnir',
    'socorro',
    'starunna',
    'thunder',
    'uranus',
    'vesta',
    'virstan'
]
const displayHorses = Array.apply(null, Array(10)) // creates an all null array of length 3 -> change to 10 for final
let card0 = null
let card1 = null
let card2 = null
let card3 = null
let card4 = null
let card5 = null
let card6 = null
let card7 = null
let card8 = null
let card9 = null

let card0Text = null
let card1Text = null
let card2Text = null
let card3Text = null
let card4Text = null
let card5Text = null
let card6Text = null
let card7Text = null
let card8Text = null
let card9Text = null

let nameplate0 = null
let nameplate1 = null
let nameplate2 = null
let nameplate3 = null
let nameplate4 = null
let nameplate5 = null
let nameplate6 = null
let nameplate7 = null
let nameplate8 = null
let nameplate9 = null

let page = 0

// Gets the actual horse names
let horseNames = []
for (let index = 0; index < horses.length; index++) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = function() {
        const myObj = JSON.parse(this.responseText);
        horseNames[index] = myObj.name
    }
    xmlHttp.open("GET", `./images/horses/${horses[index]}/data.json`);
    xmlHttp.send();
};



class Selector extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'Selector' });
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

        this.load.image('card_empty', './images/selector/card_back.png');
        this.load.image('frame', './images/selector/frame.png');
        this.load.image('nameplate', './images/selector/nameplate.png');
        this.load.image('hover_glow', './images/selector/hover_glow.png');
        this.load.atlas('sparkle', './images/selector/sparkle.png', './images/selector/sparkle.json');

        horses.forEach(horse => {
            this.load.image(`${horse}`, `./images/horses/${horse}/card_image.jpg`);
        });

        this.load.atlas('next', './images/selector/next.png', './images/selector/next.json');
        this.load.atlas('previous', './images/selector/previous.png', './images/selector/previous.json');

        this.load.audio('hover_sound', ['./sounds/selector_hover.mp3']);
        this.load.audio('click_sound', ['./sounds/selector_click.mp3']);
        this.load.audio('soundtrack', ['./sounds/selector_soundtrack.mp3']);
    }

    create ()
    { 
        const backgroundMusic = this.sound.add('soundtrack');
        backgroundMusic.loop = true; 
        backgroundMusic.play();
        const hoverSound = this.sound.add('hover_sound');
        const clickSound = this.sound.add('click_sound');

        /**
         * Sets the horses to be displayed on the page
         */
        function setDisplayHorses() {
            for (let index = 0; index < displayHorses.length; index++) {
                if (horses[(page*displayHorses.length)+index]) {
                    displayHorses[index] = horses[(page*displayHorses.length)+index]
                } else {
                    displayHorses[index] = 'card_empty'
                }
            }
        }
        setDisplayHorses()


        // Horse display cards
        card0 = this.add.image(122, 124, displayHorses[0]).setInteractive()
        nameplate0 = this.add.image(122, 240, 'nameplate').setInteractive()
        card0Text = this.add.text(122, 240, horseNames[0], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card0Text.setPosition(122-card0Text.width/2, 240-card0Text.height/2);

        card1 = this.add.image(280, 124, displayHorses[1]).setInteractive()
        nameplate1 = this.add.image(280, 240, 'nameplate').setInteractive()
        card1Text = this.add.text(280, 228, horseNames[1], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card1Text.setPosition(280-card1Text.width/2, 240-card1Text.height/2);

        card2 = this.add.image(440, 124, displayHorses[2]).setInteractive()
        nameplate2 = this.add.image(440, 240, 'nameplate').setInteractive()
        card2Text = this.add.text(440, 228, horseNames[2], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card2Text.setPosition(440-card2Text.width/2, 240-card2Text.height/2);

        card3 = this.add.image(601, 124, displayHorses[3]).setInteractive()
        nameplate3 = this.add.image(601, 240, 'nameplate').setInteractive()
        card3Text = this.add.text(601, 228, horseNames[3], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card3Text.setPosition(601-card3Text.width/2, 240-card3Text.height/2);

        card4 = this.add.image(761, 124, displayHorses[4]).setInteractive()
        nameplate4 = this.add.image(761, 240, 'nameplate').setInteractive()
        card4Text = this.add.text(761, 228, horseNames[4], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card4Text.setPosition(761-card4Text.width/2, 240-card4Text.height/2);

        card5 = this.add.image(122, 370, displayHorses[5]).setInteractive()
        nameplate5 = this.add.image(122, 488, 'nameplate').setInteractive()
        card5Text = this.add.text(122, 488, horseNames[5], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card5Text.setPosition(122-card5Text.width/2, 488-card5Text.height/2);

        card6 = this.add.image(280, 370, displayHorses[6]).setInteractive()
        nameplate6 = this.add.image(280, 488, 'nameplate').setInteractive()
        card6Text = this.add.text(280, 488, horseNames[6], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card6Text.setPosition(280-card6Text.width/2, 488-card6Text.height/2);

        card7 = this.add.image(440, 370, displayHorses[7]).setInteractive()
        nameplate7 = this.add.image(440, 488, 'nameplate').setInteractive()
        card7Text = this.add.text(440, 488, horseNames[7], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card7Text.setPosition(440-card7Text.width/2, 488-card7Text.height/2);

        card8 = this.add.image(601, 370, displayHorses[8]).setInteractive()
        nameplate8 = this.add.image(601, 488, 'nameplate').setInteractive()
        card8Text = this.add.text(601, 488, horseNames[8], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card8Text.setPosition(601-card8Text.width/2, 488-card8Text.height/2);

        card9 = this.add.image(761, 370, displayHorses[9]).setInteractive()
        nameplate9 = this.add.image(761, 488, 'nameplate').setInteractive()
        card9Text = this.add.text(761, 488, horseNames[9], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card9Text.setPosition(761-card9Text.width/2, 488-card9Text.height/2);

        const hoverGlow = this.add.image(122, 124, 'hover_glow').setVisible(false);
        const sparkle = this.add.sprite(122, 124, 'sparkle', '1').setVisible(false).setScale(.8);
            this.anims.create({
                key: 'sparkle',
                frames: this.anims.generateFrameNumbers('sparkle', { frames: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ] }),
                frameRate: 8,
                repeat: -1
            });
            sparkle.play('sparkle');

        
        const frame = this.add.image(444, 275, 'frame')

        const previousButton = this.add.sprite(22, 498, 'previous', 'idle').setScale(.75).setInteractive({ pixelPerfect: true });
        const nextButton = this.add.sprite(864, 498, 'next', 'idle').setScale(.75).setInteractive({ pixelPerfect: true });
            nextButton.on('pointerdown', function (pointer) {
                // Change the page being displayed
                if (horses.length > (page + 1)*displayHorses.length) {
                    page += 1
                }
                checkNext()
                checkPrev()
                setDisplayHorses()
            });
            nextButton.on('pointerover', function (pointer) {
                if (horses.length > (page + 1)*displayHorses.length) {
                    nextButton.setFrame('hover')
                }
            });
            nextButton.on('pointerout', function (pointer) {
                checkNext()
            });
            function checkNext() {
                if (horses.length > (page + 1)*displayHorses.length) {
                    // previous page
                    nextButton.setFrame('idle')
                } else {
                    nextButton.setFrame('dull')
                }
            }
            checkNext()

        
        previousButton.on('pointerdown', function (pointer) {
            // Change the page being displayed
            if (page > 0) {
                page -= 1
            }
            checkNext()
            checkPrev()
            setDisplayHorses()
        });
        previousButton.on('pointerover', function (pointer) {
            // Display hover
            if (page > 0) {
                previousButton.setFrame('hover')
            }
        });
        previousButton.on('pointerout', function (pointer) {
            checkPrev()
        });
        function checkPrev() {
            if (page > 0) {
                // previous page
                previousButton.setFrame('idle')
            } else {
                previousButton.setFrame('dull')
            }
        }
        checkPrev()


        setupCard(card0, nameplate0, 0, 122, 124)
        setupCard(card1, nameplate1, 1, 281, 124)
        setupCard(card2, nameplate2, 2, 440, 124)
        setupCard(card3, nameplate3, 3, 601, 124)
        setupCard(card4, nameplate4, 4, 761, 124)
        setupCard(card5, nameplate5, 5, 122, 370)
        setupCard(card6, nameplate6, 6, 281, 370)
        setupCard(card7, nameplate7, 7, 440, 370)
        setupCard(card8, nameplate8, 8, 601, 370)
        setupCard(card9, nameplate9, 9, 761, 370)

        function setupCard(card, nameplate, i, xPos, yPos) {
            hoverGlow.setScale(1.05)

            if (displayHorses[i] !== 'card_empty') {
                nameplate.setVisible(true)
            } else  {
                nameplate.setVisible(false)
            }

            card.on('pointerup', () => {
                // link to horse
                if (displayHorses[i] !== 'card_empty') {
                    window.open(`./stables.html?name=${displayHorses[i]}`, '_self');
                }
                else if (i === 9) {
                    window.open(`./stables.html?name=nostalgia`, '_self');
                }
            });
            card.on('pointerdown', () => {
                if (displayHorses[i] !== 'card_empty') {
                    clickSound.play()
                }
            });
            card.on('pointerover', () => {
                if (displayHorses[i] !== 'card_empty') {
                    hoverSound.play()
                    hoverGlow.setPosition(xPos, yPos).setVisible(true)
                    sparkle.setPosition(xPos, yPos).setVisible(true)
                }
                else if (i === 9) {
                    hoverSound.play()
                    sparkle.setPosition(xPos, yPos + 15).setVisible(true)
                }
            });
            card.on('pointerout', () => {
                hoverGlow.setVisible(false)
                sparkle.setVisible(false)
            });

            nameplate.on('pointerup', () => {
                // link to horse
                if (displayHorses[i] !== 'card_empty') {
                    window.open(`./stables.html?name=${displayHorses[i]}`, '_self');
                }
            });
            nameplate.on('pointerdown', () => {
                if (displayHorses[i] !== 'card_empty') {
                    clickSound.play()
                }
            });
            nameplate.on('pointerover', () => {
                if (displayHorses[i] !== 'card_empty') {
                    hoverSound.play()
                    hoverGlow.setPosition(xPos, yPos).setVisible(true)
                    sparkle.setPosition(xPos, yPos).setVisible(true)
                }
            });
            nameplate.on('pointerout', () => {
                hoverGlow.setVisible(false)
                sparkle.setVisible(false)
            });
        }
        


    }

    update ()
    {
        
        function updateCard(card, nameplate, text, cardNumber) {
            card.setTexture(displayHorses[cardNumber])

            if (displayHorses[cardNumber] !== 'card_empty' && cardNumber < 5) {
                card.setY(124).setScale(1)
                nameplate.setVisible(true)
                text.setVisible(true)
                const textMove = text.width
                text.text = horseNames[(page*displayHorses.length) + cardNumber]
                text.setPosition(text.x+(textMove/2)-(text.width / 2), text.y);
                
            } else if (displayHorses[cardNumber] === 'card_empty' && cardNumber < 5) {
                card.setY(139).setScale(1.05)
                nameplate.setVisible(false)
                text.setVisible(false)
            } else if (displayHorses[cardNumber] !== 'card_empty') {
                card.setY(371).setScale(1)
                nameplate.setVisible(true)
                text.setVisible(true)
                const textMove = text.width
                text.text = horseNames[(page*displayHorses.length) + cardNumber]
                text.setPosition(text.x+(textMove/2)-(text.width / 2), text.y);
            } else if (displayHorses[cardNumber] === 'card_empty') {
                card.setY(385).setScale(1.05)
                nameplate.setVisible(false)
                text.setVisible(false)
            } 
        }
        
        updateCard(card0, nameplate0, card0Text, 0)
        updateCard(card1, nameplate1, card1Text, 1)
        updateCard(card2, nameplate2, card2Text, 2)
        updateCard(card3, nameplate3, card3Text, 3)
        updateCard(card4, nameplate4, card4Text, 4)
        updateCard(card5, nameplate5, card5Text, 5)
        updateCard(card6, nameplate6, card6Text, 6)
        updateCard(card7, nameplate7, card7Text, 7)
        updateCard(card8, nameplate8, card8Text, 8)
        updateCard(card9, nameplate9, card9Text, 9)

    }
}