class LevelFour extends Phaser.Scene 
{

    levelEnd = 37440
    levelTime = 67
    canUnlockNext = true
    addLevelRef = false

    constructor ()
    {
        super({ key: 'LevelFour' });
    }

    preload ()
    {
        this.load.atlas('horse4', './images/horseThunder.png', './images/horse.json');
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
        this.horseshoe = this.physics.add.sprite(19827, 251, 'horseshoe', '1')

        // Gems
        this.gemsArray = [
            // TODO: Add rest of sprites here
        ]

        // Jumps
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
