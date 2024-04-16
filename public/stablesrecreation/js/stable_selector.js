// list of all horses
const horses = [
    'peter',
    'aphaia',
    'beran',
    'cantaro',
    'chitra',
    'clio',
    'colour',
    'epona',
    'falcha',
    'faxon',
    'fiona',
    'hercules',
    'ivy',
    'jewel',
    'juno',
    'mellonie',
    'persephone',
    'sarah',
    'savros',
    'starunna',
    'thunder',
    'vesta',
    'virstan'
]
const display_horses = Array.apply(null, Array(10)) // creates an all null array of length 3 -> change to 10 for final
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

let card0text = null
let card1text = null
let card2text = null
let card3text = null
let card4text = null
let card5text = null
let card6text = null
let card7text = null
let card8text = null
let card9text = null

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
let horse_names = []
for (let index = 0; index < horses.length; index++) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        const myObj = JSON.parse(this.responseText);
        horse_names[index] = myObj.name
    }
    xmlhttp.open("GET", `./images/horse/${horses[index]}/data.json`);
    xmlhttp.send();
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
            this.load.image(`${horse}`, `./images/horse/${horse}/card_image.jpg`);
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
        const hover_sound = this.sound.add('hover_sound');
        const click_sound = this.sound.add('click_sound');

        /**
         * Sets the horses to be displayed on the page
         */
        function setDisplayHorses() {
            for (let index = 0; index < display_horses.length; index++) {
                if (horses[(page*display_horses.length)+index]) {
                    display_horses[index] = horses[(page*display_horses.length)+index]
                } else {
                    display_horses[index] = 'card_empty'
                }
            }
        }
        setDisplayHorses()


        // Horse display cards
        card0 = this.add.image(122, 124, display_horses[0]).setInteractive()
        nameplate0 = this.add.image(122, 240, 'nameplate').setInteractive()
        card0text = this.add.text(122, 240, horse_names[0], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card0text.setPosition(122-card0text.width/2, 240-card0text.height/2);

        card1 = this.add.image(280, 124, display_horses[1]).setInteractive()
        nameplate1 = this.add.image(280, 240, 'nameplate').setInteractive()
        card1text = this.add.text(280, 228, horse_names[1], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card1text.setPosition(280-card1text.width/2, 240-card1text.height/2);

        card2 = this.add.image(440, 124, display_horses[2]).setInteractive()
        nameplate2 = this.add.image(440, 240, 'nameplate').setInteractive()
        card2text = this.add.text(440, 228, horse_names[2], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card2text.setPosition(440-card2text.width/2, 240-card2text.height/2);

        card3 = this.add.image(601, 124, display_horses[3]).setInteractive()
        nameplate3 = this.add.image(601, 240, 'nameplate').setInteractive()
        card3text = this.add.text(601, 228, horse_names[3], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card3text.setPosition(601-card3text.width/2, 240-card3text.height/2);

        card4 = this.add.image(761, 124, display_horses[4]).setInteractive()
        nameplate4 = this.add.image(761, 240, 'nameplate').setInteractive()
        card4text = this.add.text(761, 228, horse_names[4], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card4text.setPosition(761-card4text.width/2, 240-card4text.height/2);

        card5 = this.add.image(122, 368, display_horses[5]).setInteractive()
        nameplate5 = this.add.image(122, 488, 'nameplate').setInteractive()
        card5text = this.add.text(122, 488, horse_names[5], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card5text.setPosition(122-card5text.width/2, 488-card5text.height/2);

        card6 = this.add.image(280, 368, display_horses[6]).setInteractive()
        nameplate6 = this.add.image(280, 488, 'nameplate').setInteractive()
        card6text = this.add.text(280, 488, horse_names[6], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card6text.setPosition(280-card6text.width/2, 488-card6text.height/2);

        card7 = this.add.image(440, 368, display_horses[7]).setInteractive()
        nameplate7 = this.add.image(440, 488, 'nameplate').setInteractive()
        card7text = this.add.text(440, 488, horse_names[7], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card7text.setPosition(440-card7text.width/2, 488-card7text.height/2);

        card8 = this.add.image(601, 368, display_horses[8]).setInteractive()
        nameplate8 = this.add.image(601, 488, 'nameplate').setInteractive()
        card8text = this.add.text(601, 488, horse_names[8], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card8text.setPosition(601-card8text.width/2, 488-card8text.height/2);

        card9 = this.add.image(761, 368, display_horses[9]).setInteractive()
        nameplate9 = this.add.image(761, 488, 'nameplate').setInteractive()
        card9text = this.add.text(761, 488, horse_names[9], { fontFamily: 'Arial', fontSize: 18, color: '#ffffff', align: 'center' })
        card9text.setPosition(761-card9text.width/2, 488-card9text.height/2);

        const hover_glow = this.add.image(122, 124, 'hover_glow').setVisible(false);
        const sparkle = this.add.sprite(122, 124, 'sparkle', '1').setVisible(false).setScale(.8);
            this.anims.create({
                key: 'sparkle',
                frames: this.anims.generateFrameNumbers('sparkle', { frames: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ] }),
                frameRate: 8,
                repeat: -1
            });
            sparkle.play('sparkle');

        
        const frame = this.add.image(444, 275, 'frame')

        const previous_button = this.add.sprite(22, 498, 'previous', 'idle').setScale(.75).setInteractive({ pixelPerfect: true });
        const next_button = this.add.sprite(864, 498, 'next', 'idle').setScale(.75).setInteractive({ pixelPerfect: true });
            next_button.on('pointerdown', function (pointer) {
                // Change the page being displayed
                if (horses.length > (page + 1)*display_horses.length) {
                    page += 1
                }
                checkNext()
                checkPrev()
                setDisplayHorses()
            });
            next_button.on('pointerover', function (pointer) {
                if (horses.length > (page + 1)*display_horses.length) {
                    next_button.setFrame('hover')
                }
            });
            next_button.on('pointerout', function (pointer) {
                checkNext()
            });
            function checkNext() {
                if (horses.length > (page + 1)*display_horses.length) {
                    // previous page
                    next_button.setFrame('idle')
                } else {
                    next_button.setFrame('dull')
                }
            }
            checkNext()

        
        previous_button.on('pointerdown', function (pointer) {
            // Change the page being displayed
            if (page > 0) {
                page -= 1
            }
            checkNext()
            checkPrev()
            setDisplayHorses()
        });
        previous_button.on('pointerover', function (pointer) {
            // Display hover
            if (page > 0) {
                previous_button.setFrame('hover')
            }
        });
        previous_button.on('pointerout', function (pointer) {
            checkPrev()
        });
        function checkPrev() {
            if (page > 0) {
                // previous page
                previous_button.setFrame('idle')
            } else {
                previous_button.setFrame('dull')
            }
        }
        checkPrev()


        setupCard(card0, nameplate0, 0, 122, 124)
        setupCard(card1, nameplate1, 1, 281, 124)
        setupCard(card2, nameplate2, 2, 440, 124)
        setupCard(card3, nameplate3, 3, 601, 124)
        setupCard(card4, nameplate4, 4, 761, 124)
        setupCard(card5, nameplate5, 5, 122, 368)
        setupCard(card6, nameplate6, 6, 281, 368)
        setupCard(card7, nameplate7, 7, 440, 368)
        setupCard(card8, nameplate8, 8, 601, 368)
        setupCard(card9, nameplate9, 9, 761, 368)

        function setupCard(card, nameplate, i, xPos, yPos) {
            hover_glow.setScale(1.05)

            if (display_horses[i] !== 'card_empty') {
                nameplate.setVisible(true)
            } else  {
                nameplate.setVisible(false)
            }

            card.on('pointerup', () => {
                // link to horse
                if (display_horses[i] !== 'card_empty') {
                    window.open(`./stables.html?name=${display_horses[i]}`, '_self');
                }
            });
            card.on('pointerdown', () => {
                if (display_horses[i] !== 'card_empty') {
                    click_sound.play()
                }
            });
            card.on('pointerover', () => {
                if (display_horses[i] !== 'card_empty') {
                    hover_sound.play()
                    hover_glow.setPosition(xPos, yPos).setVisible(true)
                    sparkle.setPosition(xPos, yPos).setVisible(true)
                }
            });
            card.on('pointerout', () => {
                hover_glow.setVisible(false)
                sparkle.setVisible(false)
            });

            nameplate.on('pointerup', () => {
                // link to horse
                if (display_horses[i] !== 'card_empty') {
                    window.open(`./stables.html?name=${display_horses[i]}`, '_self');
                }
            });
            nameplate.on('pointerdown', () => {
                if (display_horses[i] !== 'card_empty') {
                    click_sound.play()
                }
            });
            nameplate.on('pointerover', () => {
                if (display_horses[i] !== 'card_empty') {
                    hover_sound.play()
                    hover_glow.setPosition(xPos, yPos).setVisible(true)
                    sparkle.setPosition(xPos, yPos).setVisible(true)
                }
            });
            nameplate.on('pointerout', () => {
                hover_glow.setVisible(false)
                sparkle.setVisible(false)
            });
        }
        


    }

    update ()
    {
        
        function updateCard(card, nameplate, text, cardNumber) {
            card.setTexture(display_horses[cardNumber])

            if (display_horses[cardNumber] !== 'card_empty' && cardNumber < 5) {
                card.setY(124).setScale(1)
                nameplate.setVisible(true)
                text.setVisible(true)
                const textMove = text.width
                text.text = horse_names[(page*display_horses.length) + cardNumber]
                text.setPosition(text.x+(textMove/2)-(text.width / 2), text.y);
                
            } else if (display_horses[cardNumber] === 'card_empty' && cardNumber < 5) {
                card.setY(139).setScale(1.05)
                nameplate.setVisible(false)
                text.setVisible(false)
            } else if (display_horses[cardNumber] !== 'card_empty') {
                card.setY(370).setScale(1)
                nameplate.setVisible(true)
                text.setVisible(true)
                const textMove = text.width
                text.text = horse_names[(page*display_horses.length) + cardNumber]
                text.setPosition(text.x+(textMove/2)-(text.width / 2), text.y);
            } else if (display_horses[cardNumber] === 'card_empty') {
                card.setY(385).setScale(1.05)
                nameplate.setVisible(false)
                text.setVisible(false)
            } 
        }
        
        updateCard(card0, nameplate0, card0text, 0)
        updateCard(card1, nameplate1, card1text, 1)
        updateCard(card2, nameplate2, card2text, 2)
        updateCard(card3, nameplate3, card3text, 3)
        updateCard(card4, nameplate4, card4text, 4)
        updateCard(card5, nameplate5, card5text, 5)
        updateCard(card6, nameplate6, card6text, 6)
        updateCard(card7, nameplate7, card7text, 7)
        updateCard(card8, nameplate8, card8text, 8)
        updateCard(card9, nameplate9, card9text, 9)

    }
}