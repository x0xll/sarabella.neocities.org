// Variables to be used throughout scene
playMusic = true;
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
playInspiration = true
canPlayInspiration = false

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

horse = null
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



// Actual game start
class LandStable extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: 'landStable'
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
        // Display file names whilst loading
        this.load.on('fileprogress', function (file) {
            if (urlParameters.get('debug')) {
                progressText.text = file.src;
            }
        });
        const progressText = this.add.text(344, 133, '', { fontFamily: 'Arial', fontSize: 12, color: '#ffffff', align: 'center' });
            
        // Load in images and sounds
        this.load.image('stable_bg', './images/landStable/stable-bg.png');
        this.load.image('stable_fg', './images/landStable/stable-fg.png');
        this.load.image('hunger_scale', './images/landStable/hunger.png');
        this.load.image('cleanliness_scale', './images/landStable/cleanliness.png');
        this.load.image('happiness_scale', './images/landStable/happiness.png');

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
        
        this.load.spineAtlas("horse-atlas", `./images/horses/${horseName}/skeleton.atlas`);
        this.load.spineAtlas("horse_overlay-atlas", `./images/horses/${horseName}/skeleton_overlay.atlas`);
        this.load.spineJson("horse-json", `./images/horses/${horseName}/skeleton.json`);
        this.load.spineJson("horse_overlay-json", `./images/horses/${horseName}/skeleton_overlay.json`);
        if (horseName === "skeleton") {
            this.load.spineAtlas("horse_dirty-atlas", `./images/landStable/skeleton_dirty/dirt_skeleton.atlas`);
            this.load.spineJson("horse_dirty-json", `./images/landStable/skeleton_dirty/dirt_skeleton.json`);
        } else {
            this.load.spineAtlas("horse_dirty-atlas", `./images/landStable/horse_dirty/dirt_skeleton.atlas`);
            this.load.spineJson("horse_dirty-json", `./images/landStable/horse_dirty/dirt_skeleton.json`);
        }

        this.load.image('horse_image', `./images/horses/${horseName}/card_image.jpg`);
        this.load.spritesheet('hooves', './images/landStable/hooves.png', { frameWidth: 53, frameHeight: 53 });

        this.load.atlas('luck', './images/landStable/luck.png', './images/landStable/luck.json');
        this.load.atlas('frame', './images/landStable/frame.png', './images/landStable/frame.json');
        this.load.image('inspiration', './images/landStable/inspiration.png');

        this.load.atlas('music_button', './images/landStable/music.png', './images/landStable/music.json');
        this.load.atlas('help_button', './images/landStable/help.png', './images/landStable/help.json');

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
    }

    create ()
    {
        //  If you disable topOnly it will fire events for all objects the pointer is over, regardless of place on the display list
        this.input.topOnly = true;

        const backgroundMusic = this.sound.add('background_music');
        backgroundMusic.loop = true; 
        backgroundMusic.play();

        this.add.image(444, 261, 'stable_bg');

        const hover1 = this.sound.add('hover1');
        const hover2 = this.sound.add('hover2');
        const pickup = this.sound.add('pickup');


        // Straw (on floor)
        const straw2 = this.add.sprite(539, 439, 'straw2', 'frame0000').setScale(0.8);
            this.anims.create({
                key: 'straw2_pickup',
                frames: this.anims.generateFrameNumbers('straw2', { frames: [
                    'frame0000', 'frame0001', 'frame0002', 'frame0003', 'frame0004', 'frame0005', 'frame0006'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'straw2_place',
                frames: this.anims.generateFrameNumbers('straw2', { frames: [
                    'frame0006', 'frame0007', 'frame0008', 'frame0009', 'frame0010', 'frame0011', 'frame0012'
                ] }),
                frameRate: 24
            });
        const straw1 = this.add.sprite(351, 420, 'straw1', 'frame0000').setScale(0.65);
            this.anims.create({
                key: 'straw1_pickup',
                frames: this.anims.generateFrameNumbers('straw1', { frames: [
                    'frame0000', 'frame0001', 'frame0002', 'frame0003', 'frame0004', 'frame0005', 'frame0006'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'straw1_place',
                frames: this.anims.generateFrameNumbers('straw1', { frames: [
                    'frame0006', 'frame0007', 'frame0008', 'frame0009', 'frame0010', 'frame0011', 'frame0012'
                ] }),
                frameRate: 24
            });
        const straw3 = this.add.sprite(643, 411, 'straw3', 'frame0000').setScale(0.75);
            this.anims.create({
                key: 'straw3_pickup',
                frames: this.anims.generateFrameNumbers('straw3', { frames: [
                    'frame0000', 'frame0001', 'frame0002', 'frame0003', 'frame0004', 'frame0005', 'frame0006'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'straw3_place',
                frames: this.anims.generateFrameNumbers('straw3', { frames: [
                    'frame0006', 'frame0007', 'frame0008', 'frame0009', 'frame0010', 'frame0011', 'frame0012'
                ] }),
                frameRate: 24
            });
        const straw1Interactive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(249, 309, 170, 170), Phaser.Geom.Rectangle.Contains);
        const straw2Interactive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(419, 309, 170, 170), Phaser.Geom.Rectangle.Contains);
        const straw3Interactive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(589, 309, 170, 170), Phaser.Geom.Rectangle.Contains);

        /**
         * Picks up dirty straw when shovel is used on dirty straw and places clean straw when a
         * full pitchfork is used on an empty section of floor.
         * @param {sprite} straw The sprite for the straw being interacted with.
         * @param {string} pickupAnim The name of the animation to play for picking up the straw.
         * @param {string} placeAnim The name of the animation to play for placing the straw.
         */
        function cleanStraw(straw, pickupAnim, placeAnim) {
            if (handCurrent === HAND.shovel && straw.frame.name === 'frame0000') {
                straw.play(pickupAnim);
                shovelSound.play();
                shovelHeldSprite.play('shovel_scoop');
                updateBar(cleanlinessBar, 1/3)
                updateBar(happinessBar, 1/6 + 0.05)
            }
            else if (handCurrent === HAND.forkFilled && straw.frame.name === 'frame0006') {
                straw.play(placeAnim);
                handCurrent = HAND.fork
                forkPlace.play()
                updateBar(cleanlinessBar, 1/3)
                updateBar(happinessBar, 1/6 + 0.05)
            }
        }
        straw1Interactive.on('pointerdown', function (pointer) {cleanStraw(straw1, 'straw1_pickup', 'straw1_place')});
        straw2Interactive.on('pointerdown', function (pointer) {cleanStraw(straw2, 'straw2_pickup', 'straw2_place')});
        straw3Interactive.on('pointerdown', function (pointer) {cleanStraw(straw3, 'straw3_pickup', 'straw3_place')});


        // Hay loft
        const hayLoft = this.add.sprite(350, 56, 'hay_loft', 'idle').setInteractive().setScale(.88);
            this.anims.create({
                key: 'get_hay',
                frames: this.anims.generateFrameNumbers('hay_loft', { frames: [
                    'idle', 'idle', 'idle', 'idle', 'idle', 'idle', 'idle', 'idle',
                    'shuffle0000', 'shuffle0001', 'shuffle0000',
                    'idle'
                ] }),
                frameRate: 24
            });
            hayLoft.on('pointerdown', function (pointer)
            {
                if (handCurrent === HAND.fork) {
                    handCurrent = HAND.forkFilled
                    forkFill.play()
                    hayLoft.play('get_hay')
                }
            });


        // Water Trough
        trough = this.add.sprite(153, 455, 'trough', 'idle').setInteractive({ pixelPerfect: true });
        const waterSound = this.sound.add('water_sound');
        waterDrink = this.sound.add('water_drink');
            this.anims.create({
                key: 'fill_water',
                frames: this.anims.generateFrameNumbers('trough', { frames: [
                    'water0011', 'water0011', 'water0011',
                    'water0014', 'water0014',
                    'water0016', 'water0016',
                    'water0018', 'water0019', 'water0020', 'water0021', 'water0022', 'water0023', 'water0024', 'water0025', 'water0025',
                    'water0027', 'water0028', 'water0029', 'water0030', 'water0031', 'water0032', 'water0033', 'water0034', 'water0035',
                    'water0036', 'water0037', 'water0038', 'water0039', 'water0040', 'water0041', 'water0042', 'water0043', 'water0044',
                    'water0045', 'water0046', 'water0047', 'water0048', 'water0049', 'water0050', 'water0051', 'water0052', 'water0053',
                    'water0054', 'water0055', 'water0056', 'water0057', 'water0058', 'water0059', 'water0060'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'water_trough_drink',
                frames: this.anims.generateFrameNumbers('trough', { frames: [
                    'water0060', 'water0060', 'water0060',
                    'water0060', 'water0060', 'water0060', 'water0060', 'water0060', 'water0060', 'water0060', 'water0060', 'water0060', 'water0060',
                    'water0092', 'water0093', 'water0094', 'water0095', 'water0096', 'water0097', 'water0098', 'water0099', 'water0100',
                    'water0101', 'water0102', 'water0103', 'water0104', 'water0105', 'water0106', 'water0107', 'water0108', 'water0109', 'water0110',
                    'water0111', 'water0112', 'water0113', 'water0114', 'water0115', 'water0116', 'water0117', 'water0118', 'water0119', 'water0120',
                    'water0121', 'water0121', 'water0122', 'water0123', 'water0124', 'water0125', 'water0126'
                ] }),
                frameRate: 24
            });
            trough.on('pointerdown', function (pointer)
            {
                if (!waterFilled && handCurrent === HAND.empty) {
                    waterFilled = true;
                    this.play('fill_water');
                    troughMask.play('mask_fill_water');
                    waterSound.play()
                    horseAnimationQueue.push(HORSE_STATES.drink)
                    updateBar(hungerBar, 1.5)
                }
            });
            trough.on('pointerover', function (pointer)
            {
                if (!waterFilled && handCurrent === HAND.empty) {
                    this.setFrame('hover');
                    hover1.play();
                }
            });
            trough.on('pointerout', function (pointer)
            {
                if (!waterFilled && handCurrent === HAND.empty) {
                    this.setFrame('idle');
                }
            });

        // Food Trough
        foodTrough = this.add.sprite(104, 303, 'food_trough', 0).setInteractive({ pixelPerfect: true });
        oatsEat = this.sound.add('oats_eat');
            this.anims.create({
                key: 'fill',
                frames: this.anims.generateFrameNumbers('food_trough', { frames: [
                    'empty',
                    'fill0000', 'fill0001', 'fill0002', 'fill0003', 'fill0004', 'fill0005', 'fill0006', 'fill0007', 'fill0008', 'fill0009', 'fill0010',
                    'full'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'fill_again',
                frames: this.anims.generateFrameNumbers('food_trough', { frames: [
                    'full',
                    'fill_again0000', 'fill_again0001', 'fill_again0002', 'fill_again0003', 'fill_again0004', 'fill_again0004', 'fill_again0004', 'fill_again0004', 'fill_again0004', 'fill_again0009', 'fill_again0010',
                    'full'
                ] }),
                frameRate: 24
            });
            foodTrough.on('pointerdown', function (pointer)
            {
                if (handCurrent === HAND.grainScoop) {
                    handCurrent = HAND.empty;
                    grainBin.play('place');
                    this.play(foodFilled ? 'fill_again' : 'fill')
                    grainSound.play()
                    horseAnimationQueue.push(HORSE_STATES.eatingFood)
                    if (!foodFilled) {
                        updateBar(hungerBar, 2)
                        updateBar(happinessBar, 1.05)
                    }
                    foodFilled = true;
                }
            });


            // Horse hit box
            const horseInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(230, 100, 356, 256), Phaser.Geom.Rectangle.Contains);
                // interact with horse
                horseInteractive.on('pointerdown', function (pointer)
                {
                    if (handCurrent === HAND.apple) {
                        handCurrent = HAND.empty;
                        horseAnimationQueue.push(HORSE_STATES.eatingApple)
                    }
                    else if (handCurrent === HAND.brush) {
                        brushHeldSprite.play('brush')
                        brushSound.play();
                        horseBrushed();
                    }
                    else if (handCurrent === HAND.brushSmall) {
                        brushSmallHeldSprite.play('brush_small')
                        brushSoundSmall.play();
                        horseBrushed()
                    }
                });
    
                /**
                 * Updates the horse stats, increments the count of how many times the horse has been brushed
                 * and makes the horse rear when clean
                 */
                function horseBrushed() {
                    if (brushLevel < 2) {
                        brushLevel += 1;
                        updateBar(cleanlinessBar, 1/3)
                        updateBar(happinessBar, 1/6)
                        horseDirty.skeleton.color.a = 0.25 * (4 - brushLevel)
                    }
                    else if (brushLevel === 2) {
                        brushLevel += 1;
                        checkClean()
                        updateBar(cleanlinessBar, 1/3)
                        updateBar(happinessBar, 1/6)
                        horseDirty.setAlpha(0)
                    }
                }
                function checkClean() {
                    if (brushLevel === 3 && hooves1.frame.name === 2 && hooves2.frame.name === 2) {
                        horseAnimationQueue.push(HORSE_STATES.rear)
                    }
                }


            // Inspirational message frame
            const frame = this.add.sprite(516, 118, 'frame', 'idle').setScale(.93);
            this.add.image(517, 126, 'horse_image').setScale(.32);
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
            horse = this.add.spine(418, 295, 'horse-json', 'horse-atlas').setAngle(90);
            horse.animationState.setAnimation(0, "idle", false)

            horseDirty = this.add.spine(418, 295, 'horse_dirty-json', 'horse_dirty-atlas').setAngle(90);
            horseDirty.animationState.setAnimation(0, "idle", false)
            horseOverlay = this.add.spine(418, 295, 'horse_overlay-json', 'horse_overlay-atlas').setAngle(90);
            horseOverlay.animationState.setAnimation(0, "idle", false)
            addConstantAnimation()
            rearSound = this.sound.add('rear_sound');

            /**
             * Starts the horse's constant animation (e.g. constant sparkles or aura) if it exists
             */
            function addConstantAnimation() {
                for (let index = 0; index < horseOverlay.skeleton.data.animations.length; index++) {
                    if (horse.skeleton.data.animations[index].name === "constant") {
                        horse.animationState.addAnimation(1, "constant", true)
                    }
                    if (horseOverlay.skeleton.data.animations[index].name === "constant") {
                        horseOverlay.animationState.addAnimation(1, "constant", true)
                    }
                }
            }

            /**
             * Generates a random integer between two values
             * @param {number} min The minimum number that could be returned
             * @param {number} max The maximum number that could be returned
             * @returns 
             */
            function randomIntFromInterval(min, max) { // min and max included 
                return Math.floor(Math.random() * (max - min + 1) + min)
            }

            horse.animationState.addListener({
                // start: (entry) => console.log(`Started animation ${entry.animation.name}`),
                // interrupt: (entry) => console.log(`Interrupted animation ${entry.animation.name}`),
                // end: (entry) => console.log(`Ended animation ${entry.animation.name}`),
                // dispose: (entry) => console.log(`Disposed animation ${entry.animation.name}`),
                complete: function endAnimation(entry) { 
                    if (horseAnimationQueue.length === 0) {
                        const horseIdleAnimations = ['ear_twitch', 'flank_twitch', 'head_shake', 'head_turn', 'nod', 'paw_ground', 'shift_weight', 'tail_swish']
                        let animation = horseIdleAnimations[Math.floor(Math.random()*horseIdleAnimations.length)]
                        
                        const delay = randomIntFromInterval(3, 5)
                        horse.animationState.addAnimation(0, animation, false, delay);
                        horseDirty.animationState.addAnimation(0, animation, false, delay);
                        horseOverlay.animationState.addAnimation(0, animation, false, delay);
                    }
                    // allow next animation to play
                    horseBusy = false
                }
                // event: (entry, event) => console.log(`Custom event for ${entry.animation.name}: ${event.data.name}`)          
             })



        /**
         * Displays the 'hover' frame of a sprite and plays the hover sound if the hand is empty
         * @param {sprite} sprite The sprite to change
         * @param {audio} hoverSound The sound to play on hover
         */
        function pointerover(sprite, hoverSound) {
            if (handCurrent === HAND.empty) {
                sprite.setFrame('hover')
                hoverSound.play();
            }
        }
        function pointeroverNew(sprite, hoverSound, spriteText) {
            if (handCurrent === HAND.empty) {
                sprite.setFrame('hover')
                hoverSound.play();
                spriteText.setAlpha(1)
            }
        }
        /**
         * Displays the 'idle' frame of a sprite if the hand is empty
         * @param {sprite} sprite The sprite to change
         */
        function pointerout(sprite) {
            if (handCurrent === HAND.empty) {
                sprite.setFrame('idle')
            }
        }

        function pointeroutNew(sprite, spriteText) {
            if (handCurrent === HAND.empty) {
                sprite.setFrame('idle')
                spriteText.setAlpha(0)
            }
        }


        // Text boxes
        const hoverTextSettings = { 
            font: 'bold 16px Arial', 
            align: 'center',
            color: '#ffffff',
            wordWrap: { width: 150 } 
        }
        // Pitchfork
        const fork = this.add.sprite(718, 177, 'fork', 'idle').setInteractive({ pixelPerfect: true });
        const forkFill = this.sound.add('fork_fill');
        const forkPlace = this.sound.add('fork_place');
        const forkText = this.add.text(645, 225, 'Static Text Object', hoverTextSettings).setAlpha(0);
            forkText.text = localeData.txtPitchForkHilite2;
            forkText.setOrigin(0.5)
            this.anims.create({
                key: 'fork_fill',
                frames: this.anims.generateFrameNumbers('fork', { frames: [
                    'fill0000', 'fill0001', 'fill0002', 'fill0003', 'fill0004', 'fill0005', 'fill0006', 'fill0007', 'held_filled'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'fork_pickup',
                frames: this.anims.generateFrameNumbers('fork', { frames: [
                    'hold0000', 'hold0001', 'hold0002', 'hold0003', 'hold0004', 'hold0005', 'hold0006', 'hold0007', 'held_empty'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'fork_place',
                frames: this.anims.generateFrameNumbers('fork', { frames: [
                    'place0000', 'place0001', 'place0002', 'place0003', 'place0004', 'place0005', 'held_empty'
                ] }),
                frameRate: 24
            });
            fork.on('pointerover', function (pointer)
            {
                if (handCurrent === HAND.empty) {
                    if (straw1.frame.name !== 'frame0000' && straw2.frame.name !== 'frame0000' && straw3.frame.name !== 'frame0000') {
                        this.setFrame('hover_use');
                        forkText.text = localeData.txtRollOverPitchFork;
                        forkText.setAlpha(1)
                    }
                    else {
                        this.setFrame('hover_wait');
                        forkText.text = localeData.txtPitchForkHilite2;
                        forkText.setAlpha(1)
                    }
                    hover2.play();
                }
            });
            fork.on('pointerout', function (pointer) { pointeroutNew(fork, forkText) });
            fork.on('pointerdown', function (pointer)
            {
                if (handCurrent === HAND.empty) {
                    handCurrent = HAND.fork;
                    this.setFrame('in_use')
                    forkText.setAlpha(0)
                    pickup.play();
                }
                else if (handCurrent === HAND.fork || handCurrent === HAND.forkFilled) {
                    handCurrent = HAND.empty;
                    this.setFrame('idle')
                    forkText.setAlpha(0)
                }
            });
            

        // Shovel
        const shovel = this.add.sprite(742, 189, 'shovel', 'idle').setInteractive({ pixelPerfect: true });
        const shovelSound = this.sound.add('shovel_sound');
        const shovelText = this.add.text(620, 245, 'Static Text Object', hoverTextSettings).setAlpha(0);
        shovelText.text = localeData.txtShovelHilite2;
            this.anims.create({
                key: 'shovel_pickup',
                frames: this.anims.generateFrameNumbers('shovel', { frames: [
                    'hold0000', 'hold0001', 'held'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'shovel_scoop',
                frames: this.anims.generateFrameNumbers('shovel', { frames: [
                    'held',
                    'scoop0000', 'scoop0001', 'scoop0002', 'scoop0003', 'scoop0004', 'scoop0005', 'scoop0006', 'scoop0007', 'scoop0008', 'scoop0009',
                    'scoop0010', 'scoop0011', 'scoop0012',
                    'held'
                ] }),
                frameRate: 24
            });
            shovel.on('pointerover', function (pointer)
            {
                if (handCurrent === HAND.empty) {
                    if (straw1.frame.name !== 'frame0000' && straw2.frame.name !== 'frame0000' && straw3.frame.name !== 'frame0000') {
                        this.setFrame('hover_done');
                        shovelText.text = localeData.txtShovelHilite2;
                        shovelText.setAlpha(1)
                    }
                    else {
                        this.setFrame('hover_use');
                        shovelText.text = localeData.txtRollOverShovel;
                        shovelText.setAlpha(1)
                    }
                    hover2.play();
                }
            });
            shovel.on('pointerout', function (pointer) { pointeroutNew (shovel, shovelText) });
            shovel.on('pointerdown', function (pointer)
            {
                if (handCurrent === HAND.empty) {
                    handCurrent = HAND.shovel;
                    shovel.setFrame('in_use')
                    shovelText.setAlpha(0)
                    pickup.play();
                }
                else if (handCurrent === HAND.shovel) {
                    handCurrent = HAND.empty;
                    shovel.setFrame('idle')
                    shovelText.setAlpha(0)
                }
            });


        // Brush
        const brush = this.add.sprite(767, 100, 'brush', 'idle').setScale(0.75);
        const brushInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(753, 88, 40, 50), Phaser.Geom.Rectangle.Contains);
        const brushSound = this.sound.add('brush_sound');
            this.anims.create({
                key: 'brush_pickup',
                frames: this.anims.generateFrameNumbers('brush', { frames: [
                    'pickup0000', 'pickup0001', 'pickup0002', 'pickup0003', 'pickup0004', 'pickup0005',
                    'in_use'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'brush',
                frames: this.anims.generateFrameNumbers('brush', { frames: [
                    'hold',
                    'brush0000', 'brush0001', 'brush0002', 'brush0003', 'brush0004', 'brush0005', 'brush0006', 'brush0007', 'brush0008', 'brush0009',
                    'hold'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'brush_place',
                frames: this.anims.generateFrameNumbers('brush', { frames: [
                    'place0000', 'place0001', 'place0002', 'place0003', 'place0004', 'place0005', 'place0006'
                ] }),
                frameRate: 24
            });
            brushInteractive.on('pointerdown', function (pointer)
            {
                if (handCurrent === HAND.empty) {
                    handCurrent = HAND.brush;
                    brush.play('brush_pickup')
                    pickup.play();
                }
                else if (handCurrent === HAND.brush) {
                    handCurrent = HAND.empty;
                    brush.play('brush_place')
                }
            });
            brushInteractive.on('pointerover', function (pointer) { pointerover (brush, hover1)});
            brushInteractive.on('pointerout', function (pointer) { pointerout (brush)});

        // Small Brush
        const brushSmall = this.add.sprite(746, 64, 'brush_small', 'idle');
        const brushSmallInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(753, 54, 40, 28), Phaser.Geom.Rectangle.Contains);
        const brushSoundSmall = this.sound.add('brush_sound_small');
            this.anims.create({
                key: 'brush_pickup_small',
                frames: this.anims.generateFrameNumbers('brush_small', { frames: [
                    'pickup0000', 'pickup0001', 'pickup0002', 'pickup0003', 'pickup0004', 'pickup0005',
                    'in_use'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'brush_small',
                frames: this.anims.generateFrameNumbers('brush_small', { frames: [
                    'hold',
                    'brush0000', 'brush0001', 'brush0002', 'brush0003', 'brush0004', 'brush0005', 'brush0006', 'brush0007', 'brush0008', 'brush0009', 'brush0010',
                    'hold'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'brush_place_small',
                frames: this.anims.generateFrameNumbers('brush_small', { frames: [
                    'place0000', 'place0001', 'place0002', 'place0003', 'place0004', 'place0005',
                    'idle'
                ] }),
                frameRate: 24
            });
            brushSmallInteractive.on('pointerdown', function (pointer)
            {
                if (handCurrent === HAND.empty) {
                    handCurrent = HAND.brushSmall;
                    brushSmall.play('brush_pickup_small')
                    pickup.play();
                }
                else if (handCurrent === HAND.brushSmall) {
                    handCurrent = HAND.empty;
                    brushSmall.play('brush_place_small')
                }
            });
            brushSmallInteractive.on('pointerover', function (pointer){ pointerover (brushSmall, hover1) });
            brushSmallInteractive.on('pointerout', function (pointer) { pointerout (brushSmall) });

        // Hoofpick
        const hoofpick = this.add.sprite(823, 80, 'hoofpick', 'idle').setScale(0.75);
        const hoofpickInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(801, 60, 26, 75), Phaser.Geom.Rectangle.Contains);
        hoofpick1 = this.sound.add('hoofpick1');
        hoofpick2 = this.sound.add('hoofpick2');
            this.anims.create({
                key: 'hoofpick_pickup',
                frames: this.anims.generateFrameNumbers('hoofpick', { frames: [
                    'pickup0000', 'pickup0001', 'pickup0002', 'pickup0003', 'pickup0004', 'pickup0005', 'held'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'hoofpick_use',
                frames: this.anims.generateFrameNumbers('hoofpick', { frames: [
                    'use0000', 'use0001', 'use0002', 'use0003', 'use0004', 'use0005', 'use0006', 'use0007', 'use0008', 'use0009',
                    'use0010', 'use0011', 'use0012', 'use0012',
                    'held'
                ] }),
                frameRate: 24
            });
            hoofpickInteractive.on('pointerdown', function (pointer)
            {
                if (handCurrent === HAND.empty) {
                    handCurrent = HAND.hoofpick;
                    hoofpick.setFrame('in_use')
                    pickup.play();
                }
                else if (handCurrent === HAND.hoofpick) {
                    handCurrent = HAND.empty;
                    hoofpick.setFrame('idle')
                }
                hooves1.setVisible(handCurrent === HAND.hoofpick)
                hooves2.setVisible(handCurrent === HAND.hoofpick)
            });
            hoofpickInteractive.on('pointerover', function (pointer) { pointerover (hoofpick, hover1) });
            hoofpickInteractive.on('pointerout', function (pointer) { pointerout (hoofpick)});


        // Hoof highlight circles
        const hooves1 = this.add.sprite(316, 445, 'hooves', 0).setInteractive().setScale(.84).setVisible(false);
        const hooves2 = this.add.sprite(531, 445, 'hooves', 0).setInteractive().setScale(.84).setVisible(false);
            /**
             * Updates the hoofpick highlight circle to show the next stage, plays the hoofpick use animation
             * and updates the hhorse stat bars if the hooves (at the highlight sprite) need to be cleaned.
             * @param {sprite} sprite The hoof highlight sprite being interacted with
             */
            function cleanHooves(sprite) {
                if (sprite.frame.name <2 && handCurrent === HAND.hoofpick) {
                    sprite.setFrame(sprite.frame.name + 1)
                    checkClean()
                    hoofpickHeldSprite.play('hoofpick_use')
                    updateBar(cleanlinessBar, 0.25)
                    updateBar(happinessBar, 1/8)
                }
            }
            hooves1.on('pointerdown', function (pointer) { cleanHooves(hooves1) });
            hooves2.on('pointerdown', function (pointer) { cleanHooves(hooves2) });


            // Apple Bin
            const appleBin = this.add.image(680, 505, 'apple_bin', 'idle').setInteractive();
            appleMunch = this.sound.add('apple_munch');
                appleBin.on('pointerover', function (pointer) { pointerover (appleBin, hover1) });
                appleBin.on('pointerout', function (pointer) { appleBin.setFrame('idle') });
                appleBin.on('pointerdown', function (pointer)
                {
                    if (handCurrent === HAND.empty) {
                        handCurrent = HAND.apple;
                        appleBin.setFrame('idle')
                        pickup.play();
                    }
                });
            
            // Grain Bin
            const grainBin = this.add.sprite(736, 413, 'grain_bin', 'idle').setInteractive({ pixelPerfect: true });
            const grainSound = this.sound.add('grain_sound');
            const grainText = this.add.text(610, 325, 'Static Text Object', hoverTextSettings).setAlpha(0);
                grainText.text = localeData.txtOatsRollOver;
                this.anims.create({
                    key: 'pickup',
                    frames: this.anims.generateFrameNumbers('grain_bin', { frames: [
                        'idle',
                        'pickup0000', 'pickup0001', 'pickup0002', 'pickup0003', 'pickup0004', 'pickup0005', 'pickup0006', 'pickup0007', 'pickup0008', 'pickup0009', 'pickup0010',
                        'pickup0011', 'pickup0012', 'pickup0013', 'pickup0013', 'pickup0015', 'pickup0016', 'pickup0017',
                        'empty'
                    ] }),
                    frameRate: 24
                });
                this.anims.create({
                    key: 'place',
                    frames: this.anims.generateFrameNumbers('grain_bin', { frames: [
                        'empty',
                        'place0000', 'place0001', 'place0002', 'place0003', 'place0004', 'place0005', 'place0006', 'place0007',
                        'idle'
                    ] }),
                    frameRate: 24
                });
                grainBin.on('pointerover', function (pointer) { pointeroverNew (grainBin, hover2, grainText) });
                grainBin.on('pointerout', function (pointer)
                {
                    if (handCurrent === HAND.grainScoop) {
                        grainBin.setFrame('empty')
                        grainText.setAlpha(0)
                    }
                    else {
                        grainBin.setFrame('idle')
                        grainText.setAlpha(0)
                    }
                });
                grainBin.on('pointerdown', function (pointer)
                {
                    if (handCurrent === HAND.empty) {
                        handCurrent = HAND.grainScoop
                        grainText.setAlpha(0)
                        grainBin.play('pickup')
                        pickup.play();
                        grainSound.play()
                    }
                });

        
        troughMask = this.add.sprite(153, 455, 'trough_mask', 'water0000').setVisible(false);
            this.anims.create({
                key: 'mask_fill_water',
                frames: this.anims.generateFrameNumbers('trough_mask', { frames: [
                    'water0011', 'water0011', 'water0011',
                    'water0014', 'water0014',
                    'water0016', 'water0016',
                    'water0018', 'water0019', 'water0020', 'water0021', 'water0022', 'water0023', 'water0024', 'water0025', 'water0025',
                    'water0027', 'water0028', 'water0029', 'water0030', 'water0031', 'water0032', 'water0033', 'water0034', 'water0035',
                    'water0036', 'water0037', 'water0038', 'water0039', 'water0040', 'water0041', 'water0042', 'water0043', 'water0044',
                    'water0045', 'water0046', 'water0047', 'water0048', 'water0049', 'water0050', 'water0051', 'water0052', 'water0053',
                    'water0054', 'water0055', 'water0056', 'water0057', 'water0058', 'water0059', 'water0060'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'mask_water_trough_drink',
                frames: this.anims.generateFrameNumbers('trough_mask', { frames: [
                    'water0060', 'water0060', 'water0060',
                    'water0060', 'water0060', 'water0060', 'water0060', 'water0060', 'water0060', 'water0060', 'water0060', 'water0060', 'water0060',
                    'water0092', 'water0093', 'water0094', 'water0095', 'water0096', 'water0097', 'water0098', 'water0099', 'water0100',
                    'water0101', 'water0102', 'water0103', 'water0104', 'water0105', 'water0106', 'water0107', 'water0108', 'water0109', 'water0110',
                    'water0111', 'water0112', 'water0113', 'water0114', 'water0115', 'water0116', 'water0117', 'water0118', 'water0119', 'water0120',
                    'water0121', 'water0121', 'water0122', 'water0123', 'water0124', 'water0125', 'water0126'
                ] }),
                frameRate: 24
            });


        // Lucky Horseshoe
        const luck = this.add.sprite(453, 268, 'luck', 'idle').setInteractive({ pixelPerfect: true });
        const luckSound = this.sound.add('luck_sound');
            this.anims.create({
                key: 'good_luck',
                frames: this.anims.generateFrameNumbers('luck', { frames: [
                    'idle',
                    'good_luck0000', 'good_luck0001', 'good_luck0002', 'good_luck0003', 'good_luck0004', 'good_luck0005', 'good_luck0006', 'good_luck0007', 'good_luck0008', 'good_luck0009',
                    'good_luck0010', 'good_luck0011', 'good_luck0012', 'good_luck0013', 'good_luck0014', 'good_luck0015', 'good_luck0016', 'good_luck0017', 'good_luck0018', 'good_luck0019',
                    'good_luck0020', 'good_luck0021', 'good_luck0022', 'good_luck0023', 'good_luck0024', 'good_luck0025', 'good_luck0026', 'good_luck0027', 'good_luck0028', 'good_luck0029',
                    'good_luck0030', 'good_luck0031', 'good_luck0032', 'good_luck0033', 'good_luck0034', 'good_luck0035', 'good_luck0036', 'good_luck0037', 'good_luck0038', 'good_luck0039',
                    'good_luck0040', 'good_luck0041', 'good_luck0042',
                    'idle'
                ] }),
                frameRate: 24
            });
            luck.on('pointerdown', function (pointer)
            {
                if (luck.frame.name === 'hover') {
                    luck.play('good_luck')
                    luckSound.play()
                }
            });
            luck.on('pointerover', function (pointer)
            {
                if (luck.frame.name === 'idle') {
                    luck.setFrame('hover')
                    hover1.play();
                }
            });
            luck.on('pointerout', function (pointer)
            {
                if (luck.frame.name === 'hover') {
                    luck.setFrame('idle')
                }
            });



        // ---------- Stable foreground and UI ---------- //
        this.add.image(444, 261, 'stable_fg');


        // Inspirational message
        inspiration = this.add.image(430, 150, 'inspiration').setScale(.93).setVisible(false);
        inspirationMessage = this.add.text(444, 133, 'Static Text Object', { 
            fontFamily: 'Arial', 
            fontSize: 55, 
            color: '#ffffff', 
            align: 'center' ,
            wordWrap: { width: 800 } 
        }).setVisible(false);
        inspirationMessage.text = localeData[horseName + "Quote"];
        inspirationMessage.setOrigin(0.5)
        inspirationMessage.setShadow(2, 2, '#000000', 7, true, true)


        // Horse name
        const horseNameText = this.add.text(444, 133, 'Static Text Object', { fontFamily: 'Arial', fontSize: 12, color: '#ffffff', align: 'center' });
        horseNameText.text = localeData[horseName + "Name"];
        horseNameText.setPosition(444-horseNameText.width/2, 478-horseNameText.height/2)

        // Buttons
        // music button
        const musicButton = this.add.sprite(867, 498, 'music_button', 'music_on').setInteractive({ pixelPerfect: true });
            musicButton.on('pointerdown', function (pointer)
            {
                if (playMusic) {
                    backgroundMusic.stop()
                    this.setFrame('music_off_hover')
                }
                else {
                    backgroundMusic.play()
                    this.setFrame('music_on_hover')
                }
                playMusic = !playMusic
            });
            musicButton.on('pointerover', function (pointer) { this.setFrame(`music_${playMusic ? 'on' : 'off'}_hover`) });
            musicButton.on('pointerout', function (pointer) { this.setFrame(`music_${playMusic ? 'on' : 'off'}`) });
        // help button
        const helpButton = this.add.sprite(444, 261, 'help_button', 'idle').setInteractive(this.input.makePixelPerfect(150));
            helpButton.on('pointerover', function (pointer) { this.setFrame('help') });
            helpButton.on('pointerout', function (pointer) { this.setFrame('idle') });


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


        // ---------- Held items ---------- //
        forkHeldSprite = this.add.sprite(735, 240, 'fork').setVisible(false);
        shovelHeldSprite = this.add.sprite(759, 272, 'shovel').setVisible(false);
        grainHeldSprite = this.add.image(759, 272, 'grain_scoop').setVisible(false);
        brushHeldSprite = this.add.sprite(759, 272, 'brush', 'hold').setVisible(false);
        brushSmallHeldSprite = this.add.sprite(759, 272, 'brush_small', 'hold').setVisible(false);
        hoofpickHeldSprite = this.add.sprite(759, 272, 'hoofpick').setVisible(false);
        appleHeldSprite = this.add.image(759, 272, 'apple_held').setVisible(false);
    }

    update ()
    {
        const pointer = this.input.activePointer;
            
        // clear held items from display
        function clearCursor() {
            shovelHeldSprite.setVisible(false);
            forkHeldSprite.setVisible(false);
            grainHeldSprite.setVisible(false);
            brushHeldSprite.setVisible(false);
            brushSmallHeldSprite.setVisible(false);
            hoofpickHeldSprite.setVisible(false);
            appleHeldSprite.setVisible(false);
        }

        // display held items under cursor
        if (handCurrent === HAND.shovel) {
            shovelHeldSprite.setPosition(pointer.worldX-18, pointer.worldY+35);
            if (!shovelHeldSprite.visible) {
                shovelHeldSprite.setVisible(true).play('shovel_pickup');
            }
        }
        else if (handCurrent === HAND.fork) {
            forkHeldSprite.setPosition(pointer.worldX-20, pointer.worldY+45)
            if (!forkHeldSprite.visible) {
                forkHeldSprite.setVisible(true).play('fork_pickup');
            }
            else if (forkHeldSprite.anims.getName() === 'fork_fill') {
                forkHeldSprite.play('fork_place')
            }
        }
        else if (handCurrent === HAND.forkFilled) {
            forkHeldSprite.setPosition(pointer.worldX-20, pointer.worldY+45)
            if (forkHeldSprite.anims.getName() === 'fork_pickup' || forkHeldSprite.anims.getName() === 'fork_place') {
                forkHeldSprite.play('fork_fill')
            }
        }
        else if (handCurrent === HAND.grainScoop) {
            grainHeldSprite.setPosition(pointer.worldX, pointer.worldY)
            if (!grainHeldSprite.visible) {
                grainHeldSprite.setAlpha(0).setVisible(true)
                this.time.delayedCall(630, function () {grainHeldSprite.setAlpha(.5)});
                this.time.delayedCall(670, function () {grainHeldSprite.setAlpha(.7)});
                this.time.delayedCall(710, function () {grainHeldSprite.setAlpha(.9)});
                this.time.delayedCall(750, function () {grainHeldSprite.setAlpha(1)});
            }
            
        }
        else if (handCurrent === HAND.brush) {
            brushHeldSprite.setPosition(pointer.worldX-5, pointer.worldY+20);
            if (!brushHeldSprite.visible) {
                brushHeldSprite.setAlpha(0).setVisible(true)
                this.time.delayedCall(250, function () {brushHeldSprite.setAlpha(1)});
            }
        }
        else if (handCurrent === HAND.brushSmall) {
            brushSmallHeldSprite.setPosition(pointer.worldX-8, pointer.worldY+8);
            if (!brushSmallHeldSprite.visible) {
                brushSmallHeldSprite.setAlpha(0).setVisible(true)
                this.time.delayedCall(250, function () {brushSmallHeldSprite.setAlpha(1)});
            }
        }
        else if (handCurrent === HAND.hoofpick) {
            hoofpickHeldSprite.setPosition(pointer.worldX, pointer.worldY);
            if (!hoofpickHeldSprite.visible) {
                hoofpickHeldSprite.setVisible(true).play('hoofpick_pickup');
            }
        }
        else if (handCurrent === HAND.apple) {
            clearCursor()
            appleHeldSprite.setVisible(true).setPosition(pointer.worldX, pointer.worldY);
        }
        else {
            clearCursor()
        }


        if (hoofpickHeldSprite.anims.getName() === 'hoofpick_use' && hoofpickHeldSprite.anims.getProgress() === 0) {
            this.time.delayedCall(80, function () {hoofpick1.play()});
            this.time.delayedCall(380, function () {hoofpick2.play()});
        }


        if (horseBusy === false && horseAnimationQueue.length > 0) {
            const animation = horseAnimationQueue.shift()
            horseBusy = true

            if (animation === HORSE_STATES.rear) {
                rearSound.play();
                horse.animationState.setAnimation(0, 'rear', false);
                horseDirty.animationState.setAnimation(0, 'rear', false);
                horseOverlay.animationState.setAnimation(0, 'rear', false);
            } 
            else if (animation === HORSE_STATES.drink) {
                this.time.delayedCall(2800, function () {
                    troughMask.setVisible(true)
                    trough.play('water_trough_drink')
                    troughMask.play('mask_water_trough_drink')
                    horse.animationState.setAnimation(0, 'drink', false);
                    horseDirty.animationState.setAnimation(0, 'drink', false);
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
                    horseDirty.animationState.setAnimation(0, 'eat_food', false);
                    horseOverlay.animationState.setAnimation(0, 'eat_food', false);});
                this.time.delayedCall(1000, function () {oatsEat.play()});
            }
            else if (animation === HORSE_STATES.eatingApple) {
                appleMunch.play();
                horse.animationState.setAnimation(0, 'eat_apple', false);
                horseDirty.animationState.setAnimation(0, 'eat_apple', false);
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