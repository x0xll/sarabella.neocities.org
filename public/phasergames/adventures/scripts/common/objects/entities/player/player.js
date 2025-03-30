class Player
{
    constructor(phaserScene, startX, startY)
    {
        this.PLAYER_SPEED = 800;
        this.phaserScene = phaserScene;
        this.startPos = [startX, startY];

        this.loadPlayerSprites();
    }

    // ------- INITIALIZE PLAYER -------
    loadPlayerSprites()
    {
        this.phaserScene.load.image("Player", `./assets/extracted/TestCharacter.png`)
    }

    instantiatePlayerSprites()
    {
        this.phaserScene.player = this.phaserScene.physics.add.image(this.startX, this.startY, 'Player').setScale(0.25, 0.25).setOrigin(0.5, 1)
        this.phaserScene.cameras.main.startFollow(this.phaserScene.player, true).setBounds(0, 0, 3000, 1600);
    }

    // ------- END INITIALIZE PLAYER -------

    // ------- START MOVEMENT -------
    move(zoneTiles)
    {
        this.target = {x: 0, y: 0}
        // When the user releases the screen...
        this.phaserScene.input.on('pointerup', (pointer) => {
            // Get the WORLD x and y position of the pointer
            const {worldX, worldY} = pointer;
            
            // Assign the world x and y to our vector
            this.target.x = worldX;
            this.target.y = worldY;
    
            // Start moving player towards the target
            this.phaserScene.physics.moveToObject(this.phaserScene.player, this.target, this.PLAYER_SPEED);
        });
    }

    checkIfReachedDestination()
    {
        // If the player is moving...
        if (this.phaserScene.player.body.speed > 0) {
            // Calculate it's distance to the target
            const d = Math.sqrt(Math.pow(this.phaserScene.player.x-this.target.x, 2) + Math.pow(this.phaserScene.player.y-this.target.y, 2));
            
            // If it's close enough,
            if (d < 20) {
                // Reset it's body so it stops
                this.phaserScene.player.body.reset(this.target.x, this.target.y);
            }
        }
    }
    // ------- END MOVEMENT -------
}