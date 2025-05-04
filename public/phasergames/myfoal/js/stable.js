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
        this.load.atlas('barrel', './images/stable/barrel.png', './images/stable/barrel.json')
        this.load.atlas('bin', './images/stable/bin.png', './images/stable/bin.json')
        this.load.atlas('oatBag', './images/stable/oatbag.png', './images/stable/oatbag.json')
        this.load.atlas('apples', './images/stable/apples.png', './images/stable/apples.json')
        this.load.atlas('frame', './images/stable/frame.png', './images/stable/frame.json')

        this.load.image('certificate_small', './images/stable/certificate_small.png')
        this.load.image('certificate_big', './images/stable/certificate_big.png')

        this.load.image('cursor', './images/cursor.png');

        // Hide the computer cursor
        this.input.setDefaultCursor('none');
    }

    create ()
    {
        const game = this;

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

        // Fork

        // Bottle

        // Water

        // Horseshoe

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

        // Comb

        // Hoof pick

        // To Stables

        // To Cottage

        // To World

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
        emptyPointerSprite = this.add.image(759, 272, 'cursor').setVisible(true).setOrigin(.5);
        // TODO: Set the origin correctly to be coherent with the actual mouse coordinates
        redAppleHeldSprite = this.add.image(759, 272, 'apples', 'redapple_normal').setVisible(false).setOrigin(1);
        greenAppleHeldSprite = this.add.image(759, 272, 'apples', 'greenapple_normal').setVisible(false).setOrigin(1);
        carrotHeldSprite = this.add.image(759, 272, 'apples', 'carrot_normal').setVisible(false).setOrigin(1);
        pearHeldSprite = this.add.image(759, 272, 'apples', 'pear_normal').setVisible(false).setOrigin(1);
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
        }
    }
}