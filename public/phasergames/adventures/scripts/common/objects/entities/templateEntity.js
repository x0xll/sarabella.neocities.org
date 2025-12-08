/**
 * This class is meant to handle all entities that use a template for their configuration.
 * The templates included should be
 */
class TemplateEntity extends Entity {
    SPRITE_TYPES = {
        noSprite: 0,
        stillImage: 1,
        spine: 2
    }

    constructor(zoneScene, templateID, startX, startY, facingDirection = "se", addToCurrentZone = true, loadLate = false) {
        super(zoneScene, templateID, startX, startY, facingDirection);
        this.templateID = templateID
        this.zoneID = zoneScene.zoneConfig.ID

        if (this.getTemplateValue(["Character", "identifier", "text"])) {
            this.characterID = this.getTemplateValue(templateID, ["Character", "identifier", "text"])
        }

        // console.log(this.zoneScene.sharedData.templateManager.getTemplate(this.templateID))

        if (addToCurrentZone && loadLate) {
            zoneScene.load.once('complete', this.create, this);
            this.load();
            zoneScene.load.start();
        } else if (addToCurrentZone) {
            this.load();
        }
    }


    // ------- INITIALIZE ENTITY -------
    /**
     * Loads assets for the entity sprite. Should run in the constructor (during the preload phase of zone scene setup)
     */
    load() {
        // Set asset path
        this.assetPath = `${this.assetPath}/Entities`

        let charName = this.getTemplateValue(["Character", "identifier", "text"])
        if (charName) {
            this.entityID = charName
        }
        this.spriteType = this.#loadSpriteData()
        this.#loadSpawnerData()
    }

    /**
     * Instantiates the entity sprite. Should run during the create phase of zone scene setup
     */
    create() {
        let gridFootX = this.getTemplateValue(["GridPosition", "gridFootX", "text"])
        if ( gridFootX === undefined) { gridFootX = 1}
        let gridFootY = this.getTemplateValue(["GridPosition", "gridFootY", "text"])
        if ( gridFootY === undefined) { gridFootY = 1}

        // Add entity data to tiles
        // TODO get facing direction from Isometric scaleX?
        for (let x = 0; x < gridFootX; x++) {
            for (let y = 0; y < gridFootY; y++) {
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
                tile.hasEntity.push(this.entityKey)
            }
        }


        if (this.spriteType === this.SPRITE_TYPES.spine) {
            try {
                let isoStart = this.gridToIsoMap(this.startPos[0], this.startPos[1]);
                this.sprite = this.zoneScene.add.spine(isoStart.x, isoStart.y, `${this.templateID}-json`, `${this.templateID}-atlas`).setScale();
                this.resetSpriteFacingDirection()
                this.resetSpriteDepth()
                this.setAnimations()
            } catch (error) {
                console.log(`Could not load spine file for ${this.templateID}`)
            }
        } else if (this.spriteType === this.SPRITE_TYPES.stillImage) {
            let isoStart = this.gridToIsoMap(this.startPos[0], this.startPos[1]);
            this.sprite = this.zoneScene.add.image(isoStart.x, isoStart.y, `${this.templateID}`)
            this.resetSpriteFacingDirection()
            this.resetSpriteDepth()
        }

        if (this.isSpawner) {this.#trySpawn()}
    }

    update() {
        this.#trySpawn()
    }
    // ------- END INITIALIZE ENTITY -------


    // ------- LOAD FUNCTIONS -------
    #loadSpriteData(templateID = this.templateID) {
        let spriteClass = this.getTemplateValue(["MovieClip", "className", "text"], templateID)
        let spriteType = this.SPRITE_TYPES.noSprite

        if (spriteClass !== undefined && spriteClass !== "T0179") {
            let folderName = this.getTemplateValue(["MovieClip", "fileName", "text"], templateID)
            folderName = folderName.split("/")
            folderName = folderName[folderName.length - 1].replace(".swf", "")


            if (this.getTemplateValue(["CharacterIdle"], templateID) === undefined
                // || this.zoneScene.sharedData.templateManager.getTemplateType(`${templateID}`) !== "npc"
                ) {
                // TODO actually add this
                // TODO consider having the simple image sprites in one atlas file per swf file. Then, if not in there, we could assume it should use spine instead
                spriteType = this.SPRITE_TYPES.stillImage
                this.zoneScene.load.image(`${templateID}`, `${this.assetPath}/${folderName}/${spriteClass}/1.png`);
            } else {
                spriteType = this.SPRITE_TYPES.spine
                this.zoneScene.load.spineAtlas(`${templateID}-atlas`, `${this.assetPath}/${folderName}/${spriteClass}/skeleton.atlas`);
                this.zoneScene.load.spineJson(`${templateID}-json`, `${this.assetPath}/${folderName}/${spriteClass}/skeleton.json`);
            }
        }
        return spriteType
    }

