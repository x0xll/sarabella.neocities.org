class Character extends Entity {
    constructor(zoneScene, entityID, startX, startY, facingDirection) {
        super(zoneScene, entityID, startX, startY, facingDirection);

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

        this.templateData = {}
        this.templateData.gridFootX = this.findTemplateValue(["GridPosition", "gridFootX", "text"])
        this.templateData.gridFootY = this.findTemplateValue(["GridPosition", "gridFootY", "text"])

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


        this.resetSpriteFacingDirection()
        this.resetSpriteDepth()
        this.setAnimations()
    }
    // ------- END INITIALIZE ENTITY -------

    // ------- HELPER FUNCTIONS -------
    interact(interactData) {
        // TODO add actual interactions
        this.zoneScene.sharedData.questManager.tryTriggerQuest(this.zoneScene, this)
    }

    setAnimations() {
        let character = this
        character.animationQueue = []
        character.idleAnimations = []
        character.sprite.skeleton.data.animations.forEach(animation => {
            if (animation.name.includes("idle")) character.idleAnimations.push(animation.name)
        });

        if (character.idleAnimations.length > 0) {
            character.sprite.animationState.setAnimation(0, character.idleAnimations[Math.floor(Math.random()*this.idleAnimations.length)], false)
        }
        

        character.sprite.animationState.addListener({
                // start: (entry) => console.log(`Started animation ${entry.animation.name}`),
                // interrupt: (entry) => console.log(`Interrupted animation ${entry.animation.name}`),
                // end: (entry) => console.log(`Ended animation ${entry.animation.name}`),
                // dispose: (entry) => console.log(`Disposed animation ${entry.animation.name}`),
                complete: function endAnimation(entry) { 
                    if (character.animationQueue.length === 0) {
                        let animation = character.idleAnimations[Math.floor(Math.random()*character.idleAnimations.length)]
                        
                        const delay = randomIntFromInterval(3, 5)
                        character.sprite.animationState.addAnimation(0, animation, false, delay);
                    }
                }
                // event: (entry, event) => console.log(`Custom event for ${entry.animation.name}: ${event.data.name}`)          
             })
    }
    // ------- END HELPER FUNCTIONS -------
}