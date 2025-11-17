class FoalAirStable extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: 'foalAirStable'
        });
    }

    preload ()
    {  
        const game = this
        game.stablesManager = new StablesManager(game)

        // LOADING BAR
        game.stablesManager.preloadDisplayLoadBar()
            
        // Load in images and sounds
        game.load.image('stable_bg', './images/airFoalStable/stable-bg.png');
        game.load.image('stable_fg', './images/airStable/stable-fg.png');
        game.load.image('hunger_scale', './images/airStable/hunger.png');
        game.load.image('cleanliness_scale', './images/airStable/cleanliness.png');
        game.load.image('happiness_scale', './images/airStable/happiness.png');

        game.load.atlas('leaf_tree_shake1', './images/airFoalStable/leaf_tree_shake1.png', './images/airFoalStable/leaf_tree_shake1.json');
        game.load.atlas('leaf_tree_shake2', './images/airFoalStable/leaf_tree_shake2.png', './images/airFoalStable/leaf_tree_shake2.json');
        game.load.atlas('leaf_tree_shake3', './images/airFoalStable/leaf_tree_shake3.png', './images/airFoalStable/leaf_tree_shake3.json');
        game.load.atlas('leaf_chimes', './images/airFoalStable/leaf_chimes.png', './images/airFoalStable/leaf_chimes.json');
        game.load.spineAtlas("leaves-atlas", `./images/airFoalStable/leavesskeleton.atlas`);
        game.load.spineJson("leaves-json", `./images/airFoalStable/leavesskeleton.json`);
        game.load.atlas('bottle_interactive', './images/airFoalStable/bottle.png', './images/airFoalStable/bottle.json');

        game.load.atlas('fountain1', './images/airFoalStable/fountain1.png', './images/airFoalStable/fountain1.json');
        game.load.atlas('fountain2', './images/airFoalStable/fountain2.png', './images/airFoalStable/fountain2.json');
        game.load.atlas('fountain3', './images/airFoalStable/fountain3.png', './images/airFoalStable/fountain3.json');

        game.load.image('left_tree', './images/airFoalStable/leftTree.png');
        game.load.atlas('food_interactive', './images/airStable/food_interactive.png', './images/airStable/food_interactive.json');
        game.load.atlas('berries', './images/airFoalStable/berries.png','./images/airFoalStable/berries.json');
        game.load.image('apple', './images/airStable/berriesHeld.png');
        game.load.image('bottle', './images/airFoalStable/bottleHeld.png');
        
        game.load.atlas('horn', './images/airFoalStable/horn.png','./images/airFoalStable/horn.json');
        
        game.load.atlas('brush', './images/airStable/brush.png', './images/airStable/brush.json');
        game.load.atlas('brush_small', './images/airStable/brush_small.png', './images/airStable/brush_small.json');
        game.load.atlas('hoofpick', './images/airStable/feather_oil.png', './images/airStable/feather_oil_updated.json');
        
        game.load.spineAtlas("horse-atlas", `./images/horses/${horseName}/skeleton.atlas`);
        game.load.spineAtlas("horse_overlay-atlas", `./images/horses/${horseName}/skeleton_overlay.atlas`);
        game.load.spineAtlas("horse_dirty-atlas", `./images/airFoalStable/horse_dirty/dirt_skeleton.atlas`);
        game.load.spineJson("horse-json", `./images/horses/${horseName}/skeleton.json`);
        game.load.spineJson("horse_overlay-json", `./images/horses/${horseName}/skeleton_overlay.json`);
        game.load.spineJson("horse_dirty-json", `./images/airFoalStable/horse_dirty/dirt_skeleton.json`);

        game.load.image('horse_image', `./images/horses/${horseName}/card_image.jpg`);

        game.load.atlas('frame', './images/airStable/frame.png', './images/airStable/frame.json');
        game.load.image('family_tree', './images/airFoalStable/family_tree_full.png');
        game.load.image('magnifier', './images/airFoalStable/magnifier.png');
        game.load.image('inspiration', './images/airStable/inspiration.png');

        game.load.atlas('music_button', './images/airStable/music.png', './images/airStable/music.json');
        game.load.atlas('help_button', './images/airStable/help.png', './images/airStable/help.json');
        game.load.image('stat_box', './images/StatBox.png');
        game.load.image('goworld_box', './images/airStable/ToWorldBox.png');

        game.stablesManager.preloadAudio({
            'sootheSound': `./sounds/air_soothe_sound.mp3`,
            'sootheSoundLength': `./sounds/air_soothe_sound_length.mp3`,
            'waterDrink': `./sounds/water_drink.mp3`,
            'waterSound': `./sounds/fountain_fill.mp3`,
            'waterFlow': `./sounds/fountain_flow.mp3`,
            'cleanLeaves': `./sounds/clean_leaves.mp3`,
            'shakeLeaves': `./sounds/shake_leaves.mp3`,
            'featherOilPickup': `./sounds/feather_oil_pickup.mp3`,
            'featherOilUse': `./sounds/feather_oil_use.mp3`
        })
    }


    
    create ()
    {
        const game = this
        game.stablesManager.createScene()

        // Brush
        const brush = game.add.sprite(658, 228, 'brush', 'idle').setScale(0.76).setInteractive({ pixelPerfect: true });
            game.stablesManager.addSpriteAnims(brush, 'brush_pickup', [
                    'pickup0000', 'pickup0001', 'pickup0002', 'pickup0003', 'pickup0004', 'pickup0005',
                    'in_use'
                ])
            game.stablesManager.addSpriteAnims(brush, 'brush_use', [
                    'hold',
                    'brush0000', 'brush0001', 'brush0002', 'brush0003', 'brush0004', 'brush0005', 'brush0006', 'brush0007',
                    'hold'
                ])
            game.stablesManager.addSpriteAnims(brush, 'brush_place', [
                    'place0000', 'place0001', 'place0002', 'place0003', 'place0004', 'place0005', 'place0006'
                ])
            brush.on('pointerdown', function (pointer) { game.stablesManager.pointerdown(brush, game.HAND.brush, 'brush_pickup', 'brush_place') });
            brush.on('pointerover', function (pointer) { game.stablesManager.pointerover (brush, game.hover1)});
            brush.on('pointerout', function (pointer) { game.stablesManager.pointerout (brush)});

        // Small Brush
        const brushSmall = game.add.sprite(682, 244, 'brush_small', 'idle').setInteractive({ pixelPerfect: true });
            game.stablesManager.addSpriteAnims(brushSmall, 'brush_pickup_small', [
                    'pickup0000', 'pickup0001', 'pickup0002', 'pickup0003', 'pickup0004', 'pickup0005', 'pickup0006',
                    'in_use'
                ])
            game.stablesManager.addSpriteAnims(brushSmall, 'brush_use_small', [
                    'hold',
                    'brush0000', 'brush0001', 'brush0002', 'brush0003', 'brush0004', 'brush0005', 'brush0006', 'brush0007', 'brush0008', 'brush0009', 'brush0010',
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
        const hoofpick = game.add.sprite(684, 187, 'hoofpick', 'idle').setInteractive( { pixelPerfect: true } );
            game.stablesManager.addSpriteAnims(hoofpick, 'hoofpick_pickup', [
                    'pickup0000', 'pickup0001', 'pickup0002', 'pickup0003', 'pickup0004', 'pickup0005', 'pickup0006', 'pickup0007', 'pickup0008', 'pickup0009',
                    'in_use'
                ])
            game.stablesManager.addSpriteAnims(hoofpick, 'hoofpick_place', [
                    'place0000', 'place0001', 'place0002', 'place0003', 'place0004', 'place0005', 'place0006', 'place0007',
                    'idle'
                ])
            game.stablesManager.addSpriteAnims(hoofpick, 'hoofpick_use', [
                    'use0000', 'use0001', 'use0002', 'use0003', 'use0004', 'use0005', 'use0006', 'use0007', 'use0008', 'use0009',
                    'use0010', 'use0011', 'use0012', 'use0013', 'use0014', 'use0015', 'use0016', 'use0017', 'use0018', 'use0019',
                    'use0020', 'use0021', 'use0022', 'use0023', 'use0024', 'use0025', 'use0026', 'use0027', 'use0028', 'use0029',
                    'hold'
                ])
            hoofpick.on('pointerdown', function (pointer) {
                game.stablesManager.pointerdown(hoofpick, game.HAND.hoofpick, 'hoofpick_pickup', 'hoofpick_place', game.brushLevel === 3) 
                if (game.handCurrent === game.HAND.empty && game.brushLevel === 3) { game.featherOilPickup.play(); }
            })
            const hoofpickText = game.add.text(685, 155, 'Static Text Object', game.stablesManager.hoverTextSettingsMainLarge).setAlpha(0).setOrigin(0.5);
            hoofpickText.text = localeData.txtOilHilite2;
            hoofpick.on('pointerover', function (pointer) { 
                if (game.handCurrent === game.HAND.empty && game.brushLevel === 3) {
                    hoofpick.setFrame('hover')
                } else if (game.handCurrent === game.HAND.empty && game.brushLevel !== 3) {
                    hoofpick.setFrame('hover_wait')
                    hoofpickText.setAlpha(1)
                }
             });
             hoofpick.on('pointerout', function (pointer) { game.stablesManager.pointerout (hoofpick, hoofpickText)});

            
        // Leaves (on floor)
            game.leaves = game.add.spine(770, 280, 'leaves-json', 'leaves-atlas').setAngle(0).setScale(1);
            game.beddingState = 0;
            let rand = game.stablesManager.randomIntFromInterval(2,4)
            setLeaves(game.leaves, rand)
            game.leaves.animationState.setAnimation(0, "idle", false)

            function setLeaves(leavesSkeleton, number) {
                const skeletonData = leavesSkeleton.skeleton.data;
                const skin = new spine.Skin("custom");
                    skin.addSkin(skeletonData.findSkin(`Leaf${number}`));
                leavesSkeleton.skeleton.setSkin(skin);
            }

            game.leaves.animationState.addListener({
                complete: function endAnimation(entry) { 
                    if(entry.animation.name === 'wind') {
                        setLeaves(game.leaves, 1)
                        game.beddingState = 1;
                    }
                    if(entry.animation.name === 'fall') {
                        game.beddingState = 2;
                    }
                }
            })


        // Water Fountain
        game.trough = game.add.sprite(209, 307, 'fountain1', 'idle').setInteractive({ pixelPerfect: true });
            game.stablesManager.addImageAnims('fountain2', 'fill_water1', [
                '0011', '0012', '0013', '0014', '0015', '0016', '0017', '0018', '0019', '0020',
                '0021', '0022', '0023', '0024', '0025', '0026', '0027', '0028', '0029', '0030',
                '0031', '0032', '0033', '0034', '0035', '0036', '0037', '0038', '0039', '0040',
                '0041', '0042', '0043', '0044', '0045', '0046', '0047', '0048', '0049', '0050',
                '0051', '0052', '0053', '0054', '0055', '0056', '0057', '0058', '0059', '0060',
                '0061', '0062', '0063', '0064', '0065', '0066', '0067', '0068', '0069', '0070',
                '0071', '0072', '0073', '0074', '0075', '0076', 
            ])
            game.stablesManager.addImageAnims('fountain3', 'fill_water2', [
                '0077', '0078', '0079', '0080',
                '0081', '0082', '0083', '0084', '0085', '0086', '0087', '0088', '0089', '0090',
                '0091', '0092', '0093', '0094', '0095', '0096', '0096', '0096', '0096', 
            ])
            game.stablesManager.addImageAnims('fountain3', 'water_fountain_drink', [
                '0096', '0096', '0096', '0096', '0096', '0096', '0096', '0096', '0096', '0096',
                '0096', '0096', '0096', '0096', '0096', '0096', '0096', '0096', '0096', '0096',
                '0096', '0096', '0096', '0096', '0096', '0096',
                '0125', '0126', '0127', '0128', '0129', '0130',
                '0131', '0132', '0133', '0134', '0135', '0136', '0137', '0138', '0139', '0140',
                '0141', '0142', '0143', '0144', '0145', '0146', '0147', '0148', '0149', '0150',
                '0151', '0152', '0153', '0154', '0155', '0156', '0157', '0158', '0159', '0160',
                '0161', '0162', '0163', '0164', '0165', '0166', '0167', '0168', '0169', '0096',
                '0096', '0096', '0096', '0096', '0175', '0096'
            ])
            game.trough.on('pointerdown', function (pointer)
            {
                if (!game.waterFilled && game.handCurrent === game.HAND.empty) {
                    game.waterFilled = true;
                    game.trough.play('fill_water1');
                    game.waterSound.play()
                    game.stablesManager.addToQueue(game.horseAnimationQueue, game.HORSE_STATES.drink)
                }
            });
            game.trough.on('pointerover', function (pointer) {
                if (!game.waterFilled && game.handCurrent === game.HAND.empty) {
                    game.trough.setFrame('hover');
                    game.hover1.play();
                }
            });
            game.trough.on('pointerout', function (pointer) {
                if (!game.waterFilled && game.handCurrent === game.HAND.empty) {
                    game.trough.setFrame('idle');
                }
            });


        // Horse hit box
        // TODO: Add and position
        const wingInteractive = game.add.graphics().setInteractive(new Phaser.Geom.Rectangle(330, 0, 250, 350), Phaser.Geom.Rectangle.Contains);
        game.stablesManager.createHorseHitbox(200, 120, 376, 245, cleanWings, -20, 30)
            wingInteractive.on('pointerdown', function (pointer) {
                if (game.handCurrent === game.HAND.hoofpick) { cleanWings() }
            });


        // Windchime
        const windchimes = game.add.sprite(336, 30, 'leaf_chimes', 'idle').setInteractive({ pixelPerfect: true });
            game.stablesManager.addSpriteAnims(windchimes, 'windchimes_blow', [
                    'wind0000', 'wind0001', 'wind0002', 'wind0003', 'wind0004', 'wind0005', 'wind0006', 'wind0007', 'wind0008', 'wind0009',
                    'wind0010', 'wind0011', 'wind0012', 'wind0013', 'wind0014', 'wind0015', 'wind0016', 'wind0017', 'wind0018', 'wind0019',
                    'wind0020', 'wind0021', 'wind0022', 'wind0023', 'wind0024', 'wind0025', 'wind0026',
                    'idle'
                ])
            windchimes.on('pointerover', function (pointer) {
                if (game.handCurrent === game.HAND.empty && game.beddingState === 0) {
                    windchimes.setFrame('hover');
                    game.hover2.play();
                }
            });
            windchimes.on('pointerout', function (pointer) { 
                if (windchimes.frame.name === 'hover') {
                    windchimes.setFrame('idle');
                }
            });
            windchimes.on('pointerdown', function (pointer) {
                if (game.handCurrent === game.HAND.empty && game.beddingState === 0) {
                    game.leaves.animationState.setAnimation(0, "wind", false);
                    windchimes.play('windchimes_blow');
                    game.cleanLeaves.play();
                }
            });


        // Horse
        game.stablesManager.createHorse(400, 335, 90, .8)
            /**
             * Updates the feather oil count, plays the feather oil use animation
             * and updates the horse stat bars if the wings need to be cleaned.
             */
            function cleanWings() {
                if (game.extraCleanLevel <2 && game.handCurrent === game.HAND.hoofpick) {
                    game.extraCleanLevel += 1
                    game.stablesManager.checkClean()
                    if (game.additionalCleanCondition()){
                        game.stablesManager.addToQueue(game.statBoxQueue, localeData.txtCleanHorse)
                    }
                    game.cursor.play('hoofpick_use')
                    game.featherOilUse.play();
                    game.stablesManager.updateBar(game.cleanlinessBar, 0.5)
                    game.stablesManager.updateBar(game.happinessBar, 1/4)
                }
                if (game.handCurrent === game.HAND.hoofpick) {
                    game.cursor.play('hoofpick_use')
                    game.featherOilUse.play();
                }
            }
            game.additionalCleanCondition = () => {return game.extraCleanLevel === 2}

        
        // Bottle
        game.bottle = game.add.sprite(87, 300, 'bottle_interactive', 'idle').setInteractive({ pixelPerfect: true })
        game.add.image(0, 0, 'left_tree').setOrigin(0,0);
            game.bottle.on('pointerdown', function (pointer) {
                if (game.handCurrent === game.HAND.empty) {
                    game.handCurrent = game.HAND.bottle
                    game.bottle.setAlpha(0)
                } else if (game.handCurrent === game.HAND.bottle) {
                    game.handCurrent = game.HAND.empty
                    game.bottle.setAlpha(1)
                }
            });
            game.bottle.on('pointerover', function (pointer) { 
                if (game.bottle.frame.name === 'idle' && game.handCurrent === game.HAND.empty) {
                    game.bottle.setFrame('hover')
                }
            });
            game.bottle.on('pointerout', function (pointer) {
                if (game.bottle.frame.name === 'hover') {
                    game.bottle.setFrame('idle')
                }
            });

        // Food Trough (Bottle)
        game.floatingBottle = game.add.image(158, 240, 'bottle').setScale(.75).setAngle(90).setAlpha(0);


        // Berries
        const berries = game.add.sprite(702, 30, 'berries', 'idle').setScale(.43).setInteractive();
            game.stablesManager.addSpriteAnims(berries, 'berries_pickup', [
                    'pickup0000', 'pickup0001', 'pickup0002', 'pickup0003', 'pickup0004', 'pickup0005', 'pickup0006', 'pickup0007', 'pickup0008', 'idle'
                ])
            game.stablesManager.addSpriteAnims(berries, 'berries_place', [ 'idle' ])
            berries.on('pointerover', function (pointer) { game.stablesManager.pointerover (berries, game.hover1) });
            berries.on('pointerout', function (pointer) { game.stablesManager.pointerout (berries) });
            berries.on('pointerdown', function (pointer) {
                game.stablesManager.pointerdown(berries, game.HAND.apple, 'berries_pickup', 'berries_place')
            });
        
        // Horn
        const horn = game.add.sprite(8, 145, 'horn', 'idle').setScale(.63).setInteractive({ pixelPerfect: true });
            game.stablesManager.addSpriteAnims(horn, 'soothe', [
                    '10', '11', '12', '13', '13', '15', '16', '17', '18', '19',
                    '20', '21', '22', '23', '23', '25', '26', '27', '28', '29',
                    '30', '31', '32',
                    '32', '31', '30',
                    '29', '28', '27', '26', '25', '24', '23', '22', '21', '20',
                    '19', '18', '17', '16', '15', '14', '13', '12', '11', '10',
                    
                    '10', '11', '12', '13', '13', '15', '16', '17', '18', '19',
                    '20', '21', '22', '23', '23', '25', '26', '27', '28', '29',
                    '30', '31', '32',
                    '32', '31', '30',
                    '29', '28', '27', '26', '25', '24', '23', '22', '21', '20',
                    '19', '18', '17', '16', '15', '14', '13', '12', '11', '10',

                    '10', '11', '12', '13', '13', '15', '16', '17', '18', '19',
                    '20', '21', '22', '23', '23', '25', '26', '27', '28', '29',
                    '30', '31', '32',
                    '32', '31', '30',
                    '29', '28', '27', '26', '25', '24', '23', '22', '21', '20',
                    '19', '18', '17', '16', '15', '14', '13', '12', '11', '10',
                    
                    '10', '11', '12', '13', '13', '15', '16', '17', '18', '19',
                    '20', '21', '22', '23', '23', '25', '26', '27', '28', '29',
                    '30', '31', '32',
                    '32', '31', '30',
                    '29', '28', '27', '26', '25', '24', '23', '22', '21', '20',
                    '19', '18', '17', '16', '15', '14', '13', '12', '11', '10',
                    
                    '10', '11', '12', '13', '13', '15', '16', '17', '18', '19',
                    '20', '21', '22', '23', '23', '25', '26', '27', '28', '29',
                    '30', '31', '32',
                    '32', '31', '30',
                    '29', '28', '27', '26', '25', '24', '23', '22', '21', '20',
                    '19', '18', '17', '16', '15', '14', '13', '12', '11', '10',

                    'idle'
                ], 18)
            horn.on('pointerover', function (pointer) { 
                if (game.handCurrent === game.HAND.empty && !game.soothed) {
                    horn.setFrame('hover')
                }
            });
            horn.on('pointerout', function (pointer) {
                if (game.handCurrent === game.HAND.empty && !game.soothed) {
                    horn.setFrame('idle')
                }
            });
            horn.on('pointerdown', function (pointer) {
                if (game.handCurrent === game.HAND.empty && !game.soothed) {
                    game.soothed = true
                    horn.play('soothe')
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

        // Inspirational message frame
        game.stablesManager.createFoalInspiration(140, 35, .25)


        // ---------- Stable foreground and UI ---------- //
        game.stablesManager.createStatBox(625, 130)
        game.stablesManager.createBeSaWorldLink(715, 110, .8, .8, "Small")
        game.stablesManager.createUI([
            [585, 40, localeData.txtHelpTrophyRoom, "Small"],
            [180, 290, localeData.txtHelpFountain, "Small"],
            [365, 409, localeData.txtHelpStats, "OneLine"],
            [245, 142, localeData.txtHelpSpeaker, "Small"],
            [250, 75, localeData.txtHelpInspiration, "Small"],
            [426, 120, localeData.txtHelpWindChime, "Small"],
            [782, 93, localeData.txtHelpBerries, "Med"],
            [125, 390, localeData.txtHelpAcorn, "Small"],
            [750, 175, localeData.txtHelpWorld, "OneLine"],
            [827, 290, localeData.txtHelpOil, "Small"],
            [540, 240, localeData.txtHelpBrush, "Small"],
            //[605, 365, localeData.txtHelpLuck, "Small"],
            [650, 407, localeData.txtHelpBranch, "Small"]
        ])

        
        // Tree (for leaves)
        const treeInteractive = game.add.graphics().setInteractive(new Phaser.Geom.Rectangle(740, 330, 200, 150), Phaser.Geom.Rectangle.Contains);
        game.leafTree = game.add.sprite(443, 260, 'leaf_tree_shake1', 'idle');
            game.stablesManager.addImageAnims('leaf_tree_shake2', 'tree_shake1', [
                    '0010', '0011', '0012', '0013', '0014', '0015', '0016', '0017', '0018', '0019',
                    '0020', '0021', '0022', '0023', '0024', '0025', '0026', '0027', '0028', '0029',
                    '0030', '0031', '0032', '0033'
                ])
            game.stablesManager.addImageAnims('leaf_tree_shake3', 'tree_shake2', [
                    '0034', '0035', '0036', '0037', '0038', '0039',
                    '0040', '0041', '0042', '0043', '0044', '0045', '0046', '0047', '0048', '0049',
                    '0050', '0051', '0052', '0053', '0054', '0055', '0056', '0057'
                ])
            game.stablesManager.addImageAnims('leaf_tree_shake1', 'tree_shake3', [
                    '0058', '0059',
                    '0060', '0061', '0062', '0063', '0064', '0065', '0066', '0067', '0068', '0069',
                    '0070', '0071', '0072', '0073', '0074', '0075', '0076', '0077',
                    'done'
                ])
            treeInteractive.on('pointerover', function (pointer) {
                if (game.handCurrent === game.HAND.empty && game.beddingState === 1) {
                    game.leafTree.setFrame('hover');
                    game.hover2.play();
                }
            });
            treeInteractive.on('pointerout', function (pointer) { 
                if (game.leafTree.frame.name === 'hover') {
                    game.leafTree.setFrame('idle');
                }
            });
            treeInteractive.on('pointerdown', function (pointer) {
                if (game.handCurrent === game.HAND.empty && game.beddingState === 1) {
                    game.leaves.animationState.setAnimation(0, "fall", false);
                    game.leafTree.play('tree_shake1')
                    game.shakeLeaves.play()
                    game.stablesManager.addToQueue(game.statBoxQueue, localeData.txtNoMoreLeaves)
                    game.stablesManager.updateBar(game.cleanlinessBar, 2)
                    game.stablesManager.updateBar(game.happinessBar, 1/2 + 0.05)
                }
            });
    }

    update ()
    {
        const game = this

        // TODO: check the offset positions here
        game.stablesManager.updateCursor({hoofpickYOffset:80})

        // play water flow sound when fountain is at correct frame
        if (game.trough.frame.name === '0029') {
            game.waterFlow.play();
        } else if (game.trough.frame.name === '0076') {
            game.trough.play('fill_water2');
        }
        if (game.leafTree.frame.name === '0033') {
            game.leafTree.play('tree_shake2')
        } else if (game.leafTree.frame.name === '0057') {
            game.leafTree.play('tree_shake3')
        }


        // TODO: see if this can also be added to the stables manager
        if (game.horseBusy === false && game.horseAnimationQueue.length > 0) {
            const animation = game.horseAnimationQueue.shift()
            game.horseBusy = true

            if (animation === game.HORSE_STATES.rear) {
                game.rearSound.play();
                game.stablesManager.horsePlayAnimation('rear')
            } 
            else if (animation === game.HORSE_STATES.drink) {
                game.time.delayedCall(3500, function () {
                    game.trough.play('water_fountain_drink')
                    game.stablesManager.horsePlayAnimation('drink')
                });
                game.time.delayedCall(4030, function () {
                    game.waterDrink.play()
                });
            }
            else if (animation === game.HORSE_STATES.eatingFood) {
                game.floatingBottle.setAlpha(1)
                game.time.delayedCall(800, function () { game.stablesManager.horsePlayAnimation('eat_food') });
                game.time.delayedCall(1000, function () { game.oatsEat.play() });
                game.time.delayedCall(3000, function () { game.floatingBottle.setAlpha(.75) });
                game.time.delayedCall(3100, function () { game.floatingBottle.setAlpha(.5) });
                game.time.delayedCall(3200, function () { game.floatingBottle.setAlpha(.25) });
                game.time.delayedCall(3300, function () { 
                    game.floatingBottle.setAlpha(0) 
                    game.bottle.setAlpha(1)
                });
            }
            else if (animation === game.HORSE_STATES.eatingApple) {
                game.appleMunch.play();
                game.stablesManager.horsePlayAnimation('eat_apple')
            }
        }
        
        game.stablesManager.updateInspirationalMessage()
        game.stablesManager.updateStatbox()
    }
}