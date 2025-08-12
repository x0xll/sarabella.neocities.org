// Variables to be used throughout scene
// horse = null
// horseDirty = null
// horseOverlay= null

// inspiration = null
// inspirationMessage = null



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
        const game = this
        game.stablesManager = new StablesManager(game)

        // LOADING BAR
        game.stablesManager.preloadDisplayLoadBar()
            
        // Load in images and sounds
        game.load.image('stable_bg', './images/airStable/stable-bg.png');
        game.load.image('stable_fg', './images/airStable/stable-fg.png');
        game.load.image('hunger_scale', './images/airStable/hunger.png');
        game.load.image('cleanliness_scale', './images/airStable/cleanliness.png');
        game.load.image('happiness_scale', './images/airStable/happiness.png');

        game.load.atlas('leaf_tree_shake', './images/airStable/leaf_tree_shake.png', './images/airStable/leaf_tree_shake.json');
        game.load.atlas('leaf_chimes', './images/airStable/leaf_chimes.png', './images/airStable/leaf_chimes.json');
        game.load.atlas('leaves_fall', './images/airStable/leaves_fall.png', './images/airStable/leaves_fall.json');
        game.load.atlas('leaves_wind', './images/airStable/leaves_wind.png', './images/airStable/leaves_wind.json');

        game.load.image('left_tree', './images/airStable/leftTree.png');
        game.load.atlas('fountain', './images/airStable/fountain.png', './images/airStable/fountain.json');
        game.load.atlas('food_interactive', './images/airStable/food_interactive.png', './images/airStable/food_interactive.json');
        game.load.atlas('berries', './images/airStable/berries.png','./images/airStable/berries.json');
        game.load.image('apple', './images/airStable/berriesHeld.png');
        game.load.atlas('horn', './images/airStable/horn.png','./images/airStable/horn.json');
        game.load.spineAtlas("branch-atlas", `./images/airStable/branches.atlas`);
        game.load.spineJson("branch-json", `./images/airStable/branches.json`);
        
        game.load.atlas('brush', './images/airStable/brush.png', './images/airStable/brush.json');
        game.load.atlas('brush_small', './images/airStable/brush_small.png', './images/airStable/brush_small.json');
        game.load.atlas('hoofpick', './images/airStable/feather_oil.png', './images/airStable/feather_oil_updated.json');
        
        game.load.spineAtlas("horse-atlas", `./images/horses/${horseName}/skeleton.atlas`);
        game.load.spineAtlas("horse_overlay-atlas", `./images/horses/${horseName}/skeleton_overlay.atlas`);
        game.load.spineAtlas("horse_dirty-atlas", `./images/airStable/horse_dirty/dirt_skeleton.atlas`);
        game.load.spineJson("horse-json", `./images/horses/${horseName}/skeleton.json`);
        game.load.spineJson("horse_overlay-json", `./images/horses/${horseName}/skeleton_overlay.json`);
        game.load.spineJson("horse_dirty-json", `./images/airStable/horse_dirty/dirt_skeleton.json`);

        game.load.image('horse_image', `./images/horses/${horseName}/card_image.jpg`);

        game.load.atlas('frame', './images/airStable/frame.png', './images/airStable/frame.json');
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
        const brush = game.add.sprite(659, 231, 'brush', 'idle').setScale(0.76).setInteractive({ pixelPerfect: true });
        // const brushInteractive = game.add.graphics().setInteractive(new Phaser.Geom.Rectangle(753, 88, 40, 50), Phaser.Geom.Rectangle.Contains);
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
        const brushSmall = game.add.sprite(684, 247, 'brush_small', 'idle').setInteractive({ pixelPerfect: true });
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
        const hoofpick = game.add.sprite(683, 187, 'hoofpick', 'idle').setInteractive( { pixelPerfect: true } );
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
        const leaves = game.add.sprite(520, 261, 'leaves_wind', 'wind0000');
             game.stablesManager.addSpriteAnims(leaves, 'leaves_wind', [
                    'wind0000', 'wind0001', 'wind0002', 'wind0003', 'wind0004', 'wind0005', 'wind0006', 'wind0007', 'wind0008', 'wind0009',
                    'wind0010', 'wind0011', 'wind0012', 'wind0013', 'wind0014', 'wind0015', 'wind0016', 'wind0017', 'wind0018', 'wind0019',
                    'wind0020', 'wind0021', 'wind0022', 'wind0023', 'wind0024', 'wind0025', 'wind0026', 'wind0027', 'wind0028', 'wind0029',
                ])
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
        game.add.image(164, 77, 'horse_image').setScale(.35);
        const frame = game.add.sprite(165, 73, 'frame', 'idle').setInteractive();
            frame.on('pointerover', function (pointer){
                if (game.canPlayInspiration) {
                    frame.setFrame('hover');
                    game.inspirationHover.play()
                }
            });
            frame.on('pointerout', function (pointer) { frame.setFrame('idle') });
            frame.on('pointerdown', function (pointer) { 
                if (game.canPlayInspiration) {
                    game.playInspiration = true 
                    game.inspirationSound.play()
                }
            })


        // Water Fountain
        game.trough = game.add.sprite(188, 348, 'fountain', 'idle').setInteractive({ pixelPerfect: true });
            game.stablesManager.addSpriteAnims(game.trough, 'fill_water', [
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
            ])
            game.stablesManager.addSpriteAnims(game.trough, 'water_fountain_drink', [
                '100', '100', '100', '100', '100', '100', '100', '100', '100', '100',
                '100', '100', '100', '100', '100', '100', '100', '100', '100', '100',
                '100', '100', '100', '100', '100', '100',
                '125', '126', '127', '128', '129', '130',
                '131', '132', '133', '134', '135', '136', '137', '138', '139', '140',
                '141', '142', '143', '144', '145', '146', '147', '148', '149', '150',
                '151', '152', '153', '154', '155', '156', '157', '158', '159', '160',
                '161', '162', '163', '164', '165', '166', '167', '168', '169', '170',
                '171', '172', '173', '174', '175', '176'
            ])
            game.trough.on('pointerdown', function (pointer)
            {
                if (!game.waterFilled && game.handCurrent === game.HAND.empty) {
                    game.waterFilled = true;
                    game.trough.play('fill_water');
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

        // Food Trough
        game.branch = game.add.spine(-35, 230, 'branch-json', 'branch-atlas').setScale(.35)//.setAngle(90);


        // Horse hit box
        const wingInteractive = game.add.graphics().setInteractive(new Phaser.Geom.Rectangle(330, 0, 250, 350), Phaser.Geom.Rectangle.Contains);
        game.stablesManager.createHorseHitbox(200, 120, 376, 245, cleanWings, -20, -15)
            wingInteractive.on('pointerdown', function (pointer) {
                if (game.handCurrent === game.HAND.hoofpick) { cleanWings() }
            });


        // Windchime
        const windchimes = game.add.sprite(340, 18, 'leaf_chimes', 'idle').setInteractive({ pixelPerfect: true });
            game.stablesManager.addSpriteAnims(windchimes, 'windchimes_blow', [
                    'wind0000', 'wind0001', 'wind0002', 'wind0003', 'wind0004', 'wind0005', 'wind0006', 'wind0007', 'wind0008', 'wind0009',
                    'wind0010', 'wind0011', 'wind0012', 'wind0013', 'wind0014', 'wind0015', 'wind0016', 'wind0017', 'wind0018', 'wind0019',
                    'wind0020', 'wind0021', 'wind0022', 'wind0023', 'wind0024', 'wind0025', 'wind0026',
                    'idle'
                ])
            windchimes.on('pointerover', function (pointer) {
                if (game.handCurrent === game.HAND.empty && leaves.frame.name === 'wind0000') {
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
                if (game.handCurrent === game.HAND.empty && leaves.frame.name === 'wind0000') {
                    leaves.play('leaves_wind');
                    windchimes.play('windchimes_blow');
                    game.cleanLeaves.play();
                }
            });


        // Horse
        game.stablesManager.createHorse(430, 295, 90)
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

             
        game.add.image(92, 285, 'left_tree');
        game.foodTrough = game.add.sprite(-164, 299, 'food_interactive', 'idle').setInteractive({ pixelPerfect: true });
            game.anims.create({
                key: 'pull_back',
                frames: game.anims.generateFrameNumbers('food_interactive', { frames: [
                    'bounce0000', 'bounce0001', 'bounce0002', 'bounce0003', 'bounce0004', 'bounce0005', 'bounce0006', 'bounce0007', 'bounce0008',
                    'idle'
                ] }),
                frameRate: 24
            });
            game.foodTrough.on('pointerdown', function (pointer) {
                if (game.handCurrent === game.HAND.empty) {
                    game.foodTrough.play('pull_back')
                    game.stablesManager.addToQueue(game.horseAnimationQueue, game.HORSE_STATES.eatingFood)
                }
            });
            game.foodTrough.on('pointerover', function (pointer) { 
                if (game.foodTrough.frame.name === 'idle' && game.handCurrent === game.HAND.empty) {
                    game.foodTrough.setFrame('hover')
                }
            });
            game.foodTrough.on('pointerout', function (pointer) {
                if (game.foodTrough.frame.name === 'hover') {
                    game.foodTrough.setFrame('idle')
                }
            });


        // Berries
        const berries = game.add.sprite(702, 30, 'berries', 'idle').setScale(.43).setInteractive();
            game.stablesManager.addSpriteAnims(berries, 'berries_pickup', [
                    'pickup0000', 'pickup0001', 'pickup0002', 'pickup0003', 'pickup0004', 'pickup0005', 'pickup0006', 'pickup0007', 'pickup0008', 'pickup0009'
                ])
            game.stablesManager.addSpriteAnims(berries, 'berries_place', [ 'idle' ])
            berries.on('pointerover', function (pointer) { game.stablesManager.pointerover (berries, game.hover1) });
            berries.on('pointerout', function (pointer) { game.stablesManager.pointerout (berries) });
            berries.on('pointerdown', function (pointer) {
                game.stablesManager.pointerdown(berries, game.HAND.apple, 'berries_pickup', 'berries_place')
            });

        // Tree (for leaves)
        const treeInteractive = game.add.graphics().setInteractive(new Phaser.Geom.Rectangle(740, 330, 200, 150), Phaser.Geom.Rectangle.Contains);
        const leafTree = game.add.sprite(443, 260, 'leaf_tree_shake', 'idle');
            game.stablesManager.addSpriteAnims(leafTree, 'tree_shake', [
                    'shake0000', 'shake0001', 'shake0002', 'shake0003', 'shake0004', 'shake0005', 'shake0006', 'shake0007', 'shake0008', 'shake0009',
                    'shake0010', 'shake0011', 'shake0012', 'shake0013', 'shake0014', 'shake0015', 'shake0016', 'shake0017', 'shake0018', 'shake0019',
                    'shake0020', 'shake0021', 'shake0022', 'shake0023', 'shake0024', 'shake0025', 'shake0026', 'shake0027', 'shake0028', 'shake0029',
                    'shake0030', 'shake0031', 'shake0032', 'shake0033', 'shake0034', 'shake0035', 'shake0036', 'shake0037', 'shake0038', 'shake0039',
                    'shake0040', 'shake0041', 'shake0042', 'shake0043', 'shake0044', 'shake0045', 'shake0046', 'shake0047', 'shake0048', 'shake0049',
                    'shake0050', 'shake0051', 'shake0052', 'shake0053', 'shake0054', 'shake0055', 'shake0056', 'shake0057', 'shake0058', 'shake0059',
                    'shake0060', 'shake0061', 'shake0062', 'shake0063', 'shake0064', 'shake0065', 'shake0066', 'shake0067',
                     'idle'
                ])
            treeInteractive.on('pointerover', function (pointer) {
                if (game.handCurrent === game.HAND.empty && leaves.frame.name === 'wind0029') {
                    leafTree.setFrame('hover');
                    game.hover2.play();
                }
            });
            treeInteractive.on('pointerout', function (pointer) { 
                if (leafTree.frame.name === 'hover') {
                    leafTree.setFrame('idle');
                }
            });
            treeInteractive.on('pointerdown', function (pointer) {
                if (game.handCurrent === game.HAND.empty && leaves.frame.name === 'wind0029') {
                    leaves.play('leaves_fall')
                    leafTree.play('tree_shake')
                    game.shakeLeaves.play()
                    game.stablesManager.addToQueue(game.statBoxQueue, localeData.txtNoMoreLeaves)
                    game.stablesManager.updateBar(game.cleanlinessBar, 2)
                    game.stablesManager.updateBar(game.happinessBar, 1/2 + 0.05)
                }
            });
        
        // Horn
        const horn = game.add.sprite(10, 120, 'horn', 'idle').setInteractive({ pixelPerfect: true });
            game.stablesManager.addSpriteAnims(horn, 'soothe', [
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

        // ---------- Stable foreground and UI ---------- //
        game.stablesManager.createStatBox(625, 130)
        game.stablesManager.createBeSaWorldLink(715, 125, .8, .8, "Small")
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
    }

    update ()
    {
        const game = this
        game.stablesManager.updateCursor({hoofpickYOffset:80})

        // play water flow sound when fountain is at correct frame
        if (game.trough.frame.name === '29') {
            game.waterFlow.play();
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
                game.branch.animationState.setAnimation(0, 'animation', false);
                game.time.delayedCall(800, function () { game.stablesManager.horsePlayAnimation('eat_food') });
                game.time.delayedCall(1000, function () { game.oatsEat.play() });
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