// TODO : Clean up those vars to be set in create in game const
const HAND = {
    empty: 'empty',
    shovel: 'shovel',
    fork: 'fork',
    forkFilled: 'fork_filled',
    brush: 'brush',
    brushSmall: 'comb',
    hoofpick: 'hoofpick',
    redApple: 'red_apple',
    greenApple: 'green_apple',
    carrot: 'carrot',
    pear: 'pear',
    bottle: 'bottle',
    grainScoop: 'grain_scoop'
}
handCurrent = HAND.empty;

emptyPointerSprite = null;
shovelHeldSprite = null
forkHeldSprite = null
grainHeldSprite = null
brushHeldSprite = null
combHeldSprite = null
hoofpickHeldSprite = null
redAppleHeldSprite = null
greenAppleHeldSprite = null
carrotHeldSprite = null
pearHeldSprite = null
bottleHeldSprite = null

class Stable extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: 'Stable'
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
        this.load.image('stable_ref', './images/stable/stableRef.png');
        this.load.image('stable_bg', './images/stable/stable_bg.png');

        this.load.atlas('cubby', './images/stable/cubby.png', './images/stable/cubby.json')
        this.load.atlas('hayLoft', './images/stable/hayLoft.png', './images/stable/hayLoft.json')
        this.load.atlas('hayFloor00', './images/stable/hayFloor_00.png', './images/stable/hayFloor_00.json')
        this.load.atlas('hayFloor01', './images/stable/hayFloor_01.png', './images/stable/hayFloor_01.json')
        this.load.atlas('hayFloor02', './images/stable/hayFloor_02.png', './images/stable/hayFloor_02.json')
        this.load.atlas('barrel', './images/stable/barrel.png', './images/stable/barrel.json')
        this.load.atlas('bin', './images/stable/bin.png', './images/stable/bin.json')
        this.load.atlas('oatBag', './images/stable/oatbag.png', './images/stable/oatbag.json')
        this.load.atlas('apples', './images/stable/apples.png', './images/stable/apples.json')
        this.load.atlas('bottle', './images/stable/bottles.png', './images/stable/bottles.json')
        this.load.atlas('bottle_hand', './images/stable/bottle.png', './images/stable/bottle.json')
        this.load.atlas('frame', './images/stable/frame.png', './images/stable/frame.json')
        this.load.atlas('comb', './images/stable/comb.png', './images/stable/comb.json')
        this.load.atlas('brush', './images/stable/brush.png', './images/stable/brush.json')
        this.load.atlas('pitchfork', './images/stable/pitchfork.png', './images/stable/pitchfork.json')
        this.load.atlas('shovel', './images/stable/shovel.png', './images/stable/shovel.json')
        this.load.atlas('hoofpick', './images/stable/hoofpick.png', './images/stable/hoofpick.json')
        this.load.atlas('water', './images/stable/waterfeed.png', './images/stable/waterfeed.json')
        this.load.spineAtlas('horseshoe-atlas', './images/stable/horseshoe.atlas')
        this.load.spineJson('horseshoe-json', './images/stable/horseshoe.json')

        this.load.image('certificate_small', './images/stable/certificate_small.png')
        this.load.image('certificate_big', './images/stable/certificate_big.png')

        this.load.atlas('ui_indicator', './images/stable/indicator.png', './images/stable/indicator.json')
        this.load.atlas('ui_indicator_food', './images/stable/indicator_food.png', './images/stable/indicator_foods.json')
        this.load.atlas('ui_indicator_love', './images/stable/indicator_love.png', './images/stable/indicator_love.json')
        this.load.atlas('ui_indicator_clean', './images/stable/indicator_clean.png', './images/stable/indicator_clean.json')

        this.load.image('cursor', './images/cursor.png');

        this.load.spineAtlas("horse-atlas", `./images/horse/skeleton.atlas`);
        this.load.spineJson("horse-json", `./images/horse/skeleton.json`);

        // Hide the computer cursor
        this.input.setDefaultCursor('none');
    }

    create ()
    {
        const game = this;

        game.horseStatus = 
        {
            snackSatisfied: false,
            bottleHungry: 0,
            hayFloor: [true, true, true]
        };
        game.barrel = 
        {
            foodQuality: 'normal'
        }

        //  If you disable topOnly it will fire events for all objects the pointer is over, regardless of place on the display list
        this.input.topOnly = true;

        // Ref image
        // this.add.image(0, 0, 'stable_ref').setOrigin(0);
    
        // Background image
        // TODO: Re-export with the yellow border
        this.add.image(0, 0, 'stable_bg').setOrigin(0);

        // Horse name
        const horseNameTextSettings = { 
            font: 'bold 14px Arial', 
            align: 'center',
            color: '#8330D4',
        }
        // TODO: Set name based on saved datas
        const horseName = "Flower Sparkle";
        this.add.text(399, 139, horseName, horseNameTextSettings)

        // Cubby
        // TODO: Put as close or open depending on if horse is sleeping or not
        const cubby = this.add.sprite(565, 210, 'cubby', 'open');
        const cubbyInteractive = this.add.graphics({fillStyle: { color: 0x0000aa }}).setInteractive(new Phaser.Geom.Rectangle(465, 170, 205, 168), Phaser.Geom.Rectangle.Contains);

        // HayLoft (wall)
        const hayLoft = this.add.sprite(447, 57, 'hayLoft', 'idle');
        const hayLoftInteractive = this.add.graphics({fillStyle: { color: 0x0000aa }}).setInteractive(new Phaser.Geom.Rectangle(355, 15, 180, 95), Phaser.Geom.Rectangle.Contains);
        hayLoftInteractive.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.fork) return;

            hayLoft.setTexture('hayLoft', 'hover');
        });
        hayLoftInteractive.on('pointerout', () => hayLoft.setTexture('hayLoft', 'idle'));
        hayLoftInteractive.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.fork) return;

            handCurrent = HAND.forkFilled;
            useIndicator(indicatorClean, 'clean');
        });

        // Hay (floor)
        const hayFloor00 = this.add.sprite(330, 480, 'hayFloor00', 'idle').setScale(.7, .5);
        const hayFloor00Interactive = this.add.graphics({fillStyle: { color: 0x0000aa }}).setInteractive(new Phaser.Geom.Rectangle(190, 400, 200, 200), Phaser.Geom.Rectangle.Contains);
        this.anims.create({
            key: 'hayFloor00_remove',
            frames: this.anims.generateFrameNumbers('hayFloor00', { frames: [
                '0001_remove', '0002_remove', '0003_remove', '0004_remove', '0005_remove', '0006_remove', '0007_remove', '0008_remove', '0009_remove', 'empty'
            ] }),
            frameRate: 24
        });
        this.anims.create({
            key: 'hayFloor00_add',
            frames: this.anims.generateFrameNumbers('hayFloor00', { frames: [
                '0001_add', '0002_add', '0003_add', '0004_add', '0005_add', '0006_add', '0007_add', '0008_add', '0009_add', 'idle'
            ] }),
            frameRate: 24
        });
        hayFloor00Interactive.on('pointerdown', function (pointer)
        {
            if (handCurrent == HAND.shovel && game.horseStatus.hayFloor[0] === true)
            {
                // TODO: replace the shovel
                hayFloor00.play('hayFloor00_remove');
                game.horseStatus.hayFloor[0] = false;
            }
            else if (handCurrent == HAND.forkFilled && game.horseStatus.hayFloor[0] === false)
            {
                // TODO: replace the fork
                hayFloor00.play('hayFloor00_add');
                game.horseStatus.hayFloor[0] = true;
            }

            handCurrent = HAND.empty;
        });

        const hayFloor01 = this.add.sprite(450, 480, 'hayFloor01', 'idle').setScale(.7, .5);
        const hayFloor01Interactive = this.add.graphics({fillStyle: { color: 0x0000aa }}).setInteractive(new Phaser.Geom.Rectangle(390, 400, 200, 200), Phaser.Geom.Rectangle.Contains);
        this.anims.create({
            key: 'hayFloor01_remove',
            frames: this.anims.generateFrameNumbers('hayFloor01', { frames: [
                '0001_remove', '0002_remove', '0003_remove', '0004_remove', '0005_remove', '0006_remove', '0007_remove', '0008_remove', '0009_remove', 'empty'
            ] }),
            frameRate: 24
        });
        this.anims.create({
            key: 'hayFloor01_add',
            frames: this.anims.generateFrameNumbers('hayFloor01', { frames: [
                '0001_add', '0002_add', '0003_add', '0004_add', '0005_add', '0006_add', '0007_add', '0008_add', '0009_add', 'idle'
            ] }),
            frameRate: 24
        });
        hayFloor01Interactive.on('pointerdown', function (pointer)
        {
            if (handCurrent == HAND.shovel && game.horseStatus.hayFloor[1] === true)
            {
                // TODO: replace the shovel
                hayFloor01.play('hayFloor01_remove');
                game.horse.hayFloor[1] = false;
            }
            else if (handCurrent == HAND.forkFilled && game.horseStatus.hayFloor[1] === false)
            {
                // TODO: replace the fork
                hayFloor01.play('hayFloor01_add');
                game.horseStatus.hayFloor[1] = true;
            }

            handCurrent = HAND.empty;
        });

        const hayFloor02 = this.add.sprite(600, 480, 'hayFloor02', 'idle').setScale(.7, .5);
        const hayFloor02Interactive = this.add.graphics({fillStyle: { color: 0x0000aa }}).setInteractive(new Phaser.Geom.Rectangle(590, 400, 200, 200), Phaser.Geom.Rectangle.Contains);
        this.anims.create({
            key: 'hayFloor02_remove',
            frames: this.anims.generateFrameNumbers('hayFloor02', { frames: [
                '0001_remove', '0002_remove', '0003_remove', '0004_remove', '0005_remove', '0006_remove', '0007_remove', '0008_remove', '0009_remove', 'empty'
            ] }),
            frameRate: 24
        });
        this.anims.create({
            key: 'hayFloor02_add',
            frames: this.anims.generateFrameNumbers('hayFloor02', { frames: [
                '0001_add', '0002_add', '0003_add', '0004_add', '0005_add', '0006_add', '0007_add', '0008_add', '0009_add', '0010_add','0011_add','0012_add','0013_add','idle'
            ] }),
            frameRate: 24
        });
        hayFloor02Interactive.on('pointerdown', function (pointer)
        {
            if (handCurrent == HAND.shovel && game.horseStatus.hayFloor[2] === true)
            {
                // TODO: replace the shovel
                hayFloor02.play('hayFloor02_remove');
                game.horseStatus.hayFloor[2] = false;
            }
            else if (handCurrent == HAND.forkFilled && game.horseStatus.hayFloor[2] === false)
            {
                // TODO: replace the fork
                hayFloor02.play('hayFloor02_add');
                game.horseStatus.hayFloor[2] = true;
            }

            handCurrent = HAND.empty;
        });

        // Shovel
        const shovel = this.add.sprite(28, 267, 'shovel', 'idle').setScale(-1, 1);
        const shovelInteractive = this.add.graphics({fillStyle: { color: 0x0000aa }}).setInteractive(new Phaser.Geom.Rectangle(17, 280, 40, 212), Phaser.Geom.Rectangle.Contains);
        shovelInteractive.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;
            shovel.setTexture('shovel', 'hover');
        });
        shovelInteractive.on('pointerout', () => shovel.setTexture('shovel', 'idle'));
        shovelInteractive.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            handCurrent = HAND.shovel;
            // TODO: Hide this one until the shovel is put back
            useIndicator(indicatorClean, 'clean');
        });

        // Pitchfork
        const pitchfork = this.add.sprite(67, 280, 'pitchfork', 'idle').setScale(-1, 1).setAngle(8);
        const pitchforkInteractive = this.add.graphics({fillStyle: { color: 0x0000aa }}).setInteractive(new Phaser.Geom.Rectangle(60, 270, 30, 192), Phaser.Geom.Rectangle.Contains);
        pitchforkInteractive.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;
            //pitchfork.setTexture('pitchfork', 'hover');
        });
        pitchforkInteractive.on('pointerout', () => pitchfork.setTexture('pitchfork', 'idle'));
        pitchforkInteractive.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            handCurrent = HAND.fork;
            // TODO: Hide this one until the pitchfork is put back
            useIndicator(indicatorClean, 'clean');
        });

        // Bottle
        // TODO: find hover sprite
        const bottle = this.add.sprite(720, 450, 'bottle', 'idle');
        const bottleInteractive = this.add.graphics({fillStyle: { color: 0x0000aa }}).setInteractive(new Phaser.Geom.Rectangle(600, 370, 60, 80), Phaser.Geom.Rectangle.Contains);
        this.anims.create({
            key: 'bottle_kicked',
            frames: this.anims.generateFrameNumbers('bottle', { frames: [
                '0001', '0001', '0001', '0001', '0001', '0002',  '0002',  '0002',  'idle'
            ] }),
            frameRate: 24
        });
        bottleInteractive.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            handCurrent = HAND.bottle;
            useIndicator(indicatorFood, 'food');
        });
        bottleInteractive.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            //bottle.setTexture('bottle', 'hover');
        });
        bottleInteractive.on('pointerout', () => bottle.setTexture('bottle', 'idle'));        

        // Water
        const water = this.add.sprite(160, 418, 'water', 'idle_full');
        const waterInteractive = this.add.graphics({fillStyle: { color: 0x0000aa }}).setInteractive(new Phaser.Geom.Rectangle(130, 410, 80, 140), Phaser.Geom.Rectangle.Contains);
        waterInteractive.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;
        });
        waterInteractive.on('pointerout', () => water.setTexture('water', 'idle_full'));
        waterInteractive.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            handCurrent = HAND.water;
            useIndicator(indicatorFood, 'food');
        });

        // HorseFrame
        // TODO: Add horse image inside
        const picFrame = this.add.sprite(279, 210, 'frame', 'idle').setScale(.6);
        const picFrameInteractive = this.add.graphics({fillStyle: { color: 0x0000aa }}).setInteractive(new Phaser.Geom.Rectangle(250, 180, 60, 70), Phaser.Geom.Rectangle.Contains);
        picFrameInteractive.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            // TODO: Show inspiration
        });
        picFrameInteractive.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            picFrame.setTexture('frame', 'hover');
        });
        picFrameInteractive.on('pointerout', () => picFrame.setTexture('frame', 'idle'));     

        // Barrel
        // TODO: Find hover sprite

        function updateBarrelType()
        {
            var barrelRandType = Math.random();
    
            if (barrelRandType < 0.8)
                return 'red_apple';
            else if (barrelRandType < 0.9)
                return 'green_apple';
            else if (barrelRandType < 0.95)
                return 'pear';
            else 
                return 'carrot';
        }

        var barrelType = updateBarrelType();

        const barrel = this.add.sprite(608, 265, 'barrel', barrelType);
        const barrelInteractive = this.add.graphics({fillStyle: { color: 0x0000aa }}).setInteractive(new Phaser.Geom.Rectangle(660, 250, 70, 110), Phaser.Geom.Rectangle.Contains);
        barrelInteractive.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;
            useIndicator(indicatorFood, 'food');

            // Update the sprite depending on the luck
            var foodRand = Math.random();
            var foodType = 'normal';
            if (foodRand < 0.7)
                foodType = 'normal';
            else if (foodRand < 0.9)
                foodType = 'brown';
            else
                foodType = 'gold';

            // Set hand type for showing the correct item
            switch(barrelType)
            {
                case 'red_apple':
                    handCurrent = HAND.redApple;
                    redAppleHeldSprite.setTexture('apples', 'redapple_' + foodType);
                    break;
                case 'green_apple': 
                    handCurrent = HAND.greenApple; 
                    greenAppleHeldSprite.setTexture('apples', 'greenapple_' + foodType);
                    break;
                case 'pear':
                    handCurrent = HAND.pear; 
                    pearHeldSprite.setTexture('apples', 'pear_' + foodType);
                    break;
                case 'carrot': 
                    handCurrent = HAND.carrot; 
                    carrotHeldSprite.setTexture('apples', 'carrot_' + foodType);
                    break;
            }

            game.barrel.foodQuality = foodType;
            
            // Reset the barrel
            barrelType = updateBarrelType();
            barrel.setTexture('barrel', barrelType);
        });


        // Bin
        const bin = this.add.sprite(730, 298, 'bin', 'idle');
        const binInteractive = this.add.graphics({fillStyle: { color: 0x0000aa }}).setInteractive(new Phaser.Geom.Rectangle(690, 300, 60, 80), Phaser.Geom.Rectangle.Contains);
        this.anims.create({
            key: 'bin_open',
            frames: this.anims.generateFrameNumbers('bin', { frames: [
                'idle', '0001', '0002', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0002', '0001', 'idle'
            ] }),
            frameRate: 24
        });
        binInteractive.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.redApple &&
                handCurrent != HAND.greenApple &&
                handCurrent != HAND.carrot &&
                handCurrent != HAND.pear) 
                {
                    bin.play("bin_open");
                    return;
                }

            handCurrent = HAND.empty;
        });
        binInteractive.on('pointerover', function (pointer)
        {
            // TODO: Find hover sprite
            //bin.setTexture('bin', 'hover')
        });
        binInteractive.on('pointerout', () => bin.setTexture('bin', 'idle'));        

        // Oat Bag
        const oatBag = this.add.sprite(770, 340, 'oatBag', 'idle');
        const oatBagInteractive = this.add.graphics({fillStyle: { color: 0x0000aa }}).setInteractive(new Phaser.Geom.Rectangle(720, 305, 100, 120), Phaser.Geom.Rectangle.Contains);
        oatBagInteractive.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            handCurrent = HAND.grainScoop;
            useIndicator(indicatorFood, 'food');
        });
        oatBagInteractive.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            oatBag.setTexture('oatBag', 'hover');
        });
        oatBagInteractive.on('pointerout', () => oatBag.setTexture('oatBag', 'idle'));        

        // Oat Through

        // Brush
        const brush = this.add.sprite(745, 160, 'brush', 'idle').setScale(.6);
        const brushInteractive = this.add.graphics({fillStyle: { color: 0x0000aa }}).setInteractive(new Phaser.Geom.Rectangle(748, 185, 32, 65), Phaser.Geom.Rectangle.Contains);
        brushInteractive.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;
            brush.setTexture('brush', 'hover');
        });
        brushInteractive.on('pointerout', () => brush.setTexture('brush', 'idle'));
        brushInteractive.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            handCurrent = HAND.brush;
            // TODO: Hide this one until the brush is put back
            useIndicator(indicatorClean, 'indicatorClean');
        });

        // Comb
        const comb = this.add.sprite(705, 288, 'comb', 'idle').setScale(.6);
        const combInteractive = this.add.graphics({fillStyle: { color: 0x0000aa }}).setInteractive(new Phaser.Geom.Rectangle(725, 185, 20, 60), Phaser.Geom.Rectangle.Contains);
        combInteractive.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;
            //comb.setTexture('comb', 'hover');
        });
        combInteractive.on('pointerout', () => comb.setTexture('comb', 'idle'));
        combInteractive.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            handCurrent = HAND.comb;
            // TODO: Hide this one until the comb is put back
            useIndicator(indicatorClean, 'indicatorClean');
        });

        // Hoof pick
        const hoofpick = this.add.sprite(793, 219, 'hoofpick', 'idle').setScale(.6, .8);
        const hoofpickInteractive = this.add.graphics({fillStyle: { color: 0x0000aa }}).setInteractive(new Phaser.Geom.Rectangle(785, 185, 15, 70), Phaser.Geom.Rectangle.Contains);
        hoofpickInteractive.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;
            hoofpick.setTexture('hoofpick', 'hover');
        });
        hoofpickInteractive.on('pointerout', () => hoofpick.setTexture('hoofpick', 'idle'));
        hoofpickInteractive.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            handCurrent = HAND.hoofpick;
            // TODO: Hide this one until the hoofpick is put back
            useIndicator(indicatorClean, 'indicatorClean');
        });

        // To Stables

        // To Cottage

        // To World

        // Horse
        // TODO: update the visuals with the actual skin of the horse
        // TODO: Update interaction area depending on objects
        const horse = this.add.spine(455, 485, 'horse-json', 'horse-atlas').setScale(.425);
        horse.animationState.setAnimation(0, "Idle", false)
        const horseInteractive = this.add.graphics({fillStyle: { color: 0x0000aa }}).setInteractive(new Phaser.Geom.Rectangle(340, 240, 230, 260), Phaser.Geom.Rectangle.Contains);
        horseInteractive.on('pointerdown', function (pointer)
        {
            console.log("Hi")

            switch(handCurrent)
            {
                case HAND.redApple:
                case HAND.greenApple:
                case HAND.pear:
                case HAND.carrot:
                    switch(game.barrel.foodQuality)
                    {
                        default:
                        case 'normal':
                            horse.animationState.setAnimation(0, 'EatSnack', false);
                            game.horseStatus.snackSatisfied = true;

                            var randResult = Math.random();
                            // TODO: Handle 'MovePositive' depending on randResult

                            handCurrent = HAND.empty;
                            break;
                        case 'brown':
                            horse.animationState.setAnimation(0, 'RefuseSnack', false);
                            break;
                        case 'gold':
                            horse.animationState.setAnimation(0, 'EatSnack', false);
                            // TODO: update 'MovePositive
                            handCurrent = HAND.empty;
                            break;
                    }
                    break;
                case HAND.bottle:
                    switch(game.horseStatus.bottleHungry)
                    {
                        // Very Hungry
                        case 0:
                            horse.animationState.setAnimation(0, 'DrinkBottle2', false);

                            game.horseStatus.bottleHungry = 1;

                            var randResult = Math.random();
                            // TODO: Handle 'MovePositive' depending on randResult
                            handCurrent = HAND.empty;
                            break;
                        // Hungry
                        case 1:
                            var randResult = Math.random();
                            horse.animationState.setAnimation(0, 'DrinkBottle1', false);

                            game.horseStatus.bottleHungry = 2;

                            var randResult = Math.random();
                            // TODO: Handle 'MovePositive' depending on randResult
                            handCurrent = HAND.empty;
                            break;
                        // Satisfied
                        case 2:
                            // TODO: Check what happens to the bottle when it is refused
                            handCurrent = HAND.empty;
                            break;
                    }
                    break;
            }
        });

        // Horseshoe
        const horseshoe = this.add.spine(191, 361, 'horseshoe-json', 'horseshoe-atlas').setOrigin(0).setScale(.48);
            horseshoe.animationState.setAnimation(0, "idle", true);
        const horseshoeInteractive = this.add.graphics({fillStyle: { color: 0x0000aa }}).setInteractive(new Phaser.Geom.Rectangle(16, 140, 30, 40), Phaser.Geom.Rectangle.Contains);
        this.anims.create({
            key: 'horseshoe_play',
            frames: this.anims.generateFrameNumbers('horseshoe', { frames: [
                'idle', '0001', '0002', '0003', '0004', '0005', '0006', '0007', '0008', '0009', '0010', '0011', '0012', '0013', '0014', '0015', '0016', '0017', '0018', '0019', '0020', '0021', '0022', '0023', '0024', '0025', '0026', '0027', '0028', '0029', '0030', '0031', '0032', '0033', '0034', '0035', '0036', '0037', '0038', '0039', '0040', '0041', '0042', '0043', '0044', '0045', '0046', '0047', '0048', '0049', '0050', '0051', '0052', '0053', '0054', '0055', '0056', '0057', '0058', '0059', '0060', '0061', '0062', '0063', '0064', '0065', '0066', '0067', '0068', '0069', '0070', '0071', '0072', '0073', '0074', '0075', '0076', '0077', '0078', '0079', '0080', '0081', '0082', '0083', '0084', '0085', '0086', '0087', '0088', '0089', '0090', '0091', '0092', '0093', '0094', '0095', '0096', '0097', '0098', '0099', '0100', '0101', '0102', '0103', '0104', '0105', '0106', '0107', '0108', '0109', '0110', '0111', '0112', '0113', '0114', '0115', '0116', '0117', '0118', '0119', '0120', '0121', '0122', '0123', '0124', '0125', '0126', '0127', '0128', '0129'
            ] }),
            frameRate: 24
        });
        horseshoeInteractive.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            horseshoe.animationState.setAnimation(1, "goodluck", false);
        });
        horseshoeInteractive.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            horseshoe.animationState.setAnimation(0, "hlite", true);
        });
        horseshoeInteractive.on('pointerout', () => horseshoe.animationState.setAnimation(0, "idle", true));

        // Certificate
        // TODO: Re-export the small certificate with dummy text
        // TODO: Find the sprite for small certificate hover
        // TODO: Write big certificate's texts
        const certificate_small = this.add.sprite(280, 153, 'certificate_small').setInteractive({pixelperfect: true, alphaTolerance: 255}).setScale(.1);
        const certificate_big = this.add.sprite(510, 310, 'certificate_big').setInteractive({pixelperfect: true, alphaTolerance: 255}).setVisible(false).setScale(.1);

        certificate_small.on('pointerdown', function (pointer)
        {
            if (!certificate_big.visible)
                certificate_big.setVisible(true);
        });

        certificate_big.on('pointerdown', function (pointer)
        {
            certificate_big.setVisible(false);
        });

        // ---------- UI -------------------//

        // Indicator bg
        // TODO: close the indicator when the status are full
        const indicatorUI = this.add.sprite(100, 35, 'ui_indicator', '0001').setOrigin(.5)
        this.anims.create({
            key: 'ui_indicator_open',
            frames: this.anims.generateFrameNumbers('ui_indicator', { frames: [
                '0001', '0002', '0003', '0004', '0005', '0006', '0007', '0008', '0009', '0010', '0011', '0012', '0013', '0014', '0015', '0016', '0017', '0018', '0019', '0020', '0021', '0022', '0023', '0024', '0025', '0026', '0027', '0028', '0029', '0030', '0031', '0032'
            ] }),
            frameRate: 24
        });
        indicatorUI.play('ui_indicator_open');

        // Food indicator
        // TODO: Make it change colors depending on the horse status
        // TODO: Check what was the entry animation
        const indicatorFood = this.add.sprite(200, 100, 'ui_indicator_food', 'idle_red').setOrigin(.5)
        this.anims.create({
            key: 'ui_indicator_food_using',
            frames: this.anims.generateFrameNumbers('ui_indicator_food', { frames: [
                '0001_red', '0002_red', '0003_red', '0004_red', '0005_red', '0006_red', '0007_red', '0008_red', '0009_red', '0010_red', 'idle_red'
            ] }),
            frameRate: 24
        });
        this.anims.create({
            key: 'ui_indicator_food_filled',
            frames: this.anims.generateFrameNumbers('ui_indicator_food', { frames: [
                '0001_green', '0002_green', '0003_green', '0004_green', '0005_green', '0006_green', '0007_green', '0008_green', '0009_green', 'idle_green'
            ] }),
            frameRate: 24
        });

        // Clean indicator
        // TODO: Make it change colors depending on the horse status
        // TODO: Check what was the entry animation
        const indicatorClean = this.add.sprite(150, 108, 'ui_indicator_clean', 'idle_red').setOrigin(.5)
        this.anims.create({
            key: 'ui_indicator_clean_using',
            frames: this.anims.generateFrameNumbers('ui_indicator_clean', { frames: [
                '0001_red', '0002_red', '0003_red', '0004_red', '0005_red', '0006_red', '0007_red', '0008_red', '0009_red', '0010_red', 'idle_red'
            ] }),
            frameRate: 24
        });
        this.anims.create({
            key: 'ui_indicator_clean_filled',
            frames: this.anims.generateFrameNumbers('ui_indicator_clean', { frames: [
                '0001_green', '0002_green', '0003_green', '0004_green', '0005_green', '0006_green', '0007_green', '0008_green', '0009_green', 'idle_green'
            ] }),
            frameRate: 24
        });

        // Love indicator
        // TODO: Make it change colors depending on the horse status
        // TODO: Check what was the entry animation
        const indicatorLove = this.add.sprite(232, 65, 'ui_indicator_love', 'idle_red').setOrigin(.5)
        this.anims.create({
            key: 'ui_indicator_love_using',
            frames: this.anims.generateFrameNumbers('ui_indicator_love', { frames: [
                '0001_red', '0002_red', '0003_red', '0004_red', '0005_red', '0006_red', '0007_red', '0008_red', '0009_red', '0010_red', 'idle_red'
            ] }),
            frameRate: 24
        });
        this.anims.create({
            key: 'ui_indicator_love_filled',
            frames: this.anims.generateFrameNumbers('ui_indicator_love', { frames: [
                '0001_green', '0002_green', '0003_green', '0004_green', '0005_green', '0006_green', '0007_green', '0008_green', '0009_green', 'idle_green'
            ] }),
            frameRate: 24
        });

        function useIndicator(indicator, indicatorType)
        {
            return;
            // TODO: Make it loop, allow cancel when change type of action

            indicator.play('ui_indicator_' + indicatorType + '_using')
        }

        function fillIndicator(indicator, indicatorType)
        {
            indicator.play('ui_indicator_' + indicatorType + '_filled')
        }

        // ---------- Held items ---------- //
        emptyPointerSprite = this.add.image(900, 600, 'cursor').setVisible(true).setOrigin(.1, .2);
        redAppleHeldSprite = this.add.image(900, 600, 'apples', 'redapple_normal').setVisible(false).setOrigin(.8);
        greenAppleHeldSprite = this.add.image(900, 600, 'apples', 'greenapple_normal').setVisible(false).setOrigin(.8);
        carrotHeldSprite = this.add.image(900, 600, 'apples', 'carrot_normal').setVisible(false).setOrigin(.8);
        pearHeldSprite = this.add.image(900, 600, 'apples', 'pear_normal').setVisible(false).setOrigin(.8);
        bottleHeldSprite = this.add.image(900, 600, 'bottle_hand', 'idle').setVisible(false).setOrigin(.3);
    }

    update ()
    {
        const pointer = this.input.activePointer;
            
        // Clear held items from display
        function clearCursor() {
            redAppleHeldSprite.setVisible(false);
            greenAppleHeldSprite.setVisible(false);
            carrotHeldSprite.setVisible(false);
            pearHeldSprite.setVisible(false);
            bottleHeldSprite.setVisible(false);
            emptyPointerSprite.setVisible(false);
        }

        clearCursor()

        switch(handCurrent)
        {
            default:
            case HAND.empty:
                emptyPointerSprite.setVisible(true).setPosition(pointer.worldX, pointer.worldY); break;
            case HAND.redApple:
                redAppleHeldSprite.setVisible(true).setPosition(pointer.worldX, pointer.worldY); break;
            case HAND.greenApple:
                greenAppleHeldSprite.setVisible(true).setPosition(pointer.worldX, pointer.worldY); break;
            case HAND.pear:
                pearHeldSprite.setVisible(true).setPosition(pointer.worldX, pointer.worldY); break;
            case HAND.carrot:
                carrotHeldSprite.setVisible(true).setPosition(pointer.worldX, pointer.worldY); break;
            case HAND.bottle:
                bottleHeldSprite.setVisible(true).setPosition(pointer.worldX, pointer.worldY); break;
        }
    }
}