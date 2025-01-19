class LevelTwo extends Phaser.Scene 
{

    score = 0
    horse
    canterSpeed = 350
    gallopSpeed = 500
    skidSpeed = 300
    runHeight = 290
    horseMovements = {
        backwards: 'backwards',
        cantering: 'cantering',
        galloping: 'galloping',
        jumping: 'jumping',
        skidding: 'skidding'
    }
    horseMovement = this.horseMovements.cantering
    skidLoop = 0
    levelEnd = 31628
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
        super({ key: 'LevelTwo' });
    }

    preload ()
    {
        this.load.image('scoreBoard', './images/scoreBoard.png');
        this.load.image('info', './images/info.png');
        this.load.image('infoButton', './images/infoButton.png');
        this.load.image('mountains', './images/mountains.png');
        this.load.image('path', './images/path.png');
        this.load.atlas('horse2', './images/horseFiona.png', './images/horse.json');
        this.load.atlas('jumps', './images/jumps.png', './images/jumps.json');
        this.load.atlas('gems', './images/gems.png', './images/gems.json');
        this.load.atlas('horseshoe', './images/horseshoe.png', './images/horseshoe.json');
        this.load.atlas('backgroundObjects', './images/backgroundObjects.png', './images/backgroundObjects.json');
        this.load.image('endGate', './images/endGate.png');

        this.clock = this.plugins.get('rexclockplugin').add(this, config);

        // Level reference
        //this.load.image('Level2', './images/Level Screens/Level2.png');
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
        //this.add.image(0, 0, 'Level2').setOrigin(0, 0).setAlpha(.6) 

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
        this.add.sprite(167, 285, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(95, 285, 'backgroundObjects', 'startGateBack')
        this.add.sprite(535, 280, 'backgroundObjects', 'bush')
        this.add.sprite(1100, 285, 'backgroundObjects', 'bush')
        this.add.sprite(1885, 285, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(2306, 285, 'backgroundObjects', 'bush')
        this.add.sprite(2290, 325, 'backgroundObjects', 'bridge2Back')
        this.add.sprite(3409, 282, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(3961, 285, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(4348, 284, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(5158, 285, 'backgroundObjects', 'bush')
        this.add.sprite(5475, 285, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(5742, 287, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(6239, 288, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(6650, 330, 'backgroundObjects', 'bridge2Back').setScale(.85, .9)
        this.add.sprite(6940, 330, 'backgroundObjects', 'bridge2Back').setScale(.85, .9)
        this.add.sprite(7225, 330, 'backgroundObjects', 'bridge2Back').setScale(.85, .9)
        this.add.sprite(8575, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(9102, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(10606, 295, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(11819, 295, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(12620, 287, 'backgroundObjects', 'bush')
        this.add.sprite(13518, 295, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(15073, 330, 'backgroundObjects', 'bridge2Back').setScale(.85, .9)
        this.add.sprite(15363, 330, 'backgroundObjects', 'bridge2Back').setScale(.85, .9)
        this.add.sprite(15653, 330, 'backgroundObjects', 'bridge2Back').setScale(.85, .9)
        this.add.sprite(16003, 330, 'backgroundObjects', 'bridge2Back').setScale(.85, .9)
        this.add.sprite(16293, 330, 'backgroundObjects', 'bridge2Back').setScale(.85, .9)
        this.add.sprite(16582, 330, 'backgroundObjects', 'bridge2Back').setScale(.85, .9)
        this.add.sprite(16874, 295, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(19171, 285, 'backgroundObjects', 'bush')
        this.add.sprite(19492, 295, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(20113, 285, 'backgroundObjects', 'bush')
        this.add.sprite(19928, 290, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(20298, 290, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(20704, 290, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(21054, 295, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(21249, 290, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(21752, 282, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(21639, 290, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(21994, 289, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(22010, 285, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(22575, 290, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(23165, 300, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(22948, 290, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(23451, 300, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(23527, 290, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(23897, 290, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(24784, 285, 'backgroundObjects', 'bush')
        this.add.sprite(25969, 300, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(27230, 330, 'backgroundObjects', 'bridge2Back').setScale(.85, .9)
        this.add.sprite(27518, 330, 'backgroundObjects', 'bridge2Back').setScale(.85, .9)
        this.add.sprite(27808, 330, 'backgroundObjects', 'bridge2Back').setScale(.85, .9)
        this.add.sprite(28131, 300, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(28531, 285, 'backgroundObjects', 'bush')
        this.add.sprite(29104, 330, 'backgroundObjects', 'bridge2Back').setScale(.85, .9)
        this.add.sprite(29393, 330, 'backgroundObjects', 'bridge2Back').setScale(.85, .9)
        this.add.sprite(29680, 330, 'backgroundObjects', 'bridge2Back').setScale(.85, .9)
        this.add.sprite(29974, 300, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(29993, 310, 'backgroundObjects', 'fence').setScale(.6)
        this.add.sprite(30204, 310, 'backgroundObjects', 'fence').setScale(.6)
        this.add.sprite(30415, 310, 'backgroundObjects', 'fence').setScale(.6)
        this.add.sprite(30626, 310, 'backgroundObjects', 'fence').setScale(.6)
        this.add.sprite(30915, 300, 'backgroundObjects', 'fence').setScale(.6, .9)
        this.add.sprite(31250, 285, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(31126, 300, 'backgroundObjects', 'fence').setScale(.6, .9)
        this.add.sprite(31336, 300, 'backgroundObjects', 'fence').setScale(.6, .9)
        this.add.sprite(31547, 300, 'backgroundObjects', 'fence').setScale(.6, .9)

        // Horse
        this.horse = this.physics.add.sprite(-100, this.runHeight, 'horse2', 'canter0000')
        if (!this.anims.exists('canter2')) {
            this.anims.create({
                key: 'canter2',
                frames: this.anims.generateFrameNumbers('horse2', { frames: [
                    'canter0000', 'canter0001', 'canter0002', 'canter0003', 'canter0004', 'canter0005', 'canter0006', 'canter0007', 'canter0008', 'canter0009', 'canter0010', 'canter0011'
                ] }),
                frameRate: 20,
                repeat: -1
            });
            this.anims.create({
                key: 'gallop2',
                frames: this.anims.generateFrameNumbers('horse2', { frames: [
                    'gallop0000', 'gallop0001', 'gallop0002', 'gallop0003', 'gallop0004', 'gallop0005', 'gallop0006'
                ] }),
                frameRate: 20,
                repeat: -1
            });
            this.anims.create({
                key: 'jump2',
                frames: this.anims.generateFrameNumbers('horse2', { frames: [
                    'jump0000', 'jump0001', 'jump0002', 'jump0003', 'jump0004', 'jump0005', 'jump0006', 'jump0007', 'jump0008', 'jump0009', 'jump0010', 'land0000'
                ] }),
                frameRate: 16
            });
            this.anims.create({
                key: 'slideStart2',
                frames: this.anims.generateFrameNumbers('horse2', { frames: [
                    'slide0000', 'slide0001'
                ] }),
                frameRate: 20
            });
            this.anims.create({
                key: 'slide2',
                frames: this.anims.generateFrameNumbers('horse2', { frames: [
                    'slide0002', 'slide0003', 'slide0004', 'slide0005', 'slide0006'
                ] }),
                frameRate: 20,
                repeat: -1
            });
            this.anims.create({
                key: 'slideEnd2',
                frames: this.anims.generateFrameNumbers('horse2', { frames: [
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
        this.horseshoe = this.physics.add.sprite(20300, 240, 'horseshoe', '1')
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
            this.physics.add.sprite(525, 345, 'gems', 'gemBlue5'),
            this.physics.add.sprite(839, 206, 'gems', 'gemYellow15'),
            this.physics.add.sprite(1074, 200, 'gems', 'gemBlue20'),
            this.physics.add.sprite(1497, 325, 'gems', 'gemPink10'),
            this.physics.add.sprite(1589, 311, 'gems', 'gemPink55'),
            this.physics.add.sprite(1915, 340, 'gems', 'gemBlue5'),
            this.physics.add.sprite(2291, 208, 'gems', 'gemPink40'),
            this.physics.add.sprite(2828, 307, 'gems', 'gemYellow15'),
            this.physics.add.sprite(2923, 218, 'gems', 'gemBlue65'),
            this.physics.add.sprite(3425, 290, 'gems', 'gemYellow30'),
            this.physics.add.sprite(3564, 243, 'gems', 'gemPink25'),
            this.physics.add.sprite(3942, 241, 'gems', 'gemPink10'),
            this.physics.add.sprite(4047, 199, 'gems', 'gemPink10'),
            this.physics.add.sprite(4157, 244, 'gems', 'gemPink10'),
            this.physics.add.sprite(4561, 328, 'gems', 'gemBlue5'),
            this.physics.add.sprite(5133, 310, 'gems', 'gemYellow75'),
            this.physics.add.sprite(5432, 222, 'gems', 'gemBlue50'),
            this.physics.add.sprite(5987, 272, 'gems', 'gemYellow15'),
            this.physics.add.sprite(6132, 272, 'gems', 'gemYellow15'),
            this.physics.add.sprite(6061, 202, 'gems', 'gemYellow15'),
            this.physics.add.sprite(6061, 337, 'gems', 'gemYellow15'),
            this.physics.add.sprite(6059, 270, 'gems', 'gemPink55'),
            this.physics.add.sprite(6684, 338, 'gems', 'gemBlue65'),
            this.physics.add.sprite(7591, 340, 'gems', 'gemPink10'),
            this.physics.add.sprite(7677, 340, 'gems', 'gemPink10'),
            this.physics.add.sprite(7763, 340, 'gems', 'gemPink10'),
            this.physics.add.sprite(8255, 284, 'gems', 'gemPink55'),
            this.physics.add.sprite(8741, 213, 'gems', 'gemBlue20'),
            this.physics.add.sprite(9154, 307, 'gems', 'gemPink70'),
            this.physics.add.sprite(9475, 246, 'gems', 'gemPink10'),
            this.physics.add.sprite(9871, 246, 'gems', 'gemPink10'),
            this.physics.add.sprite(10122, 246, 'gems', 'gemPink10'),
            this.physics.add.sprite(10391, 306, 'gems', 'gemBlue5'),
            this.physics.add.sprite(10936, 260, 'gems', 'gemBlue50'),
            this.physics.add.sprite(11265, 263, 'gems', 'gemYellow60'),
            this.physics.add.sprite(11671, 266, 'gems', 'gemBlue35'),
            this.physics.add.sprite(11806, 226, 'gems', 'gemBlue35'),
            this.physics.add.sprite(11941, 266, 'gems', 'gemBlue35'),
            this.physics.add.sprite(12310, 228, 'gems', 'gemBlue5'),
            this.physics.add.sprite(12495, 365, 'gems', 'gemBlue20'),
            this.physics.add.sprite(13155, 354, 'gems', 'gemPink40'),
            this.physics.add.sprite(13572, 340, 'gems', 'gemPink70'),
            this.physics.add.sprite(13373, 224, 'gems', 'gemBlue20'),
            this.physics.add.sprite(13574, 224, 'gems', 'gemBlue20'),
            this.physics.add.sprite(13770, 224, 'gems', 'gemBlue20'),
            this.physics.add.sprite(14120, 203, 'gems', 'gemPink10'),
            this.physics.add.sprite(14789, 352, 'gems', 'gemYellow45'),
            this.physics.add.sprite(15267, 338, 'gems', 'gemBlue5'),
            this.physics.add.sprite(15525, 281, 'gems', 'gemYellow60'),
            this.physics.add.sprite(15751, 338, 'gems', 'gemBlue5'),
            this.physics.add.sprite(16082, 212, 'gems', 'gemYellow30'),
            this.physics.add.sprite(16616, 206, 'gems', 'gemPink55'),
            this.physics.add.sprite(17341, 223, 'gems', 'gemBlue35'),
            this.physics.add.sprite(17629, 223, 'gems', 'gemBlue35'),
            this.physics.add.sprite(18085, 352, 'gems', 'gemBlue5'),
            this.physics.add.sprite(18462, 215, 'gems', 'gemPink25'),
            this.physics.add.sprite(18576, 336, 'gems', 'gemPink70'),
            this.physics.add.sprite(18800, 255, 'gems', 'gemPink10'),
            this.physics.add.sprite(19244, 240, 'gems', 'gemBlue50'),
            this.physics.add.sprite(19264, 340, 'gems', 'gemBlue65'),
            this.physics.add.sprite(20009, 291, 'gems', 'gemBlue5'),
            this.physics.add.sprite(20127, 291, 'gems', 'gemBlue5'),
            this.physics.add.sprite(20233, 211, 'gems', 'gemBlue5'),
            this.physics.add.sprite(20354, 211, 'gems', 'gemBlue5'),
            this.physics.add.sprite(20775, 348, 'gems', 'gemBlue20'),
            this.physics.add.sprite(21198, 279, 'gems', 'gemYellow30'),
            this.physics.add.sprite(21657, 223, 'gems', 'gemBlue65'),
            this.physics.add.sprite(22064, 307, 'gems', 'gemYellow15'),
            this.physics.add.sprite(22152, 307, 'gems', 'gemBlue5'),
            this.physics.add.sprite(22237, 307, 'gems', 'gemPink10'),
            this.physics.add.sprite(22325, 307, 'gems', 'gemBlue5'),
            this.physics.add.sprite(22936, 252, 'gems', 'gemPink10'),
            this.physics.add.sprite(23004, 216, 'gems', 'gemPink55'),
            this.physics.add.sprite(23534, 302, 'gems', 'gemBlue20'),
            this.physics.add.sprite(23686, 302, 'gems', 'gemBlue20'),
            this.physics.add.sprite(24092, 231, 'gems', 'gemPink40'),
            this.physics.add.sprite(24554, 220, 'gems', 'gemBlue50'),
            this.physics.add.sprite(24681, 348, 'gems', 'gemPink10'),
            this.physics.add.sprite(24813, 220, 'gems', 'gemBlue50'),
            this.physics.add.sprite(25284, 277, 'gems', 'gemYellow15'),
            this.physics.add.sprite(25401, 277, 'gems', 'gemYellow15'),
            this.physics.add.sprite(25518, 277, 'gems', 'gemYellow15'),
            this.physics.add.sprite(25828, 246, 'gems', 'gemPink40'),
            this.physics.add.sprite(25933, 216, 'gems', 'gemPink40'),
            this.physics.add.sprite(26719, 267, 'gems', 'gemYellow45'),
            this.physics.add.sprite(26778, 268, 'gems', 'gemBlue5'),
            this.physics.add.sprite(27347, 223, 'gems', 'gemYellow75'),
            this.physics.add.sprite(27737, 270, 'gems', 'gemBlue20'),
            this.physics.add.sprite(27820, 216, 'gems', 'gemPink55'),
            this.physics.add.sprite(28293, 221, 'gems', 'gemBlue20'),
            this.physics.add.sprite(28408, 264, 'gems', 'gemBlue20'),
            this.physics.add.sprite(28525, 221, 'gems', 'gemBlue20'),
            this.physics.add.sprite(28641, 264, 'gems', 'gemBlue20'),
            this.physics.add.sprite(28756, 221, 'gems', 'gemBlue20'),
            this.physics.add.sprite(29199, 242, 'gems', 'gemPink25'),
            this.physics.add.sprite(29653, 233, 'gems', 'gemBlue50'),
            this.physics.add.sprite(29741, 327, 'gems', 'gemPink25'),
            this.physics.add.sprite(30046, 316, 'gems', 'gemPink10'),
            this.physics.add.sprite(30203, 316, 'gems', 'gemPink10'),
            this.physics.add.sprite(30362, 316, 'gems', 'gemPink10'),
            this.physics.add.sprite(30704, 221, 'gems', 'gemYellow45'),
            this.physics.add.sprite(31310, 224, 'gems', 'gemYellow75'),
            this.physics.add.sprite(31310, 379, 'gems', 'gemBlue50')
        ]
        
        this.gems = this.physics.add.group({immovable: true});
        this.gems.addMultiple(this.gemsArray);
        this.gemsScoreTxt = [];


        // Jumps
        this.jumpsArray = [
            this.physics.add.sprite(1112, 365, 'jumps', 'stump'),
            this.physics.add.sprite(2907, 343, 'jumps', 'wall').setScale(1.6, 1.1),
            this.physics.add.sprite(4044, 360, 'jumps', 'waterTrough'),
            this.physics.add.sprite(7206, 355, 'jumps', 'waterTrough'),
            this.physics.add.sprite(8128, 351, 'jumps', 'wallGreen').setScale(1.1, 1.1),
            this.physics.add.sprite(8746, 367, 'jumps', 'hedge'),
            this.physics.add.sprite(12297, 365, 'jumps', 'hedgeSmall'),
            this.physics.add.sprite(13672, 360, 'jumps', 'wall').setScale(1.6, 1.1),
            this.physics.add.sprite(14841, 358, 'jumps', 'wall').setScale(1.2, 1),
            this.physics.add.sprite(18420, 361, 'jumps', 'wall').setScale(1.6, 1.1),
            this.physics.add.sprite(20308, 353, 'jumps', 'woodenFence'),
            this.physics.add.sprite(21206, 365, 'jumps', 'hayBale'),
            this.physics.add.sprite(23012, 372, 'jumps', 'stump'),
            this.physics.add.sprite(24088, 363, 'jumps', 'hedgeSmall').setScale(.9,.9),
            this.physics.add.sprite(25930, 359, 'jumps', 'woodenFence'),
            this.physics.add.sprite(26706, 361, 'jumps', 'log'),
            this.physics.add.sprite(28531, 353, 'jumps', 'wall').setScale(1.6, 1.1),
            this.physics.add.sprite(29661, 365, 'jumps', 'hayBale')
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
        this.add.sprite(185, 430, 'backgroundObjects', 'bush').setScale(.9, .85)
        this.add.sprite(609, 430, 'backgroundObjects', 'rock')
        this.add.sprite(1160, 440, 'backgroundObjects', 'bush').setScale(.8, .70)
        this.add.sprite(2290, 390, 'backgroundObjects', 'bridge2Front')
        this.add.sprite(2490, 440, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(3929, 430, 'backgroundObjects', 'bush')
        this.add.sprite(5206, 450, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(5806, 470, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(6650, 390, 'backgroundObjects', 'bridge2Front').setScale(.85, .9)
        this.add.sprite(6940, 390, 'backgroundObjects', 'bridge2Front').setScale(.85, .9)
        this.add.sprite(7225, 390, 'backgroundObjects', 'bridge2Front').setScale(.85, .9)
        this.add.sprite(8589, 440, 'backgroundObjects', 'bush').setScale(.8, .70)
        this.add.sprite(9559, 450, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(9768, 470, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(12497, 430, 'backgroundObjects', 'rock')
        this.add.sprite(13534, 430, 'backgroundObjects', 'rock')
        this.add.sprite(13639, 440, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(14248, 450, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(14442, 470, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(15073, 390, 'backgroundObjects', 'bridge2Front').setScale(.85, .9)
        this.add.sprite(15363, 390, 'backgroundObjects', 'bridge2Front').setScale(.85, .9)
        this.add.sprite(15653, 390, 'backgroundObjects', 'bridge2Front').setScale(.85, .9)
        this.add.sprite(16003, 390, 'backgroundObjects', 'bridge2Front').setScale(.85, .9)
        this.add.sprite(16293, 390, 'backgroundObjects', 'bridge2Front').setScale(.85, .9)
        this.add.sprite(16582, 390, 'backgroundObjects', 'bridge2Front').setScale(.85, .9)
        this.add.sprite(17346, 450, 'backgroundObjects', 'bush').setScale(.8, .70)
        this.add.sprite(18766, 470, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(19928, 440, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(20298, 440, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(20704, 440, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(21249, 440, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(21639, 440, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(22010, 440, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(22575, 440, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(22948, 440, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(22902, 470, 'backgroundObjects', 'bush')
        this.add.sprite(23527, 440, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(23523, 470, 'backgroundObjects', 'bush')
        this.add.sprite(23897, 440, 'backgroundObjects', 'fence').setScale(1.05, 1.1)
        this.add.sprite(24394, 440, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(24666, 430, 'backgroundObjects', 'rock')
        this.add.sprite(26383, 450, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(26591, 470, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(27230, 390, 'backgroundObjects', 'bridge2Front').setScale(.85, .9)
        this.add.sprite(27518, 390, 'backgroundObjects', 'bridge2Front').setScale(.85, .9)
        this.add.sprite(27808, 390, 'backgroundObjects', 'bridge2Front').setScale(.85, .9)
        this.add.sprite(28599, 440, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(29104, 390, 'backgroundObjects', 'bridge2Front').setScale(.85, .9)
        this.add.sprite(29393, 390, 'backgroundObjects', 'bridge2Front').setScale(.85, .9)
        this.add.sprite(29680, 390, 'backgroundObjects', 'bridge2Front').setScale(.85, .9)
        this.add.sprite(29993, 400, 'backgroundObjects', 'fence').setScale(.6)
        this.add.sprite(30204, 400, 'backgroundObjects', 'fence').setScale(.6)
        this.add.sprite(30415, 400, 'backgroundObjects', 'fence').setScale(.6)
        this.add.sprite(30626, 400, 'backgroundObjects', 'fence').setScale(.6)
        this.add.sprite(30915, 420, 'backgroundObjects', 'fence').setScale(.6, .9)
        this.add.sprite(31126, 420, 'backgroundObjects', 'fence').setScale(.6, .9)
        this.add.sprite(31336, 420, 'backgroundObjects', 'fence').setScale(.6, .9)
        this.add.sprite(31547, 420, 'backgroundObjects', 'fence').setScale(.6, .9)

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
                this.scene.stop('LevelTwo')
            }

            // Handle gem score text
            for (var i = this.gemsScoreTxt.length - 1; i >= 0; i--)
                {
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