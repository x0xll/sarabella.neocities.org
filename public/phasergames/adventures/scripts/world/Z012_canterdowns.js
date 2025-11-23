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
            xPosStart: 66,
            yPosStart: 3
        };

        this.camBound = 
        {
            xBounds: 5736,
            yBounds: 4150
        };

        this.loadBackgrounds(2, 2);
        
        this.load.spineAtlas("ruralskymainAtlas", `./assets/newTiles/ruralsky.atlas`);
        this.load.spineJson("ruralskymainJSON", `./assets/newTiles/ruralsky.json`);

        super.preload();
    }

    create (sharedData)
    {
        this.instantiateBackgrounds(2868, 2075);
        super.create(sharedData);
    }

    update() 
    {
        super.update();
    }
}