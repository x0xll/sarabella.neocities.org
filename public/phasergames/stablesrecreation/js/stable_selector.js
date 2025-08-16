// Font for horse names
const font_name = 'Arial'

// List of all horses - these should match the folder names for the horses which should appear in the selector
const horses = [
    'peter',
    'amor',
    'anemone',
    'angel',
    'aphaia',
    'bella',
    'beran',
    'blossom',
    'bosi',
    'cantaro',
    'ceratos',
    'ceres',
    'chitra',
    'clio',
    'colour',
    'cosima',
    'donn',
    'echo',
    'epona',
    'faith',
    'falcha',
    'faxon',
    'fiona',
    'firewalker',
    'ghost',
    'halloween',
    'hercules',
    'icarus',
    'ivy',
    'jaida',
    'jewel',
    'juno',
    'kendra',
    'king',
    'lillova',
    'mellonie',
    'mireldis',
    'nike',
    'nori',
    'nuala',
    'pegasus',
    'persephone',
    'sarah',
    'savros',
    'skeleton',
    'sleipnir',
    'socorro',
    'starunna',
    'thunder',
    'uranus',
    'vesta',
    'virstan',
    'wavebreaker',
    'zephan',
    'zombie'
]
// Array of length 10 to keep track of which horses are displayed on the current page
const displayHorses = Array.apply(null, Array(10)) 

// Variable to Keep track of the current page number
let page = 0

