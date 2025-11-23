class World_Cottage01 extends ZoneBase
{
    constructor ()
    {
        super('world_cottage01');
    }

    preload ()
    {
        // Global datas of the scene
        this.AREA_NAME = "Cottage 01";
        this.ZONE_ID = "R001";

        // TODO: may need to set pos in create based on sharedData to know which entry of the scene we are on
        this.playerData = 
        {
            xPosStart: 10,
            yPosStart: 0
        };

        this.camBound = 
        {
            xBounds: 1040,
            yBounds: 696
        };

        this.loadBackgrounds(1, 1);

        this.load.spineAtlas("canterfarmsmainAtlas", `./assets/newTiles/canterfarmsmain.atlas`);
        this.load.spineJson("canterfarmsmainJSON", `./assets/newTiles/canterfarmsmain.json`);

        super.preload();
    }

    create (sharedData)
    {
        this.instantiateBackgrounds(1500, 0);
        super.create(sharedData);
    }

    update() 
    {
        super.update();
    }
}