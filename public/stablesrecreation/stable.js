// Variables to be used throughout scene
play_music = true;
const hand = {
    empty: 'empty',
    shovel: 'shovel',
    fork: 'fork',
    fork_filled: 'fork_filled',
    brush: 'brush',
    small_brush: 'small_brush',
    hoofpick: 'hoofpick',
    apple: 'apple',
    grain_scoop: 'grain_scoop'
}
handcurrent = hand.empty;
waterfilled = false;
foodfilled = false;
brushlevel = 0
strawclean = false
play_inspiration = true
can_play_inspiration = false

horse_busy = false
horse_busy_idling = false
const horse_states = {
    busy: 'busy',
    idle: 'idle',
    drink: 'drink',
    rear: 'rear',
    eating_food: 'eat_food',
    eating_apple: 'eat_apple'
}
horse_state = horse_states.idle

horse = null
horse_dirty = null
trough = null
trough_mask = null
water_drink = null
rear_sound = null
food_trough = null
oats_eat = null
apple_munch = null
hoofpick1 = null
hoofpick2 = null
inspiration = null
inspiration_message = null

shovel_held_sprite = null
fork_held_sprite = null
grain_held_sprite = null
brush_held_sprite = null
brush_small_held_sprite = null
hoofpick_held_sprite = null
apple_held_sprite = null

// Gets info about the horse from data.json file

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
horse_name = urlParams.get('name')

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

if (!horse_name || !UrlExists(`./images/horse/${horse_name}`)) {
    horse_name ='peter'
}
let horse_data
const xmlhttp = new XMLHttpRequest();
xmlhttp.onload = function() {
  const myObj = JSON.parse(this.responseText);
  horse_data = myObj
}
xmlhttp.open("GET", `./images/horse/${horse_name}/data.json`);
xmlhttp.send();


// This scene is just used to load the image for the loading screen
class Load extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'Load' });
    }

    preload ()
    {
        this.load.image('card_back', './images/stable/card_back.png');
    }

    create ()
    { 
        this.scene.start('Stable');
    }
}

