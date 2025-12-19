/**
 * This class is meant to handle all entities that use a template for their configuration.
 * The templates included should be
 */
class TemplateEntity extends Entity {

    ITEM_REQUEST_TYPES = {
        "none": 0,
        "give": 1,
        "apply": 2
    }

    constructor(zoneScene, templateID, startX, startY, facingDirection = undefined, addToCurrentZone = true, loadLate = false) {
        super(zoneScene, templateID, startX, startY, facingDirection);
        this.templateID = templateID
        this.zoneID = zoneScene.zoneConfig.ID
        this.variant = this.getTemplateValue(["MovieClip", "className", "text"], this.templateID);

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
        let facing = parseInt(this.getTemplateValue(["Isometric", "scaleX", "text"]))
        if (facing && (this.facingDirection === undefined || this.facingDirection === "default")) {
            this.facingDirection = facing === -1 ? this.FACING_DIRECTIONS.Southwest : this.FACING_DIRECTIONS.Southeast;
        } else {
            this.facingDirection = this.FACING_DIRECTIONS.Southeast
        }
        
    // <component name="Isometric">
    //   <scaleX>-1</scaleX>
    // </component>
        this.spriteType = this.#loadSpriteData()
        this.#loadSpawnerData()
    }

    /**
     * Instantiates the entity sprite. Should run during the create phase of zone scene setup
     */
    create() {
        this.gridFootX = this.getTemplateValue(["GridPosition", "gridFootX", "text"])
        this.gridFootY = this.getTemplateValue(["GridPosition", "gridFootY", "text"])
        if (this.getTemplateValue(["GridPosition", "gridFoot", "text"])) {
            this.gridFootX = this.getTemplateValue(["GridPosition", "gridFoot", "text"])
            this.gridFootY = this.getTemplateValue(["GridPosition", "gridFoot", "text"])
        }
        if (this.gridFootX === undefined) { this.gridFootX = 1}
        if (this.gridFootY === undefined) { this.gridFootY = 1}

        // Add entity data to tiles
        // TODO get facing direction from Isometric scaleX?
        for (let x = 0; x < this.gridFootX; x++) {
            for (let y = 0; y < this.gridFootY; y++) {
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

        this.#createPlantData()
        this.#createSprite()
        this.updateSpriteVariant(this.variant);
        if (this.isSpawner) {this.#trySpawn() }
    }

    update() {
        if (this.isSpawner) { this.#trySpawn() }
        if (this.isPlant) { this.#tryGrow()}
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
            if (!this.getTemplateValue(["PlantMovieClip"]) 
                && this.getTemplateValue(["CharacterIdle"], templateID) === undefined
                && !urlExists(`${this.assetPath}/${folderName}/${spriteClass}/skeleton.atlas`)
            ) {
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
        let spawnerData = this.getTemplateValue(["EntitySpawning"])
        if (spawnerData) {
            this.isSpawner = true
            this.spawnerData = spawnerData
        } else {
            this.isSpawner = false
        }
    }
    #trySpawn() {
        const spawnerData = this.spawnerData

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
    #createPlantData() {
        let plantData = this.getTemplateValue(["BasicGrowing"])
        if (plantData) {
            this.isPlant = true
            this.plantData = {
                growthData: plantData,
                spriteData: this.getTemplateValue(["PlantMovieClip"])
            }
            // TODO (placeholder) add interactions and save states between zones
            this.isWilted = false
            this.currentStage = 1
            this.timeToGrow = parseInt(this.plantData.growthData.fullGrowthTime[0].text)
        } else {
            this.isPlant = false
        }
    }
    #createSprite() {
        let isoStart = this.gridToIsoMap(this.startPos[0], this.startPos[1]);
        let xOffset = 0
        if (this.getTemplateValue(["Isometric", "xOffset"], this.templateID)) {
            xOffset = parseInt(this.getTemplateValue(["Isometric", "xOffset", "text"], this.templateID))
        }
        let yOffset = 0
        if (this.getTemplateValue(["Isometric", "yOffset"], this.templateID)) {
            yOffset = parseInt(this.getTemplateValue(["Isometric", "yOffset", "text"], this.templateID))
        }
        // TODO figure out actual values - only used bridge as ref so far
        isoStart.x = isoStart.x + (xOffset/6)
        isoStart.y = isoStart.y + (yOffset*23)

        if (this.spriteType === this.SPRITE_TYPES.spine) {
            try {
                this.sprite = this.zoneScene.add.spine(isoStart.x, isoStart.y, `${this.templateID}-json`, `${this.templateID}-atlas`).setScale();

            } catch (error) {
                console.log(`Could not load spine file for ${this.templateID}`)
            }
            this.resetSpriteFacingDirection()
            this.resetSpriteDepth()
            this.setAnimations()
            this.updateSprite()
        } else if (this.spriteType === this.SPRITE_TYPES.atlas) {
            this.sprite = this.zoneScene.add.sprite(isoStart.x, isoStart.y, `${this.templateID}`, "1").setOrigin(.5, 1)
            this.updateSprite()
        } else if (this.spriteType === this.SPRITE_TYPES.stillImage) {
            // For sprites where the bottom corner is aligned with the middle, bottom of the sprite
            this.sprite = this.zoneScene.add.image(isoStart.x, isoStart.y + 20, `${this.templateID}`).setOrigin(.5, 1)
            this.resetSpriteFacingDirection()
            this.resetSpriteDepth()
            this.updateSprite()
        }
    }
    setAnimations() {
        let character = this
        character.animationQueue = []
        character.idleAnimations = []
        if (character.sprite === undefined) { return }
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
                        
                        const delay = 0//randomIntFromInterval(3, 5)
                        character.sprite.animationState.addAnimation(0, animation, false, delay);
                    }
                }
                // event: (entry, event) => console.log(`Custom event for ${entry.animation.name}: ${event.data.name}`)          
             })
    }
    // ------- END CREATE FUNCTIONS -------


