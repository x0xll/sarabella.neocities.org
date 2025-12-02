class Character extends Entity {
    constructor(zoneScene, entityID, startX, startY) {
        super(zoneScene, entityID, startX, startY);

        this.assetPath = `${this.assetPath}/Characters`
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
        // this.facingDirection = this.FACING_DIRECTIONS.Southwest

        // Set template
        this.template = this.zoneScene.sharedData.templateManager.getTemplate(`${this.entityID}Template`)
        if (this.template) {
            this.templateData = {}
            this.templateData.gridFootX = this.findTemplateValue(["GridPosition", 0, "gridFootX", 0, "text"])
            this.templateData.gridFootY = this.findTemplateValue(["GridPosition", 0, "gridFootY", 0, "text"])
            this.templateData.isBlocked = this.findTemplateValue(["GridPosition", 0, "isBlocked", 0, "text"])
            // console.log(this.template)

            // x = 1, y = 2
        }

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


        // Set idle animations
        this.idleAnimations = []
        this.sprite.skeleton.data.animations.forEach(animation => {
            if (animation.name.includes("idle")) this.idleAnimations.push(animation.name)
        });


        this.resetSpriteFacingDirection()
        this.resetSpriteDepth()
    }
    // ------- END INITIALIZE ENTITY -------

    // ------- HELPER FUNCTIONS -------
    interact(interactData) {
        // TODO add actual interactions
        this.zoneScene.sharedData.questManager.tryTriggerQuest(this.zoneScene, this)
    }

    findTemplateValue(keysArray) {
        let template = this.template;
            
            for (let keyindex = 0; keyindex < keysArray.length; keyindex++) {
                const key = keysArray[keyindex];
                if (!template[key]) continue
                template = template[key]
            }
        return template
    }
    // ------- END HELPER FUNCTIONS -------
}