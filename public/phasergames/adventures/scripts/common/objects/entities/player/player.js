class Player extends Entity {
    pathList = []
    pathIndex = 0
    spriteScale = .25

    constructor(zoneScene, startX, startY, camBoundX, camBoundY) {
        super(zoneScene, "player", startX, startY);

        this.PLAYER_SPEED = 600;
        this.camBounds = [camBoundX, camBoundY];
        this.load("TestCharacter");
    }


    // ------- INITIALIZE PLAYER -------
    /**
     * Instantiates player sprite, camera and cursor indicator. Should run during the create phase of scene setup
     */
    create() {
        let isoStart = this.gridToIsoMap(this.startPos[0], this.startPos[1])
        this.sprite = this.zoneScene.physics.add.image(isoStart.x, isoStart.y, 'player').setScale(this.spriteScale, this.spriteScale).setOrigin(0.5, 1)
        this.zoneScene.cameras.main.startFollow(this.sprite, true).setBounds(0, 0, this.camBounds[0], this.camBounds[1]);
        this.aStar = new AStar(this.zoneScene.tiles, this.zoneScene.entities);
        this.cursor = new Cursor(this.zoneScene)

        this.#move();
        this.resetSpriteDepth()
    }


    /**
     * Updates player sprite and movement throughout gameplay. Should be called during the update phase of scene setup
     */
    update() {  
        if (this.playerMove) {      
            if ( !this.pathList[0] ) {
                this.pathList.shift()
            } else if (this.pathList.length > 0 && this.pathList[0].length > 0) {
                // Set new target position
                let target = this.pathList[0][this.pathIndex]
                let isoTarget = this.gridToIsoMap(Math.round(target.x), Math.round(target.y))
                this.target.x = isoTarget.x;
                this.target.y = isoTarget.y;

                // Face correct direction
                this.setFacingTarget(this.target.x, this.target.y)

                // Start moving player towards the target
                this.zoneScene.physics.moveToObject(this.sprite, this.target, this.PLAYER_SPEED);
                // TODO: Change player animation (walk, need animated sprite first)
            }
                this.#checkIfReachedDestination()
            }
    }
    // ------- END INITIALIZE PLAYER -------


    // ------- SPRITE PLACEMENT IN ZONE ------
    /**
     * Sets the player position on the grid
     * @param {*} x 
     * @param {*} y 
     */
    setSpritePosition(x, y) {
        const pos = this.gridToIsoMap(x, y)
        this.sprite.body.reset(pos.x, pos.y);
    }

    /**
     * Makes the player sprite face in the direction of a target point
     * @param {number} targetDirectionX The x coordinate of the target to look towards
     * @param {number} targetDirectionY  The x coordinate of the target to look towards
     */ 
    setFacingTarget(targetDirectionX, targetDirectionY)
    {
        // TODO: add facing backwards or forwards once sprite is updated to include it
        if (targetDirectionX > this.sprite.x) {
            this.facingDirection = this.FACING_DIRECTIONS.Southwest
        } else {
            this.facingDirection = this.FACING_DIRECTIONS.Southeast
        }

        this.resetSpriteFacingDirection()
    }
    // ------- END SPRITE PLACEMENT IN ZONE ------


    // ------- MOVEMENT LOGIC -------
    /**
     * Handles player (and cursor indicator) movement within the level
     * Player can move by clicking a valid (tile) position on the level
     * Should run during the create phase of scene setup
     */
    #move() {
        this.target = {x: this.sprite.x, y: this.sprite.y}


        // Moves the player on pointerup event
        // TODO: Check that mouse is not outside of level view (e.g. do not react when clicking HUD buttons or dialogue menus)
        this.zoneScene.input.on('pointerdown', async (pointer) => {
            // Prevent interaction when a UI is open
            if (this.zoneScene.sharedData.global.uiOpen) 
                return;

            // Get the grid x and y position of the target
            const {worldX, worldY} = pointer;
            let gridTarget = this.isoToGridMap(worldX, worldY)
            let item = this.zoneScene.sharedData.inventory.currentItem

            switch (this.cursor.cursorMode) {
                case this.cursor.MODE.placing:
                    if (this.cursor.canPlace(gridTarget, item)) {
                        this.zoneScene.sharedData.inventory.manager.removeItem(item.templateID)
                        this.zoneScene.spawnEntity(item.entityTemplate, gridTarget.x, gridTarget.y)
                    } else {
                    }
                    this.zoneScene.sharedData.inventory.currentItem = null
                    this.cursor.reset()
                    break;

                case this.cursor.MODE.planting:
                    if (this.cursor.canPlant(gridTarget, item)) {
                        this.zoneScene.sharedData.inventory.manager.removeItem(item.templateID)
                        this.zoneScene.spawnEntity(item.plantItemID, gridTarget.x, gridTarget.y)
                    } else {
                    }
                    this.zoneScene.sharedData.inventory.currentItem = null
                    this.cursor.reset()
                    break;
            
                default:
                    // Add new destination
                    this.nextX = gridTarget.x
                    this.nextY = gridTarget.y
                    this.hasNext = true;
                    let entities = this.zoneScene.getEntitiesAt(gridTarget.x, gridTarget.y)
                    let test = false
                    if (entities !== undefined) {
                        for (let index = 0; index < entities.length; index++) {
                            const entity = entities[index];
                            test = test || this.zoneScene.entities[entity].interact()
                            if (test) {break}
                        }
                    }
                    if (!test) {
                        this.pathList.push(await this.#findPathToNextDestination())
                    }
                    this.playerMove = true
                    break;
            }
        });
    }

    /**
     * If close to target, stop the player at target position and recheck sprite depth
     */
    #checkIfReachedDestination() {
        this.playerMove = false
        if (this.sprite.body.speed > 0) {
            const distanceFromTarget = this.distanceBetweenPoints(this.sprite.x, this.sprite.y, this.target.x, this.target.y)
            if (distanceFromTarget < 20) {
                this.sprite.body.reset(this.target.x, this.target.y);
                
                // Check if we are in a quest trigger -> if so, we stop further movement and start the quest
                let triggerInfo = this.isoToGridMap(this.target.x, this.target.y);
                    triggerInfo.type = "StopNearTrigger"
                    
                if (triggerInfo.x === this.nextX
                    && triggerInfo.y === this.nextY
                    && this.zoneScene.sharedData.questManager.tryTriggerQuest(this.zoneScene, triggerInfo)
                ) {
                    this.pathList = [];
                    this.pathIndex = 0;
                } else {
                    this.pathIndex++
                }

                if (this.pathList.length > 0 && this.pathIndex === this.pathList[0].length ) {
                    this.pathList.shift()
                    this.pathIndex = 0
                    // TODO: Change player animation (idle, need animated sprite first)
                }
            }
            this.resetSpriteDepth()
        }
        this.playerMove = true
    }
        
    async #findPathToNextDestination() {
        let path = null
        if(this.hasNext) {
            this.onPathIndex = 0;
            let playerGridPosition = this.isoToGridMap(this.sprite.x, this.sprite.y)
            if (playerGridPosition.x === this.nextX && playerGridPosition.y === this.nextY) return null
            path = await this.aStar.Calculate(playerGridPosition.x, playerGridPosition.y, this.nextX, this.nextY);
            
            let lastMatch = null
            if (path === null || path.length === null) {return}
            for (let index = 1; index < path.length; index++) {
                const prevPoint = path[index-1];
                const point = path[index];
                
                if (lastMatch === null || prevPoint[lastMatch] !== point[lastMatch]) {
                    lastMatch = prevPoint["y"] === point["y"] ? "y" : "x"
                } else {
                    path.splice(index-1, 1);
                    index--
                }
            }

            return path
        }
    }
    // ------- END MOVEMENT -------
}