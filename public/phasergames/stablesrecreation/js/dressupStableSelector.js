// Font for horse names
const font_name = 'Arial'


// Array of length 10 to keep track of which horses are displayed on the current page
const displayHorses = Array.apply(null, Array(10)) 

// Variable to Keep track of the current page number
let page = 0

let horses = []
let horseNames = []

class dressupStableSelector extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'dressupStableSelector' });
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

        /*horses.forEach(horse => {
            this.load.image(`${horse}`, `./images/horses/${horse}/card_image.jpg`);
        });*/

        this.load.atlas('next', './images/selector/next.png', './images/selector/next.json');
        this.load.atlas('previous', './images/selector/previous.png', './images/selector/previous.json');

        this.load.spineAtlas("horsePicAtlas", `./images/horses/${horseName}/picture/skeleton.atlas`);
        this.load.spineJson("horsePicJson", `./images/horses/${horseName}/picture/skeleton.json`);

        this.load.audio('hover_sound', ['./sounds/selector_hover.mp3']);
        this.load.audio('click_sound', ['./sounds/selector_click.mp3']);
        this.load.audio('soundtrack', ['./sounds/selector_soundtrack.mp3']);

        this.load.image('delete', './images/deleteBtn.png');
        this.load.image('deleted_element', './images/deletedElement.png');
    }

    create ()
    { 
        const game = this;

        horses = savedHorses
        game.loadedHorses = [];
        
        
        function splitHex(color) {
            let r = ((color & 0xff0000) >> 16)/255
            let g = ((color & 0x00ff00) >> 8)/255
            let b = (color & 0x0000ff)/255
            return { color: color, r:r, g:g, b:b };
        }

        // Creates an array of the horses actual names to be displayed
        for (let index = 0; index < savedHorses.length; index++) {
            horseNames.push(savedHorses[index].name);

            let horseURL = horses[index].slice(1); // we remove the "&" at the start
            let urlParameters = new URLSearchParams(horseURL);

            horseData = {
                type: 'dressup',
                name: urlParameters.get('name'),
                message: urlParameters.get('message'),
                bodyColor: 0,
                hairColor: 0,
                darkColor: -1,
                whiteColor: 0,
                feathering: 0,
                forelock: 0,
                mane: 0,
                tail: 0,
                flWhite: 0,
                hlWhite: 0,
                frWhite: 0,
                hrWhite: 0,
                headStripe: 0,
                headSnip: 0,
                headStar: 0,
                headErase: 0,
                whiteMatches: 0,
                appyPattern: 0,
                pintoPattern: 0, 
                pintoExpression: 0, 
                fleckedPattern: 0,
                darkMarkings: 0
            }
            let dataLength = 0
            let startData = 0
            let URLdata = urlParameters.get('data') ? urlParameters.get('data') : "0"
            switch (urlParameters.get('v')) {
                case '1':
                    dataLength = 17
                    startData = 21
                    horseData.bodyColor = parseInt(URLdata.slice(0, 6), 16)
                    horseData.hairColor = parseInt(URLdata.slice(7, 13), 16)
                    horseData.whiteColor = parseInt(URLdata.slice(14, 20), 16)
                    
                    let darkLevel = 1 - (3 * 0.1)
                    let bodyColor =  splitHex(horseData.bodyColor)
                    horseData.darkColor = parseInt(bodyColor.r*darkLevel.toString(16) + bodyColor.g*darkLevel.toString(16) + bodyColor.b*darkLevel.toString(16))
                    break;
                case '2':
                    dataLength = 18
                    startData = 28
                    horseData.bodyColor = parseInt(URLdata.slice(0, 6), 16)
                    horseData.hairColor = parseInt(URLdata.slice(7, 13), 16)
                    horseData.darkColor = parseInt(URLdata.slice(14, 20), 16)
                    horseData.whiteColor = parseInt(URLdata.slice(21, 27), 16)
                    break;
            }
            let optionsData = URLdata !== "0" ? URLdata.slice(startData) : "0"
            // Make data correct length
            while (optionsData.length < dataLength) {
                optionsData = "0" + optionsData;
            }
            while (optionsData.length < 19) {
                optionsData = optionsData + "0";
            }
            horseData.feathering = parseInt(optionsData.slice(0, 1))
            horseData.forelock = parseInt(optionsData.slice(1, 2))
            horseData.mane = parseInt(optionsData.slice(2, 3))
            horseData.tail = parseInt(optionsData.slice(3, 4))
            horseData.flWhite = parseInt(optionsData.slice(4, 5))
            horseData.frWhite = parseInt(optionsData.slice(5, 6))
            horseData.hrWhite = parseInt(optionsData.slice(6, 7))
            horseData.hlWhite = parseInt(optionsData.slice(7, 8))
            horseData.headStripe = parseInt(optionsData.slice(8, 9))
            horseData.headSnip = parseInt(optionsData.slice(9, 10))
            horseData.headStar = parseInt(optionsData.slice(10, 11))
            horseData.headErase = parseInt(optionsData.slice(11, 12))
            horseData.whiteMatches = parseInt(optionsData.slice(12, 13))
            horseData.appyPattern = parseInt(optionsData.slice(13, 14))
            horseData.pintoPattern = parseInt(optionsData.slice(14, 15))
            horseData.pintoExpression = parseInt(optionsData.slice(15, 16))
            horseData.fleckedPattern = parseInt(optionsData.slice(16, 17))
            horseData.darkMarkings = parseInt(optionsData.slice(17, 18))

            horseData.bodyColor = splitHex(horseData.bodyColor)
            horseData.hairColor = splitHex(horseData.hairColor)
            horseData.darkColor = splitHex(horseData.darkColor)
            horseData.whiteColor = splitHex(horseData.whiteColor)

            game.loadedHorses.push(horseData);
        };

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
        this.stableVisibleHorses = [];
        for (let i = 0; i < 10; i++)
        {
            let xPos = 122;
            let xPosNameplate = 122;
            let xPosDelete = 50;
            if (i < 5)
            {
                xPos += i * 160;
                xPosDelete += i * 160;
                xPosNameplate += i * 160
            }
            else
            {
                xPos += (i -5) * 160
                xPosDelete += (i -5) * 160
                xPosNameplate += (i -5) * 160
            }

            let yPosImg = 124;
            let yPosNameplate = 240
            let yPosDelete = 25
            if (i > 4)
            {
                yPosImg += 247
                yPosNameplate += 247;
                yPosDelete = 275;
            }

            let horseData = {};

            if (displayHorses[i] === 'card_empty') {
                horseData.card = this.add.image(xPos, yPosImg, displayHorses[i]).setInteractive()
            } else {
                horseData.card = this.add.spine(xPos, yPosImg, 'horsePicJson', `horsePicAtlas`).setInteractive();
            }
            horseData.nameplate = this.add.image(xPosNameplate, yPosNameplate, 'nameplate').setInteractive()
            horseData.cardText = this.add.text(xPosNameplate, yPosNameplate, horseNames[i], { fontFamily: font_name, fontSize: 18, color: '#ffffff', align: 'center' })
            horseData.cardText.setPosition(xPos-horseData.cardText.width/2, yPosNameplate-horseData.cardText.height/2);
            horseData.deletedIcon = this.add.image(xPos, yPosImg, 'deleted_element').setVisible(false);
            horseData.deleteBtn = this.add.image(xPosDelete, yPosDelete, 'delete').setOrigin(0, 0).setScale(.35).setInteractive().setVisible(false);

            this.stableVisibleHorses.push(horseData);
        }

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
         * @param {*} i The index of the display position
         */
        function setupCard(i) {            
            let card = game.stableVisibleHorses[i].card;
            let nameplate = game.stableVisibleHorses[i].nameplate;
            let deleteBtn = game.stableVisibleHorses[i].deleteBtn;

            hoverGlow.setScale(1.05)

            if (displayHorses[i] !== 'card_empty') {
                nameplate.setVisible(true)
            } else  {
                nameplate.setVisible(false)
            }

            card.on('pointerup', () => 
                {
                    if (displayHorses[i] !== 'card_empty') {
                        window.open(`http://127.0.0.1:5500/phasergames/stablesrecreation/dressup.html?selector=false${horses[i]}&indexSaved=${i}`, '_self');
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

            nameplate.on('pointerup', () => 
            {
                if (displayHorses[i] !== 'card_empty') {
                    window.open(`http://127.0.0.1:5500/phasergames/stablesrecreation/dressup.html?selector=false${displayHorses[i]}`, '_self');
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

            deleteBtn.on('pointerdown', () => {
                if (!savedHorses.includes(displayHorses[i]))
                {
                    // Recover the horse if click on delete button anew

                    game.stableVisibleHorses[i].deletedIcon.setVisible(false);
                    let firstPart = savedHorses.splice(0, i);
                    let secondPart = savedHorses.splice(0, savedHorses.length);

                    if (displayHorses[i] === "card_empty") return;

                    firstPart.push(displayHorses[i]);
                    secondPart.forEach(element => {
                        firstPart.push(element);
                    });

                    savedHorses = firstPart;
                    
                    updateCreations(JSON.stringify(savedHorses) + "@DressUp")
                    //saveToLocalStorage("dressuphorsesBellaSaraNeoCity", JSON.stringify(savedHorses));
                    return;
                }

                // Delete horse (temp until change page)
                game.stableVisibleHorses[i].deletedIcon.setVisible(true);
                savedHorses.splice(i, 1);
                updateCreations(JSON.stringify(savedHorses) + "@DressUp")
                //saveToLocalStorage("dressuphorsesBellaSaraNeoCity", JSON.stringify(savedHorses));
            })
        }

        for (let i = 0; i < 10; i++)
        {
            setupCard(i)
            updateCard(i);
        }

        /**
         * Updates the display card images and names when the page is changed
         * @param {*} card The display card image at the display position
         * @param {*} nameplate The nameplate image at the display position
         * @param {*} text The text at the display position
         * @param {*} cardNumber The index of the display position
         */  
        function updateCard(cardNumber) {
            
            let card = game.stableVisibleHorses[cardNumber].card;
            let nameplate = game.stableVisibleHorses[cardNumber].nameplate;
            let text = game.stableVisibleHorses[cardNumber].cardText;

            if (displayHorses[cardNumber] === 'card_empty')
                card.setTexture(displayHorses[cardNumber])
            else
            {
                game.stableVisibleHorses[cardNumber].deleteBtn.setVisible(true);

                setSkin(card, cardNumber);
                tintHorse(card, cardNumber);
            }

            if (displayHorses[cardNumber] !== 'card_empty' && cardNumber < 5) {
                card.setY(124).setScale(1)
                nameplate.setVisible(true)
                text.setVisible(true)
                const textMove = text.width
                text.text = game.loadedHorses[cardNumber].name
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
                text.text = game.loadedHorses[cardNumber].name
                text.setPosition(text.x+(textMove/2)-(text.width / 2), text.y);
            } else if (displayHorses[cardNumber] === 'card_empty') {
                card.setY(385).setScale(1.05)
                nameplate.setVisible(false)
                text.setVisible(false)
            } 
        }

         /**
         * Sets the skin for the sprite to display the current features
         * @param {*} skeleton the horse skeleton to set the skin of
         */
        function setSkin(skeleton, indexHorse){
            const horseData = game.loadedHorses[indexHorse];
            const skeletonData = skeleton.skeleton.data;
            const skin = new spine.Skin("custom");
                if (horseData.darkMarkings !== 0) {
                    skin.addSkin(skeletonData.findSkin(`Pattern/Dark`));
                }
                switch (horseData.headStripe) {
                    case 0:
                    case 6:
                        skin.addSkin(skeletonData.findSkin(`Marking/Head/Irr0/Stripe/${horseData.headStripe}`));
                        break;
                
                    default:
                        skin.addSkin(skeletonData.findSkin(`Marking/Head/Irr${horseData.headErase}/Stripe/${horseData.headStripe}`));
                        break;
                }
                switch (horseData.headSnip) {
                    case 0:
                        skin.addSkin(skeletonData.findSkin(`Marking/Head/Irr0/Snip/${horseData.headSnip}`));
                        break;
                
                    default:
                        skin.addSkin(skeletonData.findSkin(`Marking/Head/Irr${horseData.headErase}/Snip/${horseData.headSnip}`));
                        break;
                }
                switch (horseData.headStar) {
                    case 0:
                        skin.addSkin(skeletonData.findSkin(`Marking/Head/Irr0/Star/${horseData.headStar}`));
                        break;
                
                    default:
                        skin.addSkin(skeletonData.findSkin(`Marking/Head/Irr${horseData.headErase}/Star/${horseData.headStar}`));
                        break;
                }
                skin.addSkin(skeletonData.findSkin(`Pattern/Appy/${horseData.appyPattern}`));
                skin.addSkin(skeletonData.findSkin(`Pattern/Pinto/${horseData.pintoExpression === 0 ? 0 : `Expression${horseData.pintoExpression}/${horseData.pintoPattern}`}`));
                skin.addSkin(skeletonData.findSkin(`Pattern/Flecked/${horseData.fleckedPattern}`));
                skin.addSkin(skeletonData.findSkin(`Mane/${horseData.mane}`));
                skin.addSkin(skeletonData.findSkin(`Forelock/${horseData.forelock}`));
            skeleton.skeleton.setSkin(skin);
            skeleton.skeleton.setToSetupPose();
        }

        function tintHorse(horsePic, indexHorse) {
            const horseData = game.loadedHorses[indexHorse];
            let shade = 1

            // Hair
            changeTint(horsePic, 'Mane', horseData.hairColor.r, horseData.hairColor.g, horseData.hairColor.b, shade)
            changeTint(horsePic, 'Forelock', horseData.hairColor.r, horseData.hairColor.g, horseData.hairColor.b, shade)

            // Body
            changeTint(horsePic, 'Ear', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horsePic, 'Base', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)

            // Dark
            changeTint(horsePic, 'Dark', horseData.darkColor.r, horseData.darkColor.g, horseData.darkColor.b, shade)

            // White
            changeTint(horsePic, 'Appy', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)

            changeTint(horsePic, 'Flecked', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)

            changeTint(horsePic, 'Pinto', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)

            if (horseData.whiteMatches) {
                changeTint(horsePic, 'Star', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
                changeTint(horsePic, 'Snip', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
                changeTint(horsePic, 'Stripe', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            }
        }

        function changeTint(skeleton, part, r, g, b, shade) {
            skeleton.skeleton.findSlot(`${part}`).color.r = r
            skeleton.skeleton.findSlot(`${part}`).color.g = g
            skeleton.skeleton.findSlot(`${part}`).color.b = b
            
            if (shade !== 0) {
                skeleton.skeleton.findSlot(`${part}`).darkColor = {r: r-shade, g: g-shade, b: b-shade, a: 1}
            } else {
                skeleton.skeleton.findSlot(`${part}`).darkColor = null
            }
        }
    }
}
