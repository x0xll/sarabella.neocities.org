class World_FountainPlaza extends ZoneBase
{
    constructor ()
    {
        super('world_fountainplaza');
    }

    preload ()
    {
        // Global datas of the scene
        this.AREA_NAME = "FountainPlaza";
        this.ZONE_ID = "Z007";

        // TODO: may need to set pos in create based on sharedData to know which entry of the scene we are on
        this.playerData = 
        {
            xPosStart: 100,
            yPosStart: 0
        };

        this.loadBackgrounds(2, 1);
        
        this.load.spineAtlas("castletownmainAtlas", `./assets/newTiles/castletown.atlas`);
        this.load.spineJson("castletownmainJSON", `./assets/newTiles/castletown.json`);

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