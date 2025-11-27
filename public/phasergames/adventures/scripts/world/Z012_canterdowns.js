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

        // These values are to offset the tile grid for the map
        this.xOffset = -1380
        this.yOffset = 1905

        this.playerData = 
        {
            xPosStart: 62,
            yPosStart: 20
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
        // Set pos based on previous zone to know which entry of the scene we are on
        this.sceneEntryPoints = {
            "Z001": [62, 5]
        }
        super.create(sharedData);
    }

    update() 
    {
        super.update();
    }
}