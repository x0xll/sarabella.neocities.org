class LevelOne extends Phaser.Scene 
{
    debugStartX = 0
    levelEnd = 22941
    levelTime = 50
    canUnlockNext = true
    addLevelRef = false

    constructor ()
    {
        super({ key: 'LevelOne' });
    }

    preload ()
    {
        this.load.atlas('horse1', './images/horseBella.png', './images/horse.json');
        this.levelHelper = new LevelHelper(this, 1, this.addLevelRef)
    }

    create (data)
    { 
        this.data = data
        this.levelHelper.startCreate()

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

        // Create Horse and Gates
        this.levelHelper.createHorseAndGates()

        // Horseshoe
        this.horseshoe = this.physics.add.sprite(6900, 220, 'horseshoe', '1')

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
            this.physics.add.sprite(18180, 175, 'gems', 'gemBlue5'),
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

        this.levelHelper.endCreate()
    }

    update ()
    {
        this.levelHelper.levelUpdate()

        if (nextScreen) {
            nextScreen = false
            this.levelHelper.destroy()
            this.scene.start('StartScreen', this.data);
            this.scene.stop('LevelOne')
        }
    }
}