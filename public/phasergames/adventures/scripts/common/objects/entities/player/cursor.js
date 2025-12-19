class Cursor {
    MODE = {
        "normal": 1,
        "placing": 2,
        "planting": 3
    }
    RADIUS = 50

    constructor(zoneScene) {
        this.zoneScene = zoneScene
        this.load()
    }


    // ------- MAIN FUNCTIONS -------
    load() {
        this.zoneScene.load.atlas(`contextMenu`, `${ROOT_ASSETS_PATH}UI/Context Menu/ToolsIcons.png`, `${ROOT_ASSETS_PATH}UI/Context Menu/ToolsIcons.json`);
    }

    create() {
        this.cursor = this.zoneScene.add.polygon(0, 0, [0,0, 0,0, 0,0, 0,0], 0x808080).setStrokeStyle(1, 0x303030).setFillStyle(0x808080, 0.5);
        this.cursorMode = this.MODE.normal
        this.gridFoot = {x: 1, y: 1}
        this.circle = this.zoneScene.add.circle(0, 0, this.RADIUS);
            this.circle.setStrokeStyle(1, 0xe5d9c3);
        this.sprites = {
            Give: this.zoneScene.add.sprite(0, 0, `contextMenu`, "Give_1"),
            Apply: this.zoneScene.add.sprite(0, 0, `contextMenu`, "Use_1"),
            Take: this.zoneScene.add.sprite(0, 0, `contextMenu`, "Take_1"),
            Trash: this.zoneScene.add.sprite(0, 0, `contextMenu`, "Trash_1"),
            Talk: this.zoneScene.add.sprite(0, 0, `contextMenu`, "Talk_1"),
            Shop: this.zoneScene.add.sprite(0, 0, `contextMenu`, "Shop_1"),
            Move: this.zoneScene.add.sprite(0, 0, `contextMenu`, "Move_1"),
            Interact: this.zoneScene.add.sprite(0, 0, `contextMenu`, "Play_1"),
            Brush: this.zoneScene.add.sprite(0, 0, `contextMenu`, "Brush_1"),
            Water: this.zoneScene.add.sprite(0, 0, `contextMenu`, "Water_1"),
            Uproot: this.zoneScene.add.sprite(0, 0, `contextMenu`, "Uproot_1"),
            Collect: this.zoneScene.add.sprite(0, 0, `contextMenu`, "Collect_1"),
            Variant: this.zoneScene.add.sprite(0, 0, `contextMenu`, "ChangeVariant_1"),
            Rotate: this.zoneScene.add.sprite(0, 0, `contextMenu`, "Rotate_1"),
        }
        this.#move()


        for (let [key] of Object.entries(this.sprites)) {
            this.sprites[key].setInteractive().setOrigin(.6, .6).setScale(.5).setAlpha(0)
            this.sprites[key].depth = 100
            this.sprites[key].on('pointerover', (pointer) => { 
                    const sprite = this.sprites[key]
                    sprite.setFrame(sprite.frame.name.replace(/.$/, "2") )
                });
            this.sprites[key].on('pointerout', (pointer) => { 
                    const sprite = this.sprites[key]
                    sprite.setFrame(sprite.frame.name.replace(/.$/, "1") )
                });
            this.sprites[key].on('pointerdown', (pointer) => { 
                    const sprite = this.sprites[key]
                    sprite.setFrame(sprite.frame.name.replace(/.$/, "3") )
                });
            this.sprites[key].on('pointerup', (pointer) => { 
                    const sprite = this.sprites[key]

                    for (let [key] of Object.entries(this.sprites)) {
                        this.sprites[key].setFrame(this.sprites[key].frame.name.replace(/.$/, "1") ).setAlpha(0)
                        this.circle.setAlpha(0)
                    }
                    this.zoneScene.entities[this.entityTarget].interact({interactionType: key})
                });
        }
    }

    #move() {
        // Move cursor
        // TODO: Hide when mouse is outside of level view (e.g. do not react when hovering over HUD buttons or dialogue menus)
        this.zoneScene.input.on('pointermove', (pointer) => {
            // Ignore if a UI is open
            if (this.zoneScene !== undefined &&
                this.zoneScene.sharedData !== undefined &&
                this.zoneScene.sharedData.global !== undefined &&
                this.zoneScene.sharedData.global.uiOpen)
            {
                this.cursor.setAlpha(0)
                return;
            }

            // Get the WORLD x and y position of the pointer
            const {worldX, worldY} = pointer;
            // Convert coordinates
            let gridTarget = this.isoToGridMap(worldX, worldY)
            gridTarget = {x: Math.round(gridTarget.x), y: Math.round(gridTarget.y)}

            if (this.lastPos !== undefined && this.lastPos.x === gridTarget.x && this.lastPos.y === gridTarget.y) return

            this.lastPos = gridTarget

            // Check if position is valid
            if(!this.#runCursorChecks(gridTarget, [this.#isInvalidTile])) {
                const item = this.zoneScene.sharedData.inventory.currentItem
                switch (this.cursorMode) {
                    case this.MODE.placing:
                            // TODO add actual checks
                            this.#moveCursorToGridTarget(gridTarget)
                            this.gridFoot = {
                                x: parseInt(item.width),
                                y: parseInt(item.height)
                            }
                            if (this.canPlace(gridTarget, item)) {
                                this.#setColourGreen()

                            } else {
                                this.#setColourRed()
                            }
                        break;
                    case this.MODE.planting:
                            // TODO add actual checks
                            this.#moveCursorToGridTarget(gridTarget)
                            this.gridFoot = {
                                x: parseInt(item.plantWidth),
                                y: parseInt(item.plantHeight)
                            }
                            if (this.canPlant(gridTarget, item)) {
                                this.#setColourGreen()
                                // this.plantSuccess()
                            } else {
                                this.#setColourRed()
                            }
                        break;
                
                    default:
                        // case this.MODE.normal:
                        gridTarget = this.#findEntityGridFootData(gridTarget)
                        this.#moveCursorToGridTarget(gridTarget)
                        this.#setColourNormal()
                        break;
                }
            } else {
                this.cursor.setAlpha(0)
            }
        });
    }
    #moveCursorToGridTarget(gridTarget, gridFoot = this.gridFoot) {

        // Move cursor to target position
        const isoTarget = this.gridToIsoMap(Math.round(gridTarget.x), Math.round(gridTarget.y+1))
        
        const gridFootX_xOffset = 20 * (gridFoot.x-1)
        const gridFootX_yOffset = 10 * (gridFoot.x-1)
        const gridFootY_xOffset = 20 * (gridFoot.y-1)
        const gridFootY_yOffset = 10 * (gridFoot.y-1)
        
        const polygon = [
            [isoTarget.x + gridFootX_xOffset + gridFootY_xOffset, isoTarget.y+20 + gridFootX_yOffset + gridFootY_yOffset], // bottom
            [isoTarget.x-40 + gridFootX_xOffset - gridFootY_xOffset, isoTarget.y + gridFootX_yOffset - gridFootY_yOffset], // left
            [isoTarget.x +  + (gridFootX_xOffset*3) - gridFootY_xOffset, isoTarget.y-20 - gridFootX_yOffset - gridFootY_yOffset], // top
            [isoTarget.x + 40 + (gridFootX_xOffset*3) + gridFootY_xOffset, isoTarget.y - gridFootX_yOffset + gridFootY_yOffset], // right
        ];

        this.cursor.setTo(polygon).setAlpha(0.5)
        this.cursor.setDepth((37 - gridTarget.x) + gridTarget.y-30)
        // console.log(zoneTiles[gridTarget.y][gridTarget.x])
    }

    #findEntityGridFootData(gridTarget) {
         const entities = this.zoneScene.getEntitiesAt(gridTarget.x, gridTarget.y)
         let newTarget = gridTarget

        if (entities) {
            for (let index = 0; index < entities.length; index++) {
                const entity = this.zoneScene.entities[entities[index]]
                const gridFootX = entity.gridFootX
                const gridFootY = entity.gridFootY
                if (gridFootX !== 1 || gridFootY !==1) {
                    this.gridFoot.x = gridFootX
                    this.gridFoot.y = gridFootY
                    newTarget = {x: entity.startPos[0], y: entity.startPos[1]}
                    return newTarget
                }
            }
        }
        this.gridFoot.x = 1
        this.gridFoot.y = 1

        return newTarget
    }
    #runCursorChecks(gridTarget, filterFunctions, filterContext, gridFoot = this.gridFoot) {
        for (let x = 0; x < gridFoot.x; x++) {
            for (let y = 0; y < gridFoot.y; y++) {

                let gridPos = {x: gridTarget.x+x, y: gridTarget.y-y}
                for (let index = 0; index < filterFunctions.length; index++) {
                    
                    const filter = filterFunctions[index];
                    if (filter(this, gridPos, filterContext)) {
                        return true
                    }
                }
            }
        }
        return false
    }
    reset() {
        this.gridFoot = { x: 1, y: 1 }
        this.cursorMode = this.MODE.normal
        this.#setColourNormal()

        for (let [key] of Object.entries(this.sprites)) {
            this.sprites[key].setAlpha(0)
        }
        this.circle.setAlpha(0)

        const gridTarget = this.#findEntityGridFootData(this.lastPos)
        this.#moveCursorToGridTarget(gridTarget)
    }

    openInteractionMenu(pos, entities) {
        for (let [key] of Object.entries(this.sprites)) {
            this.sprites[key].setAlpha(0)
        }
        this.circle.setAlpha(0)

        let test = false
        for (let index = 0; index < entities.length; index++) {
            const entity = entities[index];
            const interactions = this.zoneScene.entities[entity].getInteractOptions()
            if (interactions.length > 0) {
                for (let index = 1; index <= interactions.length; index++) {
                    const interaction = interactions[index-1].replace("Command", "").replace("Plant", "").replace("Avatar", "");
                    const theta = ((360/7 * (index - 1))-90) * (Math.PI / 180)
                    this.sprites[interaction].setAlpha(1).setPosition(pos.x + (this.RADIUS * Math.cos(theta)), pos.y + (this.RADIUS * Math.sin(theta)))

                    const plantTest = (this.zoneScene.entities[entity].isWilted
                        || parseInt(this.zoneScene.entities[entity].getTemplateValue(["PlantMovieClip", "stages", "text"])) !== this.zoneScene.entities[entity].currentStage)
                    if (this.zoneScene.entities[entity].isPlant && plantTest) {
                        this.sprites["Collect"].setAlpha(0)
                        this.sprites["Take"].setAlpha(0)
                    }
                    if (!this.zoneScene.entities[entity].canGive()) {
                        this.sprites["Give"].setAlpha(0)
                    }
                    if (!this.zoneScene.entities[entity].canGive(true)) {
                        this.sprites["Apply"].setAlpha(0)
                    }
                    if (this.zoneScene.entities[entity].getTalkData().quests.length === 0) {
                        this.sprites["Talk"].setAlpha(0)
                    }
                }
                for (let [key] of Object.entries(this.sprites)) {
                    if (this.sprites[key].alpha !== 0) {
                        this.circle.setAlpha(1).setPosition(pos.x, pos.y )
                        this.entityTarget = entity
                    }
                }
                test = true
                break
            }
        }
        return test
    }
    // ------- END MAIN FUNCTIONS -------


    // ------- COLOUR FUNCTIONS -------
    #setColourNormal() {
        this.cursor.setStrokeStyle(1, 0x303030).setFillStyle(0x808080, 0.5);
    }
    #setColourRed() {
        this.cursor.setStrokeStyle(1, 0x803030).setFillStyle(0xef7070, 0.9);
    }
    #setColourGreen() {
        this.cursor.setStrokeStyle(1, 0x308030).setFillStyle(0x60ef60, 0.9)
    }
    // ------- END COLOUR FUNCTIONS -------

    
    // ------- FILTER FUNCTIONS -------
    /**
     * Returns true or false based on if the current item can be planted in the provided location
     * @param {*} gridTarget 
     * @param {*} gridFoot 
     */
    canPlant(gridTarget, item = this.zoneScene.sharedData.inventory.currentItem, gridFoot = this.gridFoot) {
        return !this.#runCursorChecks(gridTarget, [this.#isIncorrectSoil], item)
                && !this.#runCursorChecks(gridTarget, [this.#plantingBlocked])
    }
    
    /**
     * Returns true or false based on if the current item can be planted in the provided location
     * @param {*} gridTarget 
     * @param {*} gridFoot 
     */
    canPlace(gridTarget, item = this.zoneScene.sharedData.inventory.currentItem, gridFoot = this.gridFoot) {
        // TODO This is a placeholder. Replace with actual checks
        return !this.#runCursorChecks(gridTarget, [this.#isInvalidTile])
                && !this.#runCursorChecks(gridTarget, [this.#hasEntity])
    }

    #hasEntity(context, gridTarget, filterContext) {
        let tile = context.zoneScene.getTileAt(gridTarget.x, gridTarget.y)
        if (tile.hasEntity) {
            return true
        }
        return false
    }

    #plantingBlocked(context, gridTarget, filterContext) {
        const entities = context.zoneScene.getEntitiesAt(gridTarget.x, gridTarget.y)

        if (entities) {
            for (let index = 0; index < entities.length; index++) {
                const entityID = context.zoneScene.entities[entities[index]].templateID
                if (context.zoneScene.sharedData.templateManager.getTemplateType(entityID) === "plant"
                    || context.zoneScene.sharedData.templateManager.getTemplateType(entityID) === "detritus" 
                ) {
                    return true
                }
            }
        }
        return false
    }

    #isIncorrectSoil(context, gridTarget, filterContext) {
        const entities = context.zoneScene.getEntitiesAt(gridTarget.x, gridTarget.y)
        const soilTarget = filterContext.soilTarget

        if (entities) {
            for (let index = 0; index < entities.length; index++) {
                const entityID = context.zoneScene.entities[entities[index]].templateID
                if (context.zoneScene.sharedData.templateManager.getTemplateValue(entityID, "soilType") === soilTarget) {
                    return false
                }
            }
        }
        return true
    }

    #isInteractive(context, gridTarget, filterContext) {
        // TODO const isInteractive = ?
        // return isInteractive
    }

    #isInvalidTile(context, gridTarget, filterContext) {
        let zoneTiles = context.zoneScene.tiles

        const isValid = zoneTiles[gridTarget.y] !== undefined 
            && zoneTiles[gridTarget.y][gridTarget.x] !== undefined
            && (0 <= gridTarget.y && gridTarget.y <= Object.keys(zoneTiles).length) 
            && (0 <= gridTarget.x && gridTarget.x <= Object.keys(zoneTiles[gridTarget.y]).length) 
            && zoneTiles[gridTarget.y][gridTarget.x].parsedData.id !== "x"
            // && (zoneTiles[gridTarget.y][gridTarget.x].parsedData.walkable === 'true')

        return !isValid
    }

    #isBlocked(context, gridTarget, filterContext) {
        const entities = context.zoneScene.getEntitiesAt(gridTarget.x, gridTarget.y)

        if (entities) {
            for (let index = 0; index < entities.length; index++) {
                const entityID = context.zoneScene.entities[entities[index]].templateID
                if (context.zoneScene.sharedData.templateManager.getTemplateValue(entityID, "isBlocked") === "true") {
                    return true
                }
            }
        }
        return false
    }
    // ------- END FILTER FUNCTIONS -------


    // ------- HELPER FUNCTIONS -------
    /**
     * Takes grid coordinatetes and converts them to the corresponding isometric coordinates on the level map
     * @param {number} x The grid x coordinate
     * @param {number} y The grid y coordinate
     * @returns {object} An object {x, y} with the isometric-based x and y coordinates
     */
    gridToIsoMap(x, y) {
        return this.zoneScene.gridToIsoMap(x, y)
    }

    /**
     * Takes isometric coordinatetes and converts them to the corresponding grid coordinates (tile position) on the level map
     * @param {number} x The ismometric x coordinate
     * @param {number} y The ismometric y coordinate
     * @returns {object} An object {x, y} with the grid-based x and y coordinates
     */
    isoToGridMap(x, y) {
        return this.zoneScene.isoToGridMap(x, y)
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
        return this.zoneScene.distanceBetweenPoints(x1, y1, x2, y2)
    }
    // ------- END HELPER FUNCTIONS -------
}