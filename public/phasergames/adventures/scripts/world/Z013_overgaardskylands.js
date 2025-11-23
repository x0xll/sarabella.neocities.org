class World_OvergaardSkylands extends ZoneBase
{
    constructor ()
    {
        super('world_overgaardskylands');
    }

    preload ()
    {
        // Global datas of the scene
        this.AREA_NAME = "OvergaardSkylands";
        this.ZONE_ID = "Z013";

        // TODO: may need to set pos in create based on sharedData to know which entry of the scene we are on
        this.playerData = 
        {
            xPosStart: 100,
            yPosStart: 0
        };

        this.loadBackgrounds(2, 2);
        
        this.load.spineAtlas("ruralskymainAtlas", `./assets/newTiles/ruralsky.atlas`);
        this.load.spineJson("ruralskymainJSON", `./assets/newTiles/ruralsky.json`);

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
    }
}