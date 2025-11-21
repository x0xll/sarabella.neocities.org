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
        const game = this;
        game.sharedData = sharedData
        game.tileWidth = 80
        game.xOffset = -320
        game.yOffset = 865
        game.tiles = []
        game.timeManager.startClock()
        game.sharedData.global = 
        {
            AREA_NAME: game.AREA_NAME,
            ZONE_ID: game.ZONE_ID
        }

        // TODO: handle through save data
        game.sharedData.magicTree = {};
        game.sharedData.magicTree.logic = 
        {
            level: 0
        };
        game.sharedData.inventory = 
        {
            logic:
            {
                manager: game.inventory
            }
        }

        initializeQuestDatas(game);

        // Waiting for the zone file to be fully parsed and the images to be loaded before starting the world
        function instantiateWorld()
        {            
            instantiateZoneWorld();

            // TODO : Instantiate entities (player, npcs, plants)
            game.playerObj.instantiatePlayerSprites();
        }

        // Instantiation the images from the parsed zone xml
        function instantiateZoneWorld()
        {            
            game.tiles = {}

            // Column
            for (var y = 0; y < game.zoneParsed[0].length; y++)
            {
                game.tiles[y] = {}
                // Row
                for (var x = 0; x < game.zoneParsed[0][y].length; x++)
                {
                    var cellValue = game.zoneParsed[0][y][x];

                    // We get the actual visual id
                    if (game.zoneParsed[1][cellValue] === undefined)
                    {
                        console.error("Tile isn't defined: " + cellValue);
                        continue;
                    }
                    
                    let tile = game.add.spine((x*game.tileWidth/2)+(y*game.tileWidth/2)+game.xOffset, (y*game.tileWidth/4)-(x*game.tileWidth/4)+game.yOffset, `${game.zoneParsed[1][cellValue].file}JSON`, `${game.zoneParsed[1][cellValue].file}Atlas`);
                    
                    game.timeManager.setTile(tile, cellValue)
                    
                    tile.setDepth((game.zoneParsed[0][y][x].length - x) + y - game.zoneParsed[1][cellValue].depth)

                    tile.parsedData = game.zoneParsed[1][cellValue]
                    game.tiles[y][x] = tile
                }
            }
        }
        
        // TODO : Create the isometric grid
        instantiateWorld();
        game.playerObj.move();
        game.timeManager.renderDayNight()
    }

    update() 
    {
        const game = this;

        game.playerObj.updatePlayer();
        game.timeManager.updateTime();

        //debug_DrawTriggerQuest(game);
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
        this.playerObj = new Player(this, this.playerData.xPosStart, this.playerData.yPosStart);
        this.timeManager = new TimeManager(this);    
        this.inventory = new InventoryManager(this);
    }

    loadBackgrounds(xSize, ySize)
    {
        for (let x = 0; x < xSize; x++)
        {
            for (let y = 0; y < ySize; y++)
            {
                this.load.image(`BG${x}${y}`, `./assets/extracted/Backgrounds/${this.ZONE_ID}_${x}x${y}.jpg`)
            }
        }
    }

    instantiateBackgrounds(xSize, ySize, xOffset, yOffset)
    {
        this.backgrounds = [];

        for (let x = 0; x < xSize; x++)
        {
            for (let y = 0; y < ySize; y++)
            {
                this.add.image(xOffset * x, yOffset * y, `BG${x}${y}`).setOrigin(0, 0).setDepth(-1000);
                let bg = this.add.image(xOffset * x, yOffset * y, `BG${x}${y}`).setOrigin(0, 0).setDepth(-1000).setAlpha(.75);
                this.backgrounds.push(bg);
            }
        }
    }

    goToNextZone(sceneKey)
    {
        this.sharedData.worldToLoad = sceneKey;
        this.scene.start("common_load", this.sharedData);
    }
}