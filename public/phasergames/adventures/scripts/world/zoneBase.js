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
        this.sharedData.zoneTileData

        if (sharedData.timeTrackedEntities === undefined) {
            sharedData.timeTrackedEntities = {}
            sharedData.timeTrackedEntities[this.zoneConfig.ID] = {}
        } else if (sharedData.timeTrackedEntities[this.zoneConfig.ID] === undefined) {
            sharedData.timeTrackedEntities[this.zoneConfig.ID] = {}
        }
        if (sharedData.spawnedEntities === undefined) {
            sharedData.spawnedEntities = {}
            sharedData.spawnedEntities[this.zoneConfig.ID] = {}
        } else if (sharedData.spawnedEntities[this.zoneConfig.ID] === undefined) {
            sharedData.spawnedEntities[this.zoneConfig.ID] = {}
        }

        this.sharedData.questManager.phaserScene = this
    }

    preload ()
    {
        this.timeManager = new TimeManager(this);
        this.zoneParsed = parseZoneXML(this.sharedData.zoneTileData); 
        this.loadEntitiesData();
        this.loadBackgrounds(this.zoneConfig.backgroundCountX, this.zoneConfig.backgroundCountY, this.zoneConfig.ID)

        this.zoneConfig.tileAssets.forEach(assetName => {
            this.load.spineAtlas(`${assetName}Atlas`, `${TILE_ASSETS_PATH}${assetName}/skeleton.atlas`);
            this.load.spineJson(`${assetName}JSON`, `${TILE_ASSETS_PATH}${assetName}/skeleton.json`);
        });
    }

    create (sharedData)
    {
        const zone = this;
        zone.sharedData = sharedData
        zone.tileWidth = 80
        zone.tiles = []
        zone.timeManager.startClock()

        this.instantiateBackgrounds(zone.zoneConfig.backgroundXOffset, zone.zoneConfig.backgroundYOffset); 
        this.instantiateZoneWorld();
        zone.timeManager.renderDayNight()

        this.instantiateEntities();
    }

    update() 
    {
        const zone = this;

        zone.entities.player.update();
        zone.timeManager.updateTime();
        zone.sharedData.prevZone = this.zoneConfig.ID

        //debug_DrawTriggerQuest(zone);

        // Telport between zones
        // TODO Save entity data when teleporting between zones (so spawned items don't reset)
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

        // TODO create a base templateEntity class to use for all entities that use a template for their logic
        if (this.sharedData.templateManager.NPCLocations[this.zoneConfig.ID]) {
            for (let [key] of Object.entries(this.sharedData.templateManager.NPCLocations[this.zoneConfig.ID])) {
                let entityPos = this.sharedData.templateManager.NPCLocations[this.zoneConfig.ID][key]
                new TemplateEntity(this, key, entityPos[0], entityPos[1], entityPos[2])
            }
        }

        const zone = this
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

                if (tileData.entities) {
                    new TemplateEntity(zone, tileData.entities, x, y)
                }
            }
        }

        const spawnedEntities = structuredClone(this.sharedData.spawnedEntities[this.zoneConfig.ID]);
        this.sharedData.spawnedEntities[this.zoneConfig.ID] = {}

        for (let [key] of Object.entries(spawnedEntities)) {
            const entity = spawnedEntities[key]
            this.spawnEntity(entity.template, entity.gridX, entity.gridY, false)
        }
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
                    let spriteName = undefined;
                    try {
                        // We do not show the pink square since we are showing the actual element
                        if ((tileData.entities !== undefined && tileData.entities.indexOf("Spawner") <= 0) || tileData.entities === undefined)
                        {
                            let skins;
                            if (tileData.grounds !== undefined)
                            {
                                skins = tileData.grounds.split(',');
                            }
                            if (tileData.skins !== undefined)
                            {
                                let skinData = tileData.skins.split(',');
                                if (skins === undefined)
                                    skins = skinData;
                                else
                                {
                                    for(let i = 0; i < skinData.length; i++)
                                    {
                                        skins.push(skinData[i]);
                                    }
                                }
                            }

                            for (let i = 0; i < skins.length; i++)
                            {                   
                                let skinArray = (skins[i].indexOf("Sk") > -1) ? zone.zoneParsed.map[0].skins[0] : zone.zoneParsed.map[0].grounds[0];
                                let skinData = skinArray[skins[i]];
                                spriteName = skinData.className;

                                let file = undefined;

                                if (zone.zoneConfig.tileAssets.length > 1)
                                {
                                    let index = zone.zoneConfig.tileAssets.indexOf(spriteName);
                                    if (index > -1)
                                    {
                                        file = zone.zoneConfig.tileAssets[index];
                                    }
                                    else
                                    {
                                        for (let i = 0; i < zone.zoneConfig.tileAssets.length; i++)
                                        {
                                            let cachedSpine = zone.cache.json.get(zone.zoneConfig.tileAssets[i] + "JSON").skins;

                                            for (let j = 0; j < cachedSpine.length; j++)
                                            {
                                                if (cachedSpine[j].name !== spriteName)
                                                {
                                                    if (cachedSpine[j].name.includes(spriteName) && 
                                                        cachedSpine[j].name === spriteName + "/day")
                                                    {
                                                        file = zone.zoneConfig.tileAssets[i];
                                                        break;
                                                    }
                                                    continue;
                                                }
                                                file = zone.zoneConfig.tileAssets[i];
                                                break;
                                            }

                                            if (file !== undefined)
                                                break;
                                        }
                                    }
                                }
                                else
                                    file = zone.zoneConfig.tileAssets[0];

                                tile[skins[i]] = zone.add.spine((x*zone.tileWidth/2)+(y*zone.tileWidth/2)+zone.zoneConfig.tileXOffset, (y*zone.tileWidth/4)-(x*zone.tileWidth/4)+zone.zoneConfig.tileYOffset, `${file}JSON`, `${file}Atlas`);
                                zone.timeManager.setTile(tile[skins[i]], spriteName)
                                tile[skins[i]].setDepth((rowCells[x].length - x) + y - ((tileData.gridSize !== undefined) ? tileData.gridSize[0].depth : 0))

                                let scaleX = 1;
                                let scaleY = 1;
                                let offsetX = 0;
                                let offsetY = 0;
                                if (skinData !== undefined)
                                {
                                    if (skinData.scaleX !== undefined) {scaleX = parseInt(skinData.scaleX);}
                                    if (skinData.scaleY !== undefined) {scaleY = parseInt(skinData.scaleY);}

                                    if (skinData.x !== undefined) {offsetX = parseInt(skinData.x);}
                                    if (skinData.y !== undefined) {offsetY = parseInt(skinData.y);}
                                }

                                tile[skins[i]].setScale(scaleX, scaleY);
                                tile[skins[i]].setPosition(tile[skins[i]].x + offsetX, tile[skins[i]].y + offsetY);

                                // TODO: Find a better way to check this
                                if (tile[skins[i]].skeleton.skin.attachments.length === 0)
                                {
                                    console.error(`Spine sprite could not be instantiated! Please ensure the files for the tile are available: ${cellValue}`)
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`Spine sprite could not be instantiated! Please ensure the files for the tile are available: ${cellValue} - ${spriteName}\nError Message: ${error}`)
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

    spawnEntity(template, gridX, gridY, runCreate = true, zoneID = this.zoneConfig.ID, instanceIdentifier = undefined) {
        let spawnedEntity = new TemplateEntity(this, template, gridX, gridY, "se", zoneID === this.zoneConfig.ID, runCreate)
        this.sharedData.spawnedEntities[zoneID][spawnedEntity.entityKey] = {template: template, gridX: gridX, gridY: gridY, instID: instanceIdentifier}
    }
    // ------- END HELPER FUNCTIONS -------
}