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

trough = null
waterDrink = null
waterFlow = null
rearSound = null
foodTrough = null
branch = null
oatsEat = null
appleMunch = null
inspiration = null
inspirationMessage = null

brushHeldSprite = null
brushSmallHeldSprite = null
hoofpickHeldSprite = null
appleHeldSprite = null



// Actual game start
class AirStable extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: 'airStable'
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
        this.load.image('stable_bg', './images/airStable/stable-bg.png');
        this.load.image('stable_fg', './images/airStable/stable-fg.png');
        this.load.image('hunger_scale', './images/airStable/hunger.png');
        this.load.image('cleanliness_scale', './images/airStable/cleanliness.png');
        this.load.image('happiness_scale', './images/airStable/happiness.png');

        this.load.atlas('leaf_tree_shake', './images/airStable/leaf_tree_shake.png', './images/airStable/leaf_tree_shake.json');
        this.load.atlas('leaf_chimes', './images/airStable/leaf_chimes.png', './images/airStable/leaf_chimes.json');
        this.load.atlas('leaves_fall', './images/airStable/leaves_fall.png', './images/airStable/leaves_fall.json');
        this.load.atlas('leaves_wind', './images/airStable/leaves_wind.png', './images/airStable/leaves_wind.json');

        this.load.image('left_tree', './images/airStable/leftTree.png');
        this.load.atlas('fountain', './images/airStable/fountain.png', './images/airStable/fountain.json');
        this.load.atlas('food_interactive', './images/airStable/food_interactive.png', './images/airStable/food_interactive.json');
        this.load.atlas('berries', './images/airStable/berries.png','./images/airStable/berries.json');
        this.load.image('berriesHeld', './images/airStable/berriesHeld.png');
        this.load.atlas('horn', './images/airStable/horn.png','./images/airStable/horn.json');
        this.load.spineAtlas("branch-atlas", `./images/airStable/branches.atlas`);
        this.load.spineJson("branch-json", `./images/airStable/branches.json`);
        
        this.load.atlas('brush', './images/airStable/brush.png', './images/airStable/brush.json');
        this.load.atlas('brush_small', './images/airStable/brush_small.png', './images/airStable/brush_small.json');
        this.load.atlas('feather_oil', './images/airStable/feather_oil.png', './images/airStable/feather_oil.json');
        
        this.load.spineAtlas("horse-atlas", `./images/horses/${horseName}/skeleton.atlas`);
        this.load.spineAtlas("horse_overlay-atlas", `./images/horses/${horseName}/skeleton_overlay.atlas`);
        this.load.spineAtlas("horse_dirty-atlas", `./images/airStable/horse_dirty/dirt_skeleton.atlas`);
        this.load.spineJson("horse-json", `./images/horses/${horseName}/skeleton.json`);
        this.load.spineJson("horse_overlay-json", `./images/horses/${horseName}/skeleton_overlay.json`);
        this.load.spineJson("horse_dirty-json", `./images/airStable/horse_dirty/dirt_skeleton.json`);

        this.load.image('horse_image', `./images/horses/${horseName}/card_image.jpg`);

        this.load.atlas('frame', './images/airStable/frame.png', './images/airStable/frame.json');
        this.load.image('inspiration', './images/airStable/inspiration.png');

        this.load.atlas('music_button', './images/airStable/music.png', './images/airStable/music.json');
        this.load.atlas('help_button', './images/airStable/help.png', './images/airStable/help.json');
        this.load.image('stat_box', './images/StatBox.png');

        this.load.audio('background_music', ['./sounds/stable_soundtrack.mp3']);
        this.load.audio('apple_munch', ['./sounds/apple_munch.mp3']);
        this.load.audio('brush_sound', ['./sounds/brush_sound.mp3']);
        this.load.audio('brush_sound_small', ['./sounds/brush_sound_small.mp3']);
        this.load.audio('fork_fill', ['./sounds/fork_fill.mp3']);
        this.load.audio('fork_place', ['./sounds/fork_place.mp3']);
        this.load.audio('grain_sound', ['./sounds/grain_sound.mp3']);
        this.load.audio('soothe_sound', ['./sounds/air_soothe_sound.mp3']);
        this.load.audio('soothe_sound_length', ['./sounds/air_soothe_sound_length.mp3']);
        this.load.audio('hover1', ['./sounds/hover1.mp3']);
        this.load.audio('hover2', ['./sounds/hover1.mp3']);
        this.load.audio('inspiration_hover', ['./sounds/inspiration_hover.mp3']);
        this.load.audio('inspiration_sound', ['./sounds/inspiration.mp3']);
        this.load.audio('inspiration_close', ['./sounds/inspiration_close.mp3']);
        this.load.audio('oats_eat', ['./sounds/oats_eat.mp3']);
        this.load.audio('pickup', ['./sounds/pickup.mp3']);
        this.load.audio('shovel_sound', ['./sounds/shovel_sound.mp3']);
        this.load.audio('water_sound', ['./sounds/fountain_fill.mp3']);
        this.load.audio('water_flow', ['./sounds/fountain_flow.mp3']);
        this.load.audio('water_drink', ['./sounds/water_drink.mp3']);
        this.load.audio('rear_sound', ['./sounds/rear.mp3']);

        this.load.audio('clean_leaves', ['./sounds/clean_leaves.mp3']);
        this.load.audio('shake_leaves', ['./sounds/shake_leaves.mp3']);
        this.load.audio('feather_oil_pickup', ['./sounds/feather_oil_pickup.mp3']);
        this.load.audio('feather_oil_use', ['./sounds/feather_oil_use.mp3']);
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

        // Text boxes
        const hoverTextSettings = { 
            font: 'bold 16px Arial', 
            align: 'center',
            color: '#ffffff',
            wordWrap: { width: 170 } ,
            lineSpacing: -3
        }

        // Brush
        const brush = this.add.sprite(659, 231, 'brush', 'idle').setScale(0.76).setInteractive({ pixelPerfect: true });
        // const brushInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(753, 88, 40, 50), Phaser.Geom.Rectangle.Contains);
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
                    'brush0000', 'brush0001', 'brush0002', 'brush0003', 'brush0004', 'brush0005', 'brush0006', 'brush0007',
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
        const brushSmall = this.add.sprite(684, 247, 'brush_small', 'idle').setInteractive({ pixelPerfect: true });
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
                    'hold',
                    'brush0000', 'brush0001', 'brush0002', 'brush0003', 'brush0004', 'brush0005', 'brush0006', 'brush0007', 'brush0008', 'brush0009', 'brush0010',
                    'hold'
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

        // Hoofpick
        const hoofpick = this.add.sprite(683, 187, 'feather_oil', 'idle').setInteractive( { pixelPerfect: true } )//.setScale(0.75);
        // const hoofpickInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(801, 60, 26, 75), Phaser.Geom.Rectangle.Contains);
        const featherOilPickup = this.sound.add('feather_oil_pickup');
        const featherOilUse = this.sound.add('feather_oil_use');
            this.anims.create({
                key: 'feather_oil_pickup',
                frames: this.anims.generateFrameNumbers('feather_oil', { frames: [
                    'pickup0000', 'pickup0001', 'pickup0002', 'pickup0003', 'pickup0004', 'pickup0005', 'pickup0006', 'pickup0007', 'pickup0008', 'pickup0009',
                    'in_use'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'feather_oil_place',
                frames: this.anims.generateFrameNumbers('feather_oil', { frames: [
                    'place0000', 'place0001', 'place0002', 'place0003', 'place0004', 'place0005', 'place0006', 'place0007',
                    'idle'
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'feather_oil_use',
                frames: this.anims.generateFrameNumbers('feather_oil', { frames: [
                    'use0000', 'use0001', 'use0002', 'use0003', 'use0004', 'use0005', 'use0006', 'use0007', 'use0008', 'use0009',
                    'use0010', 'use0011', 'use0012', 'use0013', 'use0014', 'use0015', 'use0016', 'use0017', 'use0018', 'use0019',
                    'use0020', 'use0021', 'use0022', 'use0023', 'use0024', 'use0025', 'use0026', 'use0027', 'use0028', 'use0029',
                    'held'
                ] }),
                frameRate: 24
            });
            hoofpick.on('pointerdown', function (pointer)
            {
                if (handCurrent === HAND.empty && brushLevel === 3) {
                    handCurrent = HAND.hoofpick;
                    hoofpick.setFrame('in_use')
                    pickup.play();
                    featherOilPickup.play();
                }
                else if (handCurrent === HAND.hoofpick) {
                    handCurrent = HAND.empty;
                    hoofpick.play('feather_oil_place')
                }
            });
            const hoofpickText = this.add.text(685, 150, 'Static Text Object', hoverTextSettings).setAlpha(0);
            hoofpickText.text = localeData.txtOilHilite2;
            hoofpickText.setOrigin(0.5)
            hoofpick.on('pointerover', function (pointer) { 
                if (handCurrent === HAND.empty && brushLevel === 3) {
                    hoofpick.setFrame('hover')
                } else if (handCurrent === HAND.empty && brushLevel !== 3) {
                    hoofpick.setFrame('hover_wait')
                    hoofpickText.setAlpha(1)
                }
             });
             hoofpick.on('pointerout', function (pointer) { pointeroutNew (hoofpick, hoofpickText)});

            
        // Leaves (on floor)
        const leaves = this.add.sprite(520, 261, 'leaves_wind', 'wind0000');
            this.anims.create({
                key: 'leaves_wind',
                frames: this.anims.generateFrameNumbers('leaves_wind', { frames: [
                    'wind0000', 'wind0001', 'wind0002', 'wind0003', 'wind0004', 'wind0005', 'wind0006', 'wind0007', 'wind0008', 'wind0009',
                    'wind0010', 'wind0011', 'wind0012', 'wind0013', 'wind0014', 'wind0015', 'wind0016', 'wind0017', 'wind0018', 'wind0019',
                    'wind0020', 'wind0021', 'wind0022', 'wind0023', 'wind0024', 'wind0025', 'wind0026', 'wind0027', 'wind0028', 'wind0029',
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'leaves_fall',
                frames: this.anims.generateFrameNumbers('leaves_fall', { frames: [
                    'fall0000', 'fall0001', 'fall0002', 'fall0003', 'fall0004', 'fall0005', 'fall0006', 'fall0007', 'fall0008', 'fall0009',
                    'fall0010', 'fall0011', 'fall0012', 'fall0013', 'fall0014', 'fall0015', 'fall0016', 'fall0017', 'fall0018', 'fall0019',
                    'fall0020', 'fall0021', 'fall0022', 'fall0023', 'fall0024', 'fall0025', 'fall0026', 'fall0027', 'fall0028', 'fall0029',
                    'fall0030', 'fall0031', 'fall0032', 'fall0033', 'fall0034', 'fall0035', 'fall0036', 'fall0037', 'fall0038', 'fall0039',
                    'fall0040', 'fall0041', 'fall0042', 'fall0043', 'fall0044', 'fall0045', 'fall0046', 'fall0047', 'fall0048', 'fall0049',
                    'fall0050', 'fall0051', 'fall0052', 'fall0053', 'fall0054', 'fall0055', 'fall0056', 'fall0057', 'fall0058', 'fall0059',
                    'fall0060', 'fall0061', 'fall0062'
                ] }),
                frameRate: 24
            });


        // Inspirational message frame
        this.add.image(164, 77, 'horse_image').setScale(.35);
        const frame = this.add.sprite(165, 73, 'frame', 'idle').setInteractive();
        const inspirationHover = this.sound.add('inspiration_hover');
        const inspirationSound = this.sound.add('inspiration_sound');
        inspirationCloseSound = this.sound.add('inspiration_close');
        // const frameInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(478, 65, 75, 110), Phaser.Geom.Rectangle.Contains);
            frame.on('pointerover', function (pointer)
            {
                if (canPlayInspiration) {
                    frame.setFrame('hover');
                    inspirationHover.play()
                }
            });
            frame.on('pointerout', function (pointer) { frame.setFrame('idle') });
            frame.on('pointerdown', function (pointer) { 
                if (canPlayInspiration) {
                    playInspiration = true 
                    inspirationSound.play()
                }
            })


        // Water Fountain
        trough = this.add.sprite(188, 348, 'fountain', 'idle').setInteractive({ pixelPerfect: true });
        const waterSound = this.sound.add('water_sound');
        waterFlow = this.sound.add('water_flow');
        waterDrink = this.sound.add('water_drink');
            this.anims.create({
                key: 'fill_water',
                frames: this.anims.generateFrameNumbers('fountain', { frames: [
                    '10',
                    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
                    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
                    '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
                    '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
                    '51', '52', '53', '54', '55', '56', '57', '58', '59', '60',
                    '61', '62', '63', '64', '65', '66', '67', '68', '69', '70',
                    '71', '72', '73', '74', '75', '76', '77', '78', '79', '80',
                    '81', '82', '83', '84', '85', '86', '87', '88', '89', '90',
                    '91', '92', '93', '94', '95', '96', '96', '96', '96', 
                ] }),
                frameRate: 24
            });
            this.anims.create({
                key: 'water_fountain_drink',
                frames: this.anims.generateFrameNumbers('fountain', { frames: [
                    '100', '100', '100', '100', '100', '100', '100', '100', '100', '100',
                    '100', '100', '100', '100', '100', '100', '100', '100', '100', '100',
                    '100', '100', '100', '100', '100', '100',
                    '125', '126', '127', '128', '129', '130',
                    '131', '132', '133', '134', '135', '136', '137', '138', '139', '140',
                    '141', '142', '143', '144', '145', '146', '147', '148', '149', '150',
                    '151', '152', '153', '154', '155', '156', '157', '158', '159', '160',
                    '161', '162', '163', '164', '165', '166', '167', '168', '169', '170',
                    '171', '172', '173', '174', '175', '176'
                ] }),
                frameRate: 24
            });
            trough.on('pointerdown', function (pointer)
            {
                if (!waterFilled && handCurrent === HAND.empty) {
                    waterFilled = true;
                    this.play('fill_water');
                    // troughMask.play('mask_fill_water');
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
            branch = this.add.spine(-35, 230, 'branch-json', 'branch-atlas').setScale(.35)//.setAngle(90);
            oatsEat = this.sound.add('oats_eat');


            // Horse hit box
            const wingInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(330, 0, 250, 350), Phaser.Geom.Rectangle.Contains);
            const horseInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(200, 120, 376, 245), Phaser.Geom.Rectangle.Contains);
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
                        cleanWings()
                    }
                });
            wingInteractive.on('pointerdown', function (pointer)
            {
                if (handCurrent === HAND.hoofpick) {
                    cleanWings()
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
                        statBoxQueue.push(localeData.txtReadyToBeOiled)
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
                function cleanWings() {
                    if (extraCleanLevel <2 && handCurrent === HAND.hoofpick) {
                        extraCleanLevel += 1
                        checkClean()
                        hoofpickHeldSprite.play('feather_oil_use')
                        featherOilUse.play();
                        updateBar(cleanlinessBar, 0.5)
                        updateBar(happinessBar, 1/4)
                    }
                    if (handCurrent === HAND.hoofpick) {
                        hoofpickHeldSprite.play('feather_oil_use')
                        featherOilUse.play();
                    }
                }
                function checkClean() {
                    if (brushLevel === 3 && extraCleanLevel === 2) {
                        statBoxQueue.push(localeData.txtCleanHorse)
                        horseAnimationQueue.push(HORSE_STATES.rear)
                    }
                }


            // Windchime
            const windchimes = this.add.sprite(340, 18, 'leaf_chimes', 'idle').setInteractive({ pixelPerfect: true });
            const cleanLeaves = this.sound.add('clean_leaves');
                this.anims.create({
                    key: 'windchimes_blow',
                    frames: this.anims.generateFrameNumbers('leaf_chimes', { frames: [
                        'wind0000', 'wind0001', 'wind0002', 'wind0003', 'wind0004', 'wind0005', 'wind0006', 'wind0007', 'wind0008', 'wind0009',
                        'wind0010', 'wind0011', 'wind0012', 'wind0013', 'wind0014', 'wind0015', 'wind0016', 'wind0017', 'wind0018', 'wind0019',
                        'wind0020', 'wind0021', 'wind0022', 'wind0023', 'wind0024', 'wind0025', 'wind0026',
                        'idle'
                    ] }),
                    frameRate: 24
                });
                windchimes.on('pointerover', function (pointer)
                {
                    if (handCurrent === HAND.empty && leaves.frame.name === 'wind0000') {
                        this.setFrame('hover');
                        hover2.play();
                    }
                });
                windchimes.on('pointerout', function (pointer) { 
                    if (this.frame.name === 'hover') {
                        this.setFrame('idle');
                    }
                });
                windchimes.on('pointerdown', function (pointer)
                {
                    if (handCurrent === HAND.empty && leaves.frame.name === 'wind0000') {
                        leaves.play('leaves_wind');
                        this.play('windchimes_blow');
                        cleanLeaves.play();
                    }
                });


            // Horse
            horse = this.add.spine(430, 295, 'horse-json', 'horse-atlas').setAngle(90);
            horse.animationState.setAnimation(0, "idle", false)
            horseDirty = this.add.spine(430, 295, 'horse_dirty-json', 'horse_dirty-atlas').setAngle(90);
            horseDirty.animationState.setAnimation(0, "idle", false)
            horseOverlay = this.add.spine(430, 295, 'horse_overlay-json', 'horse_overlay-atlas').setAngle(90);
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
                switch (entry.animation.name) {
                    case 'eat_food':
                        horseFullLevel[0] += 1
                        if (horseFullLevel[0] === 1 && horseFullLevel[1] >= 1) {
                            statBoxQueue.push(localeData.txtFullHorse)
                        }
                        break;
                    case 'drink':
                        horseFullLevel[1] += 1
                        if (horseFullLevel[0] >= 1 && horseFullLevel[1] === 1) {
                            statBoxQueue.push(localeData.txtFullHorse)
                        }
                        break;
                
                    default:
                        break;
                }
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

             
        this.add.image(92, 285, 'left_tree');
        foodTrough = this.add.sprite(-164, 299, 'food_interactive', 'idle').setInteractive({ pixelPerfect: true });
            this.anims.create({
                key: 'pull_back',
                frames: this.anims.generateFrameNumbers('food_interactive', { frames: [
                    'bounce0000', 'bounce0001', 'bounce0002', 'bounce0003', 'bounce0004', 'bounce0005', 'bounce0006', 'bounce0007', 'bounce0008',
                    'idle'
                ] }),
                frameRate: 24
            });
            foodTrough.on('pointerdown', function (pointer)
            {
                if (handCurrent === HAND.empty) {
                    this.play('pull_back')
                    horseAnimationQueue.push(HORSE_STATES.eatingFood)
                    if (!foodFilled) {
                        updateBar(hungerBar, 2)
                        updateBar(happinessBar, 1.05)
                    }
                    foodFilled = true;
                }
            });
            foodTrough.on('pointerover', function (pointer) { 
                if (foodTrough.frame.name === 'idle') {
                    this.setFrame('hover')
                }
            });
            foodTrough.on('pointerout', function (pointer)
            {
                if (foodTrough.frame.name === 'hover') {
                    this.setFrame('idle')
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

function pointeroverNew(sprite, hoverSound, spriteText) {
    if (handCurrent === HAND.empty) {
        sprite.setFrame('hover')
        hoverSound.play();
        spriteText.setAlpha(1)
    }
}

function pointeroutNew(sprite, spriteText) {
    if (handCurrent === HAND.empty) {
        sprite.setFrame('idle')
        spriteText.setAlpha(0)
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


        // Berries
        const berries = this.add.sprite(702, 30, 'berries', 'idle').setScale(.43).setInteractive();
        appleMunch = this.sound.add('apple_munch');
            this.anims.create({
                key: 'berries_pickup',
                frames: this.anims.generateFrameNumbers('berries', { frames: [
                    'pickup0000', 'pickup0001', 'pickup0002', 'pickup0003', 'pickup0004', 'pickup0005', 'pickup0006', 'pickup0007', 'pickup0008', 'pickup0009'
                ] }),
                frameRate: 24
            });
            berries.on('pointerover', function (pointer) { pointerover (berries, hover1) });
            berries.on('pointerout', function (pointer) { berries.setFrame('idle') });
            berries.on('pointerdown', function (pointer)
            {
                if (handCurrent === HAND.empty) {
                    handCurrent = HAND.apple;
                    berries.play('berries_pickup')
                    pickup.play();
                }
            });

        // Tree (for leaves)
        const treeInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(740, 330, 200, 150), Phaser.Geom.Rectangle.Contains);
        // this.add.graphics().fillStyle(0x000000).fillRect(740, 330, 200, 150);
        const leafTree = this.add.sprite(443, 260, 'leaf_tree_shake', 'idle');
        const shakeLeaves = this.sound.add('shake_leaves');
            this.anims.create({
                key: 'tree_shake',
                frames: this.anims.generateFrameNumbers('leaf_tree_shake', { frames: [
                    'shake0000', 'shake0001', 'shake0002', 'shake0003', 'shake0004', 'shake0005', 'shake0006', 'shake0007', 'shake0008', 'shake0009',
                    'shake0010', 'shake0011', 'shake0012', 'shake0013', 'shake0014', 'shake0015', 'shake0016', 'shake0017', 'shake0018', 'shake0019',
                    'shake0020', 'shake0021', 'shake0022', 'shake0023', 'shake0024', 'shake0025', 'shake0026', 'shake0027', 'shake0028', 'shake0029',
                    'shake0030', 'shake0031', 'shake0032', 'shake0033', 'shake0034', 'shake0035', 'shake0036', 'shake0037', 'shake0038', 'shake0039',
                    'shake0040', 'shake0041', 'shake0042', 'shake0043', 'shake0044', 'shake0045', 'shake0046', 'shake0047', 'shake0048', 'shake0049',
                    'shake0050', 'shake0051', 'shake0052', 'shake0053', 'shake0054', 'shake0055', 'shake0056', 'shake0057', 'shake0058', 'shake0059',
                    'shake0060', 'shake0061', 'shake0062', 'shake0063', 'shake0064', 'shake0065', 'shake0066', 'shake0067',
                     'idle'
                ] }),
                frameRate: 24
            });
            treeInteractive.on('pointerover', function (pointer)
            {
                if (handCurrent === HAND.empty && leaves.frame.name === 'wind0029') {
                    leafTree.setFrame('hover');
                    hover2.play();
                }
            });
            treeInteractive.on('pointerout', function (pointer) { 
                if (leafTree.frame.name === 'hover') {
                    leafTree.setFrame('idle');
                }
                });
            treeInteractive.on('pointerdown', function (pointer)
            {
                if (handCurrent === HAND.empty && leaves.frame.name === 'wind0029') {
                    leaves.play('leaves_fall')
                    leafTree.play('tree_shake')
                    shakeLeaves.play()
                    statBoxQueue.push(localeData.txtNoMoreLeaves)
                    updateBar(cleanlinessBar, 2)
                    updateBar(happinessBar, 1/2 + 0.05)
                }
            });
        
        // Horn
        const horn = this.add.sprite(10, 120, 'horn', 'idle').setInteractive({ pixelPerfect: true });
        const sootheSound = this.sound.add('soothe_sound');
        const sootheSoundLength = this.sound.add('soothe_sound_length');
            this.anims.create({
                key: 'soothe',
                frames: this.anims.generateFrameNumbers('horn', { frames: [
                    'play0000', 'play0001', 'play0002', 'play0003', 'play0004', 'play0005', 'play0006', 'play0007', 'play0008', 'play0009',
                    'play0010', 'play0011', 'play0012', 'play0013', 'play0013', 'play0015', 'play0016', 'play0017', 'play0018', 'play0019',
                    'play0020', 'play0021', 'play0022',

                    'play0022', 'play0021', 'play0020',
                    'play0019', 'play0018', 'play0017', 'play0016', 'play0015', 'play0014', 'play0013', 'play0012', 'play0011', 'play0010',
                    'play0010', 'play0010', 'play0010', 'play0006', 'play0005', 'play0004', 'play0003', 'play0002', 'play0001', 'play0000',
                    

                    'play0000', 'play0001', 'play0002', 'play0003', 'play0004', 'play0005', 'play0006', 'play0007', 'play0008', 'play0009',
                    'play0010', 'play0011', 'play0012', 'play0013', 'play0013', 'play0015', 'play0016', 'play0017', 'play0018', 'play0019',
                    'play0020', 'play0021', 'play0022',

                    'play0022', 'play0021', 'play0020',
                    'play0019', 'play0018', 'play0017', 'play0016', 'play0015', 'play0014', 'play0013', 'play0012', 'play0011', 'play0010',
                    'play0010', 'play0010', 'play0010', 'play0006', 'play0005', 'play0004', 'play0003', 'play0002', 'play0001', 'play0000',
                    

                    'play0000', 'play0001', 'play0002', 'play0003', 'play0004', 'play0005', 'play0006', 'play0007', 'play0008', 'play0009',
                    'play0010', 'play0011', 'play0012', 'play0013', 'play0013', 'play0015', 'play0016', 'play0017', 'play0018', 'play0019',
                    'play0020', 'play0021', 'play0022',

                    'play0022', 'play0021', 'play0020',
                    'play0019', 'play0018', 'play0017', 'play0016', 'play0015', 'play0014', 'play0013', 'play0012', 'play0011', 'play0010',
                    'play0010', 'play0010', 'play0010', 'play0006', 'play0005', 'play0004', 'play0003', 'play0002', 'play0001', 'play0000',
                    

                    'play0000', 'play0001', 'play0002', 'play0003', 'play0004', 'play0005', 'play0006', 'play0007', 'play0008', 'play0009',
                    'play0010', 'play0011', 'play0012', 'play0013', 'play0013', 'play0015', 'play0016', 'play0017', 'play0018', 'play0019',
                    'play0020', 'play0021', 'play0022',

                    'play0022', 'play0021', 'play0020',
                    'play0019', 'play0018', 'play0017', 'play0016', 'play0015', 'play0014', 'play0013', 'play0012', 'play0011', 'play0010',
                    'play0010', 'play0010', 'play0010', 'play0006', 'play0005', 'play0004', 'play0003', 'play0002', 'play0001', 'play0000',
                    

                    'play0000', 'play0001', 'play0002', 'play0003', 'play0004', 'play0005', 'play0006', 'play0007', 'play0008', 'play0009',
                    'play0010', 'play0011', 'play0012', 'play0013', 'play0013', 'play0015', 'play0016', 'play0017', 'play0018', 'play0019',
                    'play0020', 'play0021', 'play0022',

                    'play0022', 'play0021', 'play0020',
                    'play0019', 'play0018', 'play0017', 'play0016', 'play0015', 'play0014', 'play0013', 'play0012', 'play0011', 'play0010',
                    'play0010', 'play0010', 'play0010', 'play0006', 'play0005', 'play0004', 'play0003', 'play0002', 'play0001', 'play0000',

                    'idle'
                ] }),
                frameRate: 18
            });
            horn.on('pointerover', function (pointer) { 
                if (handCurrent === HAND.empty && !soothed) {
                    horn.setFrame('hover')
                }
            });
            horn.on('pointerout', function (pointer)
            {
                if (handCurrent === HAND.empty && !soothed) {
                    horn.setFrame('idle')
                }
            });
            horn.on('pointerdown', function (pointer)
            {
                if (handCurrent === HAND.empty && !soothed) {
                    soothed = true
                    horn.play('soothe')
                    backgroundMusic.stop()
                    sootheSound.play();
                    sootheSoundLength.play();
                    statBoxQueue.push(localeData.txtMusic)
                    sootheSoundLength.on('complete', function (sound) {
                        if (playMusic) {
                            backgroundMusic.play()
                        }
                    });
                    updateBar(happinessBar, 0.5 + 0.1)
                }
            });


            // Text box to display stat messages
            statBox = this.add.image(695, 120, 'stat_box').setAlpha(0)
            statBoxText = this.add.text(695, 120, 'Static Text Object', hoverTextSettings).setAlpha(0);
            statBoxText.setOrigin(.5, .5)



        // ---------- Stable foreground and UI ---------- //
        this.add.image(444, 261, 'stable_fg');


        // Inspirational message
        inspiration = this.add.image(430, 150, 'inspiration').setScale(.93).setVisible(false);
        inspirationMessage = this.add.text(444, 133, 'Static Text Object', { 
            fontFamily: 'Arial', 
            fontSize: 55, 
            color: '#ffffff', 
            align: 'center' ,
            wordWrap: { width: 800 }}).setVisible(false);
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
            var helpPopups = [];
            function showLocalizedHelpTexts(xPos, yPos, localeTxtKey, settings, scene)
            {
                const helpTxt = scene.add.text(xPos, yPos, 'Static Text Object', settings).setAlpha(0);
                helpTxt.text = localeTxtKey;
                helpTxt.setOrigin(0.5)
                helpPopups.push(helpTxt);
            }

            const helpButton = this.add.sprite(444, 261, 'help_button', 'idle').setInteractive(this.input.makePixelPerfect(150));         
            const hoverTextSettingsHelp = {
                font: 'bold 12px Arial', 
                align: 'center',
                color: '#ffffff',
                wordWrap: {width: 100},
                lineSpacing: -2
            }

            const hoverTextSettingsHelpBiggerBox = {
                font: 'bold 11px Arial', 
                align: 'center',
                color: '#ffffff',
                wordWrap: {width: 150},
                lineSpacing: -2
            }

            const hoverTextSettingsHelpOneLine = {
                font: 'bold 11px Arial', 
                align: 'center',
                color: '#ffffff',
            }

            showLocalizedHelpTexts(585, 30, localeData.txtHelpTrophyRoom, hoverTextSettingsHelp, this);
            showLocalizedHelpTexts(180, 285, localeData.txtHelpFountain, hoverTextSettingsHelp, this);
            showLocalizedHelpTexts(365, 409, localeData.txtHelpStats, hoverTextSettingsHelpOneLine, this);
            showLocalizedHelpTexts(245, 140, localeData.txtHelpSpeaker, hoverTextSettingsHelp, this);
            showLocalizedHelpTexts(250, 75, localeData.txtHelpInspiration, hoverTextSettingsHelp, this);
            showLocalizedHelpTexts(425, 110, localeData.txtHelpWindChime, hoverTextSettingsHelp, this);
            showLocalizedHelpTexts(780, 90, localeData.txtHelpBerries, hoverTextSettingsHelpBiggerBox, this);
            showLocalizedHelpTexts(125, 380, localeData.txtHelpAcorn, hoverTextSettingsHelp, this);
            showLocalizedHelpTexts(750, 175, localeData.txtHelpWorld, hoverTextSettingsHelpOneLine, this);
            showLocalizedHelpTexts(827, 290, localeData.txtHelpOil, hoverTextSettingsHelp, this);
            showLocalizedHelpTexts(540, 240, localeData.txtHelpBrush, hoverTextSettingsHelp, this);
            //showLocalizedHelpTexts(605, 365, localeData.txtHelpLuck, hoverTextSettingsHelp, this);
            showLocalizedHelpTexts(650, 410, localeData.txtHelpBranch, hoverTextSettingsHelp, this);
        
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


        // ---------- Held items ---------- //
        brushHeldSprite = this.add.sprite(759, 272, 'brush', 'hold').setVisible(false);
        brushSmallHeldSprite = this.add.sprite(759, 272, 'brush_small', 'hold').setVisible(false);
        hoofpickHeldSprite = this.add.sprite(759, 272, 'feather_oil').setVisible(false);
        appleHeldSprite = this.add.image(759, 272, 'berriesHeld').setVisible(false);
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
            hoofpickHeldSprite.setPosition(pointer.worldX, pointer.worldY+80);
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

        // play water flow sound when fountain is at correct frame
        if (trough.frame.name === '29') {
            waterFlow.play();
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
                this.time.delayedCall(3500, function () {
                    trough.play('water_fountain_drink')
                    horse.animationState.setAnimation(0, 'drink', false);
                    horseDirty.animationState.setAnimation(0, 'drink', false);
                    horseOverlay.animationState.setAnimation(0, 'drink', false);
                });
                this.time.delayedCall(4030, function () {
                    waterDrink.play()
                });
            }
            else if (animation === HORSE_STATES.eatingFood) {
                branch.animationState.setAnimation(0, 'animation', false);
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

            if (localizedQuote)
                inspirationMessage.text = localeData[horseName + "Quote"];
            else
                inspirationMessage.text = englishDatas[horseName + "Quote"];

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
        
        if (statBoxQueue.length > 0) {
            statBox.setAlpha(1)
            statBoxText.setAlpha(1)
            statBoxText.text = statBoxQueue.shift()
            this.time.delayedCall(3280, function () {
                statBox.setAlpha(0)
                statBoxText.setAlpha(0)
            });
        }
    }
}