class LevelThree extends Phaser.Scene 
{

    score = 0
    horse
    canterSpeed = 350
    gallopSpeed = 500
    skidSpeed = 300
    runHeight = 277
    horseMovements = {
        backwards: 'backwards',
        cantering: 'cantering',
        galloping: 'galloping',
        jumping: 'jumping',
        skidding: 'skidding'
    }
    horseMovement = this.horseMovements.cantering
    skidLoop = 0
    levelEnd = 37440
    levelTime = 67
    jumpCtrl
    jumpButton
    runCtrl
    runButton

    gemsScoreTxtStyle = {
        font: "italic 20px StempelGaramond",
        color: "white",
        stroke: "#5D3073",
        strokeThickness: 1.2
    }
    maxTimeScoreTxtAppear = 50
    scoreTxtAlphaAnimation = .15

    constructor ()
    {
        super({ key: 'LevelThree' });
    }

    preload ()
    {
        this.load.image('scoreBoard', './images/scoreBoard.png');
        this.load.image('info', './images/info.png');
        this.load.image('infoButton', './images/infoButton.png');
        this.load.image('mountains', './images/mountains.png');
        this.load.image('path', './images/path.png');
        this.load.atlas('horse3', './images/horseJewel.png', './images/horse.json');
        this.load.atlas('jumps', './images/jumps.png', './images/jumps.json');
        this.load.atlas('gems', './images/gems.png', './images/gems.json');
        this.load.atlas('horseshoe', './images/horseshoe.png', './images/horseshoe.json');
        this.load.atlas('backgroundObjects', './images/backgroundObjects.png', './images/backgroundObjects.json');
        this.load.image('endGate', './images/endGate.png');

        this.clock = this.plugins.get('rexclockplugin').add(this, config);

        // Level reference
        this.load.image('Level3', './images/Level Screens/Level3.png');
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
        this.input.addPointer(1);


        // BG
        this.add.image(444, 234, 'mountains').setScrollFactor(0)        
        for (let index = 0; index < this.levelEnd / 468; index++) {            
            this.add.image(444 + (index * 888), 234, 'path')
        }
        // Level Reference
        this.add.image(0, 0, 'Level3').setOrigin(0, 0).setAlpha(.6) 

        this.displayTxtStyle = 
        {
            font: "italic 32px StempelGaramond",
            color: "white",
            stroke: "rgba(110, 195, 221, 20)",
            strokeThickness: 3,
            align: "center"
        }

        // Display
        this.add.image(444, 30, 'scoreBoard').setScrollFactor(0) 
        // Horseshoe Display
        this.horseshoeText = this.add.text(0, 0, 'Static Text Object', this.displayTxtStyle).setScrollFactor(0);
        this.horseshoeText.text = this.horseshoes + " x ";
        this.horseshoeText.setPosition(320-this.horseshoeText.width/2, 35-this.horseshoeText.height/2);
        // Score Display
        this.scoreNameText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 10, color: '#ffffff', align: 'center' }).setScrollFactor(0);
        this.scoreNameText.text = langData.score;
        this.scoreNameText.setPosition(445-this.scoreNameText.width/2, 18-this.scoreNameText.height/2);

        this.scoreText = this.add.text(0, 0, 'Static Text Object', this.displayTxtStyle).setScrollFactor(0);
        this.scoreText.text = this.score;
        this.scoreText.setPosition(445-this.scoreText.width/2, 40-this.scoreText.height/2);
        // Clock
        this.clock.start();
        // Display
        this.clockNameText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 10, color: '#ffffff', align: 'center' }).setScrollFactor(0);
        this.clockNameText.text = langData.time;
        this.clockNameText.setPosition(570-this.clockNameText.width/2, 18-this.clockNameText.height/2);
        this.timerText = this.add.text(443, 234, 'Static Text Object', this.displayTxtStyle).setScrollFactor(0)//.setVisible(false);
        this.timerText.text = "0:00";
        this.timerText.setPosition(575-this.timerText.width/2, 40-this.timerText.height/2);


        // Background Elements
        this.add.sprite(95, 285, 'backgroundObjects', 'startGateBack')
        

        // Horse
        this.horse = this.physics.add.sprite(-100, this.runHeight, 'horse3', 'canter0000')
        if (!this.anims.exists('canter2')) {
            this.anims.create({
                key: 'canter2',
                frames: this.anims.generateFrameNumbers('horse3', { frames: [
                    'canter0000', 'canter0001', 'canter0002', 'canter0003', 'canter0004', 'canter0005', 'canter0006', 'canter0007', 'canter0008', 'canter0009', 'canter0010', 'canter0011'
                ] }),
                frameRate: 20,
                repeat: -1
            });
            this.anims.create({
                key: 'gallop2',
                frames: this.anims.generateFrameNumbers('horse3', { frames: [
                    'gallop0000', 'gallop0001', 'gallop0002', 'gallop0003', 'gallop0004', 'gallop0005', 'gallop0006'
                ] }),
                frameRate: 20,
                repeat: -1
            });
            this.anims.create({
                key: 'jump2',
                frames: this.anims.generateFrameNumbers('horse3', { frames: [
                    'jump0000', 'jump0001', 'jump0002', 'jump0003', 'jump0004', 'jump0005', 'jump0006', 'jump0007', 'jump0008', 'jump0009', 'jump0010', 'land0000'
                ] }),
                frameRate: 16
            });
            this.anims.create({
                key: 'slideStart2',
                frames: this.anims.generateFrameNumbers('horse3', { frames: [
                    'slide0000', 'slide0001'
                ] }),
                frameRate: 20
            });
            this.anims.create({
                key: 'slide2',
                frames: this.anims.generateFrameNumbers('horse3', { frames: [
                    'slide0002', 'slide0003', 'slide0004', 'slide0005', 'slide0006'
                ] }),
                frameRate: 20,
                repeat: -1
            });
            this.anims.create({
                key: 'slideEnd2',
                frames: this.anims.generateFrameNumbers('horse3', { frames: [
                    'slide0007', 'slide0008', 'slide0009'
                ] }),
                frameRate: 20
            });
        }
        this.horseMovement = this.horseMovements.cantering
        this.horse.setVelocityX(this.canterSpeed);
        this.horse.body.setSize(150, 105, false).setOffset(70, 95);
        this.horse.play('canter2')


        // Camera
        this.cameras.main.startFollow(this.horse, false, 1, 0, -275, 45).setBounds(0, 0, this.levelEnd, 468);


        // Start and End Gates
        this.endGate = this.physics.add.image(this.levelEnd - 83, 270, 'endGate').setOrigin(0, .5)
        this.endGate.body.setOffset(70, 0);
        this.add.sprite(this.levelEnd, 0, 'backgroundObjects', 'rainbow').setOrigin(1, 0)


        // Horseshoe
        this.horseshoe = this.physics.add.sprite(19827, 251, 'horseshoe', '1')
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
            this.physics.add.sprite(716, 279, 'gems', 'gemPink10'),
            this.physics.add.sprite(843, 279, 'gems', 'gemYellow15'),
            this.physics.add.sprite(1451, 319, 'gems', 'gemPink10'),
            this.physics.add.sprite(1512, 266, 'gems', 'gemPink10'),
            this.physics.add.sprite(1598, 223, 'gems', 'gemBlue35'),
            this.physics.add.sprite(1673, 371, 'gems', 'gemYellow15'),
            this.physics.add.sprite(1865, 308, 'gems', 'gemPink25'),
            this.physics.add.sprite(2047, 308, 'gems', 'gemPink25'),
            this.physics.add.sprite(2188, 208, 'gems', 'gemBlue50'),
            this.physics.add.sprite(3019, 276, 'gems', 'gemYellow15'),
            this.physics.add.sprite(3160, 276, 'gems', 'gemYellow15'),
            this.physics.add.sprite(3290, 211, 'gems', 'gemPink55'),
            this.physics.add.sprite(3680, 227, 'gems', 'gemPink25'),
            this.physics.add.sprite(3781, 214, 'gems', 'gemYellow75'),
            this.physics.add.sprite(3889, 228, 'gems', 'gemPink25'),
            this.physics.add.sprite(4017, 279, 'gems', 'gemPink25'),
            this.physics.add.sprite(4176, 332, 'gems', 'gemPink25'),
            this.physics.add.sprite(4818, 330, 'gems', 'gemYellow15'),
            this.physics.add.sprite(4929, 330, 'gems', 'gemYellow15'),
            this.physics.add.sprite(5038, 330, 'gems', 'gemYellow15'),
            this.physics.add.sprite(5151, 330, 'gems', 'gemYellow15'),
            this.physics.add.sprite(5977, 245, 'gems', 'gemBlue5'),
            this.physics.add.sprite(6048, 298, 'gems', 'gemBlue5'),
            this.physics.add.sprite(6090, 245, 'gems', 'gemBlue5'),
            this.physics.add.sprite(6158, 213, 'gems', 'gemPink55'),
            this.physics.add.sprite(6605, 329, 'gems', 'gemPink10'),
            this.physics.add.sprite(6726, 329, 'gems', 'gemPink10'),
            this.physics.add.sprite(6832, 329, 'gems', 'gemPink10'),
            this.physics.add.sprite(6946, 329, 'gems', 'gemPink10'),
            this.physics.add.sprite(7798, 342, 'gems', 'gemYellow75'),
            this.physics.add.sprite(7835, 277, 'gems', 'gemPink10'),
            this.physics.add.sprite(7889, 222, 'gems', 'gemPink10'),
            this.physics.add.sprite(8180, 281, 'gems', 'gemBlue5'),
            this.physics.add.sprite(8243, 241, 'gems', 'gemBlue5'),
            this.physics.add.sprite(8321, 227, 'gems', 'gemBlue35'),
            this.physics.add.sprite(9250, 279, 'gems', 'gemYellow15'),
            this.physics.add.sprite(9378, 371, 'gems', 'gemPink70'),
            this.physics.add.sprite(9378, 217, 'gems', 'gemBlue50'),
            this.physics.add.sprite(9498, 279, 'gems', 'gemYellow15'),
            this.physics.add.sprite(10196, 203, 'gems', 'gemYellow15'),
            this.physics.add.sprite(10196, 306, 'gems', 'gemYellow15'),
            this.physics.add.sprite(10243, 251, 'gems', 'gemYellow15'),
            this.physics.add.sprite(10400, 232, 'gems', 'gemPink55'),
            this.physics.add.sprite(11401, 326, 'gems', 'gemPink10'),
            this.physics.add.sprite(11484, 326, 'gems', 'gemBlue5'),
            this.physics.add.sprite(11572, 231, 'gems', 'gemBlue5'),
            this.physics.add.sprite(11669, 326, 'gems', 'gemPink55'),
            this.physics.add.sprite(12426, 335, 'gems', 'gemYellow30'),
            this.physics.add.sprite(12498, 335, 'gems', 'gemYellow30'),
            this.physics.add.sprite(12568, 335, 'gems', 'gemYellow30'),
            this.physics.add.sprite(12634, 278, 'gems', 'gemYellow30'),
            this.physics.add.sprite(12749, 335, 'gems', 'gemPink25'),
            this.physics.add.sprite(12926, 213, 'gems', 'gemBlue50'),
            this.physics.add.sprite(13110, 337, 'gems', 'gemPink25'),
            this.physics.add.sprite(13289, 209, 'gems', 'gemBlue20'),
            this.physics.add.sprite(13469, 337, 'gems', 'gemPink25'),
            this.physics.add.sprite(13819, 335, 'gems', 'gemYellow45'),
            this.physics.add.sprite(13966, 284, 'gems', 'gemBlue20'),
            this.physics.add.sprite(14303, 284, 'gems', 'gemBlue20'),
            this.physics.add.sprite(14942, 206, 'gems', 'gemPink10'),
            this.physics.add.sprite(14942, 277, 'gems', 'gemPink10'),
            this.physics.add.sprite(14942, 355, 'gems', 'gemYellow60'),
            this.physics.add.sprite(15791, 334, 'gems', 'gemYellow60'),
            this.physics.add.sprite(15807, 280, 'gems', 'gemPink25'),
            this.physics.add.sprite(15865, 228, 'gems', 'gemPink25'),
            this.physics.add.sprite(16088, 328, 'gems', 'gemBlue5'),
            this.physics.add.sprite(16931, 226, 'gems', 'gemPink10'),
            this.physics.add.sprite(16931, 278, 'gems', 'gemPink10'),
            this.physics.add.sprite(16931, 362, 'gems', 'gemBlue65'),
            this.physics.add.sprite(17640, 340, 'gems', 'gemBlue50'),
            this.physics.add.sprite(17699, 276, 'gems', 'gemPink10'),
            this.physics.add.sprite(17748, 223, 'gems', 'gemPink10'),
            this.physics.add.sprite(17812, 210, 'gems', 'gemYellow45'),
            this.physics.add.sprite(18358, 199, 'gems', 'gemPink10'),
            this.physics.add.sprite(18358, 327, 'gems', 'gemYellow15'),
            this.physics.add.sprite(18483, 274, 'gems', 'gemBlue5'),
            this.physics.add.sprite(18605, 199, 'gems', 'gemYellow15'),
            this.physics.add.sprite(18605, 327, 'gems', 'gemPink10'),
            this.physics.add.sprite(19604, 327, 'gems', 'gemBlue5'),
            this.physics.add.sprite(19720, 327, 'gems', 'gemBlue5'),
            this.physics.add.sprite(20489, 212, 'gems', 'gemPink55'),
            this.physics.add.sprite(20489, 273, 'gems', 'gemYellow15'),
            this.physics.add.sprite(20489, 327, 'gems', 'gemYellow15'),
            this.physics.add.sprite(21197, 274, 'gems', 'gemBlue5'),
            this.physics.add.sprite(21318, 210, 'gems', 'gemPink40'),
            this.physics.add.sprite(21435, 274, 'gems', 'gemBlue5'),
            this.physics.add.sprite(22134, 334, 'gems', 'gemBlue20'),
            this.physics.add.sprite(22190, 282, 'gems', 'gemBlue20'),
            this.physics.add.sprite(22288, 260, 'gems', 'gemYellow45'),
            this.physics.add.sprite(22372, 362, 'gems', 'gemBlue65'),
            this.physics.add.sprite(22665, 212, 'gems', 'gemPink25'),
            this.physics.add.sprite(22822, 212, 'gems', 'gemPink25'),
            this.physics.add.sprite(22864, 361, 'gems', 'gemYellow60'),
            this.physics.add.sprite(23581, 237, 'gems', 'gemPink40'),
            this.physics.add.sprite(23691, 205, 'gems', 'gemYellow15'),
            this.physics.add.sprite(23691, 278, 'gems', 'gemYellow15'),
            this.physics.add.sprite(23805, 236, 'gems', 'gemPink40'),
            this.physics.add.sprite(24781, 188, 'gems', 'gemPink70'),
            this.physics.add.sprite(24781, 239, 'gems', 'gemBlue20'),
            this.physics.add.sprite(24781, 286, 'gems', 'gemBlue20'),
            this.physics.add.sprite(24781, 332, 'gems', 'gemBlue20'),
            this.physics.add.sprite(25612, 328, 'gems', 'gemBlue5'),
            this.physics.add.sprite(25703, 328, 'gems', 'gemBlue5'),
            this.physics.add.sprite(25781, 212, 'gems', 'gemPink55'),
            this.physics.add.sprite(25856, 328, 'gems', 'gemBlue5'),
            this.physics.add.sprite(25946, 328, 'gems', 'gemBlue5'),
            this.physics.add.sprite(26354, 232, 'gems', 'gemPink10'),
            this.physics.add.sprite(26354, 340, 'gems', 'gemBlue20'),
            this.physics.add.sprite(26553, 232, 'gems', 'gemPink10'),
            this.physics.add.sprite(26553, 340, 'gems', 'gemBlue20'),
            this.physics.add.sprite(26713, 233, 'gems', 'gemYellow15'),
            this.physics.add.sprite(26888, 233, 'gems', 'gemYellow15'),
            this.physics.add.sprite(27576, 342, 'gems', 'gemYellow75'),
            this.physics.add.sprite(27642, 253, 'gems', 'gemBlue5'),
            this.physics.add.sprite(27642, 202, 'gems', 'gemYellow15'),
            this.physics.add.sprite(27717, 253, 'gems', 'gemPink10'),
            this.physics.add.sprite(28180, 310, 'gems', 'gemBlue5'),
            this.physics.add.sprite(28395, 207, 'gems', 'gemYellow15'),
            this.physics.add.sprite(28633, 310, 'gems', 'gemBlue5'),
            this.physics.add.sprite(28856, 207, 'gems', 'gemYellow15'),
            this.physics.add.sprite(29081, 310, 'gems', 'gemBlue5'),
            this.physics.add.sprite(29301, 207, 'gems', 'gemYellow15'),
            this.physics.add.sprite(29557, 310, 'gems', 'gemBlue5'),
            this.physics.add.sprite(29784, 207, 'gems', 'gemYellow15'),
            this.physics.add.sprite(30147, 334, 'gems', 'gemPink25'),
            this.physics.add.sprite(30310, 334, 'gems', 'gemPink25'),
            this.physics.add.sprite(30474, 334, 'gems', 'gemPink25'),
            this.physics.add.sprite(31424, 285, 'gems', 'gemYellow45'),
            this.physics.add.sprite(31898, 288, 'gems', 'gemPink55'),
            this.physics.add.sprite(32510, 203, 'gems', 'gemBlue5'),
            this.physics.add.sprite(32645, 339, 'gems', 'gemPink40'),
            this.physics.add.sprite(32852, 217, 'gems', 'gemBlue35'),
            this.physics.add.sprite(33057, 339, 'gems', 'gemPink40'),
            this.physics.add.sprite(33250, 217, 'gems', 'gemBlue35'),
            this.physics.add.sprite(33451, 339, 'gems', 'gemPink40'),
            this.physics.add.sprite(33661, 217, 'gems', 'gemBlue35'),
            this.physics.add.sprite(33871, 339, 'gems', 'gemPink40'),
            this.physics.add.sprite(34170, 329, 'gems', 'gemYellow15'),
            this.physics.add.sprite(34300, 275, 'gems', 'gemYellow15'),
            this.physics.add.sprite(34446, 329, 'gems', 'gemYellow15'),
            this.physics.add.sprite(34711, 311, 'gems', 'gemPink40'),
            this.physics.add.sprite(34909, 332, 'gems', 'gemBlue5'),
            this.physics.add.sprite(35061, 332, 'gems', 'gemPink10'),
            this.physics.add.sprite(35212, 206, 'gems', 'gemYellow15'),
            this.physics.add.sprite(35366, 206, 'gems', 'gemBlue5'),
            this.physics.add.sprite(35519, 331, 'gems', 'gemPink10'),
            this.physics.add.sprite(35672, 331, 'gems', 'gemYellow15'),
            this.physics.add.sprite(36291, 228, 'gems', 'gemBlue20'),
            this.physics.add.sprite(36405, 340, 'gems', 'gemPink70'),
            this.physics.add.sprite(36899, 350, 'gems', 'gemPink10'),
            this.physics.add.sprite(37045, 212, 'gems', 'gemYellow60'),
            this.physics.add.sprite(37200, 349, 'gems', 'gemPink10'),
            this.physics.add.sprite(37740, 281, 'gems', 'gemBlue20'),
            this.physics.add.sprite(38172, 341, 'gems', 'gemYellow75'),
            this.physics.add.sprite(38458, 207, 'gems', 'gemBlue20'),
            this.physics.add.sprite(38579, 243, 'gems', 'gemPink25'),
            this.physics.add.sprite(38781, 243, 'gems', 'gemPink25'),
            this.physics.add.sprite(38958, 205, 'gems', 'gemPink25'),
            this.physics.add.sprite(38958, 278, 'gems', 'gemPink25'),

        ]
        
        this.gems = this.physics.add.group({immovable: true});
        this.gems.addMultiple(this.gemsArray);
        this.gemsScoreTxt = [];


        // Jumps
        this.jumpsArray = [
            
        ]

        this.jumpsArray.forEach(jump => {
            let x = 0
            let y = 0
            switch (jump.frame.name) {
                case 'blueFence':
                    x = 20
                    y = 60
                    break;
                case 'hayBale':
                    x = 15
                    y = 25
                    break;
                case 'hedge':
                    x = 30
                    y = 30
                    break;
                case 'hedgeSmall':
                    x = 20
                    y = 35
                    break;
                case 'log':
                    x = 10
                    y = 20
                    break;
                case 'stump':
                    x = 30
                    y = 20
                    break;
                case 'wall':
                case 'wallGreen':
                    x = 10
                    y = 60
                    break;
                case 'waterTrough':
                    x = 10
                    y = 20
                    break;
                case 'woodenFence':
                    x = 20
                    y = 50
                    break;
            
                default:
                    console.log("Unknown jump type: " + jump.frame.name)
                    break;
            }
            if (jump.y + y >= 400) {
                y = 400 - jump.y 
            } else if (jump.y + y <= 375) {
                y = 375 - jump.y 
            }
            jump.body.setSize(5, 40, false).setOffset(x, y);
        });

        this.jumps = this.physics.add.group({immovable: true});
        this.jumps.addMultiple(this.jumpsArray);

        
        // Foreground Objects
        this.add.sprite(46, 285, 'backgroundObjects', 'startGateFront')

        this.infoScreen = this.add.image(443, 234, 'info').setScrollFactor(0).setVisible(false)
        this.infoButton = this.add.image(443, 304, 'infoButton').setScrollFactor(0).setVisible(false)
            this.infoButton.on('pointerdown', function (pointer)
            {
                nextScreen = true
            });
        

        // Extra settings for debug mode
        if (this.physics.config.debug) {
            // Start at specified x
            this.horse.x = 50
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
        const musicButton = this.add.sprite(871, 453, 'music_button', 'music_on').setInteractive({ pixelPerfect: true }).setScale(0.7).setScrollFactor(0).setFrame(`music_${data.playMusic ? 'on' : 'off'}`);
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

        // combining Button and Touch inputs
        if (this.spaceBar.isDown || (this.input.pointer1.isDown && this.input.pointer1.x < 443) || (this.input.pointer2.isDown && this.input.pointer2.x < 443)) {
            this.jumpCtrl = true
        } else {
            this.jumpCtrl = false
        }
        
        if (this.cursors.right.isDown || (this.input.pointer1.isDown && this.input.pointer1.x >= 443) || (this.input.pointer2.isDown && this.input.pointer2.x >= 443)) {
            this.runCtrl = true
        } else {
            this.runCtrl = false
        }

        // Horse movement
        // Controls
        if (this.jumpCtrl && this.horseMovement !== this.horseMovements.skidding) {
            // Horse jump if spacebar is pressed
            this.horseMovement = this.horseMovements.jumping
        }
        else if (this.runCtrl && this.horseMovement !== this.horseMovements.skidding && this.horseMovement !== this.horseMovements.jumping) {
            // Horse gallop when right arrow key is down and horse is not jumping or sliding
            this.horseMovement = this.horseMovements.galloping
        }
        else if (this.physics.config.debug && this.cursors.left.isDown && this.horseMovement !== this.horseMovements.skidding && this.horseMovement !== this.horseMovements.jumping) {
            // Allow backwards movement in debug mode when left arrow key is down and horse is not jumping or sliding
            this.horseMovement = this.horseMovements.backwards
        }
        else if (!this.runCtrl && this.horseMovement !== this.horseMovements.skidding && this.horseMovement !== this.horseMovements.jumping) {
            // Horse canter if right arrow key is not down and horse is not jumping or sliding
            this.horseMovement = this.horseMovements.cantering
        }
        // Animation
        if (this.horseMovement === this.horseMovements.skidding) {
            this.data.runningSound.stop()
            // Start slide animation
            if (!this.horse.frame.name.includes('slide')) {
                this.horse.play('slideStart2')
                this.skidLoop = 0
                this.horse.setVelocityX(this.skidSpeed);
                this.horse.body.setSize(150, 105, false).setOffset(70, 95);
            }
            // Loop sliding animation
            else if ((this.horse.frame.name === 'slide0001' || this.horse.frame.name === 'slide0006') && this.skidLoop < 3) {
                // console.log('Frame: ' + this.horse.frame.name + ' Loop: ' + this.skidLoop)
                this.horse.play('slide2')
                this.skidLoop += 1
            }
            // End slide animation
            else if (this.horse.frame.name === 'slide0006' && this.skidLoop >= 3) {
                this.horse.play('slideEnd2')
            }
            // Return to running after done sliding
            else if (this.horse.frame.name === 'slide0009') {
                this.horseMovement = this.horseMovements.cantering
            }
        }
        else if (this.horseMovement === this.horseMovements.jumping) {
            this.data.runningSound.stop()
            // Play jump animation
            if (!this.horse.frame.name.includes('jump')) {
                this.horse.play('jump2')
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
                    
                case 'land0000':
                    this.horse.body.setSize(150, 105, false).setOffset(90, 85);
                    this.horseMovement = this.horseMovements.cantering
                    break;
            
                default:
                    this.horse.body.setSize(150, 105, false).setOffset(70, 95);
                    this.horseMovement = this.horseMovements.cantering
                    break;
            }
            // Adjust speed
            if (this.runCtrl && this.horseMovement !== this.horseMovements.skidding) {
                // Horse gallop speed when right arrow key is down
                this.horse.setVelocityX(this.gallopSpeed);
            }
            else if (this.physics.config.debug && this.cursors.left.isDown && this.horseMovement !== this.horseMovements.skidding) {
                // Backwards movement in debug mode when left arrow key is down
                this.horse.setVelocityX(-this.gallopSpeed);
            }
            else if (!this.runCtrl && this.horseMovement !== this.horseMovements.skidding) {
                // Horse canter speed if right arrow key is not down
                this.horse.setVelocityX(this.canterSpeed);
            }
        }
        else if (this.horseMovement === this.horseMovements.galloping) {
            if (!this.horse.frame.name.includes('gallop')) {
                this.horse.setVelocityX(this.gallopSpeed);
                this.horse.body.setSize(150, 105, false).setOffset(70, 95);
                this.horse.play('gallop2')
                this.data.runningSound.play()
            }
        }
        else if (this.horseMovement === this.horseMovements.backwards) {
            if (!this.horse.frame.name.includes('gallop')) {
                this.horse.setVelocityX(-this.gallopSpeed);
                this.horse.body.setSize(150, 105, false).setOffset(70, 95);
                this.horse.play('gallop2')
                this.data.runningSound.play()
            }
        }
        else if (this.horseMovement === this.horseMovements.cantering) {
            this.data.runningSound.stop()
            if (!this.horse.frame.name.includes('canter')) {
                this.horse.setVelocityX(this.canterSpeed);
                this.horse.body.setSize(150, 105, false).setOffset(70, 95);
                this.horse.play('canter2')
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

                        var gemTxt = this.add.text(gem.x, gem.y, points, this.gemsScoreTxtStyle).setOrigin(.5, .5)
                        gemTxt.alpha = 0
                        var gemsTxtDatas = 
                        {
                            txt : gemTxt,
                            currenFrameVisible : 0
                        }
                        this.gemsScoreTxt.push(gemsTxtDatas)

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
                this.data.runningSound.stop()
                this.scene.start('StartScreen', this.data);
                this.scene.stop('LevelThree')
            }

            // Handle gem score text
            for (var i = this.gemsScoreTxt.length - 1; i >= 0; i--)
                {
                    this.gemsScoreTxt[i].txt.setPosition(
                        this.gemsScoreTxt[i].txt.x,
                        this.gemsScoreTxt[i].txt.y -= .1)

                    if (this.gemsScoreTxt[i].currenFrameVisible >= this.maxTimeScoreTxtAppear)
                    {
                        this.gemsScoreTxt[i].txt.alpha -= this.scoreTxtAlphaAnimation
    
                        if (this.gemsScoreTxt[i].txt.alpha <= 0)
                        {
                            this.gemsScoreTxt[i].txt.destroy();
                            this.gemsScoreTxt.splice(i, 1);           
                        }
                        continue;
                    }
                    else
                    {
                        if (this.gemsScoreTxt[i].txt.alpha < 1)
                        {
                            this.gemsScoreTxt[i].txt.alpha += this.scoreTxtAlphaAnimation
                            continue;
                        }
    
                        this.gemsScoreTxt[i].currenFrameVisible++;
                    }
                }
    }
}
