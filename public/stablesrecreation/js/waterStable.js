// Variables to be used throughout scene
playMusic = true;
// const HAND = {
//     empty: 'empty',
//     shovel: 'shovel',
//     fork: 'fork',
//     forkFilled: 'fork_filled',
//     brush: 'brush',
//     brushSmall: 'small_brush',
//     hoofpick: 'hoofpick',
//     apple: 'apple',
//     grainScoop: 'grain_scoop'
// }
handCurrent = HAND.empty;
waterFilled = false;
foodFilled = false;
brushLevel = 0
extraCleanLevel = 0
playInspiration = true
canPlayInspiration = false
soothed = false

horseBusy = false
// const HORSE_STATES = {
//     busy: 'busy',
//     idle: 'idle',
//     drink: 'drink',
//     rear: 'rear',
//     eatingFood: 'eat_food',
//     eatingApple: 'eat_apple'
// }
horseAnimationQueue = []

horse = null
horseDirty = null
horseOverlay= null

rearSound = null
splash1Sound = null
splash2Sound = null
splash3Sound = null
// foodTrough = null
// branch = null
treatDispenser = null
oatsEat = null
appleMunch = null
inspiration = null
// inspirationCloseSound = null
inspirationMessage = null
drainWater = null
water = null
oxygen = null
bubbleSound = null
bubbleReplaceSound = null
foodDispenseSound = null
treatDispenseSound = null

brushHeldSprite = null
brushSmallHeldSprite = null
hoofpickHeldSprite = null
appleHeldSprite = null