    // ------- UPDATE FUNCTIONS -------
    #tryGrow() {
        const plantData = this.plantData

        // Check for day/night, wilted and watered conditions
        if (!this.sprite
            || this.isWilted
            || this.isWatered 
            || plantData.growthData.growthType[0].text !== this.zoneScene.timeManager.getCurrentTimeType()
        ) {
            return
        }

        // Check growth time
        const timeData = this.zoneScene.sharedData.timeTrackedEntities[this.zoneID][this.entityKey]
        if (timeData !== undefined) {
            let duration = this.zoneScene.timeManager.getCurrentTime() - timeData.startTime
            const fullDay = this.zoneScene.timeManager.nightLength + this.zoneScene.timeManager.dayLength
            if (timeData.daysCount > 0) {
                duration = (fullDay - timeData.startTime) + (timeData.daysCount - 1 * fullDay) + this.zoneScene.timeManager.getCurrentTime()
            }

            const stageTime = this.timeToGrow / parseInt(plantData.spriteData.stages[0].text)
            let currentStage = this.currentStage !== undefined ? this.currentStage : 1

            // TODO Check if we have any refs for how long plants took to wilt
            const isWilted = duration > this.timeToGrow + fullDay

            const timeForCurrentStage = stageTime * currentStage;
            if (duration > timeForCurrentStage && currentStage < parseInt(plantData.spriteData.stages[0].text)) {
                currentStage++
            }
            if (isWilted) { currentStage++ }

            if (currentStage > this.currentStage) {
                this.currentStage = currentStage
                if (isWilted) {
                    this.isWilted = isWilted
                    this.updateSprite()
                } else {
                    this.updateSprite()
                }
            }
        }
    }


    updateSprite() {
        if (!this.isPlant || !this.sprite || !this.sprite.skeleton) { 
            super.updateSprite()
            return
         }
        let gameTime = this.zoneScene.timeManager.isDay ? 'day' : 'night'
        const skeletonData = this.sprite.skeleton.data;
        const skin = new spine.Skin("custom");

        const baseName = this.templateID.replace("Template", "")
        let stageName = `${baseName}/${this.currentStage}`
        if (this.isWilted) { stageName = `${this.templateID.replace("Template", "")}/Wilted` }

        if (skeletonData.findSkin(stageName) !== null){
            skin.addSkin(skeletonData.findSkin(stageName));
        }
        else if (skeletonData.findSkin(stageName + '_' + gameTime) !== null){
            skin.addSkin(skeletonData.findSkin(stageName + '_' + gameTime));
        }  else {
            console.warn(`Could not find skins ${stageName} or ${stageName + '_' + gameTime}`)
        }
        this.sprite.skeleton.setSkin(skin);
        this.sprite.skeleton.setToSetupPose();

        for (let index = 0; index < this.sprite.skeleton.data.animations.length; index++) {
            if (this.sprite.skeleton.data.animations[index].name === "idle0") {
                this.sprite.animationState.addAnimation(1, "idle0", true)
            }
        }
        super.updateSprite()
    }
    // ------- END UPDATE FUNCTIONS -------


    // ------- COMMAND FUNCTIONS -------
    // These functions are used to handle player interactions as defined in each entity's template
    /**
     * Is used when the player clicks on a tile containing this entity
     * @param {*} interactData any data about the interaction that should be passed in
     */
    getInteractOptions(interactData) {
        const allInteractions = [
            "GiveCommand",
            "ApplyCommand",
            "TakeCommand",
            "TrashCommand",
            "TalkCommand",
            "ShopCommand",
            "MoveCommand",
            "InteractCommand",
            "BrushCommand",
            "WaterPlantCommand",
            "UprootCommand",
            "VariantCommand",
            "RotateCommand"
        ]
        const entityInteractions = []

        if (this.getTemplateValue(["BasicGrowing", "type"]) === "components.FruitGrowingComponent") {
            entityInteractions.push("CollectPlantCommand")
        } else if (this.isPlant) {
            entityInteractions.push("TakePlantCommand")
        }


        if (this.getTemplateValue(["Click", "name"])) {
            for (let index = 0; index < allInteractions.length; index++) {
                const interaction = allInteractions[index];
                if (this.getTemplateValue([interaction, "name"])) {
                    entityInteractions.push(interaction)
                }
            }
        }

        // TODO actions should not be visible if they are unavailable, but they should still offset the circle
        // TODO add check for collectCommand vs takePlantCommand on plants

        return entityInteractions
    }

    // These functions are used to handle player interactions as defined in each entity's template
    /**
     * Is used when the player clicks on a tile containing this entity
     * @param {*} interactData any data about the interaction that should be passed in
     */
    interact(interactData) {
        if (this.getTemplateValue(["Click", "name"])) {
            const interactions = {
                Give: this.#giveCommand,
                Apply: this.#applyCommand,
                Take: this.#takeCommand,
                Trash: this.#trashCommand,
                Talk: this.#talkCommand,
                Shop: this.#shopCommand,
                Move: this.#moveCommand,
                Interact: this.#interactCommand,
                Brush: this.#brushCommand,
                Water: this.#waterPlantCommand,
                Uproot: this.#uprootPlantCommand,
                Collect: this.#collectCommand,
                Variant: this.#variantCommand,
                Rotate: this.#rotateCommand
            }
            interactions[interactData.interactionType](this, interactData)
            return true
        }
        return false
    }
    returnItem(itemTemplate) {
        // console.log(`Got ${itemTemplate}. Mode is ${this.itemRequestType}`)
        let triggerData

        switch (this.itemRequestType) {
            case this.ITEM_REQUEST_TYPES.give:
                triggerData = {
                    type: "GiveItemTrigger",
                    inventoryTemplate: itemTemplate,
                    templateID: this.templateID
                }
                this.zoneScene.sharedData.questManager.tryTriggerQuest(this.zoneScene, triggerData)
                this.zoneScene.sharedData.inventory.manager.removeItem(itemTemplate)
                
                break;
            case this.ITEM_REQUEST_TYPES.apply:
                // TODO double check this works
                triggerData = {
                    type: "ApplyItemTrigger",
                    inventoryTemplate: itemTemplate,
                    templateID: this.templateID
                }
                this.zoneScene.sharedData.questManager.tryTriggerQuest(this.zoneScene, triggerData)
                
                break;
        
            default:
                break;
        }

        this.itemRequestType = this.ITEM_REQUEST_TYPES.none
    }

    #giveCommand(context, interactData) {
        /*
        * Click entity to see giveCommand option
        * Select giveCommand option
        * Inventory menu appears with the available giveItem options visible
        * User can then select a giveItem item to give
        * giveItem is removed from inventory
        */
        const giveItem = context.getTemplateValue(["GiveCommand", "item"])
        context.itemRequestType = context.ITEM_REQUEST_TYPES.give
        context.zoneScene.sharedData.inventory.ui.manager.show(giveItem, context);
    }
    canGive(checkApplyInstead = false) {        
        const activeQuests = []
        for (let index = 0; index < this.zoneScene.sharedData.quest.logic.activeQuests.length; index++) {
            const questID = this.zoneScene.sharedData.quest.logic.activeQuests[index];
            activeQuests.push(this.zoneScene.sharedData.questManager.getQuestPerID(questID))
        }

        const items = []
        for (let index = 0; index < activeQuests.length; index++) {
            const quest = activeQuests[index];

            for (let lineIndex = 0; lineIndex < quest.line.length; lineIndex++) {
                let triggerData = quest.line[lineIndex].trigger.object[0];
                if((!checkApplyInstead && triggerData.type !== "GiveItemTrigger") || (checkApplyInstead && triggerData.type !== "ApplyItemTrigger")) continue

                if (triggerData.targetTemplate[0] === this.templateID) {
                    items.push({text: triggerData.inventoryTemplate[0], count: 1})
                }
            }
            
        }
        if (items.length === 0) return false
        const haveItems = this.zoneScene.sharedData.inventory.manager.getItemByTemplates(items)
        return Object.entries(haveItems).length === items.length
    }
    #applyCommand(context, interactData) { 
        // TODO double check this works
        const applyItem = context.getTemplateValue(["ApplyCommand", "item"])
        context.itemRequestType = context.ITEM_REQUEST_TYPES.apply
        context.zoneScene.sharedData.inventory.ui.manager.show(applyItem, context);
    }
    #takeCommand(context, interactData) {
        let takeItem
        // Check if takePlantCommand or takeCommand
        if (context.getTemplateValue(["TakePlantCommand"])) {
            if (!context.isWilted && context.currentStage === parseInt(context.getTemplateValue(["PlantMovieClip", "stages", "text"]))) {
                takeItem = context.getTemplateValue(["BasicGrowing", "harvestProduceItemId", "text"])
                const triggerInfo = {
                    type: "ContextItemTrigger",
                    actionClass: "take",
                    template: context.templateID
                }
                context.zoneScene.sharedData.questManager.tryTriggerQuest(context.zoneScene, triggerInfo)
            } else {
                console.log("Plant not correct stage")
            }
        } else if (context.getTemplateValue(["TakeCommand"])) {
            takeItem = context.getTemplateValue(["TakeCommand", "template", "text"])
            const triggerData = {
                type: "ContextItemTrigger",
                actionClass: "take",
                template: context.templateID
            }
            context.zoneScene.sharedData.questManager.tryTriggerQuest(context.zoneScene, triggerData)
        }

        if (takeItem == undefined) { return }
        context.zoneScene.sharedData.inventory.manager.addItem(takeItem)

        // TODO check if this part is correct (may be different for plants as well, since they use different take/harvest logic)

        context.destroy()
    }
    #collectCommand(context, interactData) { 
        let takeItem
        // Check if takePlantCommand or takeCommand
        if (context.getTemplateValue(["CollectPlantCommand"])) {
            if (!context.isWilted && context.currentStage === parseInt(context.getTemplateValue(["PlantMovieClip", "stages", "text"]))) {
                takeItem = context.getTemplateValue(["BasicGrowing", "harvestProduceItemId", "text"])
                const triggerInfo = {
                    type: "ContextItemTrigger",
                    actionClass: "take",
                    template: context.templateID
                }
                context.zoneScene.sharedData.questManager.tryTriggerQuest(context.zoneScene, triggerInfo)
                console.log("harvest", takeItem)
            } else {
                console.log("Plant not correct stage")
            }
        }

        if (takeItem == undefined) { return }

        context.zoneScene.sharedData.inventory.manager.addItem(takeItem)


        // TODO currently doesn't regrow - add regrowth ability
        this.currentStage = parseInt(context.plantData.growthData.unWiltStage[0].text)
        this.timeToGrow = parseInt(context.plantData.growthData.reGrowthTime[0].text)
        context.zoneScene.sharedData.timeTrackedEntities[context.zoneID][context.entityKey] = {
            startTime: context.zoneScene.timeManager.getCurrentTime(),
            daysCount: 0
        }
    }
    #trashCommand(context, interactData) {
        /*
        * Click entity to see trashCommand option
        * Select trashCommand option
        * Entity is removed from world
        */
        context.destroy()
    }
    #talkCommand(context, interactData) {
        const talkData = context.getTalkData()
        const character = context.getTemplateValue(["Character", "identifier", "text"])
        if (talkData.quests.length > 0 ) {
            talkData.choices["none"] = {
                entityID: character,
                text: "Nevermind" // TODO get localised version
            }
            context.zoneScene.sharedData.dialogue.ui.manager.show(null, character, "What would you like to talk about?", talkData.choices); // TODO get localised version
        }
    }
    getTalkData() {
        const character = this.getTemplateValue(["Character", "identifier", "text"])
        const choices = { }
        const quests = this.zoneScene.sharedData.questManager.getActiveQuestsWithCharacter(character)
        for (let index = 0; index < quests.length; index++) {
            const quest = quests[index];
            const advData = this.zoneScene.sharedData.questManager.getAdventurePerID(quest)
            choices[quest[2]] = {
                entityID: character,
                text: advData.description.text
            }
        }
        return {quests: quests, choices:choices}
    }
    #shopCommand(context, interactData) {
        if (context.getTemplateValue(["AvatarShopCommand"])) {
            console.log("Avatar shop not yet implemented")
        } else {
            console.log("Shop not yet implemented")
        }
    }
    #moveCommand(context, interactData) { 
        console.log("Move not yet implemented")
    }
    #interactCommand(context, interactData) { 
        console.log("Interact not yet implemented")
    }
    #brushCommand(context, interactData) { 
        console.log("Brush not yet implemented")
    }
    #waterPlantCommand(context, interactData) { 
        if (context.zoneScene.sharedData.timeTrackedEntities[context.zoneID][context.entityKey] === undefined) {
            context.zoneScene.sharedData.timeTrackedEntities[context.zoneID][context.entityKey] = {
                startTime: context.zoneScene.timeManager.getCurrentTime(),
                daysCount: 0
            }
        }
        this.isWatered = true

        const triggerInfo = {
            type: "ActionTrigger",
            actionClass: "WaterPlantAction",
            template: context.templateID
        }
        context.zoneScene.sharedData.questManager.tryTriggerQuest(context.zoneScene, triggerInfo)
    }
    #uprootPlantCommand(context, interactDat) { 
        let takeItem
        if (context.getTemplateValue(["UprootCommand"])) {
                takeItem = context.getTemplateValue(["BasicGrowing", "harvestSeedsItemId", "text"])
                // const triggerInfo = {
                //     type: "ContextItemTrigger",
                //     actionClass: "uproot", // ?
                //     template: context.templateID
                // }
                // context.zoneScene.sharedData.questManager.tryTriggerQuest(context.zoneScene, triggerInfo)
        }

        if (takeItem == undefined) { return }
        context.zoneScene.sharedData.inventory.manager.addItem(takeItem)
        context.destroy()
    }
    #variantCommand(context, interactData) { 
        let possibleVariants = context.getTemplateValue(["MovieClip", "variants"]);
        if (possibleVariants === undefined) { return; }

        let variantFound = false;
        if (context.variant === context.getTemplateValue(["MovieClip", "className", "text"], this.templateID))
        {
            variantFound = true;
        }
        for (let [key] of Object.entries(possibleVariants)) {
            if (key === "childType") {continue;}

            if (key === context.variant)
            {
                variantFound = true;
                continue;
            }

            if (variantFound)
            {
                variantFound = false;
                context.variant = key;
                break;
            }
        }

        if (variantFound)
        {
            context.variant = context.getTemplateValue(["MovieClip", "className", "text"], context.templateID);;
        }

        context.updateSpriteVariant(context.variant);
    }
    #rotateCommand(context, interactData) { 
        switch(context.facingDirection)
        {
            default:
            case context.FACING_DIRECTIONS.Northwest:
                context.facingDirection = context.FACING_DIRECTIONS.Southwest;
                break;
            case context.FACING_DIRECTIONS.Southwest:
                context.facingDirection = context.FACING_DIRECTIONS.Southeast;
                break;
            case context.FACING_DIRECTIONS.Southeast:
                context.facingDirection = context.FACING_DIRECTIONS.Northeast;
                break;
            case context.FACING_DIRECTIONS.Northeast:
                context.facingDirection = context.FACING_DIRECTIONS.Northwest;
                break;
        }
        context.resetSpriteFacingDirection()
    }


    // ------- END COMMAND FUNCTIONS -------


    // ------- HELPER FUNCTIONS -------
    getTemplateValue(keys, templateID = this.templateID) {
        // console.log(templateID + " " + keys + ": " + this.zoneScene.sharedData.templateManager.getTemplateValue(`${templateID}`, keys))
        return this.zoneScene.sharedData.templateManager.getTemplateValue(`${templateID}`, keys)
    }

    destroy () {
        // Check for any triggers

        const nearbyEntities = new Set()
        for (let x = 0; x < this.gridFootX; x++) {
            for (let y = 0; y < this.gridFootY; y++) {
                const entities = this.zoneScene.getEntitiesAt(this.startPos[0]+x, this.startPos[1]-y)
                for (let index = 0; index < entities.length; index++) {
                    nearbyEntities.add(this.zoneScene.entities[entities[index]].templateID)
                }
            }
        }
        for (const entity of nearbyEntities) {
            if (this.zoneScene.entities[entity]=== undefined) {continue}
            const triggerInfo = {
                type: "RemoveEntityTrigger",
                templateID: this.templateID,
                targetTemplate: this.zoneScene.entities[entity].templateID
            }
            this.zoneScene.sharedData.questManager.tryTriggerQuest(this.zoneScene, triggerInfo)
        }

        // Removes the sprite for the entity
        if (this.sprite) { this.sprite.destroy() }

        // Removes the entity from the tiles it is on
        if ( this.gridFootX === undefined) { this.gridFootX = 1}
        if ( this.gridFootY === undefined) { this.gridFootY = 1}
        for (let x = 0; x < this.gridFootX; x++) {
            for (let y = 0; y < this.gridFootY; y++) {
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

        // TODO Reset all spawners in the same tile so they don't instantly try to spawn

        // Removes the entity from the zone
        delete this.zoneScene.entities[this.entityKey]
        delete this.zoneScene.sharedData.spawnedEntities[this.zoneScene.zoneConfig.ID][this.entityKey]
        // TODO also delete from time tracked entities?
    }
    // ------- END HELPER FUNCTIONS -------
}