class World_CanterFarm extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'world_canterfarm' });
    }

    preload ()
    {
        const game = this;

        // Global datas of the scene
        game.AREA_NAME = "CanterFarms";

        // Dictionary of the loaded sprites so we only ask it to load each once, depending on the needs
        game.sceneVisuals = {};

        // Zone vars
        game.zoneImgLoaded = false;

        // //TEST LOADING
        // this.load.image("Test", `${LEVEL_ASSETS_PATH}${game.AREA_NAME}/T0053c/1.png`)

        // TODO : Load the background

        // Parse the zone file
        // TODO : See if possible to have this function be in an external file to the scene
        // This would be used on all world scenes, while only changing the zone file url
        async function loadZoneFromXMLDatas()
        {
            // TODO
            // Temporarily using a modified zone test file because some tiles seems to be able to have multiple grounds and/or skins..
            // We will need to understand how those are supposed to work before being able to reuse the original file
            const ZONE_XML_NAME = ZONE_XML_PATH + "Z001.xml"; 
            var zoneObj = await loadXML(ZONE_XML_NAME);
            game.zoneParsed = parseZoneXML(zoneObj);
        }

        // TODO : Load entities (npcs, player, plants, etc.)
        game.playerObj = new Player(game, 17, 3);
        game.timeManager = new TimeManager(game);

        game.load.image("BG1", `./assets/extracted/Backgrounds/Z001_0x0.jpg`)
        game.load.image("BG2", `./assets/extracted/Backgrounds/Z001_1x0.jpg`)

        loadDialogueUI(game);
        loadInventoryUI(game);
        loadQuestJournalUI(game);

        this.load.spineAtlas("canterfarmsmainAtlas", `./assets/newTiles/canterfarmsmain.atlas`);
        this.load.spineJson("canterfarmsmainJSON", `./assets/newTiles/canterfarmsmain.json`);
        this.load.spineAtlas("Ti021bAtlas", `./assets/newTiles/Ti021b.atlas`);
        this.load.spineJson("Ti021bJSON", `./assets/newTiles/Ti021b.json`);

        loadZoneFromXMLDatas();
        initializeQuestDatas(game);
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
        
        instantiateDialogueUI(game);
        initializeQuestJournalUI(game);

        // Adding BG as reference
            game.add.image(0, 0, 'BG1').setOrigin(0, 0).setDepth(-1000),
            game.add.image(1500, 0, 'BG2').setOrigin(0, 0).setDepth(-1000)
        game.backgrounds = [
            game.add.image(0, 0, 'BG1').setOrigin(0, 0).setDepth(-1000).setAlpha(.75),
            game.add.image(1500, 0, 'BG2').setOrigin(0, 0).setDepth(-1000).setAlpha(.75)
        ]

        // Waiting for the zone file to be fully parsed and the images to be loaded before starting the world
        function instantiateWorld()
        {            
            instantiateZoneWorld();

            // TODO : Instantiate entities (player, npcs, plants)
            game.playerObj.instantiatePlayerSprites();

            // TEST DIALOGUE
            //showDialogue(game, {name: "Cade Traveler", id: "C001"}, "Happy day! The bridge is safe and sound thanks to you. Here are some horseshoes for your help. Oh my! It looks like that wolf over there has captured the Starstone otter. Go see if you can help her out.", undefined);

            // TEST INVENTORY
            //showInventory(game);

            // TEST QUEST JOURNAL
            //showQuestJournal(game);
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

                    tile.data = game.zoneParsed[1][cellValue]
                    game.tiles[y][x] = tile
                }
            }
        }
        
        // TODO : Create the isometric grid
        instantiateWorld();
        game.playerObj.move();
        game.timeManager.renderDayNight()

        // TODO: Clean up, this is a temporary quest test
        let spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceBar.on('down', () => 
        {
            /*var status = getQuestStatus(game, "ADS-0000000825", "ADV-0000000899", "QUE-0000002105");

            if (status === QUEST_STATES.WAITING)
                startQuest(game, "ADS-0000000825", "ADV-0000000899", "QUE-0000002105")
            else if (status === QUEST_STATES.STARTED)
            {
                finishQuest(game, "ADS-0000000825", "ADV-0000000899", "QUE-0000002105");
                startQuest(game, "ADS-0000000825", "ADV-0000000902", "QUE-0000002117");
            }*/

            showQuestJournal(game);
        })
    }

    update() 
    {
        const game = this;

        game.playerObj.updatePlayer();
        game.timeManager.updateTime()
    }
}