// Actual game start
class Stable extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: 'Stable',
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: './SpinePluginDebug.js', sceneKey: 'spine' }
                ]
            }
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
            
        // Load in images and sounds
        this.load.image('stable_bg', './images/stable/stable-bg.png');
        this.load.image('stable_fg', './images/stable/stable-fg.png');
        this.load.image('hunger_scale', './images/stable/hunger.png');
        this.load.image('cleanliness_scale', './images/stable/cleanliness.png');
        this.load.image('happiness_scale', './images/stable/happiness.png');

        this.load.atlas('shovel', './images/stable/shovel.png', './images/stable/shovel.json');
        this.load.atlas('fork', './images/stable/fork.png', './images/stable/fork.json');
        this.load.atlas('straw1', './images/stable/straw1.png', './images/stable/straw1.json');
        this.load.atlas('straw2', './images/stable/straw2.png', './images/stable/straw2.json');
        this.load.atlas('straw3', './images/stable/straw3.png', './images/stable/straw3.json');
        this.load.atlas('hay_loft', './images/stable/hay_loft.png', './images/stable/hay_loft.json');

        this.load.atlas('trough', './images/stable/water.png', './images/stable/water.json');
        this.load.atlas('trough_mask', './images/stable/water_mask.png', './images/stable/water_mask.json');
        this.load.atlas('food_trough', './images/stable/food.png', './images/stable/food.json');
        this.load.atlas('grain_bin', './images/stable/grain_bin.png', './images/stable/grain_bin.json');
        this.load.image('grain_scoop', './images/stable/grain_scoop.png');
        this.load.atlas('apple_bin', './images/stable/apples.png','./images/stable/apples.json');
        this.load.image('apple_held', './images/stable/apple.png');
        
        this.load.atlas('brush', './images/stable/brush.png', './images/stable/brush.json');
        this.load.atlas('brush_small', './images/stable/brush_small.png', './images/stable/brush_small.json');
        this.load.atlas('hoofpick', './images/stable/hoofpick.png', './images/stable/hoofpick.json');

        this.load.spine('horse', `./images/horse/${horse_name}/skeleton.json`, [`./images/horse/${horse_name}/skeleton.atlas`], true);
        this.load.spine('horse_dirty', `./images/stable/horse_dirty/dirt_skeleton.json`, [`./images/stable/horse_dirty/dirt_skeleton.atlas`], true);
        this.load.image('horse_image', `./images/horse/${horse_name}/card_image.jpg`);
        this.load.spritesheet('hooves', './images/stable/hooves.png', { frameWidth: 53, frameHeight: 53 });

        this.load.atlas('luck', './images/stable/luck.png', './images/stable/luck.json');
        this.load.atlas('frame', './images/stable/frame.png', './images/stable/frame.json');
        this.load.image('inspiration', './images/stable/inspiration.png');

        this.load.atlas('music_button', './images/stable/music.png', './images/stable/music.json');
        this.load.atlas('help_button', './images/stable/help.png', './images/stable/help.json');

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
        const straw1_interactive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(249, 309, 170, 170), Phaser.Geom.Rectangle.Contains);
        const straw2_interactive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(419, 309, 170, 170), Phaser.Geom.Rectangle.Contains);
        const straw3_interactive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(589, 309, 170, 170), Phaser.Geom.Rectangle.Contains);

        /**
         * Picks up dirty straw when shovel is used on dirty straw and places clean straw when a
         * full pitchfork is used on an empty section of floor.
         * @param {sprite} straw The sprite for the straw being interacted with.
         * @param {string} pickup_anim The name of the animation to play for picking up the straw.
         * @param {string} place_anim The name of the animation to play for placing the straw.
         */
        function clean_straw(straw, pickup_anim, place_anim) {
            if (handcurrent === hand.shovel && straw.frame.name === 'frame0000') {
                straw.play(pickup_anim);
                shovel_sound.play();
                shovel_held_sprite.play('shovel_scoop');
                updateBar(cleanlinessBar, 1/3)
                updateBar(happinessBar, 1/6 + 0.05)
            }
            else if (handcurrent === hand.fork_filled && straw.frame.name === 'frame0006') {
                straw.play(place_anim);
                handcurrent = hand.fork
                fork_place.play()
                strawclean = 2 === straw1.frame.name && 2 === straw2.frame.name && 2 === straw3.frame.name
                updateBar(cleanlinessBar, 1/3)
                updateBar(happinessBar, 1/6 + 0.05)
            }
        }
        straw1_interactive.on('pointerdown', function (pointer) {clean_straw(straw1, 'straw1_pickup', 'straw1_place')});
        straw2_interactive.on('pointerdown', function (pointer) {clean_straw(straw2, 'straw2_pickup', 'straw2_place')});
        straw3_interactive.on('pointerdown', function (pointer) {clean_straw(straw3, 'straw3_pickup', 'straw3_place')});


        // Hay loft
        const hay_loft = this.add.sprite(350, 56, 'hay_loft', 'idle').setInteractive().setScale(.88);
            this.anims.create({
                key: 'get_hay',
                frames: this.anims.generateFrameNumbers('hay_loft', { frames: [
                    'idle', 'idle', 'idle', 'idle', 'idle', 'idle', 'idle', 'idle',
                    'shuffle0000', 'shuffle0001', 'shuffle0000',
                    'idle'
                ] }),
                frameRate: 24
            });
            hay_loft.on('pointerdown', function (pointer)
            {
                if (handcurrent === hand.fork) {
                    handcurrent = hand.fork_filled
                    fork_fill.play()
                    hay_loft.play('get_hay')
                }
            });


        // Water Trough
        trough = this.add.sprite(153, 455, 'trough', 'idle').setInteractive({ pixelPerfect: true });
        const water_sound = this.sound.add('water_sound');
        water_drink = this.sound.add('water_drink');
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
                if (!waterfilled && handcurrent === hand.empty) {
                    waterfilled = true;
                    this.play('fill_water');
                    trough_mask.play('mask_fill_water');
                    water_sound.play()
                    horse_state = horse_states.drink
                    updateBar(hungerBar, 1.5)
                }
            });
            trough.on('pointerover', function (pointer)
            {
                if (!waterfilled && handcurrent === hand.empty) {
                    this.setFrame('hover');
                    hover1.play();
                }
            });
            trough.on('pointerout', function (pointer)
            {
                if (!waterfilled && handcurrent === hand.empty) {
                    this.setFrame('idle');
                }
            });

        // Food Trough
        food_trough = this.add.sprite(104, 303, 'food_trough', 0).setInteractive({ pixelPerfect: true });
        oats_eat = this.sound.add('oats_eat');
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
            food_trough.on('pointerdown', function (pointer)
            {
                if (handcurrent === hand.grain_scoop) {
                    handcurrent = hand.empty;
                    grain_bin.play('place');
                    this.play(foodfilled ? 'fill_again' : 'fill')
                    grain_sound.play()
                    horse_state = horse_states.eating_food
                    if (!foodfilled) {
                        updateBar(hungerBar, 2)
                        updateBar(happinessBar, 1.05)
                    }
                    foodfilled = true;
                }
            });


            // Horse
            horse = this.add.spine(418, 295, 'horse', 'idle').setAngle(90);
            horse_dirty = this.add.spine(418, 295, 'horse_dirty', 'idle').setAngle(90);
            rear_sound = this.sound.add('rear_sound');
            const horse_interactive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(230, 100, 356, 256), Phaser.Geom.Rectangle.Contains);
                // interact with horse
                horse_interactive.on('pointerdown', function (pointer)
                {
                    if (handcurrent === hand.apple) {
                        handcurrent = hand.empty;
                        horse_state = horse_states.eating_apple
                    }
                    else if (handcurrent === hand.brush) {
                        brush_held_sprite.play('brush')
                        brush_sound.play();
                        horse_brushed();
                    }
                    else if (handcurrent === hand.brush_small) {
                        brush_small_held_sprite.play('brush_small')
                        brush_sound_small.play();
                        horse_brushed()
                    }
                });
    
                /**
                 * Updates the horse stats, increments the count of how many times the horse has been brushed
                 * and makes the horse rear when clean
                 */
                function horse_brushed() {
                    if (brushlevel < 2) {
                        brushlevel += 1;
                        updateBar(cleanlinessBar, 1/3)
                        updateBar(happinessBar, 1/6)
                        horse_dirty.setAlpha(0.25 * (4 - brushlevel))
                    }
                    else if (brushlevel === 2) {
                        brushlevel += 1;
                        horse_state = horse_states.rear
                        updateBar(cleanlinessBar, 1/3)
                        updateBar(happinessBar, 1/6)
                        horse_dirty.setAlpha(0)
                    }
                }

        /**
         * Displays the 'hover' frame of a sprite and plays the hover sound if the hand is empty
         * @param {sprite} sprite The sprite to change
         * @param {audio} hover_sound The sound to play on hover
         */
        function pointerover(sprite, hover_sound) {
            if (handcurrent === hand.empty) {
                sprite.setFrame('hover')
                hover_sound.play();
            }
        }
        /**
         * Displays the 'idle' frame of a sprite if the hand is empty
         * @param {sprite} sprite The sprite to change
         */
        function pointerout(sprite) {
            if (handcurrent === hand.empty) {
                sprite.setFrame('idle')
            }
        }


        // Pitchfork
        const fork = this.add.sprite(718, 177, 'fork', 'idle').setInteractive({ pixelPerfect: true });
        const fork_fill = this.sound.add('fork_fill');
        const fork_place = this.sound.add('fork_place');
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
                if (handcurrent === hand.empty) {
                    if (straw1.frame.name === 1 || straw2.frame.name === 1 || straw3.frame.name === 1) {
                        this.setFrame('hover_use');
                    }
                    else {
                        this.setFrame('hover_wait');
                    }
                    hover2.play();
                }
            });
            fork.on('pointerout', function (pointer) { pointerout(fork) });
            fork.on('pointerdown', function (pointer)
            {
                if (handcurrent === hand.empty) {
                    handcurrent = hand.fork;
                    this.setFrame('in_use')
                    pickup.play();
                }
                else if (handcurrent === hand.fork || handcurrent === hand.fork_filled) {
                    handcurrent = hand.empty;
                    this.setFrame('idle')
                }
            });

        // Shovel
        const shovel = this.add.sprite(742, 189, 'shovel', 'idle').setInteractive({ pixelPerfect: true });
        const shovel_sound = this.sound.add('shovel_sound');
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
                if (handcurrent === hand.empty) {
                    if (straw1.frame.name === 1 || straw2.frame.name === 1 || straw3.frame.name === 1) {
                        this.setFrame('hover_done');
                    }
                    else {
                        this.setFrame('hover_use');
                    }
                    hover2.play();
                }
            });
            shovel.on('pointerout', function (pointer) { pointerout (shovel) });
            shovel.on('pointerdown', function (pointer)
            {
                if (handcurrent === hand.empty) {
                    handcurrent = hand.shovel;
                    shovel.setFrame('in_use')
                    pickup.play();
                }
                else if (handcurrent === hand.shovel) {
                    handcurrent = hand.empty;
                    shovel.setFrame('idle')
                }
            });


        // Brush
        const brush = this.add.sprite(767, 100, 'brush', 'idle').setScale(0.75);
        const brush_interactive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(753, 88, 40, 50), Phaser.Geom.Rectangle.Contains);
        const brush_sound = this.sound.add('brush_sound');
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
            brush_interactive.on('pointerdown', function (pointer)
            {
                if (handcurrent === hand.empty) {
                    handcurrent = hand.brush;
                    brush.play('brush_pickup')
                    pickup.play();
                }
                else if (handcurrent === hand.brush) {
                    handcurrent = hand.empty;
                    brush.play('brush_place')
                }
            });
            brush_interactive.on('pointerover', function (pointer) { pointerover (brush, hover1)});
            brush_interactive.on('pointerout', function (pointer) { pointerout (brush)});

        // Small Brush
        const brush_small = this.add.sprite(746, 64, 'brush_small', 'idle');
        const brush_small_interactive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(753, 54, 40, 28), Phaser.Geom.Rectangle.Contains);
        const brush_sound_small = this.sound.add('brush_sound_small');
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
            brush_small_interactive.on('pointerdown', function (pointer)
            {
                if (handcurrent === hand.empty) {
                    handcurrent = hand.brush_small;
                    brush_small.play('brush_pickup_small')
                    pickup.play();
                }
                else if (handcurrent === hand.brush_small) {
                    handcurrent = hand.empty;
                    brush_small.play('brush_place_small')
                }
            });
            brush_small_interactive.on('pointerover', function (pointer){ pointerover (brush_small, hover1) });
            brush_small_interactive.on('pointerout', function (pointer) { pointerout (brush_small) });

        // Hoofpick
        const hoofpick = this.add.sprite(823, 80, 'hoofpick', 'idle').setScale(0.75);
        const hoofpick_interactive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(801, 60, 26, 75), Phaser.Geom.Rectangle.Contains);
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
            hoofpick_interactive.on('pointerdown', function (pointer)
            {
                if (handcurrent === hand.empty) {
                    handcurrent = hand.hoofpick;
                    hoofpick.setFrame('in_use')
                    pickup.play();
                }
                else if (handcurrent === hand.hoofpick) {
                    handcurrent = hand.empty;
                    hoofpick.setFrame('idle')
                }
                hooves1.setVisible(handcurrent === hand.hoofpick)
                hooves2.setVisible(handcurrent === hand.hoofpick)
            });
            hoofpick_interactive.on('pointerover', function (pointer) { pointerover (hoofpick, hover1) });
            hoofpick_interactive.on('pointerout', function (pointer) { pointerout (hoofpick)});


        // Hoof highlight circles
        const hooves1 = this.add.sprite(316, 445, 'hooves', 0).setInteractive().setScale(.84).setVisible(false);
        const hooves2 = this.add.sprite(531, 445, 'hooves', 0).setInteractive().setScale(.84).setVisible(false);
            /**
             * Updates the hoofpick highlight circle to show the next stage, plays the hoofpick use animation
             * and updates the hhorse stat bars if the hooves (at the highlight sprite) need to be cleaned.
             * @param {sprite} sprite The hoof highlight sprite being interacted with
             */
            function clean_hooves(sprite) {
                if (sprite.frame.name <2 && handcurrent === hand.hoofpick) {
                    sprite.setFrame(sprite.frame.name + 1)
                    hoofpick_held_sprite.play('hoofpick_use')
                    updateBar(cleanlinessBar, 0.25)
                    updateBar(happinessBar, 1/8)
                }
            }
            hooves1.on('pointerdown', function (pointer) { clean_hooves(hooves1) });
            hooves2.on('pointerdown', function (pointer) { clean_hooves(hooves2) });


            // Apple Bin
            const apple_bin = this.add.image(680, 505, 'apple_bin', 'idle').setInteractive();
            apple_munch = this.sound.add('apple_munch');
                apple_bin.on('pointerover', function (pointer) { pointerover (apple_bin, hover1) });
                apple_bin.on('pointerout', function (pointer) { apple_bin.setFrame('idle') });
                apple_bin.on('pointerdown', function (pointer)
                {
                    if (handcurrent === hand.empty) {
                        handcurrent = hand.apple;
                        apple_bin.setFrame('idle')
                        pickup.play();
                    }
                });
            
            // Grain Bin
            const grain_bin = this.add.sprite(736, 413, 'grain_bin', 'idle').setInteractive({ pixelPerfect: true });
            const grain_sound = this.sound.add('grain_sound');
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
                grain_bin.on('pointerover', function (pointer) { pointerover (grain_bin, hover2) });
                grain_bin.on('pointerout', function (pointer)
                {
                    if (handcurrent === hand.grain_scoop) {
                        grain_bin.setFrame('empty')
                    }
                    else {
                        grain_bin.setFrame('idle')
                    }
                });
                grain_bin.on('pointerdown', function (pointer)
                {
                    if (handcurrent === hand.empty) {
                        handcurrent = hand.grain_scoop
                        grain_bin.play('pickup')
                        pickup.play();
                        grain_sound.play()
                    }
                });

        
        trough_mask = this.add.sprite(153, 455, 'trough_mask', 'water0000').setVisible(false);
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


        // Inspirational message frame
        const frame = this.add.sprite(516, 118, 'frame', 'idle').setScale(.93);
        this.add.image(517, 126, 'horse_image').setScale(.32);
        const inspiration_hover = this.sound.add('inspiration_hover');
        const inspiration_sound = this.sound.add('inspiration_sound');
        const frame_interactive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(478, 65, 75, 110), Phaser.Geom.Rectangle.Contains);
            frame_interactive.on('pointerover', function (pointer)
            {
                if (can_play_inspiration) {
                    frame.setFrame('hover');
                    inspiration_hover.play()
                }
            });
            frame_interactive.on('pointerout', function (pointer) { frame.setFrame('idle') });
            frame_interactive.on('pointerdown', function (pointer) { 
                if (can_play_inspiration) {
                    play_inspiration = true 
                    inspiration_sound.play()
                }
            })


        // Lucky Horseshoe
        const luck = this.add.sprite(453, 268, 'luck', 'idle').setInteractive({ pixelPerfect: true });
        const luck_sound = this.sound.add('luck_sound');
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
                    luck_sound.play()
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


        // Inspirational message
        inspiration = this.add.image(430, 150, 'inspiration').setScale(.93).setVisible(false);
        inspiration_message = this.add.text(431, 133, 'Static Text Object', { fontFamily: 'Arial', fontSize: 56, color: '#ffffff', align: 'center' }).setVisible(false);
        inspiration_message.text = horse_data.message;
        inspiration_message.setPosition(431-inspiration_message.width/2, 133-inspiration_message.height/2);
        inspiration_message.setShadow(2, 2, '#000000', 7, true, true)



        // ---------- Stable foreground and UI ---------- //
        this.add.image(444, 261, 'stable_fg');

        // Horse name
        const horse_name = this.add.text(444, 133, 'Static Text Object', { fontFamily: 'Arial', fontSize: 12, color: '#ffffff', align: 'center' });
        horse_name.text = horse_data.name;
        horse_name.setPosition(444-horse_name.width/2, 478-horse_name.height/2)

        // Buttons
        // music button
        const music_button = this.add.sprite(867, 498, 'music_button', 'music_on').setInteractive({ pixelPerfect: true });
            music_button.on('pointerdown', function (pointer)
            {
                if (play_music) {
                    backgroundMusic.stop()
                    this.setFrame('music_off_hover')
                }
                else {
                    backgroundMusic.play()
                    this.setFrame('music_on_hover')
                }
                play_music = !play_music
            });
            music_button.on('pointerover', function (pointer) { this.setFrame(`music_${play_music ? 'on' : 'off'}_hover`) });
            music_button.on('pointerout', function (pointer) { this.setFrame(`music_${play_music ? 'on' : 'off'}`) });
        // help button
        const help_button = this.add.sprite(444, 261, 'help_button', 'idle').setInteractive(this.input.makePixelPerfect(150));
            help_button.on('pointerover', function (pointer) { this.setFrame('help') });
            help_button.on('pointerout', function (pointer) { this.setFrame('idle') });


        // Progress bars
        const bar = 13
        // hunger
        const hunger_level = 1.5
        const hunger_pos = 353 - 32 + (hunger_level*bar/2)
        const hunger_width = 1 + hunger_level*bar
        this.add.rectangle(353, 505, 66, 2, 0x5f2041);
            const hungerBar = {
                x: 353,
                leftShine: this.add.rectangle(hunger_pos - hunger_width/2 - 1, 510, 3, 10, 0xfabad0),
                rightShade: this.add.rectangle(hunger_pos + hunger_width/2 + 1, 510, 3, 10, 0x983657),
                topShine: this.add.rectangle(hunger_pos, 506, hunger_width, 3, 0xfabad0),
                bottomShade: this.add.rectangle(hunger_pos, 514, hunger_width, 2, 0x983657),
                progress: this.add.rectangle(hunger_pos, 510, hunger_width, 7, 0xff6699),
                level: hunger_level
            }
            this.add.image(351, 509, 'hunger_scale');

        // cleanliness
        const cleanliness_level = 1
        const cleanliness_pos = 446 - 32 + (cleanliness_level*bar/2)
        const cleanliness_width = 1 + cleanliness_level*bar
        this.add.rectangle(446, 505, 66, 2, 0x123625);
            const cleanlinessBar = {
                x: 446,
                leftShine: this.add.rectangle(cleanliness_pos - cleanliness_width/2 - 1, 510, 3, 10, 0xb2f3b1),
                rightShade: this.add.rectangle(cleanliness_pos + cleanliness_width/2 + 1, 510, 3, 10, 0x1d7429),
                topShine: this.add.rectangle(cleanliness_pos, 506, cleanliness_width, 3, 0xb2f3b1),
                bottomShade: this.add.rectangle(cleanliness_pos, 514, cleanliness_width, 2, 0x1d7429),
                progress: this.add.rectangle(cleanliness_pos, 510, cleanliness_width, 7, 0x2fce30),
                level: cleanliness_level
            }
            this.add.image(444, 509, 'cleanliness_scale');

        // happiness
        const happiness_level = 1.75
        const happiness_pos = 542 - 32 + (happiness_level*bar/2)
        const happiness_width = 1 + happiness_level*bar
        this.add.rectangle(542, 505, 66, 2, 0x002353);
            const happinessBar = {
                x: 542,
                leftShine: this.add.rectangle(happiness_pos - happiness_width/2 - 1, 510, 3, 10, 0xb4e2fb),
                rightShade: this.add.rectangle(happiness_pos + happiness_width/2 + 1, 510, 3, 10, 0x004673),
                topShine: this.add.rectangle(happiness_pos, 506, happiness_width, 3, 0xb4e2fb),
                bottomShade: this.add.rectangle(happiness_pos, 514, happiness_width, 2, 0x004673),
                progress: this.add.rectangle(happiness_pos, 510, happiness_width, 7, 0x0099ff),
                level: happiness_level
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


        // ---------- Held items ---------- //
        fork_held_sprite = this.add.sprite(735, 240, 'fork').setVisible(false);
        shovel_held_sprite = this.add.sprite(759, 272, 'shovel').setVisible(false);
        grain_held_sprite = this.add.image(759, 272, 'grain_scoop').setVisible(false);
        brush_held_sprite = this.add.sprite(759, 272, 'brush', 'hold').setVisible(false);
        brush_small_held_sprite = this.add.sprite(759, 272, 'brush_small', 'hold').setVisible(false);
        hoofpick_held_sprite = this.add.sprite(759, 272, 'hoofpick').setVisible(false);
        apple_held_sprite = this.add.image(759, 272, 'apple_held').setVisible(false);
    }

    update ()
    {
        const pointer = this.input.activePointer;
            
        // clear held items from display
        function clearCursor() {
            shovel_held_sprite.setVisible(false);
            fork_held_sprite.setVisible(false);
            grain_held_sprite.setVisible(false);
            brush_held_sprite.setVisible(false);
            brush_small_held_sprite.setVisible(false);
            hoofpick_held_sprite.setVisible(false);
            apple_held_sprite.setVisible(false);
        }

        // display held items under cursor
        if (handcurrent === hand.shovel) {
            shovel_held_sprite.setPosition(pointer.worldX-18, pointer.worldY+35);
            if (!shovel_held_sprite.visible) {
                shovel_held_sprite.setVisible(true).play('shovel_pickup');
            }
        }
        else if (handcurrent === hand.fork) {
            fork_held_sprite.setPosition(pointer.worldX-20, pointer.worldY+45)
            if (!fork_held_sprite.visible) {
                fork_held_sprite.setVisible(true).play('fork_pickup');
            }
            else if (fork_held_sprite.anims.getName() === 'fork_fill') {
                fork_held_sprite.play('fork_place')
            }
        }
        else if (handcurrent === hand.fork_filled) {
            fork_held_sprite.setPosition(pointer.worldX-20, pointer.worldY+45)
            if (fork_held_sprite.anims.getName() === 'fork_pickup' || fork_held_sprite.anims.getName() === 'fork_place') {
                fork_held_sprite.play('fork_fill')
            }
        }
        else if (handcurrent === hand.grain_scoop) {
            grain_held_sprite.setPosition(pointer.worldX, pointer.worldY)
            if (!grain_held_sprite.visible) {
                grain_held_sprite.setAlpha(0).setVisible(true)
                this.time.delayedCall(630, function () {grain_held_sprite.setAlpha(.5)});
                this.time.delayedCall(670, function () {grain_held_sprite.setAlpha(.7)});
                this.time.delayedCall(710, function () {grain_held_sprite.setAlpha(.9)});
                this.time.delayedCall(750, function () {grain_held_sprite.setAlpha(1)});
            }
            
        }
        else if (handcurrent === hand.brush) {
            brush_held_sprite.setPosition(pointer.worldX-5, pointer.worldY+20);
            if (!brush_held_sprite.visible) {
                brush_held_sprite.setAlpha(0).setVisible(true)
                this.time.delayedCall(250, function () {brush_held_sprite.setAlpha(1)});
            }
        }
        else if (handcurrent === hand.brush_small) {
            brush_small_held_sprite.setPosition(pointer.worldX-8, pointer.worldY+8);
            if (!brush_small_held_sprite.visible) {
                brush_small_held_sprite.setAlpha(0).setVisible(true)
                this.time.delayedCall(250, function () {brush_small_held_sprite.setAlpha(1)});
            }
        }
        else if (handcurrent === hand.hoofpick) {
            hoofpick_held_sprite.setPosition(pointer.worldX, pointer.worldY);
            if (!hoofpick_held_sprite.visible) {
                hoofpick_held_sprite.setVisible(true).play('hoofpick_pickup');
            }
        }
        else if (handcurrent === hand.apple) {
            clearCursor()
            apple_held_sprite.setVisible(true).setPosition(pointer.worldX, pointer.worldY);
        }
        else {
            clearCursor()
        }


        if (hoofpick_held_sprite.anims.getName() === 'hoofpick_use' && hoofpick_held_sprite.anims.getProgress() === 0) {
            this.time.delayedCall(80, function () {hoofpick1.play()});
            this.time.delayedCall(380, function () {hoofpick2.play()});
        }


        function start_animation() {
            horse_state = horse_states.busy
            horse_busy = true
        }
        function end_animation() {
            // only change state if no other animation is queued
            if (horse_state === horse_states.busy) {
                horse_state = horse_states.idle; 
            }
            // allow next animation to play
            horse_busy = false
            horse_busy_idling = false
        }

        function randomIntFromInterval(min, max) { // min and max included 
            return Math.floor(Math.random() * (max - min + 1) + min)
        }

        if (horse_busy === false && horse_state === horse_states.rear) {
            start_animation()
            rear_sound.play();
            horse.play('rear');
            horse_dirty.play('rear');
            this.time.delayedCall(3000, function () { 
                end_animation()
             });
        } 
        else if (horse_busy === false && horse_state === horse_states.drink) {
            start_animation()
            this.time.delayedCall(2800, function () {
                trough_mask.setVisible(true)
                trough.play('water_trough_drink')
                trough_mask.play('mask_water_trough_drink')
                horse.play('drink')
                horse_dirty.play('drink')
            });
            this.time.delayedCall(3330, function () {
                water_drink.play()
            });
            this.time.delayedCall(5000, function () {
                trough_mask.setVisible(false)
            });
            this.time.delayedCall(6000, function () { 
                end_animation()
            });
        }
        else if (horse_busy === false && horse_state === horse_states.eating_food) {
            start_animation()
            this.time.delayedCall(800, function () {horse.play('eat_food'); horse_dirty.play('eat_food')});
            this.time.delayedCall(1000, function () {oats_eat.play()});
            this.time.delayedCall(3000, function () { 
                end_animation()
            });
        }
        else if (horse_busy === false && horse_state === horse_states.eating_apple) {
            start_animation()
            apple_munch.play();
            horse.play('eat_apple')
            horse_dirty.play('eat_apple')
            this.time.delayedCall(3000, function () { 
                end_animation()
            });
        }
        else if (horse_state === horse_states.idle && !horse_busy && !horse_busy_idling) {
            horse_state = horse_states.busy
            horse_busy_idling = true
            this.time.delayedCall(randomIntFromInterval(3000, 5000), function () {
                if ( horse_state === horse_states.busy && !horse_busy) {
                    const horse_idle_animations = ['ear_twitch', 'flank_twitch', 'head_shake', 'head_turn', 'nod', 'paw_ground', 'shift weight', 'tail_swish']
                    let animation = horse_idle_animations[Math.floor(Math.random()*horse_idle_animations.length)]
                    horse.play(animation);
                    horse_dirty.play(animation);
                    if (horse_state === horse_states.busy) {
                        horse_state = horse_states.idle; 
                    }
                    horse_busy_idling = false
                };
            })
        }

        // Displays inspirational message
        if (play_inspiration) {
            play_inspiration = false
            can_play_inspiration = false
            inspiration.setVisible(true).setAlpha(0)
            inspiration_message.setVisible(true).setAlpha(0)
            this.time.delayedCall(40, function () {inspiration.setAlpha(.1); inspiration_message.setAlpha(0.1)});
            this.time.delayedCall(80, function () {inspiration.setAlpha(.2); inspiration_message.setAlpha(0.2)});
            this.time.delayedCall(120, function () {inspiration.setAlpha(.3); inspiration_message.setAlpha(0.3)});
            this.time.delayedCall(160, function () {inspiration.setAlpha(.4); inspiration_message.setAlpha(0.4)});
            this.time.delayedCall(200, function () {inspiration.setAlpha(.5); inspiration_message.setAlpha(0.5)});
            this.time.delayedCall(240, function () {inspiration.setAlpha(.6); inspiration_message.setAlpha(0.6)});
            this.time.delayedCall(280, function () {inspiration.setAlpha(.7); inspiration_message.setAlpha(0.7)});
            this.time.delayedCall(320, function () {inspiration.setAlpha(.8); inspiration_message.setAlpha(0.8)});
            this.time.delayedCall(360, function () {inspiration.setAlpha(.9); inspiration_message.setAlpha(0.9)});
            this.time.delayedCall(400, function () {inspiration.setAlpha(1); inspiration_message.setAlpha(1)});
            this.time.delayedCall(2960, function () {inspiration.setAlpha(.9); inspiration_message.setAlpha(0.9)});
            this.time.delayedCall(3000, function () {inspiration.setAlpha(.8); inspiration_message.setAlpha(0.8)});
            this.time.delayedCall(3040, function () {inspiration.setAlpha(.7); inspiration_message.setAlpha(0.7)});
            this.time.delayedCall(3080, function () {inspiration.setAlpha(.6); inspiration_message.setAlpha(0.6)});
            this.time.delayedCall(3120, function () {inspiration.setAlpha(.5); inspiration_message.setAlpha(0.5)});
            this.time.delayedCall(3160, function () {inspiration.setAlpha(.4); inspiration_message.setAlpha(0.4)});
            this.time.delayedCall(3200, function () {inspiration.setAlpha(.3); inspiration_message.setAlpha(0.3)});
            this.time.delayedCall(3240, function () {inspiration.setAlpha(.2); inspiration_message.setAlpha(0.2)});
            this.time.delayedCall(3280, function () {inspiration.setAlpha(.1); inspiration_message.setAlpha(0.1)});
            this.time.delayedCall(3320, function () {
                inspiration.setAlpha(0); 
                inspiration_message.setAlpha(0); 
                can_play_inspiration = true;
            });
            
        }
    }
}