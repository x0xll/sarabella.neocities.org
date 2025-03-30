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
            const ZONE_XML_NAME = ZONE_XML_PATH + "Z001_test.xml"; 
            var zoneObj = await loadXML(ZONE_XML_NAME);
            game.zoneParsed = parseZoneXML(zoneObj);

            // console.log(game.zoneParsed);

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

                    cellValue = game.zoneParsed[1][cellValue].visual;

                    // We need to load the visual
                    if (game.sceneVisuals[cellValue] == undefined)
                    {
                        // TODO : Would probably be best to setup the tiles in tilemaps/atlas instead of having each of them solo for loading
                        // Would need to check more in details which elements are actually used in each world
                        // So we can optimize as much as possible the loading
                        // We would however also need to take into account the animated sprites, and the day/nigth variations of each

                        // The visual was not yet loaded -> load it now
                        // TODO : handle animations, for now only static images
                        // TODO : handle day/nigth variants
                        switch(cellValue)
                        {
                            default:
                                var img = game.load.image(cellValue, `${LEVEL_ASSETS_PATH}${game.AREA_NAME}/${cellValue}/1.png`);
                                break;
                            // Need to handle the tiles that are not part of the same tileset as the "default" ones. 
                            // Could we find a cleaner way / easier to update way to handle this?
                            case "Overlay_ExitNE":
                                var img = game.load.image(cellValue, `${LEVEL_ASSETS_PATH}Common/Exits/ExitNE/1.png`);
                                break;
                        }

                        // TODO : When we add the img in the scene we seem to need some more informations for the transforms
                        // Could it be smart to pass those datas from the zoneParsed[1] item to the game.sceneVisuals[cellValue]
                        // Instead of the img object (which as of now isn't useful and is just a placeholder to not have the key go to undefined)
                        // The sceneVisuals is already shared in the full scene, which would allow us to not on top of that share the whole of the 
                        // zoneParsed, considering we don't need most of them after we have set everything (or at least we don't need the grid datas)
                        game.sceneVisuals[cellValue] = img;
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
        game.add.image(0, 0, 'BG1').setOrigin(0, 0) 
        game.add.image(1500, 0, 'BG2').setOrigin(0, 0) 

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

                    cellValue = game.zoneParsed[1][cellValue].visual;

                    // The visual was not loaded... Do we try loading it again here or do we just cancel this image?
                    if (game.sceneVisuals[cellValue] == undefined)
                    {
                        console.error("Tilemap sprite not yet loaded.. " + cellValue);
                        continue;
                    }

                    // We place the visual on the scene
                    // TODO: Figure out the actual position.
                    // As of now the position looks off on screen, so there must be some type of offset to add somewhere
                    // Each tile seems to have a "grid" child, and some skin/ground nodes also seems to have transform infos
                    // We probably need to read those and pass them alongside the tileDatas in the parser
                    // Then use them to correctly place each image in the world
                    let tileWidth = 30
                    game.add.image(-200+y*tileWidth+x*tileWidth, 1000+x*tileWidth/2-y*tileWidth, cellValue).setOrigin(0, 0) 
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