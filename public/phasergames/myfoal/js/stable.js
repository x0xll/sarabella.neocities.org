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

// TODO: figure out why inputs seems offset

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
        this.load.atlas('horseshoe', './images/stable/horseshoe.png', './images/stable/horseshoe.json')

        this.load.image('certificate_small', './images/stable/certificate_small.png')
        this.load.image('certificate_big', './images/stable/certificate_big.png')

        this.load.image('cursor', './images/cursor.png');

        this.load.spineAtlas("horse-atlas", `./images/horse/skeleton.atlas`);
        this.load.spineJson("horse-json", `./images/horse/skeleton.json`);

        // Hide the computer cursor
        //this.input.setDefaultCursor('none');
    }

    create ()
    {
        const game = this;

        game.horseStatus = 
        {
            snackSatisfied: false,
            bottleHungry: 0
        };
        game.barrel = 
        {
            foodQuality: 'normal'
        }

        //  If you disable topOnly it will fire events for all objects the pointer is over, regardless of place on the display list
        this.input.topOnly = true;

        // Ref image
        this.add.image(0, 0, 'stable_ref').setOrigin(0);
    
        // Background image
        // TODO: Re-export with the yellow border
        this.add.image(0, 0, 'stable_bg').setOrigin(0).setAlpha(.5);

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
        const cubby = this.add.sprite(565, 210, 'cubby', 'open').setInteractive();
        this.anims.create({
            key: 'cubby_open',
            frames: this.anims.generateFrameNumbers('cubby', { frames: [
                'open'
            ] }),
            frameRate: 24
        });
        this.anims.create({
            key: 'cubby_close',
            frames: this.anims.generateFrameNumbers('cubby', { frames: [
                'close'
            ] }),
            frameRate: 24
        });

        // HayLoft (wall)
        const hayLoft = this.add.sprite(447, 57, 'hayLoft', 'idle').setInteractive();
        this.anims.create({
            key: 'hayLoft_idle',
            frames: this.anims.generateFrameNumbers('hayLoft', { frames: [
                'idle'
            ] }),
            frameRate: 24
        });
        this.anims.create({
            key: 'hayLoft_hover',
            frames: this.anims.generateFrameNumbers('hayLoft', { frames: [
                'hover'
            ] }),
            frameRate: 24
        });
        hayLoft.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.fork) return;

            hayLoft.play('hayLoft_hover');
        });
        hayLoft.on('pointerout', () => hayLoft.play('hayLoft_idle'));
        hayLoft.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.fork) return;

            handCurrent = HAND.forkFilled;
        });

        // Hay (floor)

        // Shovel
        const shovel = this.add.sprite(28, 267, 'shovel', 'idle').setInteractive().setScale(-1, 1);
        shovel.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;
            shovel.setTexture('shovel', 'hover');
        });
        shovel.on('pointerout', () => shovel.setTexture('shovel', 'idle'));
        shovel.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            handCurrent = HAND.shovel;
            // TODO: Hide this one until the shovel is put back
        });

        // Pitchfork
        const pitchfork = this.add.sprite(67, 280, 'pitchfork', 'idle').setInteractive().setScale(-1, 1).setAngle(8);
        pitchfork.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;
            pitchfork.setTexture('pitchfork', 'hover');
        });
        pitchfork.on('pointerout', () => pitchfork.setTexture('pitchfork', 'idle'));
        pitchfork.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            handCurrent = HAND.fork;
            // TODO: Hide this one until the pitchfork is put back
        });

        // Bottle
        // TODO: find hover sprite
        const bottle = this.add.sprite(720, 450, 'bottle', 'idle').setInteractive({pixelperfect: true});
        this.anims.create({
            key: 'bottle_kicked',
            frames: this.anims.generateFrameNumbers('bottle', { frames: [
                '0001', '0001', '0001', '0001', '0001', '0002',  '0002',  '0002',  'idle'
            ] }),
            frameRate: 24
        });
        bottle.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            handCurrent = HAND.bottle;
        });
        bottle.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            //bottle.setTexture('bottle', 'hover');
        });
        bottle.on('pointerout', () => bottle.setTexture('bottle', 'idle'));        

        // Water
        const water = this.add.sprite(160, 418, 'water', 'idle_full').setInteractive();
        water.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;
        });
        water.on('pointerout', () => water.setTexture('water', 'idle_full'));
        water.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            handCurrent = HAND.water;
        });

        // HorseFrame
        // TODO: Add horse image inside
        const picFrame = this.add.sprite(279, 210, 'frame', 'idle').setInteractive({pixelperfect: true}).setScale(.6);
        picFrame.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            // TODO: Show inspiration
        });
        picFrame.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            picFrame.setTexture('frame', 'hover');
        });
        picFrame.on('pointerout', () => picFrame.setTexture('frame', 'idle'));     

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

        const barrel = this.add.sprite(608, 265, 'barrel', barrelType).setInteractive({pixelperfect: true});
        barrel.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

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
        const bin = this.add.sprite(730, 298, 'bin', 'idle').setInteractive({pixelperfect: true});
        this.anims.create({
            key: 'bin_idle',
            frames: this.anims.generateFrameNumbers('bin', { frames: [
                'idle'
            ] }),
            frameRate: 24
        });
        this.anims.create({
            key: 'bin_open',
            frames: this.anims.generateFrameNumbers('bin', { frames: [
                'idle', '0001', '0002', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0003', '0002', '0001', 'idle'
            ] }),
            frameRate: 24
        });
        bin.on('pointerdown', function (pointer)
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
        bin.on('pointerover', function (pointer)
        {
            // TODO: Find hover sprite
        });
        bin.on('pointerout', () => bin.play('bin_idle'));        

        // Oat Bag
        const oatBag = this.add.sprite(770, 340, 'oatBag', 'idle').setInteractive({pixelperfect: true});
        this.anims.create({
            key: 'oatBag_idle',
            frames: this.anims.generateFrameNumbers('oatBag', { frames: [
                'idle'
            ] }),
            frameRate: 24
        });
        this.anims.create({
            key: 'oatBag_hover',
            frames: this.anims.generateFrameNumbers('oatBag', { frames: [
                'hover'
            ] }),
            frameRate: 24
        });
        oatBag.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            handCurrent = HAND.grainScoop;
        });
        oatBag.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            oatBag.play('oatBag_hover');
        });
        oatBag.on('pointerout', () => oatBag.play('oatBag_idle'));        

        // Oat Through

        // Brush
        const brush = this.add.sprite(745, 160, 'brush', 'idle').setInteractive().setScale(.6);
        brush.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;
            brush.setTexture('brush', 'hover');
        });
        brush.on('pointerout', () => brush.setTexture('brush', 'idle'));
        brush.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            handCurrent = HAND.brush;
            // TODO: Hide this one until the brush is put back
        });

        // Comb
        const comb = this.add.sprite(705, 288, 'comb', 'idle').setInteractive().setScale(.6);
        brush.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;
            brush.setTexture('comb', 'hover');
        });
        comb.on('pointerout', () => comb.setTexture('comb', 'idle'));
        comb.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            handCurrent = HAND.comb;
            // TODO: Hide this one until the comb is put back
        });

        // Hoof pick
        const hoofpick = this.add.sprite(793, 219, 'hoofpick', 'idle').setInteractive().setScale(.6, .8);
        hoofpick.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;
            hoofpick.setTexture('hoofpick', 'hover');
        });
        hoofpick.on('pointerout', () => hoofpick.setTexture('hoofpick', 'idle'));
        hoofpick.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            handCurrent = HAND.hoofpick;
            // TODO: Hide this one until the hoofpick is put back
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
        //horseInteractive.fillRect(340, 240, 230, 260)
        horseInteractive.on('pointerdown', function (pointer)
        {
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
        // TODO: fix missing frame 0016
        // TODO: optimize, temporarily disabled
        const horseshoe = this.add.sprite(-103, 137, 'horseshoe', 'idle').setInteractive({pixelperfect: true}).setOrigin(0).setScale(.48);        /*
        this.anims.create({
            key: 'horseshoe_play',
            frames: this.anims.generateFrameNumbers('horseshoe', { frames: [
                'idle', '0001', '0002', '0003', '0004', '0005', '0006', '0007', '0008', '0009', '0010', '0011', '0012', '0013', '0014', '0015', '0016', '0017', '0018', '0019', '0020', '0021', '0022', '0023', '0024', '0025', '0026', '0027', '0028', '0029', '0030', '0031', '0032', '0033', '0034', '0035', '0036', '0037', '0038', '0039', '0040', '0041', '0042', '0043', '0044', '0045', '0046', '0047', '0048', '0049', '0050', '0051', '0052', '0053', '0054', '0055', '0056', '0057', '0058', '0059', '0060', '0061', '0062', '0063', '0064', '0065', '0066', '0067', '0068', '0069', '0070', '0071', '0072', '0073', '0074', '0075', '0076', '0077', '0078', '0079', '0080', '0081', '0082', '0083', '0084', '0085', '0086', '0087', '0088', '0089', '0090', '0091', '0092', '0093', '0094', '0095', '0096', '0097', '0098', '0099', '0100', '0101', '0102', '0103', '0104', '0105', '0106', '0107', '0108', '0109', '0110', '0111', '0112', '0113', '0114', '0115', '0116', '0117', '0118', '0119', '0120', '0121', '0122', '0123', '0124', '0125', '0126', '0127', '0128', '0129'
            ] }),
            frameRate: 24
        });
        horseshoe.on('pointerdown', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            horseshoe.play('horseshoe_play');
        });
        horseshoe.on('pointerover', function (pointer)
        {
            if (handCurrent != HAND.empty) return;

            horseshoe.setTexture('horseshoe', 'hover');
        });
        horseshoe.on('pointerout', () => horseshoe.setTexture('horseshoe', 'idle'));     */

        // Certificate
        // TODO: Re-export the small certificate with dummy text
        // TODO: Find the sprite for small certificate hover
        // TODO: Write big certificate's texts
        const certificate_small = this.add.sprite(280, 153, 'certificate_small').setInteractive({pixelperfect: true}).setScale(.1);
        const certificate_big = this.add.sprite(510, 310, 'certificate_big').setInteractive({pixelperfect: true}).setVisible(false).setScale(.1);

        certificate_small.on('pointerdown', function (pointer)
        {
            if (!certificate_big.visible)
                certificate_big.setVisible(true);
        });

        certificate_big.on('pointerdown', function (pointer)
        {
            certificate_big.setVisible(false);
        });

        // ---------- Held items ---------- //
        emptyPointerSprite = this.add.image(759, 272, 'cursor').setVisible(true).setOrigin(.1, .2);
        redAppleHeldSprite = this.add.image(759, 272, 'apples', 'redapple_normal').setVisible(false).setOrigin(.8);
        greenAppleHeldSprite = this.add.image(759, 272, 'apples', 'greenapple_normal').setVisible(false).setOrigin(.8);
        carrotHeldSprite = this.add.image(759, 272, 'apples', 'carrot_normal').setVisible(false).setOrigin(.8);
        pearHeldSprite = this.add.image(759, 272, 'apples', 'pear_normal').setVisible(false).setOrigin(.8);
        bottleHeldSprite = this.add.image(759, 272, 'bottle_hand', 'idle').setVisible(false).setOrigin(.3);
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