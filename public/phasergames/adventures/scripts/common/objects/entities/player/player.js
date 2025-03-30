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
        let isoStart = this.gridToIsoMap(this.startPos[0], this.startPos[1])
        this.phaserScene.player = this.phaserScene.physics.add.image(isoStart.x, isoStart.y, 'Player').setScale(0.25, 0.25).setOrigin(0.5, 1)
        this.phaserScene.cameras.main.startFollow(this.phaserScene.player, true).setBounds(0, 0, 3000, 1600);
        this.cursor = this.phaserScene.add.polygon(0, 0, [0,0, 0,0, 0,0, 0,0], 0x808080).setAlpha(0).setStrokeStyle(1, 0x303030).setFillStyle(0x808080, 0.5);
    }

    // ------- END INITIALIZE PLAYER -------

    // ------- START MOVEMENT -------
    move(zoneTiles)
    {
        this.target = {x: this.phaserScene.player.x, y: this.phaserScene.player.y}

        // Move cursor
        this.phaserScene.input.on('pointermove', (pointer) => {
            // Get the WORLD x and y position of the pointer
            const {worldX, worldY} = pointer;
            
            // Convert coordinates
            let gridTarget = this.isoToGridMap(worldX, worldY)
            gridTarget = {x: Math.round(gridTarget.x), y: Math.round(gridTarget.y)}

            // Check if position is valid
            let isWalkable = zoneTiles[gridTarget.y][gridTarget.x].data.walkable === 'true'
            let isInXBounds = 0 <= gridTarget.x && gridTarget.x <= Object.keys(zoneTiles[gridTarget.y]).length
            let isInYBounds = 0 <= gridTarget.y && gridTarget.y <= Object.keys(zoneTiles).length

            if(isWalkable && isInXBounds && isInYBounds){
                // Move cursor to target position
                let isoTarget = this.gridToIsoMap(Math.round(gridTarget.x), Math.round(gridTarget.y+1))
                const polygon = [
                    isoTarget.x+40, isoTarget.y,
                    isoTarget.x, isoTarget.y+20,
                    isoTarget.x-40, isoTarget.y,
                    isoTarget.x, isoTarget.y-20
                ];
                this.cursor.setTo(polygon).setAlpha(0.5)
            } else {
                this.cursor.setAlpha(0)
            }
        });


        // When the user releases the screen...
        this.phaserScene.input.on('pointerup', (pointer) => {
            // Get the WORLD x and y position of the pointer
            const {worldX, worldY} = pointer;
            
            // Convert coordinates
            let gridTarget = this.isoToGridMap(worldX, worldY)
            gridTarget = {x: Math.round(gridTarget.x), y: Math.round(gridTarget.y)}
            let isoTarget = this.gridToIsoMap(Math.round(gridTarget.x), Math.round(gridTarget.y))

            // Check if position is valid
            let isWalkable = zoneTiles[gridTarget.y][gridTarget.x].data.walkable === 'true'
            let isInXBounds = 0 <= gridTarget.x && gridTarget.x <= Object.keys(zoneTiles[gridTarget.y]).length
            let isInYBounds = 0 <= gridTarget.y && gridTarget.y <= Object.keys(zoneTiles).length

            if(isWalkable && isInXBounds && isInYBounds){
                // Set new target position
                this.target.x = isoTarget.x;
                this.target.y = isoTarget.y;

                // Face correct direction
                if (this.target.x > this.phaserScene.player.x) {
                    this.phaserScene.player.setScale(-0.25, 0.25)
                } else {
                    this.phaserScene.player.setScale(0.25, 0.25)
                }
                // Start moving player towards the target
                this.phaserScene.physics.moveToObject(this.phaserScene.player, this.target, this.PLAYER_SPEED);
            }
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

    
    // ------- HELPER FUNCTIONS -------
    gridToIsoMap(x, y) {
        let isoX = (x*this.phaserScene.tileWidth/2)+(y*this.phaserScene.tileWidth/2)+this.phaserScene.xOffset
        let isoY = (y*this.phaserScene.tileWidth/4)-(x*this.phaserScene.tileWidth/4)+this.phaserScene.yOffset
         return {x: isoX, y: isoY}
    }

    isoToGridMap(x, y) {
        let gridX = (-2 * (y-this.phaserScene.yOffset) + (x-this.phaserScene.xOffset)) / this.phaserScene.tileWidth
        let gridY = (2 * (y-this.phaserScene.yOffset) + (x-this.phaserScene.xOffset)) / this.phaserScene.tileWidth
        return {x: gridX, y: gridY}
    }
}