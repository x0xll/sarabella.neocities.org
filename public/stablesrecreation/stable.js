play_music = true;
hand = {
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
done = false;

shovel_held_sprite = null
fork_held_sprite = null
grain_held_sprite = null
brush_held_sprite = null
hoofpick_held_sprite = null
apple_held_sprite = null

class Example extends Phaser.Scene
{
    constructor ()
    {
        super({
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: './SpinePluginDebug.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    preload ()
    {
        this.load.image('stable', './images/stable/stable-bg.png');
        this.load.image('hunger_scale', './images/stable/hunger.png');
        this.load.image('cleanliness_scale', './images/stable/cleanliness.png');
        this.load.image('happiness_scale', './images/stable/happiness.png');

        this.load.atlas('shovel', './images/stable/shovel.png', './images/stable/shovel.json');
        this.load.image('shovel_held', './images/stable/shovel_held.png');
        this.load.atlas('fork', './images/stable/fork.png', './images/stable/fork.json');
        this.load.spritesheet('fork_held', './images/stable/fork_held.png', { frameWidth: 157, frameHeight: 167 });
        this.load.spritesheet('straw1', './images/stable/straw1.png', { frameWidth: 216, frameHeight: 143 });
        this.load.spritesheet('straw2', './images/stable/straw2.png', { frameWidth: 180, frameHeight: 126 });
        this.load.spritesheet('straw3', './images/stable/straw3.png', { frameWidth: 236, frameHeight: 150 });
        this.load.image('straw_bales', './images/stable/straw_bales.png');

        this.load.atlas('trough', './images/stable/trough.png', './images/stable/trough.json');
        this.load.atlas('food_trough', './images/stable/food.png', './images/stable/food.json');
        this.load.image('grain_bin', './images/stable/grain_bin.png');
        this.load.image('grain_scoop', './images/stable/grain_scoop.png');
        this.load.image('apple_bin', './images/stable/apples.png');
        this.load.image('apple_held', './images/stable/apple.png');
        
        this.load.image('brush_held', './images/stable/brush_held.png');
        this.load.atlas('brush', './images/stable/brush.png', './images/stable/brush.json');
        this.load.image('hoofpick_held', './images/stable/hoofpick_held.png');
        this.load.atlas('hoofpick', './images/stable/hoofpick.png', './images/stable/hoofpick.json');
        this.load.spritesheet('hooves', './images/stable/hooves.png', { frameWidth: 45, frameHeight: 45 });

        this.load.spine('horse', './images/horse/horse.json', ['./images/horse/peter.atlas'], true);

        this.load.spritesheet('music_button', './images/stable/music.png', { frameWidth: 36, frameHeight: 36 });

        this.load.audio('background_music', ['./sounds/stable_soundtrack.mp3']);
        this.load.audio('shovel_sound', ['./sounds/shovel_sound.mp3']);
        this.load.audio('fork_sound', ['./sounds/fork_fill.mp3']);
        this.load.audio('fork_grain_place', ['./sounds/fork+grain_place.mp3']);
        this.load.audio('grain_sound', ['./sounds/grain_fill.mp3']);
        this.load.audio('water_sound', ['./sounds/water_sound.mp3']);
        this.load.audio('hoofpick_sound', ['./sounds/hoof_scrape.mp3']);
        this.load.audio('apple_sound', ['./sounds/apple_munch.mp3']);
        this.load.audio('brush_sound', ['./sounds/brush_sound.mp3']);
    }

    create ()
    {
        //  If you disable topOnly it will fire events for all objects the pointer is over, regardless of place on the display list
        this.input.topOnly = false;

        const backgroundMusic = this.sound.add('background_music');
        backgroundMusic.loop = true; 
        backgroundMusic.play();

        this.add.image(427, 251, 'stable');
        const music_button = this.add.sprite(832, 480, 'music_button', 0).setInteractive({ pixelPerfect: true });

        const straw2 = this.add.sprite(481, 387, 'straw2', 0).setInteractive();
        const straw1 = this.add.sprite(315, 380, 'straw1', 0).setInteractive();
        const straw3 = this.add.sprite(632, 376, 'straw3', 0).setInteractive();
        const straw_bales = this.add.sprite(333, 45, 'straw_bales', 0).setInteractive();

        const fork = this.add.sprite(735, 240, 'fork', 0).setInteractive({ pixelPerfect: true });
        const shovel = this.add.sprite(759, 272, 'shovel', 0).setInteractive({ pixelPerfect: true });
        const apple_bin = this.add.image(649, 454, 'apple_bin').setInteractive();
        const grain_bin = this.add.image(733, 415, 'grain_bin').setInteractive({ pixelPerfect: true });
        const food_trough = this.add.sprite(139, 236, 'food_trough', 0).setInteractive({ pixelPerfect: true });
        const brush = this.add.sprite(739, 110, 'brush', 0).setInteractive({ pixelPerfect: true });
        const hoofpick = this.add.sprite(781, 99, 'hoofpick', 0).setInteractive({ pixelPerfect: true });

        // trough
        const trough = this.add.sprite(181, 418, 'trough', 0).setInteractive({ pixelPerfect: true });
        this.anims.create({
            key: 'fill_water',
            frames: this.anims.generateFrameNumbers('trough', { frames: [ 1, 2, 3 ] }),
            frameRate: 4
        });

        // horse
        const horse = this.add.spine(403, 283, 'horse', 'idle').setAngle(90);
        // const horse_interactive = graphics.setInteractive(new Phaser.Geom.Rectangle(0, 0, 128, 128), Phaser.Geom.Rectangle.Contains);

        const graphics = this.add.graphics()
        const horse_interactive = graphics.setInteractive(new Phaser.Geom.Rectangle(180, 100, 356, 256), Phaser.Geom.Rectangle.Contains);
        // .fillStyle(0xff00ff, 0.5).fillRect(180, 100, 356, 256).setInteractive();

        const hooves1 = this.add.sprite(305, 427, 'hooves', 0).setInteractive().setVisible(false);
        const hooves2 = this.add.sprite(510, 427, 'hooves', 0).setInteractive().setVisible(false);


        // held items
        fork_held_sprite = this.add.image(735, 240, 'fork_held').setVisible(false);
        shovel_held_sprite = this.add.image(759, 272, 'shovel_held').setVisible(false);
        grain_held_sprite = this.add.image(759, 272, 'grain_scoop').setVisible(false);
        brush_held_sprite = this.add.image(759, 272, 'brush_held').setVisible(false);
        hoofpick_held_sprite = this.add.image(759, 272, 'hoofpick_held').setVisible(false);
        apple_held_sprite = this.add.image(759, 272, 'apple_held').setVisible(false);

        const shovel_sound = this.sound.add('shovel_sound');
        const fork_sound = this.sound.add('fork_sound');
        const fork_grain_place_sound = this.sound.add('fork_grain_place');
        const grain_sound = this.sound.add('grain_sound');
        const water_sound = this.sound.add('water_sound');
        const hoofpick_sound = this.sound.add('hoofpick_sound');
        const apple_sound = this.sound.add('apple_sound');
        const brush_sound = this.sound.add('brush_sound');
        
        this.input.topOnly = true; // don't allow objects to be interacted with when they are lower

        // mute button
        music_button.on('pointerdown', function (pointer)
        {
            if (play_music) {
                backgroundMusic.stop()
                this.setFrame(1)
            }
            else {
                backgroundMusic.play()
                this.setFrame(0)
            }
            play_music = !play_music
        });
        
        // pick up and return items
        function set_tool(tool, sprite) {
            if (handcurrent === hand.empty) {
                handcurrent = tool;
                sprite.setFrame(1)
            }
            else if (handcurrent === tool) {
                handcurrent = hand.empty;
                sprite.setFrame(0)
            }
        }
        shovel.on('pointerdown', function (pointer)
        {
            set_tool(hand.shovel, shovel)
        });
        fork.on('pointerdown', function (pointer)
        {
            if (handcurrent === hand.empty) {
                handcurrent = hand.fork;
                this.setFrame(1)
            }
            else if (handcurrent === hand.fork || handcurrent === hand.fork_filled) {
                handcurrent = hand.empty;
                this.setFrame(0)
            }
        });
        grain_bin.on('pointerdown', function (pointer)
        {
            if (!foodfilled && handcurrent === hand.empty) {
                handcurrent = hand.grain_scoop
                grain_bin.setVisible(false)
                grain_sound.play()
            }
        });
        apple_bin.on('pointerdown', function (pointer)
        {
            if (handcurrent === hand.empty) {
                handcurrent = hand.apple;
            }
        });
        brush.on('pointerdown', function (pointer)
        {
            set_tool(hand.brush, brush)
        });
        hoofpick.on('pointerdown', function (pointer)
        {
            set_tool(hand.hoofpick, hoofpick)
            hooves1.setVisible(handcurrent === hand.hoofpick)
            hooves2.setVisible(handcurrent === hand.hoofpick)
        });

        // pick up dirty straw and place clean straw
        function clean_straw(straw) {
            if (handcurrent === hand.shovel && straw.frame.name === 0) {
                straw.setFrame(1);
                shovel_sound.play();
                updateBar(cleanlinessBar, 1/3)
                updateBar(happinessBar, 1/6 + 0.05)
            }
            else if (handcurrent === hand.fork_filled && straw.frame.name === 1) {
                straw.setFrame(2);
                handcurrent = hand.fork
                fork_grain_place_sound.play()
                strawclean = 2 === straw1.frame.name && 2 === straw2.frame.name && 2 === straw3.frame.name
                updateBar(cleanlinessBar, 1/3)
                updateBar(happinessBar, 1/6 + 0.05)
            }
        }
        straw1.on('pointerdown', function (pointer) {clean_straw(straw1)});
        straw2.on('pointerdown', function (pointer) {clean_straw(straw2)});
        straw3.on('pointerdown', function (pointer) {clean_straw(straw3)});

        straw_bales.on('pointerdown', function (pointer)
        {
            if (handcurrent === hand.fork) {
                handcurrent = hand.fork_filled
                fork_sound.play()
            }
        });

        // place food
        food_trough.on('pointerdown', function (pointer)
        {
            if (!foodfilled && handcurrent === hand.grain_scoop) {
                handcurrent = hand.empty;
                foodfilled = true;
                grain_bin.setVisible(true);
                this.setFrame(1);
                fork_grain_place_sound.play()
                updateBar(hungerBar, 2)
                updateBar(happinessBar, 1.05)
            }
        });

        // fill water
        trough.on('pointerdown', function (pointer)
        {
            if (!waterfilled && handcurrent === hand.empty) {
                waterfilled = true;
                this.play('fill_water');
                water_sound.play()
                updateBar(hungerBar, 1.5)
                horse.play('drink')
            }
        });

        // clean hooves
        function clean_hooves(sprite) {
            if (sprite.frame.name <2 && handcurrent === hand.hoofpick) {
                sprite.setFrame(sprite.frame.name + 1)
                hoofpick_sound.play()
                updateBar(cleanlinessBar, 0.25)
                updateBar(happinessBar, 1/8)
            }
        }
        hooves1.on('pointerdown', function (pointer) { clean_hooves(hooves1) });
        hooves2.on('pointerdown', function (pointer) { clean_hooves(hooves2) });

        // interact with horse
        horse_interactive.on('pointerdown', function (pointer)
        {
            if (handcurrent === hand.apple) {
                handcurrent = hand.empty;
                apple_sound.play();
            }
            else if (handcurrent === hand.brush) {
                brush_sound.play();
                if (brushlevel < 2) {
                    brushlevel += 1;
                    updateBar(cleanlinessBar, 1/3)
                    updateBar(happinessBar, 1/6)
                }
                else if (brushlevel === 2) {
                    brushlevel += 1;
                    horse.play('rear');
                    updateBar(cleanlinessBar, 1/3)
                    updateBar(happinessBar, 1/6)
                }
            }
        });

        // progress bars
        const bar = 13
        // hunger
        const hunger_level = 1.5
        const hunger_pos = 338 - 32 + (hunger_level*bar/2)
        const hunger_width = 1 + hunger_level*bar
        this.add.rectangle(338, 487, 66, 3, 0x5f2041);
        this.add.rectangle(338, 491, 66, 8, 0xfd575d);
        const hungerBar = {
            x: 338,
            leftShine: this.add.rectangle(hunger_pos - hunger_width/2 - 1, 490, 3, 10, 0xfabad0),
            rightShade: this.add.rectangle(hunger_pos + hunger_width/2 + 1, 491, 3, 10, 0x983657),
            topShine: this.add.rectangle(hunger_pos, 487, hunger_width, 3, 0xfabad0),
            bottomShade: this.add.rectangle(hunger_pos, 495, hunger_width, 2, 0x983657),
            progress: this.add.rectangle(hunger_pos, 491, hunger_width, 7, 0xff6699),
            level: hunger_level
        }
        this.add.image(336, 491, 'hunger_scale');

        // cleanliness
        const cleanliness_level = 1
        const cleanliness_pos = 428 - 32 + (cleanliness_level*bar/2)
        const cleanliness_width = 1 + cleanliness_level*bar
        this.add.rectangle(428, 487, 66, 3, 0x123625);
        this.add.rectangle(428, 491, 66, 8, 0x37a66f);
        const cleanlinessBar = {
            x: 428,
            leftShine: this.add.rectangle(cleanliness_pos - cleanliness_width/2 - 1, 490, 3, 10, 0xb2f3b1),
            rightShade: this.add.rectangle(cleanliness_pos + cleanliness_width/2 + 1, 491, 3, 10, 0x1d7429),
            topShine: this.add.rectangle(cleanliness_pos, 487, cleanliness_width, 3, 0xb2f3b1),
            bottomShade: this.add.rectangle(cleanliness_pos, 495, cleanliness_width, 2, 0x1d7429),
            progress: this.add.rectangle(cleanliness_pos, 491, cleanliness_width, 7, 0x2fce30),
            level: cleanliness_level
        }
        this.add.image(426, 491, 'cleanliness_scale');

        // happiness
        const happiness_level = 1.75
        const happiness_pos = 520 - 32 + (happiness_level*bar/2)
        const happiness_width = 1 + happiness_level*bar
        this.add.rectangle(520, 487, 66, 3, 0x002353);
        this.add.rectangle(520, 491, 66, 8, 0x00ccff);
        const happinessBar = {
            x: 520,
            leftShine: this.add.rectangle(happiness_pos - happiness_width/2 - 1, 490, 3, 10, 0xb4e2fb),
            rightShade: this.add.rectangle(happiness_pos + happiness_width/2 + 1, 491, 3, 10, 0x004673),
            topShine: this.add.rectangle(happiness_pos, 487, happiness_width, 3, 0xb4e2fb),
            bottomShade: this.add.rectangle(happiness_pos, 495, happiness_width, 2, 0x004673),
            progress: this.add.rectangle(happiness_pos, 491, happiness_width, 7, 0x0099ff),
            level: happiness_level
        }
        this.add.image(519, 491, 'happiness_scale');

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
            
        // clear held items from display
        function clearCursor() {
            shovel_held_sprite.setVisible(false);
            fork_held_sprite.setVisible(false);
            grain_held_sprite.setVisible(false);
            brush_held_sprite.setVisible(false);
            hoofpick_held_sprite.setVisible(false);
            apple_held_sprite.setVisible(false);
        }

        // display held items under cursor
        if (handcurrent === hand.shovel) {
            clearCursor()
            shovel_held_sprite.setVisible(true).setPosition(pointer.worldX+15, pointer.worldY-30);
        }
        else if (handcurrent === hand.fork) {
            clearCursor()
            fork_held_sprite.setFrame(0).setVisible(true).setPosition(pointer.worldX+20, pointer.worldY-20);
        }
        else if (handcurrent === hand.fork_filled) {
            clearCursor()
            fork_held_sprite.setFrame(1).setVisible(true).setPosition(pointer.worldX+20, pointer.worldY-20);
        }
        else if (handcurrent === hand.grain_scoop) {
            clearCursor()
            grain_held_sprite.setVisible(true).setPosition(pointer.worldX, pointer.worldY);
        }
        else if (handcurrent === hand.brush) {
            clearCursor()
            brush_held_sprite.setVisible(true).setPosition(pointer.worldX, pointer.worldY);
        }
        else if (handcurrent === hand.hoofpick) {
            clearCursor()
            hoofpick_held_sprite.setVisible(true).setPosition(pointer.worldX, pointer.worldY);
        }
        else if (handcurrent === hand.apple) {
            clearCursor()
            apple_held_sprite.setVisible(true).setPosition(pointer.worldX, pointer.worldY);
        }
        else {
            clearCursor()
        }
    }
}