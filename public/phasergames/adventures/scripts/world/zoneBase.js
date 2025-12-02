class ZoneBase extends Phaser.Scene 
{
    constructor () {
        super({ key: "common_zone" });
    }

    init (sharedData) {
        this.sharedData = sharedData
        // Set zone variables from shared data here (before preload)
        if (sharedData.zoneData[sharedData.worldToLoad]) {
            this.zoneConfig = sharedData.zoneData[sharedData.worldToLoad]
        } else {
            console.error(`Zone config for ${sharedData.worldToLoad} not found! Loading canterfarms instead`)

            this.zoneConfig = sharedData.zoneData["Z001"]
        }
    }

    preload ()
    {
        this.loadEntitiesData();
        this.loadZoneFromXMLData(this.zoneConfig.ID);
        this.loadBackgrounds(this.zoneConfig.backgroundCountX, this.zoneConfig.backgroundCountY, this.zoneConfig.ID)

        this.zoneConfig.tileAssets.forEach(assetName => {
            this.load.spineAtlas(`${assetName}Atlas`, `${TILE_ASSETS_PATH}${assetName}.atlas`);
            this.load.spineJson(`${assetName}JSON`, `${TILE_ASSETS_PATH}${assetName}.json`);
        });

        this.timeManager = new TimeManager(this);
    }

    create (sharedData)
    {
        const zone = this;
        zone.sharedData = sharedData
        zone.tileWidth = 80
        zone.tiles = []
        zone.timeManager.startClock()

        // // TODO : Create the isometric grid
        this.instantiateBackgrounds(zone.zoneConfig.backgroundXOffset, zone.zoneConfig.backgroundYOffset); 
        this.instantiateZoneWorld();
        zone.timeManager.renderDayNight()

        this.instantiateEntities();

        // if (zone.sharedData.hud !== undefined)
        // {
        //     zone.sharedData.hud.ui.manager.updateTexts();            
        // }
    }

    update() 
    {
        const zone = this;

        zone.entities.player.update();
        zone.timeManager.updateTime();
        zone.sharedData.prevZone = this.zoneConfig.ID

        //debug_DrawTriggerQuest(zone);

        // TEST tp
        let pos = zone.isoToGridMap(zone.entities.player.sprite.x, zone.entities.player.sprite.y);
        var cellValue = zone.tiles[pos.y][pos.x];
        if (cellValue.parsedData.entities !== undefined)
        {
            let tile = cellValue.parsedData.id;
            if (this.zoneConfig.sceneExitTiles && this.zoneConfig.sceneExitTiles[tile]) {
                this.goToNextZone(this.zoneConfig.sceneExitTiles[tile])
            }
        }
    }


    // ------- PRELOAD -------
    // Load entities
    loadEntitiesData() {
        this.zoneConfig.sceneEntryPoints

        let playerStartPos = this.zoneConfig.sceneEntryPoints["default"]
        if (this.sharedData !== undefined
            && this.sharedData.prevZone !== undefined
            && this.zoneConfig.sceneEntryPoints[this.sharedData.prevZone]
        ) {
            playerStartPos = this.zoneConfig.sceneEntryPoints[this.sharedData.prevZone]
        }

        this.entities = {}
        new Player(this, playerStartPos[0], playerStartPos[1], this.zoneConfig.camBound.xBounds, this.zoneConfig.camBound.yBounds);

        if (this.sharedData.templateManager.NPCLocations[this.zoneConfig.ID]) {
            for (let [key] of Object.entries(this.sharedData.templateManager.NPCLocations[this.zoneConfig.ID])) {
                let entityPos = this.sharedData.templateManager.NPCLocations[this.zoneConfig.ID][key]
                new Character(this, key, entityPos[0], entityPos[1], entityPos[2])
            }
        }
    }

    // Parse the zone file
    async loadZoneFromXMLData(zoneID) {
        // TODO
        // Temporarily using a modified zone test file because some tiles seems to be able to have multiple grounds and/or skins..
        // We will need to understand how those are supposed to work before being able to reuse the original file
        // const ZONE_XML_NAME = ZONE_XML_PATH + zoneID + ".xml"; 
        // var zoneObj = await loadXML(ZONE_XML_NAME);

        // this.zoneParsed = parseZoneXML(zoneObj);


        this.load.xml(zoneID, `${ZONE_XML_PATH}${zoneID}.xml`);
    }

    loadBackgrounds(xSize, ySize, zoneID) {
        this.backgroundSize =  {
            width: xSize,
            height: ySize
        }

        for (let x = 0; x < this.backgroundSize.width; x++) {
            for (let y = 0; y < this.backgroundSize.height; y++) {
                this.load.image(`BG_${zoneID}_${x}${y}`, `./assets/extracted/Backgrounds/${zoneID}_${x}x${y}.jpg`)
            }
        }
    }
    // ------- END PRELOAD -------


    // ------- CREATE -------
    instantiateBackgrounds(xOffset, yOffset) {
        this.backgrounds = [];

        for (let x = 0; x < this.backgroundSize.width; x++) {
            for (let y = 0; y < this.backgroundSize.height; y++) {
                this.add.image(xOffset * x, yOffset * y, `BG_${this.zoneConfig.ID}_${x}${y}`).setOrigin(0, 0).setDepth(-1000);
                let bg = this.add.image(xOffset * x, yOffset * y, `BG_${this.zoneConfig.ID}_${x}${y}`).setOrigin(0, 0).setDepth(-1000).setAlpha(.75);
                this.backgrounds.push(bg);
            }
        }
    }

    // Instantiation the images from the parsed zone xml
    instantiateZoneWorld() { 
        const zone = this
        this.zoneParsed = parseZoneXML(this.cache.xml.get(this.zoneConfig.ID)); 
        
        zone.tiles = {}

        const levelRows = zone.zoneParsed.map[0].layout[0].levels[0][0].levelRow
        const tiles = zone.zoneParsed.mappedTiles;

        // Column
        for (var y = 0; y < levelRows.length; y++) {
            zone.tiles[y] = {}
            var rowCells = levelRows[y].text.split(",");
            // Row
            for (var x = 0; x < rowCells.length; x++) {
                var cellValue = rowCells[x];
                let tileData = tiles.get(cellValue);

                // We get the actual visual id
                if (tileData === undefined) {
                    console.error("Tile isn't defined: " + cellValue);
                    continue;
                }
                let tile = {}
                if (cellValue !== "x"
                     && cellValue !== "."
                    ) {
                    try {
                        let file = zone.zoneConfig.tileAssets[0]
                        if (tileData.file) {
                            file = tileData.file
                        }
                        tile = zone.add.spine((x*zone.tileWidth/2)+(y*zone.tileWidth/2)+zone.zoneConfig.tileXOffset, (y*zone.tileWidth/4)-(x*zone.tileWidth/4)+zone.zoneConfig.tileYOffset, `${file}JSON`, `${file}Atlas`);
                        zone.timeManager.setTile(tile, cellValue)
                        tile.setDepth((rowCells[x].length - x) + y - tileData.gridSize[0].depth)
                        if (tileData.gridSize[0].scaleX === undefined) {tileData.gridSize[0].scaleX = 1;}
                        if (tileData.gridSize[0].scaleY === undefined) {tileData.gridSize[0].scaleY = 1;}
                        tile.setScale(tileData.gridSize[0].scaleX, tileData.gridSize[0].scaleY);
                    } catch (error) {
                        console.error(`Spine sprite could not be instantiated! Please ensure the files for the tile are available`)
                        console.warn("Note this may happen if the 'file' name for the tile in the zone xml file does not match any of the atlas and json files provided")
                    }
                }

                tile.parsedData = tileData
                zone.tiles[y][x] = tile
            }
        }
    }

    instantiateEntities() {
        // TODO : Instantiate entities (player, npcs, plants)
        for (let [key] of Object.entries(this.entities)) {
            this.entities[key].create();
        }
    }
    // ------- END CREATE -------


    // ------- UPDATE -------
    goToNextZone(sceneKey) {
        this.sharedData.timePausedAt = this.timeManager.getCurrentTime()
        this.sharedData.worldToLoad = sceneKey;
        this.scene.start("common_load", this.sharedData);
    }
    // ------- END UPDATE -------
    

    // ------- HELPER FUNCTIONS -------
    /**
     * Takes grid coordinatetes and converts them to the corresponding isometric coordinates on the level map
     * @param {number} x The grid x coordinate
     * @param {number} y The grid y coordinate
     * @returns {object} An object {x, y} with the isometric-based x and y coordinates
     */
    gridToIsoMap(x, y) {
        let isoX = (x*this.tileWidth/2)+(y*this.tileWidth/2)+this.zoneConfig.tileXOffset
        let isoY = (y*this.tileWidth/4)-(x*this.tileWidth/4)+this.zoneConfig.tileYOffset
         return {x: isoX, y: isoY}
    }

    /**
     * Takes isometric coordinatetes and converts them to the corresponding grid coordinates (tile position) on the level map
     * @param {number} x The ismometric x coordinate
     * @param {number} y The ismometric y coordinate
     * @returns {object} An object {x, y} with the grid-based x and y coordinates
     */
    isoToGridMap(x, y) {
        let gridX = (-2 * (y-this.zoneConfig.tileYOffset) + (x-this.zoneConfig.tileXOffset)) / this.tileWidth
        let gridY = (2 * (y-this.zoneConfig.tileYOffset) + (x-this.zoneConfig.tileXOffset)) / this.tileWidth
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

    getTileAt(gridX, gridY) {
        return this.tiles[gridY][gridX]
    }

    getEntitiesAt(gridX, gridY) {
        return this.tiles[gridY][gridX].hasEntity
    }
    // ------- END HELPER FUNCTIONS -------
}