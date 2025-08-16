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
        const game = this
        game.stablesManager = new StablesManager(game)

        // LOADING BAR
        game.stablesManager.preloadDisplayLoadBar()
            
        // Load in images and sounds
        game.load.image('stable_bg', './images/waterStable/stable-bg.png');
        game.load.image('stable_fg', './images/waterStable/stable-fg.png');
        game.load.image('hunger_scale', './images/waterStable/hunger.png');
        game.load.image('cleanliness_scale', './images/waterStable/cleanliness.png');
        game.load.image('happiness_scale', './images/waterStable/happiness.png');

        game.load.atlas('water', './images/waterStable/water.png', './images/waterStable/water.json');
        game.load.atlas('water_spinner', './images/waterStable/water_spinner.png', './images/waterStable/water_spinner.json');
        game.load.atlas('water_spinner_holder', './images/waterStable/water_spinner_holder.png', './images/waterStable/water_spinner_holder.json');
        
        game.load.atlas('brush', './images/waterStable/brush.png', './images/waterStable/brush_updated.json');
        game.load.atlas('brush_small', './images/waterStable/brush_small.png', './images/waterStable/brush_small_updated.json');
        game.load.atlas('hoofpick', './images/waterStable/polisher.png', './images/waterStable/polisher.json');
        game.load.atlas('bubbles1', './images/waterStable/bubbles1.png', './images/waterStable/bubbles1.json');
        game.load.atlas('bubbles2', './images/waterStable/bubbles2.png', './images/waterStable/bubbles2.json');
        game.load.atlas('bubbles3', './images/waterStable/bubbles3.png', './images/waterStable/bubbles3.json');

        game.load.atlas('speaker', './images/waterStable/speaker.png', './images/waterStable/speaker.json');
        game.load.atlas('treat_dispenser', './images/waterStable/treat_dispenser.png', './images/waterStable/treat_dispenser.json');
        game.load.image('apple', './images/waterStable/treat_held.png');
        game.load.atlas('food', './images/waterStable/food.png', './images/waterStable/food.json');

        game.load.atlas('temperature_bar', './images/waterStable/temperature_bar.png', './images/waterStable/temperature_bar.json');
        game.load.atlas('temperature_buttons', './images/waterStable/temperature_buttons.png', './images/waterStable/temperature_buttons.json');
        game.load.atlas('temperature_bg', './images/waterStable/temperature_bg.png', './images/waterStable/temperature_bg.json');
        
        game.load.spineAtlas("horse-atlas", `./images/horses/${horseName}/skeleton.atlas`);
        game.load.spineAtlas("horse_overlay-atlas", `./images/horses/${horseName}/skeleton_overlay.atlas`);
        game.load.spineJson("horse-json", `./images/horses/${horseName}/skeleton.json`);
        game.load.spineJson("horse_overlay-json", `./images/horses/${horseName}/skeleton_overlay.json`);
        if (horseName === 'wavebreaker') {
            game.load.spineAtlas("horse_dirty-atlas", `./images/waterStable/hippocampus_dirty/dirt_skeleton.atlas`);
            game.load.spineJson("horse_dirty-json", `./images/waterStable/hippocampus_dirty/dirt_skeleton.json`);
        } else {
            game.load.spineAtlas("horse_dirty-atlas", `./images/waterStable/horse_dirty/dirt_skeleton.atlas`);
            game.load.spineJson("horse_dirty-json", `./images/waterStable/horse_dirty/dirt_skeleton.json`);
        }

        game.load.image('horse_image', `./images/horses/${horseName}/card_image.jpg`);

        game.load.image('frame', './images/waterStable/frame.png');
        game.load.image('inspiration', './images/waterStable/inspiration.png');

        game.load.atlas('music_button', './images/waterStable/music.png', './images/waterStable/music.json');
        game.load.atlas('help_button', './images/waterStable/help.png', './images/waterStable/help.json');
        game.load.image('stat_box', './images/StatBox.png');
        game.load.image('goworld_box', './images/waterStable/ToWorldBox.png');

        game.stablesManager.preloadAudio({
            'sootheSound': `./sounds/water_soothe_sound.mp3`,
            'sootheSoundLength': `./sounds/water_soothe_sound_length.mp3`,
            'foodDispenseSound': `./sounds/food_drop.mp3`,
            'treatDispenseSound': `./sounds/treat_dispense.mp3`,
            'splash1Sound': `./sounds/water_splash1.mp3`,
            // 'splash2Sound': `./sounds/water_splash2.mp3`,
            // 'splash3Sound': `./sounds/water_splash3.mp3`,
            'bubbleClick': `./sounds/bubble_click.mp3`,
            'bubbleReplaceSound': `./sounds/bubble_new.mp3`,
            'bubbleSound': `./sounds/bubbles.mp3`,
            'polisherSound': `./sounds/polisher.mp3`,
            'drainWater': `./sounds/drain_water.mp3`,
            'tempChange': `./sounds/temperature_change.mp3`,
            'tempPerfect': `./sounds/temperature_perfect.mp3`
        })
    }

    create ()
    {
        const game = this
        game.stablesManager.createScene()

        // // Text boxes
        // const hoverTextSettings = { 
        //     font: 'bold 16px Arial', 
        //     align: 'center',
        //     color: '#ffffff',
        //     wordWrap: { width: 125 } ,
        //     lineSpacing: -3
        // }
     
        // Temp Change BG
        const temperatureBG = game.add.sprite(560, 110, 'temperature_bg', 'idle').setScale(1.02)
            game.stablesManager.addSpriteAnims(temperatureBG, 'BG_cool', [
                    'cool0000', 'cool0001', 'cool0002', 'cool0003', 'cool0004', 'cool0005', 'cool0006', 'cool0007', 'cool0008', 'cool0009',
                    'cool0010', 'cool0011', 'cool0012', 'cool0013', 'cool0014', 'cool0015', 'cool0016', 'cool0017', 'cool0018', 'cool0019',
                    'cool0020', 'cool0021', 'cool0022', 'cool0023', 'cool0024', 'cool0025', 'cool0026', 'cool0027', 'cool0028', 'cool0029',
                    'cool0030', 'cool0031', 'cool0032', 'cool0033', 'cool0034', 'cool0035', 'cool0036', 'cool0037', 'cool0038', 'cool0039',
                    'cool0040', 'cool0041', 'cool0042', 'cool0043', 'cool0044', 'cool0045', 'cool0046', 'cool0047', 'cool0048', 'cool0049',
                    'cool0050', 'cool0051', 'cool0052', 'cool0053', 'cool0054', 'cool0055', 'cool0056', 'cool0057', 'cool0058', 'cool0059',
                    'cool0060', 'cool0061', 'cool0062', 'cool0063', 'cool0064', 'cool0065', 'cool0066',
                    'idle'
                ])
                game.stablesManager.addSpriteAnims(temperatureBG, 'BG_heat', [
                    'heat0000', 'heat0001', 'heat0002', 'heat0003', 'heat0004', 'heat0005', 'heat0006', 'heat0007', 'heat0008', 'heat0009',
                    'heat0010', 'heat0011', 'heat0012', 'heat0013', 'heat0014', 'heat0015', 'heat0016', 'heat0017', 'heat0018', 'heat0019',
                    'heat0020', 'heat0021', 'heat0022', 'heat0023', 'heat0024', 'heat0025', 'heat0026', 'heat0027', 'heat0028', 'heat0029',
                    'heat0030', 'heat0031', 'heat0032', 'heat0033', 'heat0034', 'heat0035', 'heat0036', 'heat0037', 'heat0038', 'heat0039',
                    'heat0040', 'heat0041', 'heat0042', 'heat0043', 'heat0044', 'heat0045', 'heat0046', 'heat0047', 'heat0048', 'heat0049',
                    'heat0050', 'heat0051', 'heat0052', 'heat0053', 'heat0054', 'heat0055', 'heat0056', 'heat0057', 'heat0058', 'heat0059',
                    'heat0060', 'heat0061', 'heat0062', 'heat0063', 'heat0064', 'heat0065', 'heat0066',
                    'idle'
                ])


        // Brush
        const brush = game.add.sprite(690, 138, 'brush', 'idle').setScale(0.76).setAngle(90).setInteractive({ pixelPerfect: true });
        // const brushInteractive = game.add.graphics().setInteractive(new Phaser.Geom.Rectangle(753, 88, 40, 50), Phaser.Geom.Rectangle.Contains);
            game.stablesManager.addSpriteAnims(brush, 'brush_pickup', [
                    'pickup0000', 'pickup0001', 'pickup0002', 'pickup0003', 'pickup0004', 'pickup0005', 'pickup0006',
                    'in_use'
                ])
            game.stablesManager.addSpriteAnims(brush, 'brush_use', [
                    'hold',
                    'brush0000', 'brush0001', 'brush0002', 'brush0003', 'brush0004', 'brush0005', 'brush0006', 'brush0007', 'brush0008', 'brush0009', 'brush0010',
                    'brush0000', 'brush0011', 'brush0012', 'brush0013', 'brush0014', 'brush0015', 'brush0016',
                    'hold'
                ])
            game.stablesManager.addSpriteAnims(brush, 'brush_place', [
                    'place0000', 'place0001', 'place0002', 'place0003', 'place0004', 'place0005', 'place0006'
                ])
            brush.on('pointerdown', function (pointer) { game.stablesManager.pointerdown(brush, game.HAND.brush, 'brush_pickup', 'brush_place') });
            brush.on('pointerover', function (pointer) { game.stablesManager.pointerover (brush, game.hover1)});
            brush.on('pointerout', function (pointer) { game.stablesManager.pointerout (brush)});

        // Small Brush
        const brushSmall = game.add.sprite(702, 119, 'brush_small', 'idle').setAngle(90).setInteractive({ pixelPerfect: true });
            game.stablesManager.addSpriteAnims(brushSmall, 'brush_pickup_small', [
                    'pickup0000', 'pickup0001', 'pickup0002', 'pickup0003', 'pickup0004', 'pickup0005', 'pickup0006',
                    'in_use'
                ])
            game.stablesManager.addSpriteAnims(brushSmall, 'brush_use_small', [
                    'hold',
                    'brush0000', 'brush0001', 'brush0002', 'brush0003', 'brush0004', 'brush0005', 'brush0006', 'brush0007', 'brush0008', 'brush0009', 'brush0010',
                    'brush0000', 'brush0011', 'brush0012', 'brush0013', 'brush0014', 'brush0015', 'brush0016',
                    'hold'
                ])
            game.stablesManager.addSpriteAnims(brushSmall, 'brush_place_small', [
                    'pickup0006', 'place0001', 'place0002', 'place0003', 'place0004', 'place0005', 'place0006',
                    'idle'
                ])
            brushSmall.on('pointerdown', function (pointer) { game.stablesManager.pointerdown(brushSmall, game.HAND.brushSmall, 'brush_pickup_small', 'brush_place_small') });
            brushSmall.on('pointerover', function (pointer) { game.stablesManager.pointerover (brushSmall, game.hover1) });
            brushSmall.on('pointerout', function (pointer) { game.stablesManager.pointerout (brushSmall) });

        // Hoofpick
        const hoofpick = game.add.sprite(750, 199, 'hoofpick', 'idle').setFlipX(true).setScale(.8)
        const hoofpickInteractive = game.add.graphics().setInteractive(new Phaser.Geom.Rectangle(614, 183, 100, 50), Phaser.Geom.Rectangle.Contains);
            game.stablesManager.addSpriteAnims(hoofpick, 'hoofpick_pickup', [
                    'pickup0000', 'pickup0001', 'pickup0002', 'pickup0003', 'pickup0004',
                    'in_use'
                ])
            game.stablesManager.addSpriteAnims(hoofpick, 'hoofpick_place', [
                    'place0000', 'place0001', 'place0002', 'place0003', 'place0004', 'place0005', 'place0006', 'place0007', 'place0008',
                    'idle'
                ])
            game.stablesManager.addSpriteAnims(hoofpick, 'hoofpick_use', [
                    'polish0000', 'polish0001', 'polish0002', 'polish0003', 'polish0004', 'polish0005', 'polish0006', 'polish0007', 'polish0008', 'polish0009',
                    'polish0010', 'polish0011', 'polish0012', 'polish0013', 'polish0014', 'polish0015', 'polish0016', 'polish0017', 'polish0018', 'polish0019',
                    'polish0020', 'polish0021', 'polish0022', 'polish0023', 'polish0024', 'polish0025', 'polish0026', 'polish0027', 'polish0028', 'polish0029',
                    'polish0030', 'polish0031', 'polish0032', 'polish0033', 'polish0034', 'polish0035', 'polish0036', 'polish0037', 'polish0038', 'polish0039',
                    'polish0040', 'polish0041', 'polish0042', 'polish0043', 'polish0044', 'polish0045', 'polish0046', 'polish0047', 'polish0048', 'polish0049',
                    'polish0050', 'polish0051', 'polish0052', 'polish0053', 'polish0054', 'polish0055', 'polish0056', 'polish0057', 'polish0058', 'polish0059',
                    'polish0060', 'hold'
                ])
            hoofpickInteractive.on('pointerdown', function (pointer) {game.stablesManager.pointerdown(hoofpick, game.HAND.hoofpick, 'hoofpick_pickup', 'hoofpick_place', game.brushLevel === 3) })
            const hoofpickText = game.add.text(792, 198, 'Static Text Object', game.stablesManager.hoverTextSettingsMainSmall).setAlpha(0).setOrigin(0.5);
            hoofpickText.text = localeData.txtWandHilite;
            hoofpickInteractive.on('pointerover', function (pointer) { 
                if (game.handCurrent === game.HAND.empty && game.brushLevel === 3) {
                    hoofpick.setFrame('hover')
                } else if (game.handCurrent === game.HAND.empty && game.brushLevel !== 3) {
                    hoofpick.setFrame('hover_wait')
                    hoofpickText.setAlpha(1)
                }
             });
             hoofpickInteractive.on('pointerout', function (pointer) { game.stablesManager.pointerout (hoofpick, hoofpickText)});
        

        // Speaker
        const speaker = game.add.sprite(668, 71, 'speaker', 'idle').setInteractive();
            game.stablesManager.addSpriteAnims(speaker, 'soothe', [
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
                ], 18)
            speaker.on('pointerover', function (pointer) { 
                if (game.handCurrent === game.HAND.empty && !game.soothed) {
                    speaker.setFrame('hover')
                    game.hover1.play()
                }
            });
            speaker.on('pointerout', function (pointer) {
                if (game.handCurrent === game.HAND.empty && !game.soothed) {
                    speaker.setFrame('idle')
                }
            });
            speaker.on('pointerdown', function (pointer) {
                if (game.handCurrent === game.HAND.empty && !game.soothed) {
                    game.soothed = true
                    speaker.play('soothe')
                    game.backgroundMusic.stop()
                    game.sootheSound.play();
                    game.sootheSoundLength.play();
                    game.sootheSoundLength.on('complete', function (sound) {
                    game.stablesManager.addToQueue(game.statBoxQueue, localeData.txtMusic)
                    game.stablesManager.updateBar(game.happinessBar, 0.5 + 0.1)
                    if (game.playMusic) {
                        game.backgroundMusic.play()
                    }
                    });
                }
            });


        // Background Bubbles
        game.bubbles3 = game.add.sprite(538, 171, 'bubbles3', 'bubbles0000')


        // Horse Interactive
        game.stablesManager.createHorseHitbox(230, 110, 376, 345, polish, 15, -30)   

            
        // Food Dispenser
        game.foodTrough = game.add.sprite(238, 208, 'food', 'idle').setInteractive({ pixelPerfect: true });
            game.stablesManager.addSpriteAnims(game.foodTrough, 'food_dispense', [
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
                ])
            game.foodTrough.on('pointerdown', function (pointer) {
                if (!game.foodTrough.frame.name.includes('feed') && game.handCurrent === game.HAND.empty) {
                    game.foodTrough.play('food_dispense')
                    game.stablesManager.addToQueue(game.horseAnimationQueue, game.HORSE_STATES.eatingFood)
                }
            });
            game.foodTrough.on('pointerover', function (pointer) { 
                if (game.foodTrough.frame.name === 'idle' && game.handCurrent === game.HAND.empty) {
                    game.foodTrough.setFrame('hover')
                    game.hover1.play()
                }
            });
            game.foodTrough.on('pointerout', function (pointer) {
                if (game.foodTrough.frame.name === 'hover') {
                    game.foodTrough.setFrame('idle')
                }
            });


        // Inspirational message frame
        game.add.image(55, 268, 'horse_image').setScale(.44);
        const frame = game.add.image(54, 266, 'frame').setInteractive();
            frame.on('pointerover', function (pointer) {
                if (game.canPlayInspiration) {
                    game.inspirationHover.play()
                }
            });
            frame.on('pointerdown', function (pointer) { 
                if (game.canPlayInspiration) {
                    game.playInspiration = true 
                    game.inspirationSound.play()
                }
            })


        // Horse
        game.stablesManager.createHorse(440, 335, 90)
            /**
             * Updates the polisher count, plays the polisher use animation
             * and updates the horse stat bars.
             */
            function polish() {
                if (game.extraCleanLevel <1 && game.handCurrent === game.HAND.hoofpick) {
                    game.extraCleanLevel += 1
                    game.stablesManager.checkClean()
                    game.stablesManager.addToQueue(game.statBoxQueue, localeData.txtCleanHorse)
                    game.cursor.play('hoofpick_use')
                    game.polisherSound.play();
                    game.stablesManager.updateBar(game.cleanlinessBar, 1)
                } if (game.handCurrent === game.HAND.hoofpick) {
                    game.cursor.play('hoofpick_use')
                    game.polisherSound.play();
                }
            }
            game.additionalCleanCondition = () => {return game.extraCleanLevel === 1}


        let temp
        let buttonDisplace
        if (game.stablesManager.randomIntFromInterval(1, 2) === 1) {
            temp = 'cool'
            buttonDisplace =  72
        } else {
            temp = 'heat'
            buttonDisplace =  -72
        }
        let tempWrong = game.stablesManager.randomIntFromInterval(1, 5)
        const temperatureBar = game.add.sprite(59, 101, 'temperature_bar', `${temp}_${tempWrong}`).setScale(1.02)
        const temperatureButtons = game.add.sprite(55, 101 + buttonDisplace, 'temperature_buttons', `${temp}_idle`).setScale(1.02).setInteractive()
            temperatureButtons.on('pointerover', function (pointer) { 
                if (temperatureButtons.frame.name === `${temp}_idle`) {
                    temperatureButtons.setFrame(`${temp}_hover`)
                }
            });
            temperatureButtons.on('pointerout', function (pointer)
            {
                if (temperatureButtons.frame.name === `${temp}_hover`) {
                    temperatureButtons.setFrame(`${temp}_idle`)
                    game.hover1.play()
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
                        game.tempPerfect.play()
                        game.stablesManager.addToQueue(game.statBoxQueue, localeData.txtTemperature)
                    }
                    game.stablesManager.updateBar(game.happinessBar, 0.2)
                    game.tempChange.play()
                    temperatureBG.play(`BG_${temp}`)
                }
            });


        // Treats
        game.treatDispenser = game.add.sprite(52, 435, 'treat_dispenser', 'idle').setInteractive();
            game.stablesManager.addSpriteAnims(game.treatDispenser, 'treat_pickup', [
                    'dispense0000', 'dispense0001', 'dispense0002', 'dispense0003', 'dispense0004', 'dispense0005', 'dispense0006', 'dispense0007', 'dispense0008', 'dispense0009',
                    'dispense0010', 'dispense0011', 'dispense0012', 'dispense0013', 'dispense0014', 'dispense0015', 'dispense0016',
                    'idle'
                ])
            game.stablesManager.addSpriteAnims(game.treatDispenser, 'treat_place', [ 'idle' ])
            game.treatDispenser.on('pointerover', function (pointer) { game.stablesManager.pointerover (game.treatDispenser, game.hover1) });
            game.treatDispenser.on('pointerout', function (pointer) { game.stablesManager.pointerout(game.treatDispenser) });
            game.treatDispenser.on('pointerdown', function (pointer) { game.stablesManager.pointerdown(game.treatDispenser, game.HAND.apple, 'treat_pickup', 'treat_place')});


        // Bubbles
        game.bubbles1 = game.add.sprite(750, 261, 'bubbles1', 'idle').setInteractive({ pixelPerfect: true });
            game.stablesManager.addSpriteAnims(game.bubbles1, 'bubbles1', [
                        'bubbles0000', 'bubbles0001', 'bubbles0002', 'bubbles0003', 'bubbles0003', 'bubbles0005', 'bubbles0006', 'bubbles0007', 'bubbles0008', 'bubbles0009',
                        'bubbles0010', 'bubbles0011', 'bubbles0012', 'bubbles0013', 'bubbles0014', 'bubbles0015', 'bubbles0016', 'bubbles0017', 'bubbles0018', 'bubbles0019',
                        'bubbles0020', 'bubbles0021', 'bubbles0022', 'bubbles0023', 'bubbles0024', 'bubbles0025', 'bubbles0026', 'bubbles0027', 'bubbles0028', 'bubbles0029',
                        'bubbles0030', 'bubbles0031', 'bubbles0032', 'bubbles0033', 'bubbles0034', 'bubbles0035', 'bubbles0036', 'bubbles0037', 'bubbles0038', 'bubbles0039',
                        'bubbles0040', 'bubbles0041', 'bubbles0042', 'bubbles0043', 'bubbles0044', 'bubbles0045', 'bubbles0046', 'bubbles0047', 'bubbles0048', 'bubbles0049',
                        'bubbles0050', 'bubbles0051', 'bubbles0052', 'bubbles0053', 'bubbles0054', 'bubbles0055', 'bubbles0056', 'bubbles0057', 'bubbles0058', 'bubbles0059',
                        'bubbles0060', 

                        'bubbles0003', 'bubbles0005', 'bubbles0006', 'bubbles0007', 'bubbles0008', 'bubbles0009', 'bubbles0010', 'bubbles0011', 'bubbles0012', 
                        'bubbles0013', 'bubbles0014', 'bubbles0015', 'bubbles0016', 'bubbles0017', 'bubbles0018', 'bubbles0019', 'bubbles0020', 'bubbles0021', 'bubbles0022', 
                        'bubbles0023', 'bubbles0024', 'bubbles0025', 'bubbles0026', 'bubbles0027', 'bubbles0028', 'bubbles0029', 'bubbles0030', 'bubbles0031', 'bubbles0032', 
                        'bubbles0033',

                        'bubbles0091', 'bubbles0092', 'bubbles0093', 'bubbles0094', 'bubbles0095', 'bubbles0096', 'bubbles0097', 'bubbles0098', 'bubbles0099',
                        'bubbles0100', 'bubbles0101', 'bubbles0102', 'bubbles0103', 'bubbles0104',
                        'idle'
                    ])
        game.bubbles2 = game.add.sprite(176, 220, 'bubbles2', 'bubbles0000')
            game.stablesManager.addSpriteAnims(game.bubbles2, 'bubbles2', [
                        'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000',
                        'bubbles0000', 'bubbles0000', 'bubbles0012', 'bubbles0013', 'bubbles0014', 'bubbles0015', 'bubbles0016', 'bubbles0017', 'bubbles0018', 'bubbles0019',
                        'bubbles0020', 'bubbles0021', 'bubbles0022', 'bubbles0023', 'bubbles0024', 'bubbles0025', 'bubbles0026', 'bubbles0027', 'bubbles0028', 'bubbles0029',
                        'bubbles0030', 'bubbles0031', 'bubbles0032', 'bubbles0033', 'bubbles0034', 'bubbles0035', 'bubbles0036', 'bubbles0037', 'bubbles0038', 'bubbles0039',
                        'bubbles0040', 'bubbles0041', 'bubbles0042', 'bubbles0043', 'bubbles0044', 'bubbles0045', 'bubbles0046', 'bubbles0047', 'bubbles0048', 'bubbles0049',
                        'bubbles0050', 'bubbles0051', 'bubbles0052', 'bubbles0053', 'bubbles0054', 'bubbles0055', 'bubbles0056', 'bubbles0057', 'bubbles0058', 'bubbles0059',
                        'bubbles0060', 'bubbles0061', 'bubbles0062', 'bubbles0063', 'bubbles0064', 'bubbles0065', 'bubbles0066', 'bubbles0067', 

                        'bubbles0000', 'bubbles0012', 
                        'bubbles0013', 'bubbles0014', 'bubbles0015', 'bubbles0016', 'bubbles0017', 'bubbles0018', 'bubbles0019', 'bubbles0020', 'bubbles0021', 'bubbles0022', 
                        'bubbles0023', 'bubbles0024', 'bubbles0025', 'bubbles0026', 'bubbles0027', 'bubbles0028', 'bubbles0029', 'bubbles0030', 'bubbles0031', 'bubbles0032', 
                        'bubbles0033', 'bubbles0034', 'bubbles0035', 'bubbles0036', 'bubbles0037', 'bubbles0038', 'bubbles0039', 'bubbles0040', 'bubbles0041', 'bubbles0042', 
                        'bubbles0043', 'bubbles0044', 'bubbles0045', 'bubbles0046', 'bubbles0047', 

                        'bubbles0000'
                    ])
            game.stablesManager.addSpriteAnims(game.bubbles3, 'bubbles3', [
                        'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000',
                        'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0000', 'bubbles0018', 'bubbles0019',
                        'bubbles0020', 'bubbles0021', 'bubbles0022', 'bubbles0023', 'bubbles0024', 'bubbles0025', 'bubbles0026', 'bubbles0027', 'bubbles0028', 'bubbles0029',
                        'bubbles0030', 'bubbles0031', 'bubbles0032', 'bubbles0033', 'bubbles0034', 'bubbles0035', 'bubbles0036', 'bubbles0037', 'bubbles0038', 'bubbles0039',
                        'bubbles0040', 'bubbles0041', 'bubbles0042', 'bubbles0043', 'bubbles0044', 'bubbles0045', 'bubbles0046', 'bubbles0047', 'bubbles0048', 'bubbles0049',
                        'bubbles0050', 'bubbles0051', 'bubbles0052', 'bubbles0053', 'bubbles0054', 'bubbles0055', 'bubbles0056', 'bubbles0057', 'bubbles0058', 'bubbles0059',
                        'bubbles0060', 'bubbles0061', 'bubbles0062', 'bubbles0063', 'bubbles0064', 'bubbles0065', 'bubbles0066', 'bubbles0067', 'bubbles0068', 'bubbles0069',
                        'bubbles0070', 'bubbles0071', 'bubbles0072', 'bubbles0073',

                        'bubbles0000', 'bubbles0018', 'bubbles0019', 'bubbles0020', 'bubbles0021', 'bubbles0022', 'bubbles0023', 'bubbles0024', 'bubbles0025', 'bubbles0026', 
                        'bubbles0027', 'bubbles0028', 'bubbles0029', 'bubbles0030', 'bubbles0031', 'bubbles0032', 'bubbles0033', 'bubbles0034', 'bubbles0035', 'bubbles0036', 
                        'bubbles0037', 'bubbles0038', 'bubbles0039', 'bubbles0040', 'bubbles0041', 'bubbles0042', 'bubbles0043', 'bubbles0044', 'bubbles0045', 'bubbles0046', 
                        'bubbles0047', 'bubbles0048', 'bubbles0049', 'bubbles0050', 'bubbles0051',

                        'bubbles0000'
                    ])
            game.bubbles1.on('pointerover', function (pointer) { game.stablesManager.pointerover(game.bubbles1, game.hover1) });
            game.bubbles1.on('pointerout', function (pointer) {
                if (game.handCurrent === game.HAND.empty) {
                    game.bubbles1.setFrame('idle')
                }
            });
            game.bubbles1.on('pointerdown', function (pointer) {
                if (game.handCurrent === game.HAND.empty) {
                    game.bubbles1.play('bubbles1')
                    game.bubbles2.play('bubbles2')
                    game.bubbles3.play('bubbles3')
                    game.bubbleClick.play()
                }
            });


        // Dirty Water
        const waterSpinnerHolder = game.add.sprite(865, 54, 'water_spinner_holder', 'idle').setInteractive({ pixelPerfect: true });
        const waterSpinner = game.add.sprite(800, 57, 'water_spinner', '1').setInteractive({ pixelPerfect: true });
        game.anims.create({
                key: 'water_spinner',
                frames: game.anims.generateFrameNumbers('water_spinner', { frames: [
                    '1', '2', '3', '4', '5', '6', '7', '8', '9',
                    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
                    '20', '21', '22', '23', '24', '25', '26', '27', '28'
                ] }),
                frameRate: 24,
                repeat: -1
            });
            waterSpinner.play('water_spinner')
        game.water = this.add.sprite(436, 258, 'water', 'dirtywater0000').setScale(1.01);
            game.waterClean = false
            game.stablesManager.addSpriteAnims(game.water, 'clean_water', [
                    'dirtywater0000', 'dirtywater0001', 'dirtywater0002', 'dirtywater0003', 'dirtywater0004', 'dirtywater0005', 'dirtywater0006', 'dirtywater0007', 'dirtywater0008', 'dirtywater0009',
                    'dirtywater0010', 'dirtywater0011', 'dirtywater0012', 'dirtywater0013', 'dirtywater0014', 'dirtywater0015', 'dirtywater0016', 'dirtywater0017', 'dirtywater0018', 'dirtywater0019',
                    'dirtywater0020', 'dirtywater0021', 'dirtywater0022', 'dirtywater0023', 'dirtywater0024', 'dirtywater0025', 'dirtywater0026', 'dirtywater0027', 'dirtywater0028', 'dirtywater0029',
                    'dirtywater0030', 'dirtywater0031', 'dirtywater0032', 'dirtywater0033', 'dirtywater0034', 'dirtywater0035', 'dirtywater0036', 'dirtywater0037', 'dirtywater0038', 'dirtywater0039',
                    'dirtywater0040', 'dirtywater0041', 'dirtywater0042', 'dirtywater0043', 'dirtywater0044', 'dirtywater0045', 'dirtywater0046', 'dirtywater0047', 'dirtywater0048', 'dirtywater0049',
                    'dirtywater0050', 'dirtywater0051', 'dirtywater0052', 'dirtywater0053', 'dirtywater0054', 'dirtywater0055', 'dirtywater0056', 'dirtywater0057', 'dirtywater0058', 'dirtywater0059',
                    'dirtywater0060', 'dirtywater0061', 'dirtywater0062', 'dirtywater0063', 'dirtywater0064', 'dirtywater0065', 
                    'cleanwater'
                ])

            function cleanWaterHover () {
                if (game.handCurrent === game.HAND.empty && game.water.frame.name === 'dirtywater0000') {
                    waterSpinnerHolder.setFrame('hover');
                    game.hover2.play();
                }
            }
            function cleanWaterPointerOut () {
                if (waterSpinnerHolder.frame.name === 'hover') {
                    waterSpinnerHolder.setFrame('idle');
                }
            }
            function cleanWater () {
                if (game.handCurrent === game.HAND.empty && !game.waterClean && game.water.frame.name === 'dirtywater0000') {
                    game.waterClean = true
                    game.water.play('clean_water')
                    waterSpinner.stop().setFrame('1')
                    game.stablesManager.updateBar(game.cleanlinessBar, 2)
                    game.stablesManager.updateBar(game.happinessBar, 1/2 + 0.05)
                }
            }
            waterSpinner.on('pointerover', cleanWaterHover)
            waterSpinner.on('pointerout', cleanWaterPointerOut)
            waterSpinner.on('pointerdown', cleanWater)
            waterSpinnerHolder.on('pointerover', cleanWaterHover)
            waterSpinnerHolder.on('pointerout', cleanWaterPointerOut)
            waterSpinnerHolder.on('pointerdown', cleanWater)


        // ---------- Stable foreground and UI ---------- //
        game.stablesManager.createStatBox(625, 130)
        game.stablesManager.createBeSaWorldLink(835, 192, .9, .9, "Small")
        game.stablesManager.createUI([
            [547, 282, localeData.txtHelpTrophyRoom, "Small"],
            [197, 125, localeData.txtHelpThermostat, "Small"],
            [445, 420, localeData.txtHelpStats, "OneLine"],
            [560, 35, localeData.txtHelpMusic, "Small"],
            [175, 240, localeData.txtHelpInspiration, "Small"],
            [730, 27, localeData.txtHelpCleaner, "Small"],
            [215, 410, localeData.txtHelpChestnut, "Med"],
            [349, 48, localeData.txtHelpFood, "Small"],
            [790, 243, localeData.txtHelpWorld1, "Small"],
            [527, 210, localeData.txtHelpLaserThing, "Med"],
            [551, 120, localeData.txtHelpBrushes, "Small"],
            [605, 365, localeData.txtHelpOxygen, "Small"]
        ])
    }

    update ()
    {
        const game = this
        game.stablesManager.updateCursor({
            brushYOffset:-10, 
            brushSmallYOffset:-4, 
            hoofpickXOffset:-10, hoofpickYOffset:20
        })

        // play sounds at correct frame
        if (game.water.frame.name === 'dirtywater0015') {
            game.drainWater.play();
        } else if (game.water.frame.name === 'dirtywater0065') {
            game.stablesManager.addToQueue(game.statBoxQueue, localeData.txtCleanTank)
        }
        if (game.bubbles1.frame.name === 'bubbles0006') {
            game.bubbleSound.play();
        }
        else if (game.bubbles1.frame.name === 'bubbles0091') {
            game.bubbleReplaceSound.play();
            game.stablesManager.addToQueue(game.statBoxQueue, localeData.txtCleanWater)
            if (!game.waterFilled) {
                game.waterFilled = true
                game.stablesManager.updateBar(game.happinessBar, 1/4)
            }
        }
        if (game.foodTrough.frame.name === 'feed0006') {
            game.foodDispenseSound.play();
        }
        if (game.treatDispenser.frame.name === 'dispense0006') {
            game.treatDispenseSound.play();
        }


        // TODO: see if this can also be added to the stables manager
        if (game.horseBusy === false && game.horseAnimationQueue.length > 0) {
            const animation = game.horseAnimationQueue.shift()
            game.horseBusy = true

            if (animation === game.HORSE_STATES.rear) {
                game.rearSound.play();
                game.stablesManager.horsePlayAnimation('rear')
            } 
            else if (animation === game.HORSE_STATES.eatingFood) {
                game.time.delayedCall(800, function () { game.stablesManager.horsePlayAnimation('eat_food') });
                game.time.delayedCall(1000, function () { game.oatsEat.play() });
            }
            else if (animation === game.HORSE_STATES.eatingApple) {
                game.appleMunch.play();
                game.stablesManager.horsePlayAnimation('eat_apple');
            }
        }
        

        game.stablesManager.updateInspirationalMessage()
        
        if (game.statBoxQueue.length > 0) {
            if (game.statBoxQueue[0] === localeData.txtBrushClean) {
                game.statBox.setPosition(665, 225)
                game.statBoxText.setPosition(665, 225)
            } else {
                game.statBox.setPosition(665, 150)
                game.statBoxText.setPosition(665, 150)
            }
            game.stablesManager.updateStatbox()
        }
    }
}