// Actual game start
class WaterStable extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: 'waterStable'
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
        this.load.image('stable_bg', './images/waterStable/stable-bg.png');
        this.load.image('stable_fg', './images/waterStable/stable-fg.png');
        this.load.image('hunger_scale', './images/waterStable/hunger.png');
        this.load.image('cleanliness_scale', './images/waterStable/cleanliness.png');
        this.load.image('happiness_scale', './images/waterStable/happiness.png');

        this.load.atlas('water', './images/waterStable/water.png', './images/waterStable/water.json');
        this.load.atlas('water_spinner', './images/waterStable/water_spinner.png', './images/waterStable/water_spinner.json');
        this.load.atlas('water_spinner_holder', './images/waterStable/water_spinner_holder.png', './images/waterStable/water_spinner_holder.json');
        
        this.load.atlas('brush', './images/waterStable/brush.png', './images/waterStable/brush.json');
        this.load.atlas('brush_small', './images/waterStable/brush_small.png', './images/waterStable/brush_small.json');
        this.load.atlas('polisher', './images/waterStable/polisher.png', './images/waterStable/polisher.json');
        this.load.atlas('oxygen1', './images/waterStable/oxygen1.png', './images/waterStable/oxygen1.json');
        this.load.atlas('oxygen2', './images/waterStable/oxygen2.png', './images/waterStable/oxygen2.json');
        this.load.atlas('oxygen3', './images/waterStable/oxygen3.png', './images/waterStable/oxygen3.json');
        this.load.atlas('speaker', './images/waterStable/speaker.png', './images/waterStable/speaker.json');
        this.load.atlas('treat_dispenser', './images/waterStable/treat_dispenser.png', './images/waterStable/treat_dispenser.json');
        this.load.image('treatHeld', './images/waterStable/treat_held.png');
        this.load.atlas('food', './images/waterStable/food.png', './images/waterStable/food.json');

        this.load.atlas('temperature_bar', './images/waterStable/temperature_bar.png', './images/waterStable/temperature_bar.json');
        this.load.atlas('temperature_buttons', './images/waterStable/temperature_buttons.png', './images/waterStable/temperature_buttons.json');
        this.load.atlas('temperature_bg', './images/waterStable/temperature_bg.png', './images/waterStable/temperature_bg.json');
        
        this.load.spineAtlas("horse-atlas", `./images/horses/${horseName}/skeleton.atlas`);
        this.load.spineAtlas("horse_overlay-atlas", `./images/horses/${horseName}/skeleton_overlay.atlas`);
        this.load.spineJson("horse-json", `./images/horses/${horseName}/skeleton.json`);
        this.load.spineJson("horse_overlay-json", `./images/horses/${horseName}/skeleton_overlay.json`);
        if (horseName === 'wavebreaker') {
            this.load.spineAtlas("horse_dirty-atlas", `./images/waterStable/hippocampus_dirty/dirt_skeleton.atlas`);
            this.load.spineJson("horse_dirty-json", `./images/waterStable/hippocampus_dirty/dirt_skeleton.json`);
        } else {
            this.load.spineAtlas("horse_dirty-atlas", `./images/waterStable/horse_dirty/dirt_skeleton.atlas`);
            this.load.spineJson("horse_dirty-json", `./images/waterStable/horse_dirty/dirt_skeleton.json`);
        }

        this.load.image('horse_image', `./images/horses/${horseName}/card_image.jpg`);

        this.load.image('frame', './images/waterStable/frame.png');
        this.load.image('inspiration', './images/waterStable/inspiration.png');

        this.load.atlas('music_button', './images/waterStable/music.png', './images/waterStable/music.json');
        this.load.atlas('help_button', './images/waterStable/help.png', './images/waterStable/help.json');

        this.load.audio('background_music', ['./sounds/stable_soundtrack.mp3']);
        this.load.audio('apple_munch', ['./sounds/apple_munch.mp3']);
        this.load.audio('brush_sound', ['./sounds/brush_sound.mp3']);
        this.load.audio('brush_sound_small', ['./sounds/brush_sound_small.mp3']);
        this.load.audio('soothe_sound', ['./sounds/water_soothe_sound.mp3']);
        this.load.audio('soothe_sound_length', ['./sounds/water_soothe_sound_length.mp3']);
        this.load.audio('hover1', ['./sounds/hover1.mp3']);
        this.load.audio('hover2', ['./sounds/hover1.mp3']);
        this.load.audio('inspiration_hover', ['./sounds/inspiration_hover.mp3']);
        this.load.audio('inspiration_sound', ['./sounds/inspiration.mp3']);
        this.load.audio('inspiration_close', ['./sounds/inspiration_close.mp3']);
        this.load.audio('food_dispense_sound', ['./sounds/food_drop.mp3']);
        this.load.audio('treat_dispense_sound', ['./sounds/treat_dispense.mp3']);
        this.load.audio('pickup', ['./sounds/pickup.mp3']);

        this.load.audio('oats_eat', ['./sounds/oats_eat.mp3']);
        this.load.audio('rear_sound', ['./sounds/rear.mp3']);
        this.load.audio('water_splash1', ['./sounds/water_splash1.mp3']);
        this.load.audio('water_splash2', ['./sounds/water_splash2.mp3']);
        this.load.audio('water_splash3', ['./sounds/water_splash3.mp3']);

        this.load.audio('bubble_click', ['./sounds/bubble_click.mp3']);
        this.load.audio('bubble_new', ['./sounds/bubble_new.mp3']);
        this.load.audio('bubbles', ['./sounds/bubbles.mp3']);
        this.load.audio('polisher_use', ['./sounds/polisher.mp3']);
        this.load.audio('drain_water', ['./sounds/drain_water.mp3']);
        this.load.audio('temperature_change', ['./sounds/temperature_change.mp3']);
        this.load.audio('temperature_perfect', ['./sounds/temperature_perfect.mp3']);
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

        splash1Sound = this.sound.add('water_splash1');
        splash2Sound = this.sound.add('water_splash2');
        splash3Sound = this.sound.add('water_splash3');

        
        // Temp Change BG
        const temperatureBG = this.add.sprite(560, 110, 'temperature_bg', 'idle').setScale(1.02)
            this.anims.create({
                key: 'BG_cool',
                frames: this.anims.generateFrameNumbers('temperature_bg', { frames: [
                    'cool0000', 'cool0001', 'cool0002', 'cool0003', 'cool0004', 'cool0005', 'cool0006', 'cool0007', 'cool0008', 'cool0009',
                    'cool0010', 'cool0011', 'cool0012', 'cool0013', 'cool0014', 'cool0015', 'cool0016', 'cool0017', 'cool0018', 'cool0019',
                    'cool0020', 'cool0021', 'cool0022', 'cool0023', 'cool0024', 'cool0025', 'cool0026', 'cool0027', 'cool0028', 'cool0029',
                    'cool0030', 'cool0031', 'cool0032', 'cool0033', 'cool0034', 'cool0035', 'cool0036', 'cool0037', 'cool0038', 'cool0039',
                    'cool0040', 'cool0041', 'cool0042', 'cool0043', 'cool0044', 'cool0045', 'cool0046', 'cool0047', 'cool0048', 'cool0049',
                    'cool0050', 'cool0051', 'cool0052', 'cool0053', 'cool0054', 'cool0055', 'cool0056', 'cool0057', 'cool0058', 'cool0059',
                    'cool0060', 'cool0061', 'cool0062', 'cool0063', 'cool0064', 'cool0065', 'cool0066',
                    'idle'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'BG_heat',
                frames: this.anims.generateFrameNumbers('temperature_bg', { frames: [
                    'heat0000', 'heat0001', 'heat0002', 'heat0003', 'heat0004', 'heat0005', 'heat0006', 'heat0007', 'heat0008', 'heat0009',
                    'heat0010', 'heat0011', 'heat0012', 'heat0013', 'heat0014', 'heat0015', 'heat0016', 'heat0017', 'heat0018', 'heat0019',
                    'heat0020', 'heat0021', 'heat0022', 'heat0023', 'heat0024', 'heat0025', 'heat0026', 'heat0027', 'heat0028', 'heat0029',
                    'heat0030', 'heat0031', 'heat0032', 'heat0033', 'heat0034', 'heat0035', 'heat0036', 'heat0037', 'heat0038', 'heat0039',
                    'heat0040', 'heat0041', 'heat0042', 'heat0043', 'heat0044', 'heat0045', 'heat0046', 'heat0047', 'heat0048', 'heat0049',
                    'heat0050', 'heat0051', 'heat0052', 'heat0053', 'heat0054', 'heat0055', 'heat0056', 'heat0057', 'heat0058', 'heat0059',
                    'heat0060', 'heat0061', 'heat0062', 'heat0063', 'heat0064', 'heat0065', 'heat0066',
                    'idle'
                ] }),
                frameRate: 24
            });


        // Brush
        const brush = this.add.sprite(690, 138, 'brush', 'idle').setScale(0.76).setAngle(90).setInteractive({ pixelPerfect: true });
        // const brushInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(753, 88, 40, 50), Phaser.Geom.Rectangle.Contains);
        const brushSound = this.sound.add('brush_sound');
            this.anims.create({
                key: 'brush_pickup',
                frames: this.anims.generateFrameNumbers('brush', { frames: [
                    'pickup0000', 'pickup0001', 'pickup0002', 'pickup0003', 'pickup0004', 'pickup0005', 'pickup0006',
                    'in_use'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'brush',
                frames: this.anims.generateFrameNumbers('brush', { frames: [
                    'held',
                    'brush0000', 'brush0001', 'brush0002', 'brush0003', 'brush0004', 'brush0005', 'brush0006', 'brush0007', 'brush0008', 'brush0009', 'brush0010',
                    'brush0000', 'brush0011', 'brush0012', 'brush0013', 'brush0014', 'brush0015', 'brush0016',
                    'held'
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
            brush.on('pointerdown', function (pointer)
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
            brush.on('pointerover', function (pointer) { pointerover (brush, hover1)});
            brush.on('pointerout', function (pointer) { pointerout (brush)});

        // Small Brush
        const brushSmall = this.add.sprite(702, 119, 'brush_small', 'idle').setAngle(90).setInteractive({ pixelPerfect: true });
        const brushSoundSmall = this.sound.add('brush_sound_small');
            this.anims.create({
                key: 'brush_pickup_small',
                frames: this.anims.generateFrameNumbers('brush_small', { frames: [
                    'pickup0000', 'pickup0001', 'pickup0002', 'pickup0003', 'pickup0004', 'pickup0005', 'pickup0006',
                    'in_use'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'brush_small',
                frames: this.anims.generateFrameNumbers('brush_small', { frames: [
                    'held',
                    'brush0000', 'brush0001', 'brush0002', 'brush0003', 'brush0004', 'brush0005', 'brush0006', 'brush0007', 'brush0008', 'brush0009', 'brush0010',
                    'brush0000', 'brush0011', 'brush0012', 'brush0013', 'brush0014', 'brush0015', 'brush0016',
                    'held'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'brush_place_small',
                frames: this.anims.generateFrameNumbers('brush_small', { frames: [
                    'pickup0006', 'place0001', 'place0002', 'place0003', 'place0004', 'place0005', 'place0006',
                    'idle'
                ] }),
                frameRate: 24
            });
            brushSmall.on('pointerdown', function (pointer)
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
            brushSmall.on('pointerover', function (pointer){ pointerover (brushSmall, hover1) });
            brushSmall.on('pointerout', function (pointer) { pointerout (brushSmall) });

        // // Hoofpick
        const hoofpick = this.add.sprite(750, 199, 'polisher', 'idle').setFlipX(true).setScale(.8)
        const hoofpickInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(614, 183, 100, 50), Phaser.Geom.Rectangle.Contains);
        const polisherSound = this.sound.add('polisher_use');
            this.anims.create({
                key: 'polisher_pickup',
                frames: this.anims.generateFrameNumbers('polisher', { frames: [
                    'pickup0000', 'pickup0001', 'pickup0002', 'pickup0003', 'pickup0004',
                    'in_use'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'polisher_place',
                frames: this.anims.generateFrameNumbers('polisher', { frames: [
                    'place0000', 'place0001', 'place0002', 'place0003', 'place0004', 'place0005', 'place0006', 'place0007', 'place0008',
                    'idle'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'polisher_use',
                frames: this.anims.generateFrameNumbers('polisher', { frames: [
                    'polish0000', 'polish0001', 'polish0002', 'polish0003', 'polish0004', 'polish0005', 'polish0006', 'polish0007', 'polish0008', 'polish0009',
                    'polish0010', 'polish0011', 'polish0012', 'polish0013', 'polish0014', 'polish0015', 'polish0016', 'polish0017', 'polish0018', 'polish0019',
                    'polish0020', 'polish0021', 'polish0022', 'polish0023', 'polish0024', 'polish0025', 'polish0026', 'polish0027', 'polish0028', 'polish0029',
                    'polish0030', 'polish0031', 'polish0032', 'polish0033', 'polish0034', 'polish0035', 'polish0036', 'polish0037', 'polish0038', 'polish0039',
                    'polish0040', 'polish0041', 'polish0042', 'polish0043', 'polish0044', 'polish0045', 'polish0046', 'polish0047', 'polish0048', 'polish0049',
                    'polish0050', 'polish0051', 'polish0052', 'polish0053', 'polish0054', 'polish0055', 'polish0056', 'polish0057', 'polish0058', 'polish0059',
                    'polish0060', 'hold'
                ] }),
                frameRate: 24
            });
            hoofpickInteractive.on('pointerdown', function (pointer)
            {
                if (handCurrent === HAND.empty && brushLevel === 3) {
                    handCurrent = HAND.hoofpick;
                    hoofpick.setFrame('in_use')
                    pickup.play();
                }
                else if (handCurrent === HAND.hoofpick) {
                    handCurrent = HAND.empty;
                    hoofpick.play('polisher_place')
                }
            });
            hoofpickInteractive.on('pointerover', function (pointer) { 
                if (handCurrent === HAND.empty && brushLevel === 3) {
                    hoofpick.setFrame('hover')
                } else if (handCurrent === HAND.empty && brushLevel !== 3) {
                    hoofpick.setFrame('hover_wait')
                }
             });
             hoofpickInteractive.on('pointerout', function (pointer) { pointerout (hoofpick)});
        

             // Speaker
             const speaker = this.add.sprite(668, 71, 'speaker', 'idle').setInteractive();
             const sootheSound = this.sound.add('soothe_sound');
             const sootheSoundLength = this.sound.add('soothe_sound_length');
                 this.anims.create({
                     key: 'soothe',
                     frames: this.anims.generateFrameNumbers('speaker', { frames: [
                         'play0000', 'play0001', 'play0002', 'play0003', 'play0004', 'play0005', 'play0006', 'play0007', 'play0008', 'play0009',
                         'play0010', 'play0011', 'play0012', 'play0014',
     
                         'play0014', 'play0013', 'play0012', 'play0011', 'play0010',
                         'play0010', 'play0010', 'play0010', 'play0006', 'play0005', 'play0004', 'play0003', 'play0002', 'play0001', 'play0000',
                         
     
                         'play0000', 'play0001', 'play0002', 'play0003', 'play0004', 'play0005', 'play0006', 'play0007', 'play0008', 'play0009',
                         'play0010', 'play0011', 'play0012', 'play0014',
     
                         'play0014', 'play0013', 'play0012', 'play0011', 'play0010',
                         'play0010', 'play0010', 'play0010', 'play0006', 'play0005', 'play0004', 'play0003', 'play0002', 'play0001', 'play0000',
                         
     
                         'play0000', 'play0001', 'play0002', 'play0003', 'play0004', 'play0005', 'play0006', 'play0007', 'play0008', 'play0009',
                         'play0010', 'play0011', 'play0012', 'play0014',
     
                         'play0014', 'play0013', 'play0012', 'play0011', 'play0010',
                         'play0010', 'play0010', 'play0010', 'play0006', 'play0005', 'play0004', 'play0003', 'play0002', 'play0001', 'play0000',
                         
     
                         'play0000', 'play0001', 'play0002', 'play0003', 'play0004', 'play0005', 'play0006', 'play0007', 'play0008', 'play0009',
                         'play0010', 'play0011', 'play0012', 'play0014',
     
                         'play0014', 'play0013', 'play0012', 'play0011', 'play0010',
                         'play0010', 'play0010', 'play0010', 'play0006', 'play0005', 'play0004', 'play0003', 'play0002', 'play0001', 'play0000',
                         
     
                         'play0000', 'play0001', 'play0002', 'play0003', 'play0004', 'play0005', 'play0006', 'play0007', 'play0008', 'play0009',
                         'play0010', 'play0011', 'play0012', 'play0014',
     
                         'play0014', 'play0013', 'play0012', 'play0011', 'play0010',
                         'play0010', 'play0010', 'play0010', 'play0006', 'play0005', 'play0004', 'play0003', 'play0002', 'play0001', 'play0000',
                         
     
                         'play0000', 'play0001', 'play0002', 'play0003', 'play0004', 'play0005', 'play0006', 'play0007', 'play0008', 'play0009',
                         'play0010', 'play0011', 'play0012', 'play0014',
     
                         'play0014', 'play0013', 'play0012', 'play0011', 'play0010',
                         'play0010', 'play0010', 'play0010', 'play0006', 'play0005', 'play0004', 'play0003', 'play0002', 'play0001', 'play0000',
                         
     
                         'play0000', 'play0001', 'play0002', 'play0003', 'play0004', 'play0005', 'play0006', 'play0007', 'play0008', 'play0009',
                         'play0010', 'play0011', 'play0012', 'play0014',
     
                         'play0014', 'play0013', 'play0012', 'play0011', 'play0010',
                         'play0010', 'play0010', 'play0010', 'play0006', 'play0005', 'play0004', 'play0003', 'play0002', 'play0001', 'play0000',
     
                         'idle'
                     ] }),
                     frameRate: 18
                 });
                 speaker.on('pointerover', function (pointer) { 
                     if (handCurrent === HAND.empty && !soothed) {
                         speaker.setFrame('hover')
                         hover1.play()
                     }
                 });
                 speaker.on('pointerout', function (pointer)
                 {
                     if (handCurrent === HAND.empty && !soothed) {
                         speaker.setFrame('idle')
                     }
                 });
                 speaker.on('pointerdown', function (pointer)
                 {
                     if (handCurrent === HAND.empty && !soothed) {
                         soothed = true
                         speaker.play('soothe')
                         backgroundMusic.stop()
                         sootheSound.play();
                         sootheSoundLength.play();
                         sootheSoundLength.on('complete', function (sound) {
                            if (playMusic) {
                                backgroundMusic.play()
                            }
                         });
                         updateBar(happinessBar, 0.5 + 0.1)
                     }
                 });


            // Horse Interactive
            // this.add.graphics().fillStyle(0x000000).fillRect(230, 110, 376, 345);
            const horseInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(230, 110, 376, 345), Phaser.Geom.Rectangle.Contains);

             
            // Food Dispenser
            foodTrough = this.add.sprite(238, 208, 'food', 'idle').setInteractive({ pixelPerfect: true });
                oatsEat = this.sound.add('oats_eat');
                foodDispenseSound = this.sound.add('food_dispense_sound');
            this.anims.create({
                    key: 'food_dispense',
                    frames: this.anims.generateFrameNumbers('food', { frames: [
                        'feed0000', 'feed0001', 'feed0002', 'feed0003', 'feed0004', 'feed0005', 'feed0006', 'feed0007', 'feed0008', 'feed0009',
                        'feed0010', 'feed0011', 'feed0012', 'feed0013', 'feed0014', 'feed0015', 'feed0016', 'feed0017', 'feed0018', 'feed0019',
                        'feed0020', 'feed0021', 'feed0022', 'feed0023', 'feed0024', 'feed0025', 'feed0026', 'feed0027', 'feed0028', 'feed0029',
                        'feed0030', 'feed0031', 'feed0032', 'feed0033', 'feed0034', 'feed0035', 'feed0036', 'feed0037', 'feed0038', 'feed0039',
                        'feed0040', 'feed0041', 'feed0042', 'feed0043', 'feed0044', 'feed0045', 'feed0046', 'feed0047', 'feed0048', 'feed0049',
                        'feed0050', 'feed0051', 'feed0052', 'feed0053', 'feed0054', 'feed0055', 'feed0056', 'feed0057', 'feed0058', 'feed0059',
                        'feed0060', 'feed0061', 'feed0062', 'feed0063', 'feed0064', 'feed0065', 'feed0066', 'feed0067', 'feed0068', 'feed0069',
                        'feed0070', 'feed0071', 'feed0072', 'feed0073', 'feed0074', 'feed0075', 'feed0076', 'feed0077', 'feed0078', 'feed0079',
                        'feed0080', 'feed0081', 'feed0082', 'feed0083', 'feed0084',
                        'idle'
                    ] }),
                    frameRate: 24
                });
                foodTrough.on('pointerdown', function (pointer)
                {
                    if (handCurrent === HAND.empty) {
                        this.play('food_dispense')
                        horseAnimationQueue.push(HORSE_STATES.eatingFood)
                        if (!foodFilled) {
                            updateBar(hungerBar, 3.5)
                            updateBar(happinessBar, 1.05)
                        }
                        foodFilled = true;
                    }
                });
                foodTrough.on('pointerover', function (pointer) { 
                    if (foodTrough.frame.name === 'idle') {
                        this.setFrame('hover')
                        hover1.play()
                    }
                });
                foodTrough.on('pointerout', function (pointer)
                {
                    if (foodTrough.frame.name === 'hover') {
                        this.setFrame('idle')
                    }
                });


        // Inspirational message frame
        this.add.image(55, 268, 'horse_image').setScale(.44);
        const frame = this.add.image(54, 266, 'frame').setInteractive();
        const inspirationHover = this.sound.add('inspiration_hover');
        const inspirationSound = this.sound.add('inspiration_sound');
        inspirationCloseSound = this.sound.add('inspiration_close');
        // const frameInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(478, 65, 75, 110), Phaser.Geom.Rectangle.Contains);
            frame.on('pointerover', function (pointer)
            {
                if (canPlayInspiration) {
                    inspirationHover.play()
                }
            });
            frame.on('pointerdown', function (pointer) { 
                if (canPlayInspiration) {
                    playInspiration = true 
                    inspirationSound.play()
                }
            })


        //     // Horse hit box
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
                    else if (handCurrent === HAND.hoofpick) {
                        polish()
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
                /**
                 * Updates the feather oil count, plays the feather oil use animation
                 * and updates the horse stat bars if the wings need to be cleaned.
                 */
                function polish() {
                    if (extraCleanLevel <1 && handCurrent === HAND.hoofpick) {
                        extraCleanLevel += 1
                        checkClean()
                        hoofpickHeldSprite.play('polisher_use')
                        polisherSound.play();
                        updateBar(cleanlinessBar, 1)
                    }
                    if (handCurrent === HAND.hoofpick) {
                        hoofpickHeldSprite.play('polisher_use')
                        polisherSound.play();
                    }
                }
                function checkClean() {
                    if (brushLevel === 3 && extraCleanLevel === 1) {
                        horseAnimationQueue.push(HORSE_STATES.rear)
                    }
                }

            // Horse
            horse = this.add.spine(440, 335, 'horse-json', 'horse-atlas').setAngle(90);
            horse.animationState.setAnimation(0, "idle", false)
            horseDirty = this.add.spine(440, 335, 'horse_dirty-json', 'horse_dirty-atlas').setAngle(90);
            horseDirty.animationState.setAnimation(0, "idle", false)
            horseOverlay = this.add.spine(440, 335, 'horse_overlay-json', 'horse_overlay-atlas').setAngle(90);
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
                start: function startAnimation(entry){                    
                    if (entry.animation.name === 'shift_weight' || entry.animation.name === 'paw_ground') {
                        splash1Sound.play()
                    }
                },
                // interrupt: (entry) => console.log(`Interrupted animation ${entry.animation.name}`),
                // end: (entry) => console.log(`Ended animation ${entry.animation.name}`),
                // dispose: (entry) => console.log(`Disposed animation ${entry.animation.name}`),
                complete: function endAnimation(entry) { 
                    if (horseAnimationQueue.length === 0) {
                        const horseIdleAnimations = ['ear_twitch', 'flank_twitch', 'head_shake', 'head_turn', 'paw_ground', 'shift_weight', 'tail_swish']
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

        let temp
        let buttonDisplace
        if (randomIntFromInterval(1, 2) === 1) {
            temp = 'cool'
            buttonDisplace =  72
        } else {
            temp = 'heat'
            buttonDisplace =  -72
        }
        let tempWrong = randomIntFromInterval(1, 5)
        const temperatureBar = this.add.sprite(59, 101, 'temperature_bar', `${temp}_${tempWrong}`).setScale(1.02)
        const temperatureButtons = this.add.sprite(55, 101 + buttonDisplace, 'temperature_buttons', `${temp}_idle`).setScale(1.02).setInteractive()
        const tempChange = this.sound.add('temperature_change');
        const tempPerfect = this.sound.add('temperature_perfect');
            temperatureButtons.on('pointerover', function (pointer) { 
                if (temperatureButtons.frame.name === `${temp}_idle`) {
                    this.setFrame(`${temp}_hover`)
                }
            });
            temperatureButtons.on('pointerout', function (pointer)
            {
                if (temperatureButtons.frame.name === `${temp}_hover`) {
                    this.setFrame(`${temp}_idle`)
                    hover1.play()
                }
            });
            temperatureButtons.on('pointerdown', function (pointer)
            {
                if (tempWrong !== 0) {
                    tempWrong = tempWrong - 1
                    if (tempWrong) {
                        temperatureBar.setFrame(`${temp}_${tempWrong}`)
                    } else {
                        temperatureButtons.setVisible(false)
                        temperatureBar.setFrame('perfect')
                        tempPerfect.play()
                    }
                    updateBar(happinessBar, 0.2)
                    tempChange.play()
                    temperatureBG.play(`BG_${temp}`)
                }
            });




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
        /**
         * Displays the 'idle' frame of a sprite if the hand is empty
         * @param {sprite} sprite The sprite to change
         */
        function pointerout(sprite) {
            if (handCurrent === HAND.empty) {
                sprite.setFrame('idle')
            }
        }


        // Treats
        treatDispenser = this.add.sprite(52, 435, 'treat_dispenser', 'idle').setInteractive();
            treatDispenseSound = this.sound.add('treat_dispense_sound');
            appleMunch = this.sound.add('apple_munch');
            this.anims.create({
                key: 'treat_pickup',
                frames: this.anims.generateFrameNumbers('treat_dispenser', { frames: [
                    'dispense0000', 'dispense0001', 'dispense0002', 'dispense0003', 'dispense0004', 'dispense0005', 'dispense0006', 'dispense0007', 'dispense0008', 'dispense0009',
                    'dispense0010', 'dispense0011', 'dispense0012', 'dispense0013', 'dispense0014', 'dispense0015', 'dispense0016',
                    'idle'
                ] }),
                frameRate: 24
            });
            treatDispenser.on('pointerover', function (pointer) { pointerover (treatDispenser, hover1) });
            treatDispenser.on('pointerout', function (pointer) { treatDispenser.setFrame('idle') });
            treatDispenser.on('pointerdown', function (pointer)
            {
                if (handCurrent === HAND.empty) {
                    handCurrent = HAND.apple;
                    treatDispenser.play('treat_pickup')
                    pickup.play();
                }
            });

        // Bubbles
        oxygen = this.add.sprite(525, 75, 'oxygen3', 'idle').setInteractive({ pixelPerfect: true });
        bubbleSound = this.sound.add('bubbles');
        bubbleReplaceSound = this.sound.add('bubble_new');
        const bubbleClick = this.sound.add('bubble_click');
            this.anims.create({
                    key: 'oxygen1',
                    frames: this.anims.generateFrameNumbers('oxygen1', { frames: [
                        'bubbles0000', 'bubbles0001', 'bubbles0002', 'bubbles0003', 'bubbles0004', 'bubbles0005', 'bubbles0006', 'bubbles0007', 'bubbles0008', 'bubbles0009',
                        'bubbles0010', 'bubbles0011', 'bubbles0012', 'bubbles0013', 'bubbles0014', 'bubbles0015', 'bubbles0016', 'bubbles0017', 'bubbles0018', 'bubbles0019',
                        'bubbles0020', 'bubbles0021', 'bubbles0022', 'bubbles0023', 'bubbles0024', 'bubbles0025', 'bubbles0026', 'bubbles0027', 'bubbles0028', 'bubbles0029',
                        'bubbles0030', 'bubbles0031', 'bubbles0032', 'bubbles0033', 'bubbles0034', 'bubbles0035'
                    ] }),
                    frameRate: 24,
                });
                
        this.anims.create({
            key: 'oxygen2',
            frames: this.anims.generateFrameNumbers('oxygen2', { frames: [
                'bubbles0036', 'bubbles0037', 'bubbles0038', 'bubbles0039',
                'bubbles0040', 'bubbles0041', 'bubbles0042', 'bubbles0043', 'bubbles0044', 'bubbles0045', 'bubbles0046', 'bubbles0047', 'bubbles0048', 'bubbles0049',
                'bubbles0050', 'bubbles0051', 'bubbles0052', 'bubbles0053', 'bubbles0054', 'bubbles0055', 'bubbles0056', 'bubbles0057', 'bubbles0058', 'bubbles0059',
                'bubbles0060', 'bubbles0061', 'bubbles0062', 'bubbles0063', 'bubbles0064', 'bubbles0065', 'bubbles0066', 'bubbles0067', 'bubbles0068', 'bubbles0069',
                'bubbles0070', 'bubbles0071'
            ] }),
            frameRate: 24,
        });
        this.anims.create({
                key: 'oxygen3',
                frames: this.anims.generateFrameNumbers('oxygen3', { frames: [
                    'bubbles0072', 'bubbles0073', 'bubbles0074', 'bubbles0075', 'bubbles0076', 'bubbles0077', 'bubbles0078', 'bubbles0079',
                    'bubbles0080', 'bubbles0081', 'bubbles0082', 'bubbles0083', 'bubbles0084', 'bubbles0085', 'bubbles0086', 'bubbles0087', 'bubbles0088', 'bubbles0089',
                    'bubbles0090', 'bubbles0091', 'bubbles0092', 'bubbles0093', 'bubbles0094', 'bubbles0095', 'bubbles0096', 'bubbles0097', 'bubbles0098', 'bubbles0099',
                    'bubbles0100', 'bubbles0101', 'bubbles0102', 'bubbles0103', 'bubbles0104',
                    'idle'
                ] }),
                frameRate: 24,
            });
            oxygen.on('pointerover', function (pointer) { pointerover(oxygen, hover1) });
            oxygen.on('pointerout', function (pointer)
            {
                if (handCurrent === HAND.empty) {
                    oxygen.setTexture('oxygen3', 'idle')
                    // oxygen.setFrame('idle')
                }
            });
            oxygen.on('pointerdown', function (pointer)
            {
                if (handCurrent === HAND.empty) {
                    oxygen.play('oxygen1')
                    bubbleClick.play()
                    if (!waterFilled) {
                        waterFilled = true
                        updateBar(happinessBar, 1/4)
                    }
                }
            });

        

        // Dirty Water
        const waterSpinnerHolder = this.add.sprite(865, 54, 'water_spinner_holder', 'idle').setInteractive({ pixelPerfect: true });
        const waterSpinner = this.add.sprite(800, 57, 'water_spinner', '1').setInteractive({ pixelPerfect: true });
        drainWater = this.sound.add('drain_water');
        this.anims.create({
                key: 'water_spinner',
                frames: this.anims.generateFrameNumbers('water_spinner', { frames: [
                    '1', '2', '3', '4', '5', '6', '7', '8', '9',
                    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                    '20', '21', '22', '23', '24', '25', '26', '27', '28'
                ] }),
                frameRate: 24,
                repeat: -1
            });
            waterSpinner.play('water_spinner')
        water = this.add.sprite(436, 258, 'water', 'dirtywater0000').setScale(1.01);
            this.anims.create({
                key: 'clean_water',
                frames: this.anims.generateFrameNumbers('water', { frames: [
                    'dirtywater0000', 'dirtywater0001', 'dirtywater0002', 'dirtywater0003', 'dirtywater0004', 'dirtywater0005', 'dirtywater0006', 'dirtywater0007', 'dirtywater0008', 'dirtywater0009',
                    'dirtywater0010', 'dirtywater0011', 'dirtywater0012', 'dirtywater0013', 'dirtywater0014', 'dirtywater0015', 'dirtywater0016', 'dirtywater0017', 'dirtywater0018', 'dirtywater0019',
                    'dirtywater0020', 'dirtywater0021', 'dirtywater0022', 'dirtywater0023', 'dirtywater0024', 'dirtywater0025', 'dirtywater0026', 'dirtywater0027', 'dirtywater0028', 'dirtywater0029',
                    'dirtywater0030', 'dirtywater0031', 'dirtywater0032', 'dirtywater0033', 'dirtywater0034', 'dirtywater0035', 'dirtywater0036', 'dirtywater0037', 'dirtywater0038', 'dirtywater0039',
                    'dirtywater0040', 'dirtywater0041', 'dirtywater0042', 'dirtywater0043', 'dirtywater0044', 'dirtywater0045', 'dirtywater0046', 'dirtywater0047', 'dirtywater0048', 'dirtywater0049',
                    'dirtywater0050', 'dirtywater0051', 'dirtywater0052', 'dirtywater0053', 'dirtywater0054', 'dirtywater0055', 'dirtywater0056', 'dirtywater0057', 'dirtywater0058', 'dirtywater0059',
                    'dirtywater0060', 'dirtywater0061', 'dirtywater0062', 'dirtywater0063', 'dirtywater0064', 'dirtywater0065', 
                    'cleanwater'
                ] }),
                frameRate: 24,
            });

            function cleanWaterHover () {
                if (handCurrent === HAND.empty && water.frame.name === 'dirtywater0000') {
                    waterSpinnerHolder.setFrame('hover');
                    hover2.play();
                }
            }
            function cleanWaterPointerOut () {
                if (waterSpinnerHolder.frame.name === 'hover') {
                    waterSpinnerHolder.setFrame('idle');
                }
            }
            function cleanWater () {
                if (handCurrent === HAND.empty && water.frame.name === 'dirtywater0000') {
                    water.play('clean_water')
                    waterSpinner.stop().setFrame('1')
                    updateBar(cleanlinessBar, 2)
                    updateBar(happinessBar, 1/2 + 0.05)
                }
            }
            waterSpinner.on('pointerover', cleanWaterHover)
            waterSpinner.on('pointerout', cleanWaterPointerOut)
            waterSpinner.on('pointerdown', cleanWater)
            waterSpinnerHolder.on('pointerover', cleanWaterHover)
            waterSpinnerHolder.on('pointerout', cleanWaterPointerOut)
            waterSpinnerHolder.on('pointerdown', cleanWater)



        // ---------- Stable foreground and UI ---------- //
        this.add.image(444, 260, 'stable_fg');


        // Inspirational message
        inspiration = this.add.image(430, 150, 'inspiration').setScale(.93).setVisible(false);
        inspirationMessage = this.add.text(444, 133, 'Static Text Object', { fontFamily: 'Arial', fontSize: 55, color: '#ffffff', align: 'center' }).setVisible(false);
        inspirationMessage.text = horseData.message;
        inspirationMessage.setPosition(444-inspirationMessage.width/2, 133-inspirationMessage.height/2);
        inspirationMessage.setShadow(2, 2, '#000000', 7, true, true)


        // Horse name
        const horseNameText = this.add.text(444, 133, 'Static Text Object', { fontFamily: 'Arial', fontSize: 12, color: '#ffffff', align: 'center' });
        horseNameText.text = horseData.name;
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

        // happiness
        const happinessLevel = 2 - (tempWrong * 0.2)
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


        // // ---------- Held items ---------- //
        brushHeldSprite = this.add.sprite(759, 272, 'brush', 'held').setVisible(false);
        brushSmallHeldSprite = this.add.sprite(759, 272, 'brush_small', 'held').setVisible(false);
        hoofpickHeldSprite = this.add.sprite(759, 272, 'polisher').setVisible(false);
        appleHeldSprite = this.add.image(759, 272, 'treatHeld').setVisible(false);
    }

    update ()
    {
        const pointer = this.input.activePointer;
            
        // clear held items from display
        function clearCursor() {
            brushHeldSprite.setVisible(false);
            brushSmallHeldSprite.setVisible(false);
            hoofpickHeldSprite.setVisible(false);
            appleHeldSprite.setVisible(false);
        }

        // display held items under cursor
        if (handCurrent === HAND.brush) {
            brushHeldSprite.setPosition(pointer.worldX-5, pointer.worldY-10);
            if (!brushHeldSprite.visible) {
                brushHeldSprite.setAlpha(0).setVisible(true)
                this.time.delayedCall(250, function () {brushHeldSprite.setAlpha(1)});
            }
        }
        else if (handCurrent === HAND.brushSmall) {
            brushSmallHeldSprite.setPosition(pointer.worldX-8, pointer.worldY-4);
            if (!brushSmallHeldSprite.visible) {
                brushSmallHeldSprite.setAlpha(0).setVisible(true)
                this.time.delayedCall(250, function () {brushSmallHeldSprite.setAlpha(1)});
            }
        }
        else if (handCurrent === HAND.hoofpick) {
            hoofpickHeldSprite.setPosition(pointer.worldX-10, pointer.worldY+20);
            if (!hoofpickHeldSprite.visible) {
                hoofpickHeldSprite.setVisible(true).setFrame('held');
            }
        }
        else if (handCurrent === HAND.apple) {
            clearCursor()
            appleHeldSprite.setVisible(true).setPosition(pointer.worldX, pointer.worldY);
        }
        else {
            clearCursor()
        }
        

        // play water clean animation
        if (oxygen.frame.name === 'bubbles0035') {
            oxygen.play('oxygen2')
        } else if (oxygen.frame.name === 'bubbles0071') {
            oxygen.play('oxygen3')
        }

        // play water clean sound when fountain is at correct frame
        if (water.frame.name === 'dirtywater0015') {
            drainWater.play();
        }
        if (oxygen.frame.name === 'bubbles0006') {
            bubbleSound.play();
        }
        else if (oxygen.frame.name === 'bubbles0090') {
            bubbleReplaceSound.play();
        }
        if (foodTrough.frame.name === 'feed0006') {
            foodDispenseSound.play();
        }
        if (treatDispenser.frame.name === 'dispense0006') {
            treatDispenseSound.play();
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