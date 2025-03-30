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

        //TEST LOADING
        this.load.image("Test", `${LEVEL_ASSETS_PATH}${game.AREA_NAME}/T0053c/1.png`)

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
        game.playerObj = new Player(game, 100, 100);

        game.load.image("BG1", `./assets/extracted/Backgrounds/Z001_0x0.jpg`)
        game.load.image("BG2", `./assets/extracted/Backgrounds/Z001_1x0.jpg`)

        loadDialogueUI(game);
        loadInventoryUI(game);

        this.load.spineAtlas("CanterTilesAtlas", `./assets/newTiles/skeleton.atlas`);
        this.load.spineJson("CanterTilesJSON", `./assets/newTiles/skeleton.json`);

        loadZoneFromXMLDatas();
    }

    create ()
    {
        const game = this;
        game.tileWidth = 80
        game.tiles = []

        // Adding BG as reference
        game.add.image(0, 0, 'BG1').setOrigin(0, 0).setDepth(-1000)
        game.add.image(1500, 0, 'BG2').setOrigin(0, 0).setDepth(-1000)

        // Waiting for the zone file to be fully parsed and the images to be loaded before starting the world
        function instantiateWorld()
        {            
            instantiateZoneWorld();

            // TODO : Instantiate entities (player, npcs, plants)
            game.playerObj.instantiatePlayerSprites();
            game.playerObj.move();

            // TEST DIALOGUE
            //showDialogue(game, {name: "Cade Traveler"}, "Happy day! The bridge is safe and sound thanks to you. Here are some horseshoes for your help. Oh my! It looks like that wolf over there has captured the Starstone otter. Go see if you can help her out.", undefined);

            // TEST INVENTORY
            showInventory(game);
        }

        // Instantiation the images from the parsed zone xml
        function instantiateZoneWorld()
        {
            // TEST ADDING IMAGE
            // TODO : Figure out why commenting on and off the game.add.image below seems to unlock the code
            // There are moments where no images are shown as having been loaded
            // But no errors or warning will appear either
            // Commenting on or off this line usually unlocks things and we get a bunch of error
            // Concerning the other images, or we see all of them being loaded and instantiated correctly
            // Maybe an issue with the amount of images to load? 
            //game.add.image(200, 200, "Test");

            // TODO : Clean up
            // I'm not sure having both those for loops right after the preload ones is the best approach.
            // Adding the images to the scene in preload doesn't seem to work (Phaser limitation?)
            // But going twice through the full grid feels wasteful, especially for larger maps
            // Could we think of a better way to handling this? Maybe a callback for each loaded image to an add function?
            // Or something similar?

            // Column
            for (var x = 0; x < game.zoneParsed[0].length; x++)
            {
                // Row
                for (var y = 0; y < game.zoneParsed[0][x].length; y++)
                {
                    var cellValue = game.zoneParsed[0][x][y];

                    // Nothing to place on this tile
                    if (cellValue === "x" || cellValue === ".") continue;

                    // We get the actual visual id
                    if (game.zoneParsed[1][cellValue] === undefined)
                    {
                        console.error("Tile isn't defined: " + cellValue);
                        continue;
                    }
                    let tile = game.add.spine((y*game.tileWidth/2)+(x*game.tileWidth/2)-320, (x*game.tileWidth/4)-(y*game.tileWidth/4)+865, 'CanterTilesJSON', 'CanterTilesAtlas');
                    
                    const skeletonData = tile.skeleton.data;
                    const skin = new spine.Skin("custom");
                    if (skeletonData.findSkin(cellValue) !== null){
                        skin.addSkin(skeletonData.findSkin(cellValue));
                    }
                               
                    tile.skeleton.setSkin(skin);
                    tile.skeleton.setToSetupPose();

                    game.tiles = {x: {y: tile}}
                }
            }
        }
        
        // TODO : Create the isometric grid
        instantiateZoneWorld();


        instantiateWorld();
    }

    update() 
    {
        const game = this;

        game.playerObj.checkIfReachedDestination();
    }
}