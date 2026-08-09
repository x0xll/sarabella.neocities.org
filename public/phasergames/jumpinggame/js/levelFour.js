class LevelFour extends Phaser.Scene 
{
    debugStartX = 200
    levelEnd = 37440
    levelTime = 140
    canUnlockNext = false
    addLevelRef = false

    constructor ()
    {
        super({ key: 'LevelFour' });
    }

    preload ()
    {
        //this.load.atlas('horse4', './images/horseThunder.png', './images/horse.json');
        this.load.atlas('horse4', './newsprites/Thunder/spritesThunder.png', './newsprites/Thunder/spritesThunder.json');
        this.levelHelper = new LevelHelper(this, 4, this.addLevelRef)
    }

    create (data)
    { 
        this.data = data
        this.levelHelper.startCreate()

        // Background Elements
        this.add.sprite(95, 285, 'backgroundObjects', 'startGateBack')

        // Create Horse and Gates
        this.levelHelper.createHorseAndGates()

        // Horseshoe
        this.horseshoe = this.physics.add.sprite(28840, 340, 'horseshoe', '1')

        //this.physics.add.sprite(1598, 223, 'gems', 'gemBlue35') Blue diamond
        //this.physics.add.sprite(1865, 308, 'gems', 'gemPink25') Pink rectangle
        //this.physics.add.sprite(2188, 208, 'gems', 'gemBlue50') Blue teardrop
        //this.physics.add.sprite(3290, 211, 'gems', 'gemPink55') Pink teardrop
        //this.physics.add.sprite(3781, 214, 'gems', 'gemYellow75') Yellow heart
        //this.physics.add.sprite(5977, 245, 'gems', 'gemBlue5') Small blue
        //this.physics.add.sprite(9378, 371, 'gems', 'gemPink70') Pink heart
        //this.physics.add.sprite(12634, 278, 'gems', 'gemYellow30') Yellow rectangle
        //this.physics.add.sprite(13289, 209, 'gems', 'gemBlue20') Blue rectangle
        //this.physics.add.sprite(13819, 335, 'gems', 'gemYellow45') Yellow diamond
        //this.physics.add.sprite(14942, 355, 'gems', 'gemYellow60') Yellow teardrop
        //this.physics.add.sprite(16931, 362, 'gems', 'gemBlue65') Blue heart
        //this.physics.add.sprite(21318, 210, 'gems', 'gemPink40') Pink diamond

        // Gems
        this.gemsArray = [
            // TODO: Add rest of sprites here
            this.physics.add.sprite(275, 279, 'gems', 'gemPink10'), //Small pink
            this.physics.add.sprite(397, 279, 'gems', 'gemPink10'),
            this.physics.add.sprite(520, 279, 'gems', 'gemPink10'),
            this.physics.add.sprite(640, 279, 'gems', 'gemYellow15'), //Small yellow
            this.physics.add.sprite(1065, 330, 'gems', 'gemBlue5'),
            this.physics.add.sprite(1155, 225, 'gems', 'gemPink10'),
            this.physics.add.sprite(1250, 330, 'gems', 'gemBlue5'),
            this.physics.add.sprite(1340, 225, 'gems', 'gemPink10'),
            this.physics.add.sprite(1435, 330, 'gems', 'gemPink40'),
            this.physics.add.sprite(1927, 283, 'gems', 'gemYellow30'),
            this.physics.add.sprite(2066, 233, 'gems', 'gemPink25'),
            this.physics.add.sprite(2201, 213, 'gems', 'gemBlue20'),
            this.physics.add.sprite(2336, 233, 'gems', 'gemPink25'),
            this.physics.add.sprite(2473, 283, 'gems', 'gemYellow30'),
            this.physics.add.sprite(3065, 335, 'gems', 'gemPink10'),
            this.physics.add.sprite(3120, 335, 'gems', 'gemYellow45'),
            this.physics.add.sprite(3120, 285, 'gems', 'gemYellow45'),
            this.physics.add.sprite(3120, 205, 'gems', 'gemPink70'),
            this.physics.add.sprite(3175, 335, 'gems', 'gemPink10'),
            this.physics.add.sprite(3880, 326, 'gems', 'gemPink10'),
            this.physics.add.sprite(3990, 326, 'gems', 'gemPink10'),
            this.physics.add.sprite(4100, 326, 'gems', 'gemPink10'),
            this.physics.add.sprite(4210, 262, 'gems', 'gemBlue65'),
            this.physics.add.sprite(4610, 213, 'gems', 'gemPink25'),
            this.physics.add.sprite(4717, 213, 'gems', 'gemPink25'),
            this.physics.add.sprite(4874, 335, 'gems', 'gemYellow60'),
            this.physics.add.sprite(5010, 213, 'gems', 'gemPink25'),
            this.physics.add.sprite(5120, 213, 'gems', 'gemPink25'),
            this.physics.add.sprite(5410, 335, 'gems', 'gemBlue20'),
            this.physics.add.sprite(5680, 330, 'gems', 'gemYellow15'),
            this.physics.add.sprite(5777, 218, 'gems', 'gemPink40'),
            this.physics.add.sprite(5860, 330, 'gems', 'gemYellow15'),
            this.physics.add.sprite(6125, 335, 'gems', 'gemBlue20'),
            this.physics.add.sprite(6333, 205, 'gems', 'gemPink70'),
            this.physics.add.sprite(6500, 280, 'gems', 'gemBlue20'),
            this.physics.add.sprite(6625, 280, 'gems', 'gemBlue20'),
            this.physics.add.sprite(6745, 330, 'gems', 'gemBlue20'),
            this.physics.add.sprite(7412, 292, 'gems', 'gemPink10'),
            this.physics.add.sprite(7412, 210, 'gems', 'gemPink10'),
            this.physics.add.sprite(7517, 245, 'gems', 'gemYellow75'),
            this.physics.add.sprite(7624, 210, 'gems', 'gemPink10'),
            this.physics.add.sprite(7624, 292, 'gems', 'gemPink10'),
            this.physics.add.sprite(8117, 335, 'gems', 'gemBlue35'),
            this.physics.add.sprite(8119, 240, 'gems', 'gemYellow45'),
            this.physics.add.sprite(8502, 335, 'gems', 'gemBlue35'),
            this.physics.add.sprite(8504, 240, 'gems', 'gemYellow45'),
            this.physics.add.sprite(8760, 288, 'gems', 'gemPink70'),
            this.physics.add.sprite(8955, 215, 'gems', 'gemPink55'),
            this.physics.add.sprite(8955, 335, 'gems', 'gemBlue50'),
            this.physics.add.sprite(9407, 285, 'gems', 'gemYellow45'),
            this.physics.add.sprite(9610, 285, 'gems', 'gemYellow45'),
            this.physics.add.sprite(9610, 215, 'gems', 'gemPink55'),
            this.physics.add.sprite(9885, 212, 'gems', 'gemBlue5'),
            this.physics.add.sprite(9885, 285, 'gems', 'gemBlue5'),
            this.physics.add.sprite(10122, 212, 'gems', 'gemYellow15'),
            this.physics.add.sprite(10122, 285, 'gems', 'gemYellow15'),
            this.physics.add.sprite(10362, 212, 'gems', 'gemPink10'),
            this.physics.add.sprite(10362, 285, 'gems', 'gemPink10'),
            this.physics.add.sprite(10690, 335, 'gems', 'gemBlue65'),
            this.physics.add.sprite(10980, 260, 'gems', 'gemPink40'),
            this.physics.add.sprite(11200, 300, 'gems', 'gemPink40'),
            this.physics.add.sprite(11365, 260, 'gems', 'gemYellow60'),
            this.physics.add.sprite(11551, 225, 'gems', 'gemBlue5'),
            this.physics.add.sprite(11910, 205, 'gems', 'gemPink10'),
            this.physics.add.sprite(11910, 255, 'gems', 'gemPink40'),
            this.physics.add.sprite(11910, 337, 'gems', 'gemPink55'),
            this.physics.add.sprite(12383, 332, 'gems', 'gemYellow75'),
            this.physics.add.sprite(12550, 205, 'gems', 'gemYellow75'),
            this.physics.add.sprite(12600, 335, 'gems', 'gemYellow75'),
            this.physics.add.sprite(12880, 235, 'gems', 'gemBlue50'),
            this.physics.add.sprite(13270, 205, 'gems', 'gemBlue5'),
            this.physics.add.sprite(13270, 335, 'gems', 'gemPink40'),
            this.physics.add.sprite(14308, 235, 'gems', 'gemPink55'),
            this.physics.add.sprite(14430, 238, 'gems', 'gemBlue20'),
            this.physics.add.sprite(14430, 332, 'gems', 'gemYellow30'),
            this.physics.add.sprite(14732, 235, 'gems', 'gemBlue50'),
            this.physics.add.sprite(14815, 328, 'gems', 'gemPink70'),
            this.physics.add.sprite(15325, 215, 'gems', 'gemPink40'),
            this.physics.add.sprite(15325, 335, 'gems', 'gemPink40'),
            this.physics.add.sprite(15458, 255, 'gems', 'gemBlue20'),
            this.physics.add.sprite(15560, 255, 'gems', 'gemBlue20'),
            this.physics.add.sprite(15665, 255, 'gems', 'gemBlue20'),
            this.physics.add.sprite(16098, 285, 'gems', 'gemYellow45'),
            this.physics.add.sprite(16238, 215, 'gems', 'gemYellow45'),
            this.physics.add.sprite(16395, 285, 'gems', 'gemPink70'),
            this.physics.add.sprite(16605, 235, 'gems', 'gemBlue20'),
            this.physics.add.sprite(16778, 230, 'gems', 'gemBlue20'),
            this.physics.add.sprite(17065, 260, 'gems', 'gemBlue50'),
            this.physics.add.sprite(17305, 215, 'gems', 'gemPink70'),
            this.physics.add.sprite(17305, 325, 'gems', 'gemBlue5'),
            this.physics.add.sprite(17532, 260, 'gems', 'gemBlue50'),
            this.physics.add.sprite(18435, 245, 'gems', 'gemPink10'),
            this.physics.add.sprite(18515, 205, 'gems', 'gemPink10'),
            this.physics.add.sprite(18515, 245, 'gems', 'gemBlue65'),
            this.physics.add.sprite(18515, 288, 'gems', 'gemPink10'),
            this.physics.add.sprite(18602, 245, 'gems', 'gemPink10'),
            this.physics.add.sprite(19145, 230, 'gems', 'gemYellow15'),
            this.physics.add.sprite(19260, 335, 'gems', 'gemPink55'),
            this.physics.add.sprite(19265, 230, 'gems', 'gemYellow15'),
            this.physics.add.sprite(19385, 230, 'gems', 'gemYellow15'),
            this.physics.add.sprite(19795, 200, 'gems', 'gemBlue20'),
            this.physics.add.sprite(19795, 240, 'gems', 'gemYellow15'),
            this.physics.add.sprite(19795, 285, 'gems', 'gemBlue20'),
            this.physics.add.sprite(19795, 325, 'gems', 'gemYellow15'),
            this.physics.add.sprite(20070, 240, 'gems', 'gemBlue20'),
            this.physics.add.sprite(20070, 280, 'gems', 'gemYellow15'),
            this.physics.add.sprite(20800, 240, 'gems', 'gemPink55'),
            this.physics.add.sprite(20860, 205, 'gems', 'gemBlue5'),
            this.physics.add.sprite(20860, 285, 'gems', 'gemYellow60'),
            this.physics.add.sprite(20920, 240, 'gems', 'gemPink55'),
            this.physics.add.sprite(21410, 335, 'gems', 'gemYellow30'),
            this.physics.add.sprite(21545, 230, 'gems', 'gemPink10'),
            this.physics.add.sprite(21685, 335, 'gems', 'gemYellow30'),
            this.physics.add.sprite(21815, 230, 'gems', 'gemPink10'),
            this.physics.add.sprite(21955, 335, 'gems', 'gemYellow30'),
            this.physics.add.sprite(22502, 285, 'gems', 'gemPink40'),
            this.physics.add.sprite(22680, 325, 'gems', 'gemYellow15'),
            this.physics.add.sprite(22682, 205, 'gems', 'gemBlue65'),
            this.physics.add.sprite(22872, 285, 'gems', 'gemPink40'),
            this.physics.add.sprite(23150, 285, 'gems', 'gemPink25'),
            this.physics.add.sprite(23325, 210, 'gems', 'gemBlue5'),
            this.physics.add.sprite(23505, 285, 'gems', 'gemPink25'),
            this.physics.add.sprite(23680, 210, 'gems', 'gemBlue5'),
            this.physics.add.sprite(23860, 285, 'gems', 'gemPink25'),
            this.physics.add.sprite(24175, 330, 'gems', 'gemYellow15'),
            this.physics.add.sprite(24330, 210, 'gems', 'gemPink55'),
            this.physics.add.sprite(24485, 210, 'gems', 'gemPink55'),
            this.physics.add.sprite(24640, 330, 'gems', 'gemYellow15'),
            this.physics.add.sprite(25090, 338, 'gems', 'gemPink40'),
            this.physics.add.sprite(25300, 200, 'gems', 'gemYellow15'),
            this.physics.add.sprite(25300, 230, 'gems', 'gemYellow15'),
            this.physics.add.sprite(25300, 338, 'gems', 'gemPink40'),
            this.physics.add.sprite(25512, 338, 'gems', 'gemPink40'),
            this.physics.add.sprite(25825, 207, 'gems', 'gemBlue65'),
            this.physics.add.sprite(25975, 310, 'gems', 'gemPink40'),
            this.physics.add.sprite(26305, 310, 'gems', 'gemPink40'),
            this.physics.add.sprite(26450, 207, 'gems', 'gemBlue65'),
            this.physics.add.sprite(26698, 332, 'gems', 'gemPink25'),
            this.physics.add.sprite(26925, 332, 'gems', 'gemPink25'),
            this.physics.add.sprite(27155, 332, 'gems', 'gemPink25'),
            this.physics.add.sprite(27380, 332, 'gems', 'gemPink25'),
            this.physics.add.sprite(28028, 210, 'gems', 'gemYellow15'),
            this.physics.add.sprite(28028, 255, 'gems', 'gemYellow15'),
            this.physics.add.sprite(28028, 305, 'gems', 'gemYellow15'),
            this.physics.add.sprite(28098, 210, 'gems', 'gemYellow15'),
            this.physics.add.sprite(28098, 255, 'gems', 'gemYellow15'),
            this.physics.add.sprite(28098, 305, 'gems', 'gemYellow15'),
            this.physics.add.sprite(28570, 335, 'gems', 'gemPink25'),
            this.physics.add.sprite(28680, 280, 'gems', 'gemYellow30'),
            this.physics.add.sprite(28785, 230, 'gems', 'gemBlue20'),
            this.physics.add.sprite(28895, 230, 'gems', 'gemPink25'),
            this.physics.add.sprite(29000, 280, 'gems', 'gemYellow30'),
            this.physics.add.sprite(29110, 335, 'gems', 'gemBlue20'),
            this.physics.add.sprite(29615, 205, 'gems', 'gemYellow75'),
            this.physics.add.sprite(29615, 335, 'gems', 'gemYellow75'),
            this.physics.add.sprite(29768, 280, 'gems', 'gemPink10'),
            this.physics.add.sprite(29875, 280, 'gems', 'gemPink10'),
            this.physics.add.sprite(30420, 280, 'gems', 'gemBlue5'),
            this.physics.add.sprite(30577, 205, 'gems', 'gemBlue5'),
            this.physics.add.sprite(30577, 325, 'gems', 'gemBlue5'),
            this.physics.add.sprite(30735, 280, 'gems', 'gemBlue5'),
            this.physics.add.sprite(31159, 288, 'gems', 'gemBlue35'),
            this.physics.add.sprite(31375, 205, 'gems', 'gemYellow60'),
            this.physics.add.sprite(31595, 205, 'gems', 'gemYellow60'),
            this.physics.add.sprite(31815, 288, 'gems', 'gemBlue35'),
            this.physics.add.sprite(32045, 300, 'gems', 'gemPink25'),
            this.physics.add.sprite(32220, 300, 'gems', 'gemPink25'),
            this.physics.add.sprite(32355, 210, 'gems', 'gemPink25'),
            this.physics.add.sprite(32485, 300, 'gems', 'gemPink25'),
            this.physics.add.sprite(32690, 300, 'gems', 'gemPink25'),
            this.physics.add.sprite(32898, 282, 'gems', 'gemBlue20'),
            this.physics.add.sprite(33075, 282, 'gems', 'gemBlue20'),
            this.physics.add.sprite(33255, 200, 'gems', 'gemBlue20'),
            this.physics.add.sprite(33435, 282, 'gems', 'gemBlue20'),
            this.physics.add.sprite(33610, 282, 'gems', 'gemBlue20'),
            this.physics.add.sprite(33853, 208, 'gems', 'gemYellow60'),
            this.physics.add.sprite(33985, 240, 'gems', 'gemBlue50'),
            this.physics.add.sprite(34117, 285, 'gems', 'gemPink55'),
            this.physics.add.sprite(34250, 240, 'gems', 'gemBlue50'),
            this.physics.add.sprite(34383, 208, 'gems', 'gemYellow60'),
            this.physics.add.sprite(34728, 205, 'gems', 'gemYellow45'),
            this.physics.add.sprite(34885, 235, 'gems', 'gemYellow45'),
            this.physics.add.sprite(35040, 285, 'gems', 'gemYellow45'),
            this.physics.add.sprite(35195, 335, 'gems', 'gemYellow45'),
            this.physics.add.sprite(35750, 325, 'gems', 'gemBlue5'),
            this.physics.add.sprite(35840, 280, 'gems', 'gemYellow15'),
            this.physics.add.sprite(35930, 205, 'gems', 'gemPink40'),
            this.physics.add.sprite(36020, 280, 'gems', 'gemYellow15'),
            this.physics.add.sprite(36110, 325, 'gems', 'gemBlue5'),
            this.physics.add.sprite(37345, 230, 'gems', 'gemPink25')
        ]

        // Jumps (Not present in Thunder's level)
        this.jumpsArray = [
             // TODO: Add rest of sprites here
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
            this.scene.stop('LevelFour')
        }
    }
}
