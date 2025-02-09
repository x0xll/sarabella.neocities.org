// Variables to be used throughout scene
const COLOR_PRIMARY = 0x424242;
const COLOR_PRIMARY_HEX = '#424242';
const COLOR_SECONDARY = 0x6b6b6b;
const COLOR_SECONDARY_HEX = '#6b6b6b';
const COLOR_LIGHT = 0x6d6d6d;
const COLOR_DARK = 0x1b1b1b;

const HAND = {
    empty: 'empty',
    shovel: 'shovel',
    fork: 'fork',
    forkFilled: 'fork_filled',
    brush: 'brush',
    brushSmall: 'small_brush',
    hoofpick: 'hoofpick',
    apple: 'apple',
    grainScoop: 'grain_scoop'
}
handCurrent = HAND.empty;
waterFilled = false;
foodFilled = false;
brushLevel = 0
playInspiration = false
canPlayInspiration = true

horseBusy = false
const HORSE_STATES = {
    busy: 'busy',
    idle: 'idle',
    drink: 'drink',
    rear: 'rear',
    eatingFood: 'eat_food',
    eatingApple: 'eat_apple'
}
horseAnimationQueue = []
makeRandomHorse = true

horse = null
horsePic = null
horseDirty = null
horseOverlay= null
trough = null
troughMask = null
waterDrink = null
rearSound = null
foodTrough = null
oatsEat = null
appleMunch = null
hoofpick1 = null
hoofpick2 = null
inspiration = null
inspirationCloseSound = null
inspirationMessage = null

shovelHeldSprite = null
forkHeldSprite = null
grainHeldSprite = null
brushHeldSprite = null
brushSmallHeldSprite = null
hoofpickHeldSprite = null
appleHeldSprite = null

urlVersion = 2



