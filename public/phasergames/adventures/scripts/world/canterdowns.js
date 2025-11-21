class World_CanterDowns extends ZoneBase
{
    constructor ()
    {
        super('world_canterdowns');
    }

    preload ()
    {
        // Global datas of the scene
        this.AREA_NAME = "CanterDowns";
        this.ZONE_ID = "Z012";

        // TODO: may need to set pos in create based on sharedData to know which entry of the scene we are on
        this.playerData = 
        {
            xPosStart: 100,
            yPosStart: 0
        };

        this.loadBackgrounds(2, 2);

        super.preload();
    }

    create (sharedData)
    {
        this.instantiateBackgrounds(1500, 1500);
        super.create(sharedData);
    }

    update() 
    {
        super.update();

        // TEST
        var spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceBar.on('down', () => {
            this.goToNextZone("world_canterfarm");
        });
    }
}