class Entity {
    FACING_DIRECTIONS = {
        Northeast: 'ne',
        East: 'e',
        Southeast: 'se',
        South: 's',
        Southwest: 'sw',
        West: 'w',
        Northwest: 'nw'
    }
    SPRITE_TYPES = {
        noSprite: 0,
        stillImage: 1,
        atlas: 2,
        spine: 3
    }
    
    assetPath = "./assets/extracted"
    spriteScale = 1

    constructor(zoneScene, entityID, startX, startY, facingDirection) {
        this.zoneScene = zoneScene;

        let entityCount = 0
        for (let [key] of Object.entries(this.zoneScene.entities)) {
            if (key.includes(entityID)) {entityCount++}
        }
        this.entityKey = entityCount > 0 ? entityID+entityCount : entityID
        this.zoneScene.entities[this.entityKey] = this

        this.entityID = entityID;
        this.startPos = [parseInt(startX), parseInt(startY)];
        this.facingDirection = facingDirection
    }

    // ------- INITIALIZE ENTITY -------
    /**
     * Loads assets for the entity sprite. Should run in the constructor (during the preload phase of zone scene setup)
     */
    load(fileName = this.entityID) {
        this.zoneScene.load.image(`${this.entityID}`, `${this.assetPath}/${fileName}.png`);

        // Spine version for ref
        // this.zoneScene.load.spineAtlas(`${this.entityID}-atlas`, `${assetPath}/${this.entityID}/skeleton.atlas`);
        // this.zoneScene.load.spineJson(`${this.entityID}-json`, `${assetPath}/${this.entityID}/skeleton.json`);
    }

    /**
     * Instantiates the entity sprite. Should run during the create phase of zone scene setup
     */
    create() {
        let isoStart = this.gridToIsoMap(this.startPos[0], this.startPos[1]);
        this.sprite = this.zoneScene.add.image(isoStart.x, isoStart.y, `${this.entityID}`).setScale();

        this.resetSpriteFacingDirection()
        this.resetSpriteDepth()
        // Spine version for ref
        // this.sprite = this.zoneScene.add.spine(isoStart.x, isoStart.y, `${this.entityID}-json`, `${this.entityID}-atlas`);
    }

    update() {}
    // ------- END INITIALIZE ENTITY -------

    // ------- SPRITE PLACEMENT IN ZONE ------
    /**
     * Sets the sprite position on the grid
     * @param {*} x 
     * @param {*} y 
     */
    setSpritePosition(x, y) {
        if (this.sprite === undefined) return
        const pos = this.gridToIsoMap(x, y)
        this.sprite.setPosition(pos.x, pos.y);
    }
    
    /**
     * Makes the entity sprite face in its current facing direction
     */ 
    resetSpriteFacingDirection() {
        if (this.sprite === undefined) return

        if (this.sprite.skeleton !== undefined && 
            (this.sprite.skeleton.data.slots[0].name.includes("ne") ||
            this.sprite.skeleton.data.slots[0].name.includes("nw") ||
            this.sprite.skeleton.data.slots[0].name.includes("se") ||
            this.sprite.skeleton.data.slots[0].name.includes("sw")))
        {
            const slots = ["sw", "se", "nw", "ne"]

            for (let i = 0; i < slots.length; i++)
            {
                let slot = this.sprite.skeleton.findSlot(slots[i]);
                if (slots[i] === this.facingDirection)
                {
                    slot.color.a = 1;
                }
                else
                {
                    slot.color.a = 0;
                }
            }
            return;
        }

        switch (this.facingDirection) {
            case this.FACING_DIRECTIONS.Southwest:
            case this.FACING_DIRECTIONS.West:
            case this.FACING_DIRECTIONS.Northwest:
                this.sprite.setScale(-this.spriteScale, this.spriteScale)
                break;
        
            default:
                this.sprite.setScale(this.spriteScale, this.spriteScale)
                break;
        }
    }

    /**
     * Place sprite at correct depth within the scene
     */
    resetSpriteDepth() {
        if (this.sprite === undefined) return
        let gridPosition = this.isoToGridMap(this.sprite.x, this.sprite.y)
        this.sprite.setDepth((7 - gridPosition.x) + gridPosition.y)
    }

    /**
     * Updates sprite based on conditions such as day/night or plant growth stage
     */
    updateSprite() {
        if (this.sprite && this.sprite.skeleton) {
            if (this.zoneScene.timeManager.isDay) { 
                this.zoneScene.timeManager.changeTint(this.sprite.skeleton, 1, 1, 1, 0, 1)
            } else {
                this.zoneScene.timeManager.changeTint(this.sprite.skeleton, 0.4, 0.6, 0.8, 0, .75)
            }
        } else if (this.sprite) {
            if (this.zoneScene.timeManager.isDay) { 
                this.sprite.clearTint()
            } else {
                this.sprite.setTint('0x6699cc')
            }
        }
    }

    /**
     * Updates sprite based on the current variation. Mostly for placeable objects
     */
    updateSpriteVariant(variantData)
    {
        if (this.sprite === undefined ||
            this.sprite.skeleton === undefined ||
            this.sprite.skeleton.data === undefined
        ) {return;}
        let skinData = this.sprite.skeleton.data.findSkin(variantData);
        if (skinData === undefined || skinData === null) {return;}

        const skin = new spine.Skin("custom");
        skin.addSkin(skinData);
        
        this.sprite.skeleton.setSkin(skin);
        this.resetSpriteFacingDirection();
    }
    // ------- END SPRITE PLACEMENT IN ZONE -------

    
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