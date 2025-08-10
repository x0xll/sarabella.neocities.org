class Player
{
    facingDirection = {
        North: '_n',
        Northeast: '_ne',
        East: '_e',
        Southeast: '_se',
        South: '_s',
        Southwest: '_sw',
        West: '_w',
        Northwest: '_nw'
    }
    pathList = []
    pathIndex = 0

    constructor(phaserScene, startX, startY)
    {
        this.PLAYER_SPEED = 800;
        this.phaserScene = phaserScene;
        this.startPos = [startX, startY];

        this.loadPlayerSprites();
    }

    // ------- INITIALIZE PLAYER -------
    /**
     * Loads assets for player sprites. Should run during the preload phase of scene setup
     */
    loadPlayerSprites()
    {
        this.phaserScene.load.image("Player", `./assets/extracted/TestCharacter.png`)
    }

    /**
     * Instantiates player sprite, camera and cursor indicator. Should run during the create phase of scene setup
     */
    instantiatePlayerSprites()
    {
        let isoStart = this.gridToIsoMap(this.startPos[0], this.startPos[1])
        this.phaserScene.player = this.phaserScene.physics.add.image(isoStart.x, isoStart.y, 'Player').setScale(0.25, 0.25).setOrigin(0.5, 1)
        this.phaserScene.cameras.main.startFollow(this.phaserScene.player, true).setBounds(0, 0, 3000, 1600);
        this.cursor = this.phaserScene.add.polygon(0, 0, [0,0, 0,0, 0,0, 0,0], 0x808080).setAlpha(0).setStrokeStyle(1, 0x303030).setFillStyle(0x808080, 0.5);
        this.aStar = new AStar(this.phaserScene.tiles);
    }

    // ------- END INITIALIZE PLAYER -------

    // ------- START MOVEMENT -------
    /**
     * Handles player (and cursor indicator) movement within the level
     * Player can move by clicking a valid (tile) position on the level
     * Should run during the create phase of scene setup
     */
    move()
    {
        let zoneTiles = this.phaserScene.tiles
        this.target = {x: this.phaserScene.player.x, y: this.phaserScene.player.y}

        // Move cursor
        // TODO: Hide when mouse is outside of level view (e.g. do not react when hovering over HUD buttons or dialogue menus)
        this.phaserScene.input.on('pointermove', (pointer) => {
            // Get the WORLD x and y position of the pointer
            const {worldX, worldY} = pointer;
            
            // Convert coordinates
            let gridTarget = this.isoToGridMap(worldX, worldY)
            gridTarget = {x: Math.round(gridTarget.x), y: Math.round(gridTarget.y)}

            // Check if position is valid
            if((0 <= gridTarget.y && gridTarget.y <= Object.keys(zoneTiles).length) && (0 <= gridTarget.x && gridTarget.x <= Object.keys(zoneTiles[gridTarget.y]).length) && (zoneTiles[gridTarget.y][gridTarget.x].data.walkable === 'true')){
                // Move cursor to target position
                let isoTarget = this.gridToIsoMap(Math.round(gridTarget.x), Math.round(gridTarget.y+1))
                const polygon = [
                    isoTarget.x+40, isoTarget.y,
                    isoTarget.x, isoTarget.y+20,
                    isoTarget.x-40, isoTarget.y,
                    isoTarget.x, isoTarget.y-20
                ];
                this.cursor.setTo(polygon).setAlpha(0.5)
                this.cursor.setDepth((Object.keys(this.phaserScene.tiles[gridTarget.y][gridTarget.x]).length - gridTarget.x) + gridTarget.y-30)
            } else {
                this.cursor.setAlpha(0)
            }
        });


        // Moves the player on pointerup event
        // TODO: Add pathfinding so the player moves completely on the grid.
        // This might be useful here: https://www.geeksforgeeks.org/rat-in-a-maze/
        // TODO: Check that mouse is not outside of level view (e.g. do not react when clicking HUD buttons or dialogue menus)
        this.phaserScene.input.on('pointerup', (pointer) => {
            // Prevent moving when dialogue box is open
            if (this.phaserScene.dialogueBox.open ||
                this.phaserScene.questManager.journal.open) 
                return;

            // Get the grid x and y position of the target
            const {worldX, worldY} = pointer;
            let gridTarget = this.isoToGridMap(worldX, worldY)

            // Add new destination
            this.nextX = gridTarget.x
            this.nextY = gridTarget.y
            this.hasNext = true;
            this.pathList.push(this.FindPathToNextDestination())
        });
    }

    /**
     * Updates player sprite and movement throughout gameplay. Should be called during the update phase of scene setup
     */
    updatePlayer() {        
        if ( this.pathList[0] === null ) {
            this.pathList.shift()
        } else if (this.pathList.length > 0 && this.pathList[0].length > 0) {
            // Set new target position
            let target = this.pathList[0][this.pathIndex]
            let isoTarget = this.gridToIsoMap(Math.round(target.x), Math.round(target.y))
            this.target.x = isoTarget.x;
            this.target.y = isoTarget.y;

            // Face correct direction
            this.setPlayerFacing(this.target.x, this.target.y)

            // Start moving player towards the target
            this.phaserScene.physics.moveToObject(this.phaserScene.player, this.target, this.PLAYER_SPEED);
            // TODO: Change player animation (walk, need animated sprite first)
        }
        this.checkIfReachedDestination()
    }

    /**
     * If close to target, stop the player at target position and recheck sprite depth
     */
    checkIfReachedDestination()
    {
        if (this.phaserScene.player.body.speed > 0) {
            const distanceFromTarget = this.distanceBetweenPoints(this.phaserScene.player.x, this.phaserScene.player.y, this.target.x, this.target.y)
            if (distanceFromTarget < 20) {
                this.phaserScene.player.body.reset(this.target.x, this.target.y);
                this.pathIndex++
                if (this.pathList.length > 0 && this.pathIndex === this.pathList[0].length ) {
                    this.pathList.shift()
                    this.pathIndex = 0
                    // TODO: Change player animation (idle, need animated sprite first)
                }
            }
            this.updatePlayerSpriteDepth()
        }
    }

    /**
     * Makes the player sprite face in the direction of a target point
     * @param {number} targetDirectionX The x coordinate of the target to look towards
     * @param {number} targetDirectionY  The x coordinate of the target to look towards
     */ 
    setPlayerFacing(targetDirectionX, targetDirectionY)
    {
        if (targetDirectionX > this.phaserScene.player.x) {
            this.phaserScene.player.setScale(-0.25, 0.25)
        } else {
            this.phaserScene.player.setScale(0.25, 0.25)
        }

        // TODO: add facing backwards or forwards once sprite is updated to include it
    }
        
    FindPathToNextDestination() {
        let path = null
        if(this.hasNext) {
            this.onPathIndex = 0;
            let playerGridPosition = this.isoToGridMap(this.phaserScene.player.x, this.phaserScene.player.y)
            path = this.aStar.Calculate(playerGridPosition.x, playerGridPosition.y, this.nextX, this.nextY);
            return path
        }
    }

    /**
     * Place player sprite at correct depth within the scene
     */
    updatePlayerSpriteDepth() {
        let gridPosition = this.isoToGridMap(this.phaserScene.player.x, this.phaserScene.player.y)
        this.phaserScene.player.setDepth((Object.keys(this.phaserScene.tiles[gridPosition.y][gridPosition.x]).length - gridPosition.x) + gridPosition.y-30)
    }
    // ------- END MOVEMENT -------

    
    // ------- HELPER FUNCTIONS -------
    /**
     * Takes grid coordinatetes and converts them to the corresponding isometric coordinates on the level map
     * @param {number} x The grid x coordinate
     * @param {number} y The grid y coordinate
     * @returns {object} An object {x, y} with the isometric-based x and y coordinates
     */
    gridToIsoMap(x, y) {
        let isoX = (x*this.phaserScene.tileWidth/2)+(y*this.phaserScene.tileWidth/2)+this.phaserScene.xOffset
        let isoY = (y*this.phaserScene.tileWidth/4)-(x*this.phaserScene.tileWidth/4)+this.phaserScene.yOffset
         return {x: isoX, y: isoY}
    }

    /**
     * Takes isometric coordinatetes and converts them to the corresponding grid coordinates (tile position) on the level map
     * @param {number} x The ismometric x coordinate
     * @param {number} y The ismometric y coordinate
     * @returns {object} An object {x, y} with the grid-based x and y coordinates
     */
    isoToGridMap(x, y) {
        let gridX = (-2 * (y-this.phaserScene.yOffset) + (x-this.phaserScene.xOffset)) / this.phaserScene.tileWidth
        let gridY = (2 * (y-this.phaserScene.yOffset) + (x-this.phaserScene.xOffset)) / this.phaserScene.tileWidth
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

    /**
     * 
     * @returns true if the player is moving, false if not
     */
    isMoving()
    {
        return this.phaserScene.player.body.speed > 0;
    }
}