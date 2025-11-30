class ZoneBase extends Phaser.Scene 
{
    constructor (sceneKey)
    {
        super({ key: sceneKey });
    }

    preload ()
    {
        this.loadEntitiesData();
        this.loadZoneFromXMLData(this.ZONE_ID);
    }

    create (sharedData)
    {
        const zone = this;
        zone.sharedData = sharedData
        zone.tileWidth = 80
        zone.tiles = []
        zone.timeManager.startClock()
        zone.sharedData.global = 
        {
            AREA_NAME: zone.AREA_NAME,
            ZONE_ID: zone.ZONE_ID
        }

        // Waiting for the zone file to be fully parsed and the images to be loaded before starting the world
        function instantiateWorld()
        {            
            instantiateZoneWorld();

            // TODO : Instantiate entities (player, npcs, plants)
            zone.entities.player.create();
        }

        // Instantiation the images from the parsed zone xml
        function instantiateZoneWorld()
        {            
            zone.tiles = {}

            // Column
            for (var y = 0; y < zone.zoneParsed[0].length; y++)
            {
                zone.tiles[y] = {}
                // Row
                for (var x = 0; x < zone.zoneParsed[0][y].length; x++)
                {
                    var cellValue = zone.zoneParsed[0][y][x];

                    // We get the actual visual id
                    if (zone.zoneParsed[1][cellValue] === undefined) {
                        console.error("Tile isn't defined: " + cellValue);
                        continue;
                    }
                    let tile = {}
                    if (zone.zoneParsed[1][cellValue].id !== "x") {
                        tile = zone.add.spine((x*zone.tileWidth/2)+(y*zone.tileWidth/2)+zone.xOffset, (y*zone.tileWidth/4)-(x*zone.tileWidth/4)+zone.yOffset, `${zone.zoneParsed[1][cellValue].file}JSON`, `${zone.zoneParsed[1][cellValue].file}Atlas`);
                        zone.timeManager.setTile(tile, cellValue)
                        tile.setDepth((zone.zoneParsed[0][y][x].length - x) + y - zone.zoneParsed[1][cellValue].depth)
                    }

                    tile.parsedData = zone.zoneParsed[1][cellValue]
                    zone.tiles[y][x] = tile
                }
            }
        }
        
        // TODO : Create the isometric grid
        instantiateWorld();

        zone.timeManager.renderDayNight()
    }

    update() 
    {
        const zone = this;

        zone.entities.player.update();
        zone.timeManager.updateTime();
        zone.sharedData.prevZone = this.ZONE_ID

        //debug_DrawTriggerQuest(zone);

        // TEST tp
        let pos = zone.isoToGridMap(zone.entities.player.sprite.x, zone.entities.player.sprite.y);
        var cellValue = zone.zoneParsed[0][pos.y][pos.x];
        if (zone.zoneParsed[1][cellValue].entity !== undefined)
        {
            let entity = zone.zoneParsed[1][cellValue].entity;

            if (entity === "Z012a")
                this.goToNextZone("world_canterdowns");
            else if (entity === "R001")
                this.goToNextZone("world_cottage01");
            else if (entity === "Z001a")
                this.goToNextZone("world_canterfarm");
        }
    }
    
    // Parse the zone file
    async loadZoneFromXMLData(zoneID)
    {
        // TODO
        // Temporarily using a modified zone test file because some tiles seems to be able to have multiple grounds and/or skins..
        // We will need to understand how those are supposed to work before being able to reuse the original file
        const ZONE_XML_NAME = ZONE_XML_PATH + zoneID + ".xml"; 
        var zoneObj = await loadXML(ZONE_XML_NAME);
        this.zoneParsed = parseZoneXML(zoneObj);
    }

    // Load entities
    loadEntitiesData()
    {
        this.entities = {}
        new Player(this, this.playerData.xPosStart, this.playerData.yPosStart, this.camBound.xBounds, this.camBound.yBounds);
        this.timeManager = new TimeManager(this);    
    }

    loadBackgrounds(xSize, ySize)
    {
        this.backgroundSize = 
        {
            width: xSize,
            height: ySize
        }

        for (let x = 0; x < this.backgroundSize.width; x++)
        {
            for (let y = 0; y < this.backgroundSize.height; y++)
            {
                this.load.image(`BG_${this.ZONE_ID}_${x}${y}`, `./assets/extracted/Backgrounds/${this.ZONE_ID}_${x}x${y}.jpg`)
            }
        }
    }

    instantiateBackgrounds(xOffset, yOffset)
    {
        this.backgrounds = [];

        for (let x = 0; x < this.backgroundSize.width; x++)
        {
            for (let y = 0; y < this.backgroundSize.height; y++)
            {
                this.add.image(xOffset * x, yOffset * y, `BG_${this.ZONE_ID}_${x}${y}`).setOrigin(0, 0).setDepth(-1000);
                let bg = this.add.image(xOffset * x, yOffset * y, `BG_${this.ZONE_ID}_${x}${y}`).setOrigin(0, 0).setDepth(-1000).setAlpha(.75);
                this.backgrounds.push(bg);
            }
        }
    }

    goToNextZone(sceneKey)
    {
        this.sharedData.worldToLoad = sceneKey;
        this.scene.start("common_load", this.sharedData);
    }

    
    // ------- HELPER FUNCTIONS -------
    /**
     * Takes grid coordinatetes and converts them to the corresponding isometric coordinates on the level map
     * @param {number} x The grid x coordinate
     * @param {number} y The grid y coordinate
     * @returns {object} An object {x, y} with the isometric-based x and y coordinates
     */
    gridToIsoMap(x, y) {
        let isoX = (x*this.tileWidth/2)+(y*this.tileWidth/2)+this.xOffset
        let isoY = (y*this.tileWidth/4)-(x*this.tileWidth/4)+this.yOffset
         return {x: isoX, y: isoY}
    }

    /**
     * Takes isometric coordinatetes and converts them to the corresponding grid coordinates (tile position) on the level map
     * @param {number} x The ismometric x coordinate
     * @param {number} y The ismometric y coordinate
     * @returns {object} An object {x, y} with the grid-based x and y coordinates
     */
    isoToGridMap(x, y) {
        let gridX = (-2 * (y-this.yOffset) + (x-this.xOffset)) / this.tileWidth
        let gridY = (2 * (y-this.yOffset) + (x-this.xOffset)) / this.tileWidth
        return {x: Math.round(gridX), y: Math.round(gridY)}
    }

    /**
     * Finds the distance between two points
     * @param {number} x1 x coordinate of point 1
     * @param {number} y1 y coordinate of point 1
     * @param {number} x2 x coordinate of point 2
     * @param {number} y2 y coordinate of point 2
     * @returns {number} The distance between the given points
     */
    distanceBetweenPoints(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2))
    }
    // ------- END HELPER FUNCTIONS -------
    
}