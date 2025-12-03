class Collectable extends Entity {
    constructor(zoneScene, entityID, startX, startY) {
        super(zoneScene, entityID, startX, startY);


        this.isSpawner = entityID.indexOf("Spawner") > 0

        this.assetPath = `${this.assetPath}/World Elements/Interactables`
        this.load();
    }


    // ------- INITIALIZE ENTITY -------
    /**
     * Loads assets for the entity sprite. Should run in the constructor (during the preload phase of zone scene setup)
     */
    load(fileName = this.entityID) {
        this.zoneScene.load.spineAtlas(`${this.entityID}-atlas`, `${this.assetPath}/${this.entityID}/skeleton.atlas`);
        this.zoneScene.load.spineJson(`${this.entityID}-json`, `${this.assetPath}/${this.entityID}/skeleton.json`);
    }

    /**
     * Instantiates the entity sprite. Should run during the create phase of zone scene setup
     */
    create() {
        this.templateData = {}
        this.templateData.gridFootX = 1 //this.findTemplateValue("gridFootX") // TODO findTemplateValue should return undefined if a value is not found
        this.templateData.gridFootY = 1 //this.findTemplateValue("gridFootY")

        // Add entity data to tiles
        for (let x = 0; x < this.templateData.gridFootX; x++) {
            for (let y = 0; y < this.templateData.gridFootY; y++) {
                let tile = this.zoneScene.getTileAt(this.startPos[0]+x, this.startPos[1]-y)
                switch (this.facingDirection) {
                    case this.FACING_DIRECTIONS.Southwest:
                    case this.FACING_DIRECTIONS.West:
                    case this.FACING_DIRECTIONS.Northwest:
                        tile = this.zoneScene.getTileAt(this.startPos[0]+y, this.startPos[1]-x)
                        break;
                    default:
                        break;
                }
                if (!tile.hasEntity) {
                    tile.hasEntity = []
                }
                tile.hasEntity.push(this.entityID)
            }
        }

        let isoStart = this.gridToIsoMap(this.startPos[0], this.startPos[1]);
        this.sprite = this.zoneScene.add.spine(isoStart.x, isoStart.y, `${this.entityID}-json`, `${this.entityID}-atlas`).setScale();

        this.resetSpriteFacingDirection()
        this.resetSpriteDepth()
    }
    // ------- END INITIALIZE ENTITY -------

    // ------- HELPER FUNCTIONS -------
    interact(interactData) {
        // TODO: Handle interaction
        console.log(`Collecting: ${this.entityID}`);
    }

    findTemplateValue(keys) {
        if (this.isSpawner)
            return this.zoneScene.sharedData.templateManager.findTemplateValue(`${this.entityID}`, keys)
        return super.findTemplateValue(keys);
    }
    // ------- END HELPER FUNCTIONS -------
}