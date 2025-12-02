class TemplateManager {
    constructor (phaserScene) {
        this.phaserScene = phaserScene
        this.preloadData()
    }

    // Used to place NPCs into each zone
    // TODO move this info to a config to store default locations.
    // Only save to player data if different from the default
    NPCLocations = {
        "Z001": {
            "H047": [15, 6]
        } 
    }
    TEMPLATE_TYPES = {
        //<KEY>.xml -> templates.<VALUES>Data
        "Detritus": "detritus",
        "Inventory": "inventory",
        "NPCs": "npc",
        "PlaceableObject": "placeableObject",
        "Plants": "plant",
        // "Player": "player", // Is this one needed anywhere?
        "Soil": "soil",
        "WorldObject": "worldObject",
    }

    // TODO : get the quests info from somewhere
    
    /**
     * Preloads the xml files for the quests into cache so they can be used later. Should be called from the loadScreen scene
     */
    preloadData() {
        for (let [key] of Object.entries(this.TEMPLATE_TYPES)) {
            this.phaserScene.load.xml(key, `${TEMPLATE_XML_PATH}${key}.xml`);
        }
    }

    /**
     * Loads and parses the xml files from the cache, and then initializes the quests. Should be called from the loadScreen scene
     */
    initializeData() {
        this.phaserScene.sharedData.templates = {}

        for (let [key] of Object.entries(this.TEMPLATE_TYPES)) {
            this.phaserScene.sharedData.templates[`${this.TEMPLATE_TYPES[key]}Data`] = parseTemplateXML(this, this.phaserScene.cache.xml.get(key))
        }
    }

    getTemplate(templateID) {
        const templateType = this.#getTemplateType(templateID)
        if (templateType !== undefined) {
            const templateArray = this.#getMatchingTemplates(templateType, templateID)
            this.#mergeTemplates(templateArray)
            
            return templateArray[0]
        }
        console.warn(`No template found for ${templateID}`)
    }

    #getTemplateType(templateID) {
        for (let [key] of Object.entries(this.TEMPLATE_TYPES)) {
            const templateType = this.TEMPLATE_TYPES[key];
            if (this.phaserScene.sharedData.templates[`${templateType}Data`].things[0][templateID]) {
                return templateType
            }
        }
        console.warn(`No template type found for ${templateID}`)
    }

    #getMatchingTemplates(templateType, templateID, templateArray = []) {
        const allTemplates = this.phaserScene.sharedData.templates[`${templateType}Data`].things[0]
        if (allTemplates[templateID]) {
            const template = allTemplates[templateID]
            templateArray.push(template[0])
            if (template[0].template && !template[0].template.alreadyMerged) {
                this.#getMatchingTemplates(templateType, template[0].template, templateArray)
            }
        }
        return templateArray
    }
    
    #mergeTemplates(templateArray) {
        const baseTemplate = templateArray[0]
        baseTemplate.alreadyMerged = true
        for (let index = 1; index < templateArray.length; index++) {
            const nextTemplate = templateArray[index];

            // Template is an object, so check keys first
            this.#mergeObjects(baseTemplate, nextTemplate)
        }
    }

    #mergeObjects(object1, object2) {
        for (let [key] of Object.entries(object2)) {
            if (object1[key] === undefined) {
                // Add missing key to template
                object1[key] = object2[key]
            }
            else {
                const element1 = object1[key]
                if (Array.isArray(element1) || (typeof element1 === 'object' && !Array.isArray(element1) && element1 !== null))
                    this.#mergeNext(element1, object2[key])
            }
        }
    }

    #mergeNext(element1, element2) {
        if (Array.isArray(element1)) {
            // element is an array
            if (element1.length === 1 && element2.length === 1) {
                this.#mergeNext(element1[0], element2[0])
            }
        } else if (typeof element1 === 'object' && !Array.isArray(element1) && element1 !== null) {
            // element is an object
            this.#mergeObjects(element1, element2)
        }
    }
}