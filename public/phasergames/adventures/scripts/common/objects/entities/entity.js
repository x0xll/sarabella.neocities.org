class Entity {
    FACING_DIRECTIONS = {
        Northeast: '_ne',
        East: '_e',
        Southeast: '_se',
        South: '_s',
        Southwest: '_sw',
        West: '_w',
        Northwest: '_nw'
    }
    
    assetPath = "./assets/extracted"
    spriteScale = 1
    facingDirection = this.FACING_DIRECTIONS.Southeast

    constructor(zoneScene, entityID, startX, startY) {
        this.zoneScene = zoneScene;
        this.zoneScene.entities[entityID] = this
        this.entityID = entityID;
        this.startPos = [startX, startY];
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
        const pos = this.gridToIsoMap(x, y)
        this.sprite.setPosition(pos.x, pos.y);
    }
    
    /**
     * Makes the entity sprite face in its current facing direction
     */ 
    resetSpriteFacingDirection() {
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
        let gridPosition = this.isoToGridMap(this.sprite.x, this.sprite.y)
        this.sprite.setDepth((Object.keys(this.zoneScene.tiles[gridPosition.y][gridPosition.x]).length - gridPosition.x) + gridPosition.y-30)
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