// Creates an array of the horses actual names to be displayed
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


        // Load in the images and sounds for the selector screen
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
        // Add the sounds for the selector screen
        const backgroundMusic = this.sound.add('soundtrack');
        backgroundMusic.loop = true; 
        backgroundMusic.play();
        const hoverSound = this.sound.add('hover_sound');
        const clickSound = this.sound.add('click_sound');


        /**
         * Finds which horses should be displayed on the current page
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


        // Add horse display cards and names to screen
        this.card0 = this.add.image(122, 124, displayHorses[0]).setInteractive()
        this.nameplate0 = this.add.image(122, 240, 'nameplate').setInteractive()
        this.card0Text = this.add.text(122, 240, horseNames[0], { fontFamily: font_name, fontSize: 18, color: '#ffffff', align: 'center' })
        this.card0Text.setPosition(122-this.card0Text.width/2, 240-this.card0Text.height/2);

        this.card1 = this.add.image(280, 124, displayHorses[1]).setInteractive()
        this.nameplate1 = this.add.image(280, 240, 'nameplate').setInteractive()
        this.card1Text = this.add.text(280, 228, horseNames[1], { fontFamily: font_name, fontSize: 18, color: '#ffffff', align: 'center' })
        this.card1Text.setPosition(280-this.card1Text.width/2, 240-this.card1Text.height/2);

        this.card2 = this.add.image(440, 124, displayHorses[2]).setInteractive()
        this.nameplate2 = this.add.image(440, 240, 'nameplate').setInteractive()
        this.card2Text = this.add.text(440, 228, horseNames[2], { fontFamily: font_name, fontSize: 18, color: '#ffffff', align: 'center' })
        this.card2Text.setPosition(440-this.card2Text.width/2, 240-this.card2Text.height/2);

        this.card3 = this.add.image(601, 124, displayHorses[3]).setInteractive()
        this.nameplate3 = this.add.image(601, 240, 'nameplate').setInteractive()
        this.card3Text = this.add.text(601, 228, horseNames[3], { fontFamily: font_name, fontSize: 18, color: '#ffffff', align: 'center' })
        this.card3Text.setPosition(601-this.card3Text.width/2, 240-this.card3Text.height/2);

        this.card4 = this.add.image(761, 124, displayHorses[4]).setInteractive()
        this.nameplate4 = this.add.image(761, 240, 'nameplate').setInteractive()
        this.card4Text = this.add.text(761, 228, horseNames[4], { fontFamily: font_name, fontSize: 18, color: '#ffffff', align: 'center' })
        this.card4Text.setPosition(761-this.card4Text.width/2, 240-this.card4Text.height/2);

        this.card5 = this.add.image(122, 370, displayHorses[5]).setInteractive()
        this.nameplate5 = this.add.image(122, 488, 'nameplate').setInteractive()
        this.card5Text = this.add.text(122, 488, horseNames[5], { fontFamily: font_name, fontSize: 18, color: '#ffffff', align: 'center' })
        this.card5Text.setPosition(122-this.card5Text.width/2, 488-this.card5Text.height/2);

        this.card6 = this.add.image(280, 370, displayHorses[6]).setInteractive()
        this.nameplate6 = this.add.image(280, 488, 'nameplate').setInteractive()
        this.card6Text = this.add.text(280, 488, horseNames[6], { fontFamily: font_name, fontSize: 18, color: '#ffffff', align: 'center' })
        this.card6Text.setPosition(280-this.card6Text.width/2, 488-this.card6Text.height/2);

        this.card7 = this.add.image(440, 370, displayHorses[7]).setInteractive()
        this.nameplate7 = this.add.image(440, 488, 'nameplate').setInteractive()
        this.card7Text = this.add.text(440, 488, horseNames[7], { fontFamily: font_name, fontSize: 18, color: '#ffffff', align: 'center' })
        this.card7Text.setPosition(440-this.card7Text.width/2, 488-this.card7Text.height/2);

        this.card8 = this.add.image(601, 370, displayHorses[8]).setInteractive()
        this.nameplate8 = this.add.image(601, 488, 'nameplate').setInteractive()
        this.card8Text = this.add.text(601, 488, horseNames[8], { fontFamily: font_name, fontSize: 18, color: '#ffffff', align: 'center' })
        this.card8Text.setPosition(601-this.card8Text.width/2, 488-this.card8Text.height/2);

        this.card9 = this.add.image(761, 370, displayHorses[9]).setInteractive()
        this.nameplate9 = this.add.image(761, 488, 'nameplate').setInteractive()
        this.card9Text = this.add.text(761, 488, horseNames[9], { fontFamily: font_name, fontSize: 18, color: '#ffffff', align: 'center' })
        this.card9Text.setPosition(761-this.card9Text.width/2, 488-this.card9Text.height/2);


        // Add the glow and sparkle effect which will become visible when hovering over a card
        const hoverGlow = this.add.image(122, 124, 'hover_glow').setVisible(false);
        const sparkle = this.add.sprite(122, 124, 'sparkle', '1').setVisible(false).setScale(.8);
            this.anims.create({
                key: 'sparkle',
                frames: this.anims.generateFrameNumbers('sparkle', { frames: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ] }),
                frameRate: 8,
                repeat: -1
            });
            sparkle.play('sparkle');


        // Add the main UI elements
        this.add.image(444, 275, 'frame')
        const previousButton = this.add.sprite(22, 498, 'previous', 'idle').setScale(.75).setInteractive({ pixelPerfect: true });
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

        /**
         * Check if there is a previous page and dull the previous button if no previous page exists
         */
        function checkPrev() {
            if (page > 0) {
                // previous page
                previousButton.setFrame('idle')
            } else {
                previousButton.setFrame('dull')
            }
        }
        checkPrev()
        /**
         * Check if there is a next page and dull the next button if no next page exists
         */
        function checkNext() {
            if (horses.length > (page + 1)*displayHorses.length) {
                // previous page
                nextButton.setFrame('idle')
            } else {
                nextButton.setFrame('dull')
            }
        }
        checkNext()

        
        // Set the cards up for display
        /**
         * Sets up the card, makes the nameplate visible if the card is not empty and makes the
         * sparkles and glow effect visible over the card if it is not empty and the card is hovered over
         * @param {*} card The display card image at the display position
         * @param {*} nameplate The nameplate image at the display position
         * @param {*} i The index of the display position
         */
        function setupCard(card, nameplate, i) {
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
                    hoverGlow.setPosition(card.x, card.y).setVisible(true)
                    sparkle.setPosition(card.x, card.y).setVisible(true)
                }
                else if (i === 9) {
                    hoverSound.play()
                    sparkle.setPosition(card.x, card.y + 15).setVisible(true)
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
                    hoverGlow.setPosition(card.x, card.y).setVisible(true)
                    sparkle.setPosition(card.x, card.y).setVisible(true)
                }
            });
            nameplate.on('pointerout', () => {
                hoverGlow.setVisible(false)
                sparkle.setVisible(false)
            });
        }

        setupCard(this.card0, this.nameplate0, 0)
        setupCard(this.card1, this.nameplate1, 1)
        setupCard(this.card2, this.nameplate2, 2)
        setupCard(this.card3, this.nameplate3, 3)
        setupCard(this.card4, this.nameplate4, 4)
        setupCard(this.card5, this.nameplate5, 5)
        setupCard(this.card6, this.nameplate6, 6)
        setupCard(this.card7, this.nameplate7, 7)
        setupCard(this.card8, this.nameplate8, 8)
        setupCard(this.card9, this.nameplate9, 9)
    }

    update ()
    {
        /**
         * Updates the display card images and names when the page is changed
         * @param {*} card The display card image at the display position
         * @param {*} nameplate The nameplate image at the display position
         * @param {*} text The text at the display position
         * @param {*} cardNumber The index of the display position
         */  
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
        
        updateCard(this.card0, this.nameplate0, this.card0Text, 0)
        updateCard(this.card1, this.nameplate1, this.card1Text, 1)
        updateCard(this.card2, this.nameplate2, this.card2Text, 2)
        updateCard(this.card3, this.nameplate3, this.card3Text, 3)
        updateCard(this.card4, this.nameplate4, this.card4Text, 4)
        updateCard(this.card5, this.nameplate5, this.card5Text, 5)
        updateCard(this.card6, this.nameplate6, this.card6Text, 6)
        updateCard(this.card7, this.nameplate7, this.card7Text, 7)
        updateCard(this.card8, this.nameplate8, this.card8Text, 8)
        updateCard(this.card9, this.nameplate9, this.card9Text, 9)

    }
}