class LevelThree extends Phaser.Scene 
{
    debugStartX = 200
    levelEnd = 37440
    levelTime = 67
    canUnlockNext = false
    addLevelRef = true

    constructor ()
    {
        super({ key: 'LevelThree' });
    }

    preload ()
    {
        this.load.atlas('horse3', './images/horseJewel.png', './images/horse.json');
        this.levelHelper = new LevelHelper(this, 3, this.addLevelRef)
    }

    create (data)
    { 
        this.data = data
        this.levelHelper.startCreate()

        // Background Elements
        this.add.sprite(95, 285, 'backgroundObjects', 'startGateBack')
        this.add.sprite(625, 290, 'backgroundObjects', 'bush')
        this.add.sprite(2394, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(2811, 295, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(3452, 288, 'backgroundObjects', 'bush')
        this.add.sprite(3798, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(4701, 290, 'backgroundObjects', 'bush').setScale(.3, .6)
        this.add.sprite(5142, 290, 'backgroundObjects', 'bush')
        this.add.sprite(5790, 290, 'backgroundObjects', 'bush')
        this.add.sprite(6196, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(6476, 295, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(7366, 290, 'backgroundObjects', 'bush')
        this.add.sprite(8073, 295, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(8410, 275, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(8648, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(10064, 280, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(10595, 295, 'backgroundObjects', 'bush')
        this.add.sprite(11882, 290, 'backgroundObjects', 'bush')
        this.add.sprite(12421, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(12801, 287, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(13144, 288, 'backgroundObjects', 'bush')
        this.add.sprite(13780, 280, 'backgroundObjects', 'bush')
        this.add.sprite(14694, 290, 'backgroundObjects', 'bush')
        this.add.sprite(15207, 305, 'backgroundObjects', 'bush').setScale(.3, .6)
        this.add.sprite(15582, 305, 'backgroundObjects', 'bush').setScale(.3, .6)
        this.add.sprite(15858, 305, 'backgroundObjects', 'bush').setScale(.3, .6)
        this.add.sprite(16149, 305, 'backgroundObjects', 'bush').setScale(.3, .6)
        this.add.sprite(16574, 290, 'backgroundObjects', 'bush')
        this.add.sprite(18128, 280, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(18742, 280, 'backgroundObjects', 'bush')
        this.add.sprite(19273, 290, 'backgroundObjects', 'bush')
        this.add.sprite(21306, 290, 'backgroundObjects', 'bush')
        this.add.sprite(21828, 305, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(23120, 290, 'backgroundObjects', 'bush')
        this.add.sprite(23616, 300, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(23990, 285, 'backgroundObjects', 'bush')
        this.add.sprite(24557, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(25145, 270, 'backgroundObjects', 'bush').setScale(1, .6)
        this.add.sprite(25430, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(25826, 275, 'backgroundObjects', 'bush').setScale(1, .6)
        this.add.sprite(26450, 290, 'backgroundObjects', 'bush').setScale(-0.4, 0.8)
        this.add.sprite(26580, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(26967, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(27454, 295, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(28168, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(28617, 295, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(29015, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(29302, 295, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(29795, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(30131, 285, 'backgroundObjects', 'bush')
        this.add.sprite(32886, 280, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(33106, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(33289, 280, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(33520, 290, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(34062, 295, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(34207, 275, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(34330, 298, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(35937, 298, 'backgroundObjects', 'bush').setScale(.2, .4)
        this.add.sprite(36221, 298, 'backgroundObjects', 'bush').setScale(.2, .4)
        this.add.sprite(36516, 298, 'backgroundObjects', 'bush').setScale(.2, .4)

        // Create Horse and Gates
        this.levelHelper.createHorseAndGates()

        // Horseshoe
        this.horseshoe = this.physics.add.sprite(19827, 251, 'horseshoe', '1')

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

        // Jumps
        this.jumpsArray = [
            
        ]
        
        // Foreground Objects
        this.add.sprite(46, 285, 'backgroundObjects', 'startGateFront')

        this.levelHelper.endCreate()
    }

    update ()
    {
        this.levelHelper.levelUpdate()

        if (nextScreen) {
            nextScreen = false
            this.levelHelper.destroy()
            this.scene.start('StartScreen', this.data);
            this.scene.stop('LevelThree')
        }
    }
}
