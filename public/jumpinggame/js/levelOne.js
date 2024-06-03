class LevelOne extends Phaser.Scene 
{

    score = 0
    horse
    canterSpeed = 350
    gallopSpeed = 500
    skidSpeed = 300
    runHeight = 280
    horseMovements = {
        backwards: 'backwards',
        cantering: 'cantering',
        galloping: 'galloping',
        jumping: 'jumping',
        skidding: 'skidding'
    }
    horseMovement = this.horseMovements.cantering
    skidLoop = 0
    levelEnd = 22941
    levelTime = 50

    constructor ()
    {
        super({ key: 'LevelOne' });
    }

    preload ()
    {
        this.load.image('scoreBoard', './images/scoreBoard.png');
        this.load.image('info', './images/info.png');
        this.load.image('infoButton', './images/infoButton.png');
        this.load.image('mountains', './images/mountains.png');
        this.load.image('path', './images/path.png');
        this.load.atlas('horse', './images/horse.png', './images/horse.json');
        this.load.atlas('jumps', './images/jumps.png', './images/jumps.json');
        this.load.atlas('gems', './images/gems.png', './images/gems.json');
        this.load.atlas('horseshoe', './images/horseshoe.png', './images/horseshoe.json');
        this.load.atlas('backgroundObjects', './images/backgroundObjects.png', './images/backgroundObjects.json');
        this.load.image('endGate', './images/endGate.png');

        this.clock = this.plugins.get('rexclockplugin').add(this, config);

        // Level reference
        // this.load.image('Level1', './images/Level1.png');
    }

    create (data)
    { 
        this.data = data
        this.score = 0
        this.horseshoes = 0
        this.timeEnd = false // Should become true on game end

        // Inputs
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        // BG
        this.add.image(444, 234, 'mountains').setScrollFactor(0)        
        for (let index = 0; index < this.levelEnd / 468; index++) {            
            this.add.image(444 + (index * 888), 234, 'path')
        }
        // Level Reference
        // this.add.image(0, 0, 'Level1').setOrigin(0, 0).setAlpha(.6) 


        // Display
        this.add.image(444, 30, 'scoreBoard').setScrollFactor(0) 
        // Horseshoe Display
        this.horseshoeText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 30, color: '#ffffff', align: 'center' }).setScrollFactor(0);
        this.horseshoeText.text = this.horseshoes + " x ";
        this.horseshoeText.setPosition(320-this.horseshoeText.width/2, 35-this.horseshoeText.height/2);
        // Score Display
        this.scoreNameText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 10, color: '#ffffff', align: 'center' }).setScrollFactor(0);
        this.scoreNameText.text = langData.score;
        this.scoreNameText.setPosition(445-this.scoreNameText.width/2, 18-this.scoreNameText.height/2);

        this.scoreText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 30, color: '#ffffff', align: 'center' }).setScrollFactor(0);
        this.scoreText.text = this.score;
        this.scoreText.setPosition(445-this.scoreText.width/2, 40-this.scoreText.height/2);
        // Clock
        this.clock.start();
        // Display
        this.clockNameText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 10, color: '#ffffff', align: 'center' }).setScrollFactor(0);
        this.clockNameText.text = langData.time;
        this.clockNameText.setPosition(570-this.clockNameText.width/2, 18-this.clockNameText.height/2);
        this.timerText = this.add.text(443, 234, 'Static Text Object', { fontFamily: 'Arial', fontSize: 30, color: '#ffffff', align: 'center' }).setScrollFactor(0)//.setVisible(false);
        this.timerText.text = "0:00";
        this.timerText.setPosition(575-this.timerText.width/2, 40-this.timerText.height/2);


        // Background Elements
        this.add.sprite(165, 285, 'backgroundObjects', 'bush').setAngle(3)
        this.add.sprite(95, 285, 'backgroundObjects', 'startGateBack')
        this.add.sprite(2000, 275, 'backgroundObjects', 'bush')
        this.add.sprite(2460, 285, 'backgroundObjects', 'bush').setScale(.73)
        this.add.sprite(3080, 285, 'backgroundObjects', 'bush').setScale(1, .8)
        this.add.sprite(4100, 280, 'backgroundObjects', 'bridge1Back')
        this.add.sprite(4525, 285, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(4915, 280, 'backgroundObjects', 'bush').setScale(.9)
        this.add.sprite(5575, 270, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(4745, 283, 'backgroundObjects', 'fence')
        this.add.sprite(5095, 283, 'backgroundObjects', 'fence')
        this.add.sprite(5470, 283, 'backgroundObjects', 'fence')
        this.add.sprite(5820, 283, 'backgroundObjects', 'fence')
        this.add.sprite(6380, 290, 'backgroundObjects', 'bush').setScale(.9, .8)
        this.add.sprite(7295, 280, 'backgroundObjects', 'bush').setScale(.75, .65)
        this.add.sprite(7690, 285, 'backgroundObjects', 'bush').setScale(.4, .75)
        this.add.sprite(8105, 280, 'backgroundObjects', 'bush').setScale(.85, .75)
        this.add.sprite(8600, 275, 'backgroundObjects', 'bush').setScale(.65, .7)
        this.add.sprite(9210, 290, 'backgroundObjects', 'bush')
        this.add.sprite(9465, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(10065, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(10730, 295, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(11290, 285, 'backgroundObjects', 'bush')
        this.add.sprite(11975, 280, 'backgroundObjects', 'bush').setScale(.9, .9)
        this.add.sprite(12910, 300, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(13350, 275, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(13860, 290, 'backgroundObjects', 'bush')
        this.add.sprite(11810, 283, 'backgroundObjects', 'fence')
        this.add.sprite(12160, 283, 'backgroundObjects', 'fence')
        this.add.sprite(12530, 283, 'backgroundObjects', 'fence')
        this.add.sprite(13040, 283, 'backgroundObjects', 'fence')
        this.add.sprite(13415, 283, 'backgroundObjects', 'fence')
        this.add.sprite(13765, 283, 'backgroundObjects', 'fence')
        this.add.sprite(14365, 290, 'backgroundObjects', 'bush').setScale(.4, .6)
        this.add.sprite(14680, 280, 'backgroundObjects', 'bridge1Back')
        this.add.sprite(15230, 280, 'backgroundObjects', 'bush').setScale(.8, .6)
        this.add.sprite(15720, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(16050, 295, 'backgroundObjects', 'bush').setScale(.9, .75)
        this.add.sprite(18150, 280, 'backgroundObjects', 'bush').setScale(.9)
        this.add.sprite(18800, 275, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(19030, 285, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(20990, 280, 'backgroundObjects', 'bush')
        this.add.sprite(18700, 283, 'backgroundObjects', 'fence')
        this.add.sprite(19050, 283, 'backgroundObjects', 'fence')
        this.add.sprite(19590, 283, 'backgroundObjects', 'fence')
        this.add.sprite(19940, 283, 'backgroundObjects', 'fence')
        this.add.sprite(20470, 283, 'backgroundObjects', 'fence')
        this.add.sprite(20820, 283, 'backgroundObjects', 'fence')
        this.add.sprite(21260, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(21633, 325, 'backgroundObjects', 'bridge2Back')
        this.add.sprite(22700, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(22160, 293, 'backgroundObjects', 'fence').setScale(.6, .9)
        this.add.sprite(22370, 293, 'backgroundObjects', 'fence').setScale(.6, .9)
        this.add.sprite(22580, 293, 'backgroundObjects', 'fence').setScale(.6, .9)
        this.add.sprite(22790, 293, 'backgroundObjects', 'fence').setScale(.6, .9)


        // Horse
        this.horse = this.physics.add.sprite(-100, this.runHeight, 'horse', 'canter0000')
        if (!this.anims.exists('canter')) {
            this.anims.create({
                key: 'canter',
                frames: this.anims.generateFrameNumbers('horse', { frames: [
                    'canter0000', 'canter0001', 'canter0002', 'canter0003', 'canter0004', 'canter0005', 'canter0006', 'canter0007', 'canter0008', 'canter0009', 'canter0010', 'canter0011'
                ] }),
                frameRate: 20,
                repeat: -1
            });
            this.anims.create({
                key: 'gallop',
                frames: this.anims.generateFrameNumbers('horse', { frames: [
                    'gallop0000', 'gallop0001', 'gallop0002', 'gallop0003', 'gallop0004', 'gallop0005', 'gallop0006'
                ] }),
                frameRate: 20,
                repeat: -1
            });
            this.anims.create({
                key: 'jump',
                frames: this.anims.generateFrameNumbers('horse', { frames: [
                    'jump0000', 'jump0001', 'jump0002', 'jump0003', 'jump0004', 'jump0005', 'jump0006', 'jump0007', 'jump0008', 'jump0009', 'jump0010', 'jump0011'
                ] }),
                frameRate: 16
            });
            this.anims.create({
                key: 'slideStart',
                frames: this.anims.generateFrameNumbers('horse', { frames: [
                    'slide0000', 'slide0001'
                ] }),
                frameRate: 20
            });
            this.anims.create({
                key: 'slide',
                frames: this.anims.generateFrameNumbers('horse', { frames: [
                    'slide0002', 'slide0003', 'slide0004', 'slide0005', 'slide0006'
                ] }),
                frameRate: 20,
                repeat: -1
            });
            this.anims.create({
                key: 'slideEnd',
                frames: this.anims.generateFrameNumbers('horse', { frames: [
                    'slide0007', 'slide0008', 'slide0009'
                ] }),
                frameRate: 20
            });
        }
        this.horseMovement = this.horseMovements.cantering
        this.horse.setVelocityX(this.canterSpeed);
        this.horse.body.setSize(150, 105, false).setOffset(70, 95);
        this.horse.play('canter')


        // Camera
        this.cameras.main.startFollow(this.horse, false, 1, 0, -275, 45).setBounds(0, 0, this.levelEnd, 468);


        // Start and End Gates
        this.endGate = this.physics.add.image(this.levelEnd - 83, 270, 'endGate').setOrigin(0, .5)
        this.endGate.body.setOffset(70, 0);


        // Horseshoe
        this.horseshoe = this.physics.add.sprite(6900, 220, 'horseshoe', '1')
        if (!this.anims.exists('horseshoe')) {
            this.anims.create({
                key: 'horseshoe',
                frames: this.anims.generateFrameNumbers('horseshoe', { frames: [
                    '1', '2'
                ] }),
                frameRate: 10,
                repeat: -1
            });
        }
        this.horseshoe.play('horseshoe')


        // Gems
        this.gemsArray = [
            this.physics.add.sprite(728, 210, 'gems', 'gemBlue20'),
            this.physics.add.sprite(1200, 340, 'gems', 'gemBlue5'),
            this.physics.add.sprite(1250, 285, 'gems', 'gemBlue5'),
            this.physics.add.sprite(1310, 235, 'gems', 'gemBlue5'),
            this.physics.add.sprite(1370, 210, 'gems', 'gemBlue5'),
            this.physics.add.sprite(2050, 255, 'gems', 'gemPink55'),
            this.physics.add.sprite(2510, 260, 'gems', 'gemBlue35'),
            this.physics.add.sprite(2700, 350, 'gems', 'gemPink10'),
            this.physics.add.sprite(2850, 350, 'gems', 'gemPink10'),
            this.physics.add.sprite(3300, 220, 'gems', 'gemBlue65'),
            this.physics.add.sprite(3590, 340, 'gems', 'gemPink10'),
            this.physics.add.sprite(4355, 345, 'gems', 'gemPink10'),
            this.physics.add.sprite(4485, 285, 'gems', 'gemPink10'),
            this.physics.add.sprite(4560, 250, 'gems', 'gemPink40'),
            this.physics.add.sprite(4910, 330, 'gems', 'gemBlue5'),
            this.physics.add.sprite(4950, 275, 'gems', 'gemBlue5'),
            this.physics.add.sprite(5035, 230, 'gems', 'gemBlue35'),
            this.physics.add.sprite(5423, 265, 'gems', 'gemPink25'),
            this.physics.add.sprite(5835, 250, 'gems', 'gemBlue50'),
            this.physics.add.sprite(6320, 260, 'gems', 'gemBlue35'),
            this.physics.add.sprite(6600, 330, 'gems', 'gemBlue20'),
            this.physics.add.sprite(6745, 340, 'gems', 'gemBlue5'),
            this.physics.add.sprite(7560, 320, 'gems', 'gemPink10'),
            this.physics.add.sprite(7605, 275, 'gems', 'gemPink10'),
            this.physics.add.sprite(7660, 245, 'gems', 'gemPink10'),
            this.physics.add.sprite(7725, 235, 'gems', 'gemPink40'),
            this.physics.add.sprite(8225, 340, 'gems', 'gemYellow15'),
            this.physics.add.sprite(8475, 265, 'gems', 'gemBlue5'),
            this.physics.add.sprite(8515, 230, 'gems', 'gemBlue5'),
            this.physics.add.sprite(8515, 320, 'gems', 'gemBlue5'),
            this.physics.add.sprite(8565, 205, 'gems', 'gemBlue5'),
            this.physics.add.sprite(8560, 270, 'gems', 'gemPink40'),
            this.physics.add.sprite(8565, 340, 'gems', 'gemBlue5'),
            this.physics.add.sprite(8615, 230, 'gems', 'gemBlue5'),
            this.physics.add.sprite(8615, 320, 'gems', 'gemBlue5'),
            this.physics.add.sprite(8645, 265, 'gems', 'gemBlue5'),
            this.physics.add.sprite(9105, 330, 'gems', 'gemBlue65'),
            this.physics.add.sprite(9505, 260, 'gems', 'gemPink10'),
            this.physics.add.sprite(10130, 360, 'gems', 'gemBlue5'),
            this.physics.add.sprite(10180, 315, 'gems', 'gemPink10'),
            this.physics.add.sprite(10250, 275, 'gems', 'gemBlue5'),
            this.physics.add.sprite(10310, 240, 'gems', 'gemPink10'),
            this.physics.add.sprite(10355, 215, 'gems', 'gemYellow75'),
            this.physics.add.sprite(10870, 290, 'gems', 'gemBlue20'),
            this.physics.add.sprite(11090, 260, 'gems', 'gemPink40'),
            this.physics.add.sprite(11160, 260, 'gems', 'gemPink40'),
            this.physics.add.sprite(11630, 220, 'gems', 'gemBlue35'),
            this.physics.add.sprite(12095, 220, 'gems', 'gemPink55'),
            this.physics.add.sprite(12235, 325, 'gems', 'gemPink70'),
            this.physics.add.sprite(12430, 220, 'gems', 'gemPink55'),
            this.physics.add.sprite(12745, 210, 'gems', 'gemYellow30'),
            this.physics.add.sprite(13115, 255, 'gems', 'gemBlue20'),
            this.physics.add.sprite(13295, 345, 'gems', 'gemBlue20'),
            this.physics.add.sprite(13450, 300, 'gems', 'gemBlue20'),
            this.physics.add.sprite(13900, 260, 'gems', 'gemPink10'),
            this.physics.add.sprite(14035, 225, 'gems', 'gemYellow45'),
            this.physics.add.sprite(14380, 345, 'gems', 'gemBlue20'),
            this.physics.add.sprite(14930, 345, 'gems', 'gemBlue20'),
            this.physics.add.sprite(15375, 270, 'gems', 'gemBlue5'),
            this.physics.add.sprite(15445, 290, 'gems', 'gemBlue5'),
            this.physics.add.sprite(15490, 345, 'gems', 'gemBlue5'),
            this.physics.add.sprite(15525, 290, 'gems', 'gemBlue5'),
            this.physics.add.sprite(15590, 270, 'gems', 'gemBlue5'),
            this.physics.add.sprite(16315, 235, 'gems', 'gemPink10'),
            this.physics.add.sprite(16430, 235, 'gems', 'gemPink10'),
            this.physics.add.sprite(16535, 235, 'gems', 'gemPink10'),
            this.physics.add.sprite(16650, 235, 'gems', 'gemPink10'),
            this.physics.add.sprite(16850, 260, 'gems', 'gemBlue20'),
            this.physics.add.sprite(17230, 300, 'gems', 'gemPink10'),
            this.physics.add.sprite(17280, 255, 'gems', 'gemPink10'),
            this.physics.add.sprite(17355, 225, 'gems', 'gemPink10'),
            this.physics.add.sprite(17430, 215, 'gems', 'gemYellow45'),
            this.physics.add.sprite(18170, 215, 'gems', 'gemYellow45'),
            this.physics.add.sprite(18180, 165, 'gems', 'gemBlue5'),
            this.physics.add.sprite(18180, 265, 'gems', 'gemBlue5'),
            this.physics.add.sprite(18210, 190, 'gems', 'gemBlue5'),
            this.physics.add.sprite(18210, 240, 'gems', 'gemBlue5'),
            this.physics.add.sprite(18240, 215, 'gems', 'gemBlue5'),
            this.physics.add.sprite(18615, 325, 'gems', 'gemBlue20'),
            this.physics.add.sprite(18700, 280, 'gems', 'gemBlue20'),
            this.physics.add.sprite(19325, 270, 'gems', 'gemBlue20'),
            this.physics.add.sprite(19500, 215, 'gems', 'gemBlue35'),
            this.physics.add.sprite(19670, 215, 'gems', 'gemBlue35'),
            this.physics.add.sprite(19800, 280, 'gems', 'gemPink55'),
            this.physics.add.sprite(19970, 215, 'gems', 'gemBlue35'),
            this.physics.add.sprite(20185, 215, 'gems', 'gemBlue35'),
            this.physics.add.sprite(20650, 200, 'gems', 'gemPink10'),
            this.physics.add.sprite(20650, 340, 'gems', 'gemPink10'),
            this.physics.add.sprite(20950, 300, 'gems', 'gemYellow75'),
            this.physics.add.sprite(21430, 325, 'gems', 'gemPink10'),
            this.physics.add.sprite(21835, 325, 'gems', 'gemPink10'),
            this.physics.add.sprite(22150, 330, 'gems', 'gemYellow60'),
            this.physics.add.sprite(22240, 265, 'gems', 'gemPink10'),
            this.physics.add.sprite(22315, 265, 'gems', 'gemBlue5'),
            this.physics.add.sprite(22420, 220, 'gems', 'gemPink10'),
            this.physics.add.sprite(22495, 220, 'gems', 'gemBlue5'),
            this.physics.add.sprite(22590, 265, 'gems', 'gemPink10'),
            this.physics.add.sprite(22665, 265, 'gems', 'gemBlue5')
        ]
        
        this.gems = this.physics.add.group({immovable: true});
        this.gems.addMultiple(this.gemsArray);


        // Jumps
        this.jumpsArray = [
            this.physics.add.sprite(2285, 360, 'jumps', 'waterTrough'),
            this.physics.add.sprite(5010, 350, 'jumps', 'woodenFence'),
            this.physics.add.sprite(5836, 360, 'jumps', 'hayBale'),
            this.physics.add.sprite(7685, 335, 'jumps', 'wall'),
            this.physics.add.sprite(8970, 345, 'jumps', 'woodenFence'),
            this.physics.add.sprite(11120, 360, 'jumps', 'hedge'),
            this.physics.add.sprite(12435, 350, 'jumps', 'woodenFence'),
            this.physics.add.sprite(13130, 360, 'jumps', 'hayBale'),
            this.physics.add.sprite(13965, 335, 'jumps', 'wall'),
            this.physics.add.sprite(16020, 365, 'jumps', 'stump'),
            this.physics.add.sprite(17380, 335, 'jumps', 'wall'),
            this.physics.add.sprite(18198, 350, 'jumps', 'woodenFence'),
            this.physics.add.sprite(19815, 365, 'jumps', 'stump'),
            this.physics.add.sprite(22090, 340, 'jumps', 'blueFence'),
        ]

        this.jumpsArray.forEach(jump => {
            switch (jump.frame.name) {
                case 'blueFence':
                    jump.body.setSize(5, 50, false).setOffset(20, 60);
                    break;
                case 'hayBale':
                    jump.body.setSize(5, 40, false).setOffset(15, 25);
                    break;
                case 'hedge':
                    jump.body.setSize(5, 40, false).setOffset(30, 30);
                    break;
                case 'log':
                    jump.body.setSize(5, 40, false).setOffset(10, 20);
                    break;
                case 'stump':
                    jump.body.setSize(5, 40, false).setOffset(30, 20);
                    break;
                case 'wall':
                    jump.body.setSize(5, 50, false).setOffset(10, 60);
                    break;
                case 'waterTrough':
                    jump.body.setSize(5, 40, false).setOffset(10, 20);
                    break;
                case 'woodenFence':
                    jump.body.setSize(5, 50, false).setOffset(20, 50);
                    break;
            
                default:
                    console.log("Unknown jump type: " + jump.frame.name)
                    break;
            }
        });

        this.jumps = this.physics.add.group({immovable: true});
        this.jumps.addMultiple(this.jumpsArray);

        
        // Foreground Objects
        this.add.sprite(46, 285, 'backgroundObjects', 'startGateFront')
        this.add.sprite(195, 430, 'backgroundObjects', 'bush')
        this.add.sprite(1720, 430, 'backgroundObjects', 'bush')
        this.add.sprite(2185, 410, 'backgroundObjects', 'bush').setScale(-1, 1)
        this.add.sprite(2435, 410, 'backgroundObjects', 'bush')
        this.add.sprite(3120, 410, 'backgroundObjects', 'bush').setScale(-1, 1)
        this.add.sprite(3370, 410, 'backgroundObjects', 'bush')
        this.add.sprite(4100, 280, 'backgroundObjects', 'bridge1Front')
        this.add.sprite(3790, 440, 'backgroundObjects', 'bush').setAngle(12)
        this.add.sprite(4265, 438, 'backgroundObjects', 'bush').setAngle(347)
        this.add.sprite(4525, 435, 'backgroundObjects', 'bush').setScale(.5, .8)
        this.add.sprite(4740, 425, 'backgroundObjects', 'fence')
        this.add.sprite(5090, 425, 'backgroundObjects', 'fence')
        this.add.sprite(5465, 425, 'backgroundObjects', 'fence')
        this.add.sprite(5815, 425, 'backgroundObjects', 'fence')
        this.add.sprite(5885, 435, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(6605, 445, 'backgroundObjects', 'bush').setScale(.6, .7)
        this.add.sprite(7285, 420, 'backgroundObjects', 'bush').setScale(.9, .65)
        this.add.sprite(8150, 430, 'backgroundObjects', 'bush').setScale(.4, .75)
        this.add.sprite(8440, 440, 'backgroundObjects', 'bush').setScale(.65, .7)
        this.add.sprite(9020, 430, 'backgroundObjects', 'bush').setScale(.55)
        this.add.sprite(9480, 430, 'backgroundObjects', 'bush').setScale(.4, .7)
        this.add.sprite(10240, 420, 'backgroundObjects', 'bush').setScale(.9)
        this.add.sprite(10820, 420, 'backgroundObjects', 'bush').setScale(.9)
        this.add.sprite(11560, 425, 'backgroundObjects', 'bush').setScale(.4, .75)
        this.add.sprite(13390, 430, 'backgroundObjects', 'bush')
        this.add.sprite(13850, 430, 'backgroundObjects', 'bush').setScale(.4, .75)
        this.add.sprite(11810, 425, 'backgroundObjects', 'fence')
        this.add.sprite(12160, 425, 'backgroundObjects', 'fence')
        this.add.sprite(12530, 425, 'backgroundObjects', 'fence')
        this.add.sprite(12880, 425, 'backgroundObjects', 'fence')
        this.add.sprite(13430, 425, 'backgroundObjects', 'fence')
        this.add.sprite(13780, 425, 'backgroundObjects', 'fence')
        this.add.sprite(14680, 280, 'backgroundObjects', 'bridge1Front')
        this.add.sprite(14370, 440, 'backgroundObjects', 'bush').setAngle(12)
        this.add.sprite(14845, 438, 'backgroundObjects', 'bush').setAngle(347)
        this.add.sprite(15270, 435, 'backgroundObjects', 'bush').setScale(.9, .8)
        this.add.sprite(16515, 420, 'backgroundObjects', 'bush').setScale(.5, .6)
        this.add.sprite(17775, 430, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(18700, 425, 'backgroundObjects', 'fence')
        this.add.sprite(19050, 425, 'backgroundObjects', 'fence')
        this.add.sprite(19590, 425, 'backgroundObjects', 'fence')
        this.add.sprite(19940, 425, 'backgroundObjects', 'fence')
        this.add.sprite(20470, 425, 'backgroundObjects', 'fence')
        this.add.sprite(20820, 425, 'backgroundObjects', 'fence')
        this.add.sprite(20150, 440, 'backgroundObjects', 'bush').setScale(.9, .85)
        this.add.sprite(20770, 440, 'backgroundObjects', 'bush').setScale(.9, .85)
        this.add.sprite(21260, 435, 'backgroundObjects', 'bush').setScale(.4, .5)
        this.add.sprite(21633, 390, 'backgroundObjects', 'bridge2Front')
        this.add.sprite(21930, 430, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(22120, 440, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(22430, 430, 'backgroundObjects', 'bush').setScale(.9, .8)
        this.add.sprite(22730, 435, 'backgroundObjects', 'bush').setScale(.4, .8)


        this.infoScreen = this.add.image(443, 234, 'info').setScrollFactor(0).setVisible(false)
        this.infoButton = this.add.image(443, 304, 'infoButton').setScrollFactor(0).setVisible(false)
            this.infoButton.on('pointerdown', function (pointer)
            {
                nextScreen = true
            });
        

        // Extra settings for debug mode
        if (this.physics.config.debug) {
            // Start at specified x
            this.horse.x = 20000
            // Keep horse still unless buttons are pressed
            this.canterSpeed = 0
            this.horse.setVelocityX(this.canterSpeed);
            // Speed up movement
            this.gallopSpeed = this.gallopSpeed 

            // Display object coordinates in debug mode
            this.gemsArray.forEach(gem => {
                this.gemText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 10, color: '#ffffff', align: 'center' });
                this.gemText.text = "x: " + gem.x + "\ny: " + gem.y;
                this.gemText.setPosition(gem.x-this.gemText.width/2, gem.y-40);
            });
            this.jumpsArray.forEach(jump => {
                this.jumpText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 10, color: '#ffffff', align: 'center' });
                this.jumpText.text = "x: " + jump.x + "\ny: " + jump.y;
                this.jumpText.setPosition(jump.x-this.jumpText.width/2, jump.y-40);
            });
        }


        // UI
        const UI = this.add.image(443, 234, 'UI').setScrollFactor(0)
        // Music button
        const musicButton = this.add.sprite(871, 453, 'music_button', 'music_on').setInteractive({ pixelPerfect: true }).setScale(0.7).setScrollFactor(0);
            musicButton.on('pointerdown', function (pointer)
            {
                if (data.playMusic) {
                    data.backgroundMusic.stop()
                    this.setFrame('music_off_hover')
                }
                else {
                    data.backgroundMusic.play()
                    this.setFrame('music_on_hover')
                }
                data.playMusic = !data.playMusic
            });
            musicButton.on('pointerover', function (pointer) { this.setFrame(`music_${data.playMusic ? 'on' : 'off'}_hover`);});
            musicButton.on('pointerout', function (pointer) { this.setFrame(`music_${data.playMusic ? 'on' : 'off'}`) });
    }

    update ()
    {
        function millisToMinutesAndSeconds(millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
          }

        this.timerText.text = millisToMinutesAndSeconds(this.clock.now)


        // Horse movement
        // Controls
        if (this.spaceBar.isDown && this.horseMovement !== this.horseMovements.skidding) {
            // Horse jump if spacebar is pressed
            this.horseMovement = this.horseMovements.jumping
        }
        else if (this.cursors.right.isDown && this.horseMovement !== this.horseMovements.skidding && this.horseMovement !== this.horseMovements.jumping) {
            // Horse gallop when right arrow key is down and horse is not jumping or sliding
            this.horseMovement = this.horseMovements.galloping
        }
        else if (this.physics.config.debug && this.cursors.left.isDown && this.horseMovement !== this.horseMovements.skidding && this.horseMovement !== this.horseMovements.jumping) {
            // Allow backwards movement in debug mode when left arrow key is down and horse is not jumping or sliding
            this.horseMovement = this.horseMovements.backwards
        }
        else if (!this.cursors.right.isDown && this.horseMovement !== this.horseMovements.skidding && this.horseMovement !== this.horseMovements.jumping) {
            // Horse canter if right arrow key is not down and horse is not jumping or sliding
            this.horseMovement = this.horseMovements.cantering
        }
        // Animation
        if (this.horseMovement === this.horseMovements.skidding) {
            // Start slide animation
            if (!this.horse.frame.name.includes('slide')) {
                this.horse.play('slideStart')
                this.skidLoop = 0
                this.horse.setVelocityX(this.skidSpeed);
                this.horse.body.setSize(150, 105, false).setOffset(70, 95);
            }
            // Loop sliding animation
            else if ((this.horse.frame.name === 'slide0001' || this.horse.frame.name === 'slide0006') && this.skidLoop < 3) {
                console.log('Frame: ' + this.horse.frame.name + ' Loop: ' + this.skidLoop)
                this.horse.play('slide')
                this.skidLoop += 1
            }
            // End slide animation
            else if (this.horse.frame.name === 'slide0006' && this.skidLoop >= 3) {
                this.horse.play('slideEnd')
            }
            // Return to running after done sliding
            else if (this.horse.frame.name === 'slide0009') {
                this.horseMovement = this.horseMovements.cantering
            }
        }
        else if (this.horseMovement === this.horseMovements.jumping) {
            // Play jump animation
            if (!this.horse.frame.name.includes('jump')) {
                this.horse.play('jump')
            }
            // Adjust horse hitbox position whilst jumping
            switch (this.horse.frame.name) {
                case 'jump0001':
                    this.horse.body.setSize(150, 105, false).setOffset(90, 70);
                    break;
                case 'jump0002':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 35);
                    break;
                case 'jump0003':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 25);
                    break;
                case 'jump0004':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 20);
                    break;
                case 'jump0005':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 20);
                    break;
                case 'jump0006':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 20);
                    break;
                case 'jump0007':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 20);
                    break;
                case 'jump0008':
                    this.horse.body.setSize(150, 105, false).setOffset(115, 25);
                    break;
                case 'jump0009':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 35);
                    break;
                case 'jump0010':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 55);
                    break;
                    
                case 'jump0011':
                    this.horse.body.setSize(150, 105, false).setOffset(90, 85);
                    this.horseMovement = this.horseMovements.cantering
                    break;
            
                default:
                    this.horse.body.setSize(150, 105, false).setOffset(70, 95);
                    this.horseMovement = this.horseMovements.cantering
                    break;
            }
            // Adjust speed
            if (this.cursors.right.isDown && this.horseMovement !== this.horseMovements.skidding) {
                // Horse gallop speed when right arrow key is down
                this.horse.setVelocityX(this.gallopSpeed);
            }
            else if (this.physics.config.debug && this.cursors.left.isDown && this.horseMovement !== this.horseMovements.skidding) {
                // Backwards movement in debug mode when left arrow key is down
                this.horse.setVelocityX(-this.gallopSpeed);
            }
            else if (!this.cursors.right.isDown && this.horseMovement !== this.horseMovements.skidding) {
                // Horse canter speed if right arrow key is not down
                this.horse.setVelocityX(this.canterSpeed);
            }
        }
        else if (this.horseMovement === this.horseMovements.galloping) {
            if (!this.horse.frame.name.includes('gallop')) {
                this.horse.setVelocityX(this.gallopSpeed);
                this.horse.body.setSize(150, 105, false).setOffset(70, 95);
                this.horse.play('gallop')
            }
        }
        else if (this.horseMovement === this.horseMovements.backwards) {
            if (!this.horse.frame.name.includes('gallop')) {
                this.horse.setVelocityX(-this.gallopSpeed);
                this.horse.body.setSize(150, 105, false).setOffset(70, 95);
                this.horse.play('gallop')
            }
        }
        else if (this.horseMovement === this.horseMovements.cantering) {
            if (!this.horse.frame.name.includes('canter')) {
                this.horse.setVelocityX(this.canterSpeed);
                this.horse.body.setSize(150, 105, false).setOffset(70, 95);
                this.horse.play('canter')
            }
        }

        // Gems
        this.gems.getChildren().forEach(gem => {
            this.physics.overlap(
                this.horse,
                gem,
                function() {
                    if (gem.visible) {
                        gem.setVisible(false)
                        let points = 0
                        switch (gem.frame.name) {
                            case "gemBlue5":
                                points += 5
                                break;
                            case "gemPink10":
                                points += 10
                                break;
                            case "gemYellow15":
                                points += 15
                                break;
                            case "gemBlue20":
                                points += 20
                                break;
                            case "gemPink25":
                                points += 25
                                break;
                            case "gemYellow30":
                                points += 30
                                break;
                            case "gemBlue35":
                                points += 35
                                break;
                            case "gemPink40":
                                points += 40
                                break;
                            case "gemYellow45":
                                points += 45
                                break;
                            case "gemBlue50":
                                points += 50
                                break;
                            case "gemPink55":
                                points += 55
                                break;
                            case "gemYellow60":
                                points += 60
                                break;
                            case "gemBlue65":
                                points += 65
                                break;
                            case "gemPink70":
                                points += 70
                                break;
                            case "gemYellow75":
                                points += 75
                                break;
                        
                            default:
                                console.log("Unknown gem: " + gem.frame.name)
                                break;
                        }
                        this.score += points
                        this.scoreText.text = this.score
                        this.scoreText.setPosition(445-this.scoreText.width/2, 40-this.scoreText.height/2);
                    }
                },
                null,
                this);
        });

        // Horseshoe
        this.physics.overlap(
            this.horse,
            this.horseshoe,
            function() {
                    if (this.horseshoe.visible) {
                        this.horseshoe.setVisible(false)
                        this.horseshoes += 1
                        this.horseshoeText.text = this.horseshoes + " x ";
                        this.horseshoeText.setPosition(320-this.horseshoeText.width/2, 35-this.horseshoeText.height/2);
                    }
            },
            null,
            this);

        // Jumps
        this.physics.overlap(
            this.horse,
            this.jumps,
            function() {
                    this.horseMovement = this.horseMovements.skidding
            },
            null,
            this);

        // End gate
        this.physics.overlap(
            this.horse,
            [this.endGate],
            function() {
                    if (!this.timeEnd) {
                        this.timeEnd = true
                        this.clock.pause()
                        let timeBonus = (this.levelTime * 100) -  Math.ceil(this.clock.now / 10)
                        if (timeBonus < 0) {
                            timeBonus = 0
                        }
                        let finalScore = this.score + timeBonus

                        this.infoScreen.setVisible(true)
                        this.infoButton.setVisible(true).setInteractive()

                        let levelText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 30, color: '#ffffff', align: 'center' }).setScrollFactor(0);
                        let buttonText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 15, color: '#ffffff', align: 'center' }).setScrollFactor(0);

                        if (timeBonus > 0) {
                            levelText.text = langData.succeed_title;
                            buttonText.text = langData.succeed_level_select;
                        }
                        else {
                            levelText.text = langData.fail_title;
                            buttonText.text = langData.fail_level_select;
                        }

                        levelText.setPosition(443-levelText.width/2, 150-levelText.height/2);
                        buttonText.setPosition(443-buttonText.width/2, 304-buttonText.height/2);

                        let endTimeText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 15, color: '#ffffff', align: 'center' }).setScrollFactor(0);
                        endTimeText.text = langData.time_bonus + " = " + timeBonus + " " + langData.points;
                        endTimeText.setPosition(443-endTimeText.width/2, 185-endTimeText.height/2);

                        let endGemText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 15, color: '#ffffff', align: 'center' }).setScrollFactor(0);
                        endGemText.text = langData.gem_bonus + " = " + this.score + " " + langData.points;
                        endGemText.setPosition(443-endGemText.width/2, 215-endGemText.height/2);

                        let endLevelText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 15, color: '#ffffff', align: 'center' }).setScrollFactor(0);
                        endLevelText.text = langData.level_score + " = " + finalScore + " " + langData.points;
                        endLevelText.setPosition(443-endLevelText.width/2, 245-endLevelText.height/2);

                        let endHorseshoeText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 15, color: '#ffffff', align: 'center' }).setScrollFactor(0);
                        this.add.sprite(433, 267, 'horseshoe', 'icon').setScale(.5).setScrollFactor(0)
                        endHorseshoeText.text = " = " + this.horseshoes;
                        endHorseshoeText.setPosition(456-endHorseshoeText.width/2, 270-endHorseshoeText.height/2);
                    }
            },
            null,
            this);

            if (nextScreen) {
                nextScreen = false
                this.scene.start('StartScreen', {backgroundMusic: this.data.backgroundMusic, playMusic: this.data.playMusic});
                this.scene.stop('LevelOne')
            }
    }
}