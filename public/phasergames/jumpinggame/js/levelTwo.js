class LevelTwo extends Phaser.Scene 
{
    debugStartX = 30000
    levelEnd = 31628
    levelTime = 67
    canUnlockNext = false
    addLevelRef = false

    constructor ()
    {
        super({ key: 'LevelTwo' });
    }

    preload ()
    {
        this.load.atlas('horse2', './images/horseFiona.png', './images/horse.json');
        this.levelHelper = new LevelHelper(this, 2, this.addLevelRef)
    }

    create (data)
    { 
        this.data = data
        this.levelHelper.startCreate()

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

        // Create Horse and Gates
        this.levelHelper.createHorseAndGates()

        // Horseshoe
        this.horseshoe = this.physics.add.sprite(20300, 240, 'horseshoe', '1')

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

        this.levelHelper.endCreate()
    }

    update ()
    {
        this.levelHelper.levelUpdate()

        if (nextScreen) {
            nextScreen = false
            this.levelHelper.destroy()
            this.scene.start('StartScreen', this.data);
            this.scene.stop('LevelTwo')
        }
    }
}