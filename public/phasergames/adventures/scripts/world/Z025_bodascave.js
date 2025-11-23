class World_BodasCave extends ZoneBase
{
    constructor ()
    {
        super('world_bodascave');
    }

    preload ()
    {
        // Global datas of the scene
        this.AREA_NAME = "bodascave";
        this.ZONE_ID = "Z025";

        // TODO: may need to set pos in create based on sharedData to know which entry of the scene we are on
        this.playerData = 
        {
            xPosStart: 100,
            yPosStart: 0
        };

        this.loadBackgrounds(2, 2);
        
        this.load.spineAtlas("forestcavemainATLAS", `./assets/newTiles/forestcave.atlas`);
        this.load.spineJson("forestcavemainJSON", `./assets/newTiles/forestcave.json`);

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