class World_CanterFarm extends ZoneBase
{
    constructor ()
    {
        super('world_canterfarm');
    }

    preload ()
    {
        // Global datas of the scene
        this.AREA_NAME = "CanterFarms";
        this.ZONE_ID = "Z001";

        // TODO: may need to set pos in create based on sharedData to know which entry of the scene we are on
        this.playerData = 
        {
            xPosStart: 17,
            yPosStart: 3
        };

        this.loadBackgrounds(2, 1);

        this.load.spineAtlas("canterfarmsmainAtlas", `./assets/newTiles/canterfarmsmain.atlas`);
        this.load.spineJson("canterfarmsmainJSON", `./assets/newTiles/canterfarmsmain.json`);
        this.load.spineAtlas("Ti021bAtlas", `./assets/newTiles/Ti021b.atlas`);
        this.load.spineJson("Ti021bJSON", `./assets/newTiles/Ti021b.json`);

        super.preload();
    }

    create (sharedData)
    {
        this.instantiateBackgrounds(2, 1, 1500, 0);
        super.create(sharedData);
    }

    update() 
    {
        super.update();

        // TEST
        var spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceBar.on('down', () => {
            this.goToNextZone("world_canterdowns");
        });
    }
}