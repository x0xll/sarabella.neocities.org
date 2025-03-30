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

            // console.log(game.zoneParsed);

            // Column
            for (var x = 0; x < game.zoneParsed[0].length; x++)
            {
                // Row
                for (var y = 0; y < game.zoneParsed[0][x].length; y++)
                {
                    var cellValue = game.zoneParsed[0][x][y].trim();

                    // Nothing to place on this tile
                    if (cellValue === "x" || cellValue === ".") continue;

                    // We get the actual visual id
                    if (game.zoneParsed[1][cellValue] === undefined)
                    {
                        console.error("Tile isn't defined: " + cellValue);
                        continue;
                    }

                    var visuals = game.zoneParsed[1][cellValue].visual;
                    var visualIds = game.zoneParsed[1][cellValue].visualIds;

                    for (var i = 0; i < game.zoneParsed[1][cellValue].visualIds.length; i++)
                    {
                        // We need to load the visual
                        if (game.sceneVisuals[visualIds[i]] === undefined)
                        {
                            // TODO : Would probably be best to setup the tiles in tilemaps/atlas instead of having each of them solo for loading
                            // Would need to check more in details which elements are actually used in each world
                            // So we can optimize as much as possible the loading
                            // We would however also need to take into account the animated sprites, and the day/nigth variations of each

                            // The visual was not yet loaded -> load it now
                            // TODO : handle animations, for now only static images
                            // TODO : handle day/nigth variants
                            switch(visualIds[i])
                            {
                                default:
                                    game.load.image(visualIds[i], `${LEVEL_ASSETS_PATH}${game.AREA_NAME}/${visualIds[i]}/1.png`);
                                    break;
                                // Need to handle the tiles that are not part of the same tileset as the "default" ones. 
                                // Could we find a cleaner way / easier to update way to handle this?
                                case "Overlay_ExitNE":
                                    game.load.image(visualIds[i], `${LEVEL_ASSETS_PATH}Common/Exits/ExitNE/1.png`);
                                    break;
                            }

                            game.sceneVisuals[visualIds[i]] = visuals[visualIds[i]];
                        }
                    }
                }
            }

            game.zoneImgLoaded = true;
        }

        // TODO : Load entities (npcs, player, plants, etc.)
        this.load.image("Player", `./assets/extracted/TestCharacter.png`)
        this.load.image("BG1", `./assets/extracted/Backgrounds/Z001_0x0.jpg`)
        this.load.image("BG2", `./assets/extracted/Backgrounds/Z001_1x0.jpg`)

        loadZoneFromXMLDatas();
    }

    create ()
    {
        const game = this;

        // Adding BG as reference
        game.add.image(0, 0, 'BG1').setOrigin(0, 0).setDepth(-1000)
        game.add.image(1500, 0, 'BG2').setOrigin(0, 0).setDepth(-1000)

        // Waiting for the zone file to be fully parsed and the images to be loaded before starting the world
        function instantiateWorld()
        {
            if (!game.zoneImgLoaded)
            {
                window.setTimeout(instantiateWorld, 100); // Is there a better way to handle this? Maybe a callback instead?
                return;
            }
            
            instantiateZoneWorld();
        }

        // TODO : Instantiate backgrounds

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

                    var visuals = game.zoneParsed[1][cellValue].visual;           
                    var visualIds = game.zoneParsed[1][cellValue].visualIds;

                    for (var i = 0; i < game.zoneParsed[1][cellValue].visualIds.length; i++)
                    {
                        // The visual was not loaded... Do we try loading it again here or do we just cancel this image?
                        if (game.sceneVisuals[visualIds[i]] === undefined)
                        {
                            console.error("Tilemap sprite not yet loaded.. " + cellValue);
                            return;
                        }
    
                        // We place the visual on the scene
                        // TODO: Figure out the actual position.
                        // As of now the position looks off on screen, so there must be some type of offset to add somewhere
                        // Each tile seems to have a "grid" child, and some skin/ground nodes also seems to have transform infos
                        // We probably need to read those and pass them alongside the tileDatas in the parser
                        // Then use them to correctly place each image in the world
                        let tileWidth = 40
                        let tileHeight = 80
                        let backgroundXOffset = -320;
                        let backgroundYOffset = 865;

                        let xOffset = (visuals[visualIds[i]].xOffset !== undefined) ? parseInt(visuals[visualIds[i]].xOffset) : 0;
                        let yOffset = (visuals[visualIds[i]].yOffset !== undefined) ? parseInt(visuals[visualIds[i]].yOffset) : 0;
                        let zOffset = (visuals[visualIds[i]].depthOffset !== undefined) ? parseInt(visuals[visualIds[i]].depthOffset) : 0;

                        // Used to know which tiles are being impacted for building/walking?
                        let widthOffset = (game.zoneParsed[1][cellValue].width) ? parseInt(game.zoneParsed[1][cellValue].width) : 1;
                        let heightOffset = (game.zoneParsed[1][cellValue].height) ? parseInt(game.zoneParsed[1][cellValue].height) : 1;
                        let depthOffset = (game.zoneParsed[1][cellValue].depth) ? parseInt(game.zoneParsed[1][cellValue].depth) : 1;

                        game.add.image((y * tileWidth) + (x * tileWidth) + backgroundXOffset + xOffset + widthOffset, (x * tileWidth / 2) - (y * tileWidth / 2) + backgroundYOffset + yOffset + heightOffset, visualIds[i])
                        .setOrigin(.5, (visuals[visualIds[i]].visualType === "grounds") ? .5 : 1)
                        .setScale(
                            (visuals[visualIds[i]].scaleX !== undefined) ? visuals[visualIds[i]].scaleX : 1,
                            (visuals[visualIds[i]].scaleY !== undefined) ? visuals[visualIds[i]].scaleY : 1)
                        .setScrollFactor(1)
                        .setDepth(zOffset + depthOffset)
                    }
                }
            }
        }

        // TODO : Instantiate entities (player, npcs, plants)
        this.player = this.physics.add.image(100, 100, 'Player').setScale(0.25, 0.25)
        this.cameras.main.startFollow(this.player, true).setBounds(0, 0, 3000, 1600);

        this.target = {x: 0, y: 0}
        // When the user releases the screen...
        this.input.on('pointerup', (pointer) => {
            // Get the WORLD x and y position of the pointer
            const {worldX, worldY} = pointer;
            
            // Assign the world x and y to our vector
            this.target.x = worldX;
            this.target.y = worldY;
    
            // Start moving player towards the target
            this.physics.moveToObject(this.player, this.target, 800);
        });

        // TODO : Create the isometric grid
        
        instantiateWorld();
    }

    update() {
        // If the player is moving...
        if (this.player.body.speed > 0) {
          // Calculate it's distance to the target
          const d = Math.sqrt(Math.pow(this.player.x-this.target.x, 2) + Math.pow(this.player.y-this.target.y, 2));
          
          // If it's close enough,
          if (d < 10) {
            // Reset it's body so it stops
            this.player.body.reset(this.target.x, this.target.y);
          }
        }
      }
}