    #loadSpawnerData() {
        let spawnerData = this.getTemplateValue(["EntitySpawning", "spawnType"])
        if (spawnerData) {
            this.isSpawner = true
        } else {
            this.isSpawner = false
        }
    }
    #trySpawn() {
        const spawnerData = this.getTemplateValue(["EntitySpawning"])

        // Check for day/night spawn conditions
        if (spawnerData.spawnTimeType[0].text !== this.zoneScene.timeManager.getCurrentTimeType()) { 
            return
        }

        // Check spawn time has elapsed
        const timeData = this.zoneScene.sharedData.timeTrackedEntities[this.zoneID][this.entityKey]
        if (timeData !== undefined) {
            let duration = this.zoneScene.timeManager.getCurrentTime() - timeData.startTime
            if (timeData.daysCount > 0) {
                const fullDay = this.zoneScene.timeManager.nightLength + this.zoneScene.timeManager.dayLength
                duration = (fullDay - timeData.startTime) + (timeData.daysCount - 1 * fullDay) + this.zoneScene.timeManager.getCurrentTime()
            }
            if (duration < parseFloat(spawnerData.entitySpawnTime[0].text)) {return}
        } else {
            this.zoneScene.sharedData.timeTrackedEntities[this.zoneID][this.entityKey] = {
                startTime: this.zoneScene.timeManager.getCurrentTime(),
                daysCount: 0
            }
            return
        }

        // Reset spawn time
        this.zoneScene.sharedData.timeTrackedEntities[this.zoneID][this.entityKey] = {
            startTime: this.zoneScene.timeManager.getCurrentTime(),
            daysCount: 0
        }

        // Check if spawning is blocked
        const spawnType = spawnerData.spawnType
        const entities = this.zoneScene.getEntitiesAt(this.startPos[0], this.startPos[1])
        if (entities !== undefined) {
            for (let index = 0; index < entities.length; index++) {
                const entity = this.zoneScene.entities[entities[index]].templateID
                let blocksSpawn = this.getTemplateValue(["GridPosition", "blocksSpawn", "text"], entity)
                if (blocksSpawn === "True") { return }
                for (let index = 0; index < spawnType.length; index++) {
                    if (spawnType[index].text === entity) {return}
                }
            }
        }

        // If all conditions met, try spawning
        const random = Math.random()
        let chanceCounter = 0
        for (let index = 0; index < spawnType.length; index++) {
            const type = spawnType[index];

            chanceCounter = chanceCounter + parseFloat(type.chance)
            if (random <= chanceCounter) {
                this.zoneScene.spawnEntity(type.text, this.startPos[0], this.startPos[1])
                return
            }
        }

    }
    // ------- END LOAD FUNCTIONS -------


    // ------- CREATE FUNCTIONS -------
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
    // ------- END CREATE FUNCTIONS -------


    // ------- COMMAND FUNCTIONS -------
    // These functions are used to handle player interactions as defined in each entity's template
    /**
     * Is used when the player clicks on a tile containing this entity
     * @param {*} interactData any data about the interaction that should be passed in
     */
    interact(interactData) {
        // TODO ignore if template does not include a Click option in the template
        if (this.getTemplateValue(["Click", "name"])) {
            // TODO add actual interactions

            if (this.getTemplateValue(["TalkCommand", "name"])) {
                this.#talkCommand()
            } else if (this.getTemplateValue(["TrashCommand", "name"])) {
                this.#trashCommand()
            } 
            return true
        }
        return false
    }

    #brushCommand() { }
    #talkCommand() {
        const triggerData = {
            type: "TalkQuestTrigger",
            entityID: this.entityID
        }
        this.zoneScene.sharedData.questManager.tryTriggerQuest(this.zoneScene, triggerData)
    }

    #tradeCommand() { }
    #takeCommand() {
        /*
        * Click entity to see takeCommand option
        * Select takeCommand option
        * takeItem item is added to inventory
        * Entity is removed from world
        */
        const takeItem = this.getTemplateValue(["TakeCommand", "item", "text"])
        console.log(`Take command not fully implemented. Take item is: ${takeItem}`)
       }
    #trashCommand() {
        /*
        * Click entity to see trashCommand option
        * Select trashCommand option
        * Entity is removed from world
        */
        const triggerData = {
            type: "RemoveEntityTrigger",
            templateID: this.templateID
        }
        this.zoneScene.sharedData.questManager.tryTriggerQuest(this.zoneScene, triggerData)
        this.destroy()
    }
    #applyCommand() { }
    #giveCommand() {
        /*
        * Click entity to see giveCommand option
        * Select giveCommand option
        * Inventory menu appears with the available giveItem options visible
        * User can then select a giveItem item to give
        * giveItem is removed from inventory
        */
        const giveItem = this.getTemplateValue(["GiveCommand", "item", "text"])
        console.log(`Give command not fully implemented. Give item is: ${giveItem}`)
    }

    #shopCommand() { }
    #avatarShopCommand() { }
    #interactCommand() { }
    #moveCommand() {}
    #waterRemoveCommand() {}
    // ------- END COMMAND FUNCTIONS -------


    // ------- HELPER FUNCTIONS -------
    getTemplateValue(keys, templateID = this.templateID) {
        // console.log(templateID + " " + keys + ": " + this.zoneScene.sharedData.templateManager.getTemplateValue(`${templateID}`, keys))
        return this.zoneScene.sharedData.templateManager.getTemplateValue(`${templateID}`, keys)
    }

    destroy () {
        // Removes the sprite for the entity
        if (this.sprite) { this.sprite.destroy() }

        // Removes the entity from the tiles it is on
        let gridFootX = this.getTemplateValue(["GridPosition", "gridFootX", "text"])
        if ( gridFootX === undefined) { gridFootX = 1}
        let gridFootY = this.getTemplateValue(["GridPosition", "gridFootY", "text"])
        if ( gridFootY === undefined) { gridFootY = 1}
        for (let x = 0; x < gridFootX; x++) {
            for (let y = 0; y < gridFootY; y++) {
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
                const index = tile.hasEntity.indexOf(this.entityKey);
                if (index !== -1) {
                    tile.hasEntity.splice(index, 1);
                }
            }
        }

        // Removes the entity from the zone
        delete this.zoneScene.entities[this.entityKey]
        delete this.zoneScene.sharedData.spawnedEntities[this.zoneScene.zoneConfig.ID][this.entityKey]
    }
    // ------- END HELPER FUNCTIONS -------
}