// Actual game start
class dressupStable extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: 'dressupStable'
        });
    }

    preload (data)
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
        // Display file names whilst loading
        this.load.on('fileprogress', function (file) {
            if (urlParameters.get('debug')) {
                progressText.text = file.src;
            }
        });
        const progressText = this.add.text(344, 133, '', { fontFamily: 'Arial', fontSize: 12, color: '#ffffff', align: 'center' });
            
        // Load in images and sounds
        this.load.image('card_back', './images/selector/card_back.png');
        this.load.image('stable_bg', './images/landStable/stable-bg.png');
        this.load.image('stable_fg', './images/landStable/stable-fg.png');
        this.load.image('hunger_scale', './images/landStable/hunger.png');
        this.load.image('cleanliness_scale', './images/landStable/cleanliness.png');
        this.load.image('happiness_scale', './images/landStable/happiness.png');
        this.load.image('info_box', './images/InfoBox.png');

        this.load.atlas('shovel', './images/landStable/shovel.png', './images/landStable/shovel.json');
        this.load.atlas('fork', './images/landStable/fork.png', './images/landStable/fork.json');
        this.load.atlas('straw1', './images/landStable/straw1.png', './images/landStable/straw1.json');
        this.load.atlas('straw2', './images/landStable/straw2.png', './images/landStable/straw2.json');
        this.load.atlas('straw3', './images/landStable/straw3.png', './images/landStable/straw3.json');
        this.load.atlas('hay_loft', './images/landStable/hay_loft.png', './images/landStable/hay_loft.json');

        this.load.atlas('trough', './images/landStable/water.png', './images/landStable/water.json');
        this.load.atlas('trough_mask', './images/landStable/water_mask.png', './images/landStable/water_mask.json');
        this.load.atlas('food_trough', './images/landStable/food.png', './images/landStable/food.json');
        this.load.atlas('grain_bin', './images/landStable/grain_bin.png', './images/landStable/grain_bin.json');
        this.load.image('grain_scoop', './images/landStable/grain_scoop.png');
        this.load.atlas('apple_bin', './images/landStable/apples.png','./images/landStable/apples.json');
        this.load.image('apple_held', './images/landStable/apple.png');
        
        this.load.atlas('brush', './images/landStable/brush.png', './images/landStable/brush.json');
        this.load.atlas('brush_small', './images/landStable/brush_small.png', './images/landStable/brush_small.json');
        this.load.atlas('hoofpick', './images/landStable/hoofpick.png', './images/landStable/hoofpick.json');

        this.load.spineAtlas("horseAtlas", `./images/horses/${horseName}/skeleton.atlas`);
        this.load.spineJson("horseJson", `./images/horses/${horseName}/skeleton.json`);
        this.load.spineAtlas("horsePicAtlas", `./images/horses/${horseName}/picture/skeleton.atlas`);
        this.load.spineJson("horsePicJson", `./images/horses/${horseName}/picture/skeleton.json`);

        this.load.atlas('luck', './images/landStable/luck.png', './images/landStable/luck.json');
        this.load.atlas('frame', './images/landStable/frame.png', './images/landStable/frame.json');
        this.load.image('inspiration', './images/landStable/inspiration.png');

        this.load.atlas('music_button', './images/landStable/music.png', './images/landStable/music.json');
        this.load.atlas('help_dressup_button', './images/dress_up_help.png', './images/dress_up_help.json');
        this.load.atlas('next_button', './images/selector/next.png', './images/selector/next.json');
        this.load.atlas('previous_button', './images/selector/previous.png', './images/selector/previous.json');

        this.load.audio('background_music', ['./sounds/stable_soundtrack.mp3']);
        this.load.audio('apple_munch', ['./sounds/apple_munch.mp3']);
        this.load.audio('brush_sound', ['./sounds/brush_sound.mp3']);
        this.load.audio('brush_sound_small', ['./sounds/brush_sound_small.mp3']);
        this.load.audio('fork_fill', ['./sounds/fork_fill.mp3']);
        this.load.audio('fork_place', ['./sounds/fork_place.mp3']);
        this.load.audio('grain_sound', ['./sounds/grain_sound.mp3']);
        this.load.audio('hoofpick1', ['./sounds/hoofpick1.mp3']);
        this.load.audio('hoofpick2', ['./sounds/hoofpick2.mp3']);
        this.load.audio('hover1', ['./sounds/hover1.mp3']);
        this.load.audio('hover2', ['./sounds/hover1.mp3']);
        this.load.audio('inspiration_hover', ['./sounds/inspiration_hover.mp3']);
        this.load.audio('inspiration_sound', ['./sounds/inspiration.mp3']);
        this.load.audio('inspiration_close', ['./sounds/inspiration_close.mp3']);
        this.load.audio('luck_sound', ['./sounds/luck_sound.mp3']);
        this.load.audio('oats_eat', ['./sounds/oats_eat.mp3']);
        this.load.audio('pickup', ['./sounds/pickup.mp3']);
        this.load.audio('shovel_sound', ['./sounds/shovel_sound.mp3']);
        this.load.audio('water_sound', ['./sounds/water_sound.mp3']);
        this.load.audio('water_drink', ['./sounds/water_drink.mp3']);
        this.load.audio('rear_sound', ['./sounds/rear.mp3']);


        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        // Loading an older version of the text input plugin to allow the textarea input type
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/aff9baa86b400cce0d2788b6b2db4bcc84bda34f/dist/rexinputtextplugin.min.js', true);

        
        function splitHex(color) {
            let r = ((color & 0xff0000) >> 16)/255
            let g = ((color & 0x00ff00) >> 8)/255
            let b = (color & 0x0000ff)/255
            return { color: color, r:r, g:g, b:b };
        }

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
                makeRandomHorse = false
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
                makeRandomHorse = false
                dataLength = 18
                startData = 28
                horseData.bodyColor = parseInt(URLdata.slice(0, 6), 16)
                horseData.hairColor = parseInt(URLdata.slice(7, 13), 16)
                horseData.darkColor = parseInt(URLdata.slice(14, 20), 16)
                horseData.whiteColor = parseInt(URLdata.slice(21, 27), 16)
                break;
        
            default:
                makeRandomHorse = true
                dataLength = 0
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
    }

    create (data)
    {
        // Makes functions easier to write
        const game = this;

        //  If you disable topOnly it will fire events for all objects the pointer is over, regardless of place on the display list
        this.input.topOnly = true;

        if (data.playMusic) {
            game.playMusic = data.playMusic
            game.backgroundMusic = data.backgroundMusic
        } else {
            game.playMusic = true;
            game.backgroundMusic = this.sound.add('background_music');
            game.backgroundMusic.loop = true; 
            game.backgroundMusic.play();
        }

        this.add.image(444, 261, 'stable_bg');

        /**
         * Generates a random integer between two values
         * @param {number} min The minimum number that could be returned
         * @param {number} max The maximum number that could be returned
         * @returns 
         */
        function randomIntFromInterval(min, max) { // min and max included 
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
        
        /**
         * Resets the horse sprite to show the correct features and colours
         */
        function resetHorseSprite() {
            for (let index = 0; index < horse.skeleton.slots.length; index++) {
                horse.skeleton.slots[index].darkColor = null;
                
            }
            for (let index = 0; index < horseOverlay.skeleton.slots.length; index++) {
                horseOverlay.skeleton.slots[index].darkColor = null;
                
            }
            for (let index = 0; index < horsePic.skeleton.slots.length; index++) {
                horsePic.skeleton.slots[index].darkColor = null;
                
            }
            setSkin(horsePic, true)
            setSkin(horse, false)
            hideSlots(horse, ['EarAppy', 'EarFlecked', 'Ear', 'Mane', 'Forelock'])
            setSkin(horseOverlay, false)
            hideSlots(horseOverlay, [
                'Eye', `Apple`, 'Shadow1', `Tail`, 
                'HeadUAppy', 'HeadUFlecked', 'HeadUPinto', //'HeadUMarkingErase', 
                'HeadUMarkingStar', 'HeadUMarkingSnip', 'HeadUMarkingStripe', 'HeadUDark', `HeadUpper`, 
                'HeadJawInner', 'HeadJMarkingStripe', 'HeadJMarkingSnip', 'HeadJDark', 'HeadJaw', 
                'HeadMarkingStripe', 'HeadDark', 'Head',
                'MarkingHL', 'MarkingHL2', 'HLAppy', 'HLPinto', 'HLFlecked', 'DarkHL', 'DarkHL2', `FeatheringHL`, 'HoofHL', `LowerHL`, `UpperHL`, 
                'MarkingFL', 'MarkingFL2', 'FLAppy', 'FLPinto', 'FLFlecked', 'DarkFL', 'DarkFL2', `FeatheringFL`, 'HoofFL', `LowerFL`, `UpperFL`, 
                'BodyAppy', 'BodyFlecked', 'BodyPinto', 'DarkBody', `Body`, 
                'NeckAppy', 'NeckFlecked', 'NeckPinto', 'Neck', 
                'MarkingFR', 'MarkingFR2', 'DarkFR', 'DarkFR2', `FeatheringFR`, 'HoofFR', `LowerFR`, `UpperFR`,
                'MarkingHR', 'MarkingHR2', 'DarkHR', 'DarkHR2', `FeatheringHR`, 'HoofHR', `LowerHR`, `UpperHR`
            ])

            tintHorse()
            tintHoof('FL', horseData.flWhite)
            tintHoof('HL', horseData.hlWhite)
            tintHoof('FR', horseData.frWhite)
            tintHoof('HR', horseData.hrWhite)
        }

        /**
         * Sets the skin for the sprite to display the current features
         * @param {*} skeleton the horse skeleton to set the skin of
         */
        function setSkin(skeleton, isPic){
            const skeletonData = skeleton.skeleton.data;
            const skin = new spine.Skin("custom");
                if (!isPic) {
                    skin.addSkin(skeletonData.findSkin(`Marking/FL/F${horseData.feathering}M${horseData.flWhite}`));
                    skin.addSkin(skeletonData.findSkin(`Marking/FR/F${horseData.feathering}M${horseData.frWhite}`));
                    skin.addSkin(skeletonData.findSkin(`Marking/HL/F${horseData.feathering}M${horseData.hlWhite}`));
                    skin.addSkin(skeletonData.findSkin(`Marking/HR/F${horseData.feathering}M${horseData.hrWhite}`));
                    skin.addSkin(skeletonData.findSkin(`Pattern/Dark/${horseData.darkMarkings ? `${horseData.feathering}/${horseData.darkMarkings}` : 0}`));
                    skin.addSkin(skeletonData.findSkin(`Tail/${horseData.tail}`));
                } else {
                    if (horseData.darkMarkings !== 0) {
                        skin.addSkin(skeletonData.findSkin(`Pattern/Dark`));
                    }
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

        function tintHoof(hoof, lighten) {
            if (lighten) {
                horse.skeleton.findSlot(`Hoof${hoof}`).darkColor = {r: 197/255, g: 156/255, b: 110/255, a: 1}
            }
            else {
                horse.skeleton.findSlot(`Hoof${hoof}`).darkColor = {r: 0, g: 0, b: 0, a: 1}
            }

        }

        function tintHorse() {
            let shade = 1

            // Hair
            changeTint(horse, 'Tail', horseData.hairColor.r, horseData.hairColor.g, horseData.hairColor.b, shade)
            changeTint(horseOverlay, 'Mane', horseData.hairColor.r, horseData.hairColor.g, horseData.hairColor.b, shade)
            changeTint(horseOverlay, 'Forelock', horseData.hairColor.r, horseData.hairColor.g, horseData.hairColor.b, shade)
            changeTint(horsePic, 'Mane', horseData.hairColor.r, horseData.hairColor.g, horseData.hairColor.b, shade)
            changeTint(horsePic, 'Forelock', horseData.hairColor.r, horseData.hairColor.g, horseData.hairColor.b, shade)

            // Body
            changeTint(horseOverlay, 'Ear', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horse, 'Body', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horse, 'Head', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horse, 'HeadUpper', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horse, 'HeadJaw', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horse, 'Neck', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horse, 'UpperFL', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horse, 'LowerFL', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horse, 'UpperHL', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horse, 'LowerHL', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horse, 'UpperFR', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horse, 'LowerFR', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horse, 'UpperHR', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horse, 'LowerHR', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horse, 'FeatheringFL', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horse, 'FeatheringFR', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horse, 'FeatheringHL', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horse, 'FeatheringHR', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horsePic, 'Ear', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
            changeTint(horsePic, 'Base', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)

            // Dark
            let dark = ['DarkBody', 'HeadDark', 'HeadUDark', 'HeadJDark', 'DarkFL', 'DarkFL2', 'DarkHL', 'DarkHL2', 'DarkFR', 'DarkFR2', 'DarkHR', 'DarkHR2']
            for (let index = 0; index < dark.length; index++) {
                changeTint(horse, dark[index], horseData.darkColor.r, horseData.darkColor.g, horseData.darkColor.b, shade)
            }
            changeTint(horsePic, 'Dark', horseData.darkColor.r, horseData.darkColor.g, horseData.darkColor.b, shade)

            // White
            changeTint(horseOverlay, 'EarAppy', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            changeTint(horse, 'HeadUAppy', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            changeTint(horse, 'BodyAppy', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            changeTint(horse, 'NeckAppy', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            changeTint(horse, 'HLAppy', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            changeTint(horse, 'FLAppy', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            changeTint(horsePic, 'Appy', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)

            changeTint(horseOverlay, 'EarFlecked', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            changeTint(horse, 'HeadUFlecked', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            changeTint(horse, 'BodyFlecked', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            changeTint(horse, 'NeckFlecked', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            changeTint(horse, 'HLFlecked', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            changeTint(horse, 'FLFlecked', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            changeTint(horsePic, 'Flecked', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)

            changeTint(horse, 'HeadUPinto', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            changeTint(horse, 'BodyPinto', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            changeTint(horse, 'NeckPinto', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            changeTint(horse, 'HLPinto', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            changeTint(horse, 'FLPinto', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            changeTint(horsePic, 'Pinto', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)

            if (horseData.whiteMatches) {
                changeTint(horse, 'HeadUMarkingStar', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
                changeTint(horsePic, 'Star', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
                changeTint(horse, 'HeadUMarkingSnip', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
                changeTint(horse, 'HeadJMarkingSnip', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
                changeTint(horsePic, 'Snip', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
                changeTint(horse, 'HeadUMarkingStripe', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
                changeTint(horse, 'HeadMarkingStripe', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
                changeTint(horse, 'HeadJMarkingStripe', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
                changeTint(horsePic, 'Stripe', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)

                changeTint(horse, 'MarkingHL', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
                changeTint(horse, 'MarkingHL2', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
                changeTint(horse, 'MarkingFL', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
                changeTint(horse, 'MarkingFL2', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
                changeTint(horse, 'MarkingFR', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
                changeTint(horse, 'MarkingFR2', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
                changeTint(horse, 'MarkingHR', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
                changeTint(horse, 'MarkingHR2', horseData.whiteColor.r, horseData.whiteColor.g, horseData.whiteColor.b, shade)
            }
            if (horseData.headErase === 3) {
                changeTint(horse, 'HeadJMarkingSnip', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
                changeTint(horse, 'HeadJMarkingStripe', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
                changeTint(horse, 'HeadMarkingStripe', horseData.bodyColor.r, horseData.bodyColor.g, horseData.bodyColor.b, shade)
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

        function horseDataToString() {
            let string = getColorHexCode(horseData.bodyColor.color) + '+' +
                getColorHexCode(horseData.hairColor.color) + '+' +
                getColorHexCode(horseData.darkColor.color) + '+' +
                getColorHexCode(horseData.whiteColor.color) + '+' +
                horseData.feathering.toString() +
                horseData.forelock.toString() +
                horseData.mane.toString() +
                horseData.tail.toString() +
                horseData.flWhite.toString() +
                horseData.frWhite.toString() +
                horseData.hrWhite.toString() +
                horseData.hlWhite.toString() +
                horseData.headStripe.toString() +
                horseData.headSnip.toString() +
                horseData.headStar.toString() +
                horseData.headErase.toString() +
                horseData.whiteMatches.toString() +
                horseData.appyPattern.toString() +
                horseData.pintoPattern.toString() +
                horseData.pintoExpression.toString() +
                horseData.fleckedPattern.toString() +
                horseData.darkMarkings.toString()

            return string
        }

        function getColorHexCode(color) {
            color = color.toString(16)
            while (color.length < 6) {
                color = "0" + color;
            }
            return color
        }
        
        function copy() {
            let copyText = `${location.origin + location.pathname}` +
                `?v=${urlVersion}` +
                `&name=${encodeURIComponent(horseData.name)}` +
                `&message=${encodeURIComponent(horseData.message)}` +
                `&data=${horseDataToString()}`

            let input = document.getElementById('copy');
            input.value = copyText
            input.style.display = 'inline'
            document.getElementById('copyLable').style.display = 'inline'

            if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
                // handle iOS devices
                input.contenteditable = true;
                input.readonly = false;
            
                let range = document.createRange();
                range.selectNodeContents(input);
            
                let selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                input.setSelectionRange(0, 999999);
                } else {
                // other devices are easy
                input.select()
                }
                document.execCommand('copy');
                
            // Alert the copied text
            alert(localeData.txtDressupLinkInfo + copyText);
        }

        const sharedData = {
            horseData: horseData, 
            backgroundMusic: game.backgroundMusic, 
            playMusic: game.playMusic,
            randomIntFromInterval: randomIntFromInterval,
            resetHorseSprite: resetHorseSprite,
            horseDataToString: horseDataToString,
            copy: copy
        }

        if (!data.horseData && urlParameters.get('data')) {
            this.scene.start('dressupLandStable', sharedData);
        }

        const hover1 = this.sound.add('hover1');
        const hover2 = this.sound.add('hover2');
        const pickup = this.sound.add('pickup');


        // Straw (on floor)
        const straw2 = this.add.sprite(539, 439, 'straw2', 'frame0012').setScale(0.8);
        const straw1 = this.add.sprite(351, 420, 'straw1', 'frame0012').setScale(0.65);
        const straw3 = this.add.sprite(643, 411, 'straw3', 'frame0012').setScale(0.75);
        // Hay loft
        const hayLoft = this.add.sprite(350, 56, 'hay_loft', 'idle').setScale(.88)//.setInteractive();
        // Water Trough
        trough = this.add.sprite(153, 455, 'trough', 'idle')//.setInteractive({ pixelPerfect: true });
        // Food Trough
        foodTrough = this.add.sprite(104, 303, 'food_trough', 0)//.setInteractive({ pixelPerfect: true });
        // Pitchfork
        const fork = this.add.sprite(718, 177, 'fork', 'idle')//.setInteractive({ pixelPerfect: true });
        // Shovel
        const shovel = this.add.sprite(742, 189, 'shovel', 'idle')//.setInteractive({ pixelPerfect: true });
        // Brush
        const brush = this.add.sprite(767, 100, 'brush', 'idle').setScale(0.75);
        // Small Brush
        const brushSmall = this.add.sprite(746, 64, 'brush_small', 'idle');
        // Hoofpick
        const hoofpick = this.add.sprite(823, 80, 'hoofpick', 'idle').setScale(0.75);
        // Lucky Horseshoe
        const luck = this.add.sprite(453, 268, 'luck', 'idle')//.setInteractive({ pixelPerfect: true });
        // Inspirational message frame
        const frame = this.add.sprite(516, 118, 'frame', 'idle').setScale(.93);
            canPlayInspiration = true

        horsePic = game.add.spine(518, 125, 'horsePicJson', `horsePicAtlas`).setScale(.35);
        const inspirationHover = this.sound.add('inspiration_hover');
        const inspirationSound = this.sound.add('inspiration_sound');
        inspirationCloseSound = this.sound.add('inspiration_close');
        const frameInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(478, 65, 75, 110), Phaser.Geom.Rectangle.Contains);
            frameInteractive.on('pointerover', function (pointer)
            {
                if (canPlayInspiration) {
                    frame.setFrame('hover');
                    inspirationHover.play()
                }
            });
            frameInteractive.on('pointerout', function (pointer) { frame.setFrame('idle') });
            frameInteractive.on('pointerdown', function (pointer) { 
                if (canPlayInspiration) {
                    playInspiration = true 
                    inspirationSound.play()
                }
            })


        // Horse       
        // Main Body
        horse = game.add.spine(418, 295, 'horseJson', `horseAtlas`);
            horse.animationState.setAnimation(0, "idle", false)
        horseOverlay = game.add.spine(418, 295, 'horseJson', `horseAtlas`);
            horseOverlay.animationState.setAnimation(0, "idle", false)
        rearSound = this.sound.add('rear_sound');
        
        // Randomise and display the features
        // @todo add a randomise button
        if (makeRandomHorse) {
            horseData.name = ''
            horseData.message = ''
            randomiseHorse()
            makeRandomHorse = false
        }
        resetHorseSprite()

        // Setup animations
        for (let index = 0; index < horseOverlay.skeleton.data.animations.length; index++) {
            if (horse.skeleton.data.animations[index].name === "constant") {
                horse.animationState.addAnimation(1, "constant", true)
            }
            if (horseOverlay.skeleton.data.animations[index].name === "constant") {
                horseOverlay.animationState.addAnimation(1, "constant", true)
            }
        }
        horse.animationState.addListener({
            complete: function endAnimation(entry) { 
                if (horseAnimationQueue.length === 0) {
                    const horseIdleAnimations = ['ear_twitch', 'flank_twitch', 'head_shake', 'head_turn', 'nod', 'paw_ground', 'shift_weight', 'tail_swish']
                    let animation = horseIdleAnimations[Math.floor(Math.random()*horseIdleAnimations.length)]
                    
                    const delay = randomIntFromInterval(3, 5)
                    horse.animationState.addAnimation(0, animation, false, delay);
                    horseOverlay.animationState.addAnimation(0, animation, false, delay);
                }
                // allow next animation to play
                horseBusy = false
            }
            })

        function randomiseHorse() {
            horseData.feathering = randomIntFromInterval(0,5)
            horseData.forelock = randomIntFromInterval(0,2)
            horseData.mane = randomIntFromInterval(0,2)
            horseData.tail = randomIntFromInterval(0,2)
            horseData.flWhite = randomIntFromInterval(0,5)
            horseData.frWhite = randomIntFromInterval(0,5)
            horseData.hlWhite = randomIntFromInterval(0,5)
            horseData.hrWhite = randomIntFromInterval(0,5)
            horseData.headStar = randomIntFromInterval(0,3)
            horseData.headSnip = randomIntFromInterval(0,4)
            horseData.headStripe = randomIntFromInterval(0,6)
            horseData.headErase = randomIntFromInterval(0,2)
            horseData.whiteMatches = randomIntFromInterval(0,1)
            
            horseData.appyPattern = 0
            horseData.pintoExpression = 0
            horseData.fleckedPattern = 0
            switch (randomIntFromInterval(0,5)) {
                case 0:
                    horseData.appyPattern = randomIntFromInterval(0,6)
                    break;
                case 1:
                    horseData.pintoPattern = randomIntFromInterval(0,4)
                    horseData.pintoExpression = randomIntFromInterval(0,3)
                    break;
                case 2:
                    horseData.fleckedPattern = randomIntFromInterval(0,3)
                    break;
                case 3:
                    horseData.appyPattern = randomIntFromInterval(0,6)
                    horseData.pintoPattern = randomIntFromInterval(0,3)
                    horseData.pintoExpression = randomIntFromInterval(0,3)
                    break;
                case 4:
                    horseData.appyPattern = randomIntFromInterval(0,6)
                    horseData.fleckedPattern = randomIntFromInterval(0,3)
                    break;
                case 5:
                    horseData.pintoPattern = randomIntFromInterval(0,3)
                    horseData.pintoExpression = randomIntFromInterval(0,3)
                    horseData.fleckedPattern = randomIntFromInterval(0,3)
                    break;
            
                default:
                    break;
            }

            horseData.darkMarkings = randomIntFromInterval(0,4)

        }


        /**
         * Hides the slots of a skeleton based on an array of slot names
         * @param {*} skeleton The skeleton to hide the slots of
         * @param {*} slotArray An array of the slot names which should be hidden
         */
        function hideSlots(skeleton, slotArray) {
            for (let index = 0; index < slotArray.length; index++) {
                skeleton.skeleton.findSlot(slotArray[index]).color.a = 0;
            }
        }

        function splitHex(color) {
            let r = ((color & 0xff0000) >> 16)/255
            let g = ((color & 0x00ff00) >> 8)/255
            let b = (color & 0x0000ff)/255
            return { color: color, r:r, g:g, b:b };
          }


        // Apple Bin
        const appleBin = this.add.image(680, 505, 'apple_bin', 'idle')//.setInteractive();
        // Grain Bin
        const grainBin = this.add.sprite(736, 413, 'grain_bin', 'idle')//.setInteractive({ pixelPerfect: true });
        
        this.add.image(618, 40, 'info_box').setOrigin(0,0).setAlpha(0.75);
        
        const hairColorPicker = this.rexUI.add.colorPicker({
            x: 723, y: 160,
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_SECONDARY),
            svPalette: {
                width: 128,
                height: 128
            },
            hPalette: {
                size: 16
            },
            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 10,
            },

            setAlpha(visible) {
                if (visible) {
                    x = 730
                    y = 350
                } else {
                    x = -100
                    y = -100
                }
            },

            valuechangeCallback(value) {
                horseData.hairColor = splitHex(value)
                tintHorse()
            },
            value: horseData.hairColor ? horseData.hairColor : Phaser.Math.Between(0, 0x1000000)
        }).layout()

        const bodyColorPicker = this.rexUI.add.colorPicker({
            x: 723, y: 160,
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_SECONDARY),
            svPalette: {
                width: 128,
                height: 128
            },
            hPalette: {
                size: 16
            },
            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 10,
            },

            setAlpha(visible) {
                if (visible) {
                    x = 730
                    y = 150
                } else {
                    x = -100
                    y = -100
                }
            },

            valuechangeCallback(value) {
                horseData.bodyColor = splitHex(value)
                
                tintHorse()
            },
            value: horseData.bodyColor ? horseData.bodyColor : Phaser.Math.Between(0, 0x1000000)
        }).layout()

        const darkColorPicker = this.rexUI.add.colorPicker({
            x: 723, y: 160,
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_SECONDARY),
            svPalette: {
                width: 128,
                height: 128
            },
            hPalette: {
                size: 16
            },
            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 10,
            },

            setAlpha(visible) {
                if (visible) {
                    x = 730
                    y = 150
                } else {
                    x = -100
                    y = -100
                }
            },

            valuechangeCallback(value) {
                horseData.darkColor = splitHex(value)
                
                tintHorse()
            },
            value: horseData.darkColor !== -1 ? horseData.darkColor : randomDark()
        }).layout()

        const whiteColorPicker = this.rexUI.add.colorPicker({
            x: 723, y: 160,
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_SECONDARY),
            svPalette: {
                width: 128,
                height: 128
            },
            hPalette: {
                size: 16
            },
            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 10,
            },

            setAlpha(visible) {
                if (visible) {
                    x = 730
                    y = 150
                } else {
                    x = -100
                    y = -100
                }
            },

            valuechangeCallback(value) {
                horseData.whiteColor = splitHex(value)
                
                tintHorse()
            },
            value: horseData.whiteColor ? horseData.whiteColor : randomWhite()
        }).layout()

        const nameInputText = this.add.rexInputText(723, 100, 150, 20, {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#000000',
            backgroundColor: '#ffffff80',
            padding: 6
        })
        nameInputText.on('textchange', function(inputText, e){ 
            horseData.name = nameInputText.text
            horseNameText.text = horseData.name;
        });        
        if (horseData.name) { nameInputText.text = horseData.name }
        nameInputText.placeholder = 'Name'

        const messageInputText = this.add.rexInputText(723, 160, 150, 60, {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#000000',
            backgroundColor: '#ffffff80',
            padding: 6,
            type: 'textarea'
        })
        messageInputText.on('textchange', function(inputText, e){ 
            horseData.message = messageInputText.text
            inspirationMessage.text = horseData.message;
        });
        if (horseData.message) { messageInputText.text = horseData.message }
        messageInputText.placeholder = 'Message'


        const featheringSlider = makeSelector(723, 270, 6, 'feathering', localeData.txtDressupFeathering)

        const darkSlider = makeSelector(723, 270, 5, 'darkMarkings', localeData.txtDressupBay)

        const forelockSlider = makeSelector(723, 270, 3, 'forelock', localeData.txtDressupForelock)
        const maneSlider = makeSelector(723, 300, 3, 'mane', localeData.txtDressupMane)
        const tailSlider = makeSelector(723, 330, 3, 'tail', localeData.txtDressupTail)

        const markingHeadStarSlider = makeSelector(723, 100, 4, 'headStar', localeData.txtDressupStar)
        const markingHeadSnipSlider = makeSelector(723, 130, 5, 'headSnip', localeData.txtDressupSnip)
        const markingHeadStripeSlider = makeSelector(723, 160, 7, 'headStripe', localeData.txtDressupStripe)
        const markingHeadEraseSlider = makeSelector(723, 190, 3, 'headErase', localeData.txtDressupIrregularity)

        const markingflSlider = makeSelector(723, 240, 6, 'flWhite', localeData.txtDressupFLLeg)
        const markingfrSlider = makeSelector(723, 270, 6, 'frWhite', localeData.txtDressupFRLeg)
        const markinghrSlider = makeSelector(723, 300, 6, 'hrWhite', localeData.txtDressupHRLeg)
        const markinghlSlider = makeSelector(723, 330, 6, 'hlWhite', localeData.txtDressupHLLeg)

        const markingMatchSlider = makeSelector(723, 380, 2, 'whiteMatches', localeData.txtDressupMarkingWhite)
        
        const patternAppySlider = makeSelector(723, 270, 7, 'appyPattern', localeData.txtDressupAppaloosa)
        const patternPintoSlider = makeSelector(723, 300, 5, 'pintoPattern', localeData.txtDressupPintoP)
        const expressionPintoSlider = makeSelector(723, 330, 4, 'pintoExpression', localeData.txtDressupPintoE)
        const patternFleckedSlider = makeSelector(723, 360, 4, 'fleckedPattern', localeData.txtDressupGrey)

        function makeSelector(x, y, options, key, lable) {
            const slider = game.add.container(100, 24);

            const text = game.add.text(0, 0, lable, {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: '#ffffff',
                align: 'center',
                fixedWidth: 125,
                backgroundColor: '#00000080'
            }).setPadding(6).setOrigin(0.5);

            const pButton = game.add.sprite(-80, 0, 'previous_button', 'idle').setScale(.5)
                0 < horseData[key] ? pButton.setFrame('idle') : pButton.setFrame('dull');
                pButton.setInteractive({ useHandCursor: true });
                pButton.on('pointerover', () => {
                    if (0 < horseData[key]) {
                        pButton.setFrame('hover')
                        hover1.play()
                    }
                    0 < horseData[key] ? pButton.setFrame('idle') : pButton.setFrame('dull');
                });
                pButton.on('pointerout', () => {
                    0 < horseData[key] ? pButton.setFrame('idle') : pButton.setFrame('dull');
                });
                pButton.on('pointerdown', () => {
                    if (0 < horseData[key]) {
                        horseData[key] = horseData[key] - 1
                        resetHorseSprite()
                    }
                    0 < horseData[key] ? pButton.setFrame('idle') : pButton.setFrame('dull');
                    horseData[key] < options - 1 ? nButton.setFrame('idle') : nButton.setFrame('dull');
                })

            const nButton = game.add.sprite(80, 0, 'next_button', 'idle').setScale(.5)
                horseData[key] < options - 1 ? nButton.setFrame('idle') : nButton.setFrame('dull');
                nButton.setInteractive({ useHandCursor: true });
                nButton.on('pointerover', () => {
                    if (horseData[key] < options - 1) {
                        nButton.setFrame('hover')
                        hover1.play()
                    }
                    horseData[key] < options - 1 ? nButton.setFrame('idle') : nButton.setFrame('dull');
                });
                nButton.on('pointerout', () => {
                    horseData[key] < options - 1 ? nButton.setFrame('idle') : nButton.setFrame('dull');
                });
                nButton.on('pointerdown', () => {
                    if (horseData[key] < options - 1) {
                        horseData[key] = horseData[key] + 1
                        resetHorseSprite()
                    }
                    horseData[key] < options - 1 ? nButton.setFrame('idle') : nButton.setFrame('dull');
                    0 < horseData[key] ? pButton.setFrame('idle') : pButton.setFrame('dull');
                })

            slider.add([ text, pButton, nButton ]);
            slider.setSize(100, 24).setPosition(x, y);
            return slider
        }


        const infoTab = [nameInputText, messageInputText]
        const mainTab = [bodyColorPicker, featheringSlider]
        const darkTab = [darkColorPicker, darkSlider]
        const hairTab = [hairColorPicker, forelockSlider, maneSlider, tailSlider]
        const markingTab = [
            markingHeadSnipSlider, markingHeadStarSlider, markingHeadStripeSlider, markingHeadEraseSlider,
            markingflSlider, markingfrSlider, markinghlSlider, markinghrSlider, markingMatchSlider
        ]
        const patternTab = [whiteColorPicker, patternAppySlider, patternPintoSlider, expressionPintoSlider, patternFleckedSlider]
        showTab(mainTab)
        /**
         * Hides the current tab and shows the new tab
         * @param {*} tab The tab to show (all others will be hidden)
         */
        function showTab(tab) {
            let tabs = [infoTab, mainTab, darkTab, hairTab, markingTab, patternTab]
            tabs = tabs.filter(e => e !== tab)
            for (let index = 0; index < tabs.length; index++) {
                tabs[index].forEach(element => {
                    element.setAlpha(0);
                });
            }
            tab.forEach(element => {
                element.setAlpha(1);
            });
        }


        makeChoiceButton(localeData.txtDressupInfo, infoTab, 155)
        makeChoiceButton(localeData.txtDressupMain, mainTab, 270)
        makeChoiceButton(localeData.txtDressupDarkPatterns, darkTab, 385)
        makeChoiceButton(localeData.txtDressupHair, hairTab, 500)
        makeChoiceButton(localeData.txtDressupWhiteMarkings, markingTab, 615)
        makeChoiceButton(localeData.txtDressupWhitePatterns, patternTab, 730)

        function makeChoiceButton(text, tab, x) {
            const button = game.add.text(x, 20, text, {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: '#ffffff',
                align: 'center',
                fixedWidth: 100,
                backgroundColor: COLOR_PRIMARY_HEX
            }).setPadding(6).setOrigin(0.5);
    
            button.setInteractive({ useHandCursor: true });
    
            button.on('pointerover', () => {
                button.setBackgroundColor(COLOR_SECONDARY_HEX);
            });
    
            button.on('pointerout', () => {
                button.setBackgroundColor(COLOR_PRIMARY_HEX);
            });

            button.on('pointerdown', () => {
                showTab(tab)
            })
        }

        /**
         * 
         * @returns a random 'white' colour based on the body colour
         */
        function randomWhite() {
            const r = 255*horseData.bodyColor.r + Phaser.Math.Between(0x40, 0xf0)
            const g = 255*horseData.bodyColor.g + Phaser.Math.Between(0x40, 0xf0)
            const b = 255*horseData.bodyColor.b + Phaser.Math.Between(0x40, 0xf0)
            let color = [r, g, b]
            for (let index = 0; index < color.length; index++) {
                if (color[index] > 255) { color[index] = 255}
            }
            let newColor = parseInt(color[0].toString(16) + color[1].toString(16) + color[2].toString(16), 16)
            return newColor

        }

        function randomDark() {
            let color
            switch (randomIntFromInterval(0, 1)) {
                case 0:
                    let darkLevel = randomIntFromInterval(1, 8)
                    darkLevel = 1 - (darkLevel * 0.1)
                    color = [horseData.bodyColor.r*darkLevel, horseData.bodyColor.g*darkLevel, horseData.bodyColor.b*darkLevel]
                    break;
                    
                default:
                    const r = 255*horseData.bodyColor.r - Phaser.Math.Between(0x20, 0x70)
                    const g = 255*horseData.bodyColor.g - Phaser.Math.Between(0x20, 0x70)
                    const b = 255*horseData.bodyColor.b - Phaser.Math.Between(0x20, 0x70)
                    color = [r, g, b]
                    for (let index = 0; index < color.length; index++) {
                        if (color[index] < 0) { color[index] = 0}
                    }
                    break;
            }
            let newColor = parseInt(color[0].toString(16) + color[1].toString(16) + color[2].toString(16), 16)
            return newColor
        }

        
        // Recovers horse data if played with in stable
        if (data.horseData) {
            horseData = data.horseData
            bodyColorPicker.value = data.horseData.bodyColor.color
            hairColorPicker.value = data.horseData.hairColor.color
            whiteColorPicker.value = data.horseData.whiteColor.color
            resetHorseSprite()
        }
        
        

        // ---------- Stable foreground and UI ---------- //
        this.add.image(444, 261, 'stable_fg');


        // Inspirational message
        inspiration = this.add.image(430, 150, 'inspiration').setScale(.93).setVisible(false);
        inspirationMessage = this.add.text(444, 133, 'Static Text Object', { 
            fontFamily: 'Arial', 
            fontSize: 55, 
            color: '#ffffff', 
            align: 'center',
            wordWrap: { width: 800 } 
        }).setVisible(false);
        inspirationMessage.text = horseData.message;
        inspirationMessage.setOrigin(0.5);
        inspirationMessage.setShadow(2, 2, '#000000', 7, true, true)


        // Horse name
        const horseNameText = this.add.text(444, 478, 'Static Text Object', { fontFamily: 'Arial', fontSize: 12, color: '#ffffff', align: 'center' });
        horseNameText.text = horseData.name;
        horseNameText.setOrigin(0.5)

        // Buttons
        // Copy Button
        const copyButton = game.add.text(730, 500, localeData.txtDressupCopy, {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#ffffff',
            align: 'center',
            fixedWidth: 100,
            backgroundColor: COLOR_PRIMARY_HEX
        }).setPadding(6).setOrigin(0.5);
            copyButton.setInteractive({ useHandCursor: true });
            copyButton.on('pointerover', () => {
                copyButton.setBackgroundColor(COLOR_SECONDARY_HEX);
            });
            copyButton.on('pointerout', () => {
                copyButton.setBackgroundColor(COLOR_PRIMARY_HEX);
            });
            copyButton.on('pointerdown', () => {
                // Copy the text
                copy()

            })

        // Random Button
        const randomButton = game.add.text(150, 500, localeData.txtDressupRandomise, {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#ffffff',
            align: 'center',
            fixedWidth: 100,
            backgroundColor: COLOR_PRIMARY_HEX
        }).setPadding(6).setOrigin(0.5);
            randomButton.setInteractive({ useHandCursor: true });
            randomButton.on('pointerover', () => {
                randomButton.setBackgroundColor(COLOR_SECONDARY_HEX);
            });
            randomButton.on('pointerout', () => {
                randomButton.setBackgroundColor(COLOR_PRIMARY_HEX);
            });
            randomButton.on('pointerdown', () => {
                randomiseHorse()
                hairColorPicker.value = Phaser.Math.Between(0, 0x1000000)
                bodyColorPicker.value = Phaser.Math.Between(0, 0x1000000)
                darkColorPicker.value = randomDark()
                whiteColorPicker.value = randomWhite()
                resetHorseSprite()
            })
            

        // Play Button
        const playButton = game.add.text(730, 465, localeData.txtDressupPlay, {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#ffffff',
            align: 'center',
            fixedWidth: 100,
            backgroundColor: COLOR_PRIMARY_HEX
        }).setPadding(6).setOrigin(0.5);
            playButton.setInteractive({ useHandCursor: true });
            playButton.on('pointerover', () => {
                playButton.setBackgroundColor(COLOR_SECONDARY_HEX);
            });
            playButton.on('pointerout', () => {
                playButton.setBackgroundColor(COLOR_PRIMARY_HEX);
            });
            playButton.on('pointerdown', () => {
                this.scene.start('dressupLandStable', sharedData);
            })

        // music button
        const musicButton = this.add.sprite(867, 498, 'music_button', 'music_on').setInteractive({ pixelPerfect: true });
            musicButton.on('pointerdown', function (pointer)
            {
                if (game.playMusic) {
                    game.backgroundMusic.stop()
                    this.setFrame('music_off_hover')
                }
                else {
                    game.backgroundMusic.play()
                    this.setFrame('music_on_hover')
                }
                game.playMusic = !game.playMusic
            });
            musicButton.on('pointerover', function (pointer) { this.setFrame(`music_${game.playMusic ? 'on' : 'off'}_hover`) });
            musicButton.on('pointerout', function (pointer) { this.setFrame(`music_${game.playMusic ? 'on' : 'off'}`) });
        
        // help button
        let helpPopups = [];
        function showLocalizedHelpTexts(xPos, yPos, localeTxtKey, settings, scene)
        {
            const helpTxt = scene.add.text(xPos, yPos, 'Static Text Object', settings).setAlpha(0);
            helpTxt.text = localeTxtKey;
            helpTxt.setOrigin(0.5)
            helpPopups.push(helpTxt);
        }

        const helpButton = this.add.sprite(444, 261, 'help_dressup_button', 'idle').setInteractive(this.input.makePixelPerfect(150));
            const hoverTextSettingsBigBox = {
                font: 'bold 12px Arial', 
                align: 'center',
                color: '#ffffff',
                wordWrap: {width: 200},
                lineSpacing: -2
            }
            
            const hoverTextSettingsMediumSmallBox = {
                font: 'bold 12px Arial', 
                align: 'center',
                color: '#ffffff',
                wordWrap: {width: 135},
                lineSpacing: -2
            }

            showLocalizedHelpTexts(156, 105, localeData.txtHelpInfo, hoverTextSettingsMediumSmallBox, this);
            showLocalizedHelpTexts(398, 177, localeData.txtHelpMain, hoverTextSettingsBigBox, this);
            showLocalizedHelpTexts(155, 420, localeData.txtHelpRandomise, hoverTextSettingsMediumSmallBox, this);
            showLocalizedHelpTexts(683, 350, localeData.txtHelpPlay, hoverTextSettingsMediumSmallBox, this);
            showLocalizedHelpTexts(587, 425, localeData.txtHelpCopyLink, hoverTextSettingsMediumSmallBox, this);

            helpButton.on('pointerover', function (pointer) { 
                this.setFrame('help') 
                helpPopups.forEach(helpTxt => {
                    helpTxt.setAlpha(1);
                });
            });
            helpButton.on('pointerout', function (pointer) { 
                this.setFrame('idle') 
                helpPopups.forEach(helpTxt => {
                    helpTxt.setAlpha(0);
                });
            });


        // Progress bars
        const bar = 13
        const statTextSettings = { 
            fontFamily: 'Arial', 
            fontSize: 11.5, 
            align: 'center'
        }
        // hunger
        const hungerLevel = 1.5
        const hungerPos = 353 - 32 + (hungerLevel*bar/2)
        const hungerWidth = 1 + hungerLevel*bar
        this.add.rectangle(353, 505, 66, 2, 0x5f2041);
            const hungerBar = {
                x: 353,
                leftShine: this.add.rectangle(hungerPos - hungerWidth/2 - 1, 510, 3, 10, 0xfabad0),
                rightShade: this.add.rectangle(hungerPos + hungerWidth/2 + 1, 510, 3, 10, 0x983657),
                topShine: this.add.rectangle(hungerPos, 506, hungerWidth, 3, 0xfabad0),
                bottomShade: this.add.rectangle(hungerPos, 514, hungerWidth, 2, 0x983657),
                progress: this.add.rectangle(hungerPos, 510, hungerWidth, 7, 0xff6699),
                level: hungerLevel
            }
            this.add.image(351, 509, 'hunger_scale');
            const hungerText = this.add.text(351, 498, 'Static Text Object', statTextSettings);
            hungerText.text = localeData.txtStatHunger;
            hungerText.setColor("#fa91b9");
            hungerText.setOrigin(0.5)

        // cleanliness
        const cleanlinessLevel = 1
        const cleanlinessPos = 446 - 32 + (cleanlinessLevel*bar/2)
        const cleanlinessWidth = 1 + cleanlinessLevel*bar
        this.add.rectangle(446, 505, 66, 2, 0x123625);
            const cleanlinessBar = {
                x: 446,
                leftShine: this.add.rectangle(cleanlinessPos - cleanlinessWidth/2 - 1, 510, 3, 10, 0xb2f3b1),
                rightShade: this.add.rectangle(cleanlinessPos + cleanlinessWidth/2 + 1, 510, 3, 10, 0x1d7429),
                topShine: this.add.rectangle(cleanlinessPos, 506, cleanlinessWidth, 3, 0xb2f3b1),
                bottomShade: this.add.rectangle(cleanlinessPos, 514, cleanlinessWidth, 2, 0x1d7429),
                progress: this.add.rectangle(cleanlinessPos, 510, cleanlinessWidth, 7, 0x2fce30),
                level: cleanlinessLevel
            }
            this.add.image(444, 509, 'cleanliness_scale');
            const cleanlinessText = this.add.text(444, 498, 'Static Text Object', statTextSettings);
            cleanlinessText.text = localeData.txtStatClean;
            cleanlinessText.setColor("#33cc00");
            cleanlinessText.setOrigin(0.5)

        // happiness
        const happinessLevel = 1.75
        const happinessPos = 542 - 32 + (happinessLevel*bar/2)
        const happinessWidth = 1 + happinessLevel*bar
        this.add.rectangle(542, 505, 66, 2, 0x002353);
            const happinessBar = {
                x: 542,
                leftShine: this.add.rectangle(happinessPos - happinessWidth/2 - 1, 510, 3, 10, 0xb4e2fb),
                rightShade: this.add.rectangle(happinessPos + happinessWidth/2 + 1, 510, 3, 10, 0x004673),
                topShine: this.add.rectangle(happinessPos, 506, happinessWidth, 3, 0xb4e2fb),
                bottomShade: this.add.rectangle(happinessPos, 514, happinessWidth, 2, 0x004673),
                progress: this.add.rectangle(happinessPos, 510, happinessWidth, 7, 0x0099ff),
                level: happinessLevel
            }
            this.add.image(540, 509, 'happiness_scale');
            const happinessText = this.add.text(540, 498, 'Static Text Object', statTextSettings);
            happinessText.text = localeData.txtStatHappy;
            happinessText.setColor("#00ccff");
            happinessText.setOrigin(0.5)

        /**
         * Adds additional progress to the provided stat bar.
         * @param {*} progressBar The bar to update
         * @param {number} progressAdd The amount of progress to add (1 = 1 mini bar = 1/5 of full bar)
         */
        function updateBar(progressBar, progressAdd) {
            progressBar.level += progressAdd

            progressBar.progress.setDisplaySize(progressBar.level*bar, progressBar.progress.height)
            progressBar.progress.setPosition(progressBar.x - 33 + (progressBar.level*bar/2), progressBar.progress.y)
            
            progressBar.topShine.setDisplaySize(progressBar.level*bar, progressBar.topShine.height)
            progressBar.topShine.setPosition(progressBar.x - 33 + (progressBar.level*bar/2), progressBar.topShine.y)
            
            progressBar.bottomShade.setDisplaySize(progressBar.level*bar, progressBar.bottomShade.height)
            progressBar.bottomShade.setPosition(progressBar.x - 33 + (progressBar.level*bar/2), progressBar.bottomShade.y)
            
            progressBar.rightShade.setPosition(progressBar.x - 32 + progressBar.level*bar, progressBar.rightShade.y)
        }
    }

    update ()
    {
        const pointer = this.input.activePointer;


        if (horseBusy === false && horseAnimationQueue.length > 0) {
            const animation = horseAnimationQueue.shift()
            horseBusy = true

            if (animation === HORSE_STATES.rear) {
                rearSound.play();
                horse.animationState.setAnimation(0, 'rear', false);
                horseOverlay.animationState.setAnimation(0, 'rear', false);
            } 
            else if (animation === HORSE_STATES.drink) {
                this.time.delayedCall(2800, function () {
                    troughMask.setVisible(true)
                    trough.play('water_trough_drink')
                    troughMask.play('mask_water_trough_drink')
                    horse.animationState.setAnimation(0, 'drink', false);
                    horseOverlay.animationState.setAnimation(0, 'drink', false);
                });
                this.time.delayedCall(3330, function () {
                    waterDrink.play()
                });
                this.time.delayedCall(5500, function () {
                    troughMask.setVisible(false)
                });
            }
            else if (animation === HORSE_STATES.eatingFood) {
                this.time.delayedCall(800, function () {
                    horse.animationState.setAnimation(0, 'eat_food', false);
                    horseOverlay.animationState.setAnimation(0, 'eat_food', false);
                });
                this.time.delayedCall(1000, function () {oatsEat.play()});
            }
            else if (animation === HORSE_STATES.eatingApple) {
                appleMunch.play();
                horse.animationState.setAnimation(0, 'eat_apple', false);
                horseOverlay.animationState.setAnimation(0, 'eat_apple', false);
            }
        }
        

        // Displays inspirational message
        if (playInspiration) {
            playInspiration = false
            canPlayInspiration = false
            inspiration.setVisible(true).setAlpha(0)
            inspirationMessage.setVisible(true).setAlpha(0)
            this.time.delayedCall(40, function () {inspiration.setAlpha(.1); inspirationMessage.setAlpha(0.1)});
            this.time.delayedCall(80, function () {inspiration.setAlpha(.2); inspirationMessage.setAlpha(0.2)});
            this.time.delayedCall(120, function () {inspiration.setAlpha(.3); inspirationMessage.setAlpha(0.3)});
            this.time.delayedCall(160, function () {inspiration.setAlpha(.4); inspirationMessage.setAlpha(0.4)});
            this.time.delayedCall(200, function () {inspiration.setAlpha(.5); inspirationMessage.setAlpha(0.5)});
            this.time.delayedCall(240, function () {inspiration.setAlpha(.6); inspirationMessage.setAlpha(0.6)});
            this.time.delayedCall(280, function () {inspiration.setAlpha(.7); inspirationMessage.setAlpha(0.7)});
            this.time.delayedCall(320, function () {inspiration.setAlpha(.8); inspirationMessage.setAlpha(0.8)});
            this.time.delayedCall(360, function () {inspiration.setAlpha(.9); inspirationMessage.setAlpha(0.9)});
            this.time.delayedCall(400, function () {inspiration.setAlpha(1); inspirationMessage.setAlpha(1)});
            this.time.delayedCall(2960, function () {inspiration.setAlpha(.9); inspirationMessage.setAlpha(0.9); inspirationCloseSound.play()});
            this.time.delayedCall(3000, function () {inspiration.setAlpha(.8); inspirationMessage.setAlpha(0.8)});
            this.time.delayedCall(3040, function () {inspiration.setAlpha(.7); inspirationMessage.setAlpha(0.7)});
            this.time.delayedCall(3080, function () {inspiration.setAlpha(.6); inspirationMessage.setAlpha(0.6)});
            this.time.delayedCall(3120, function () {inspiration.setAlpha(.5); inspirationMessage.setAlpha(0.5)});
            this.time.delayedCall(3160, function () {inspiration.setAlpha(.4); inspirationMessage.setAlpha(0.4)});
            this.time.delayedCall(3200, function () {inspiration.setAlpha(.3); inspirationMessage.setAlpha(0.3)});
            this.time.delayedCall(3240, function () {inspiration.setAlpha(.2); inspirationMessage.setAlpha(0.2)});
            this.time.delayedCall(3280, function () {inspiration.setAlpha(.1); inspirationMessage.setAlpha(0.1)});
            this.time.delayedCall(3320, function () {
                inspiration.setAlpha(0); 
                inspirationMessage.setAlpha(0); 
                canPlayInspiration = true;
            });
            
        }
    }
}