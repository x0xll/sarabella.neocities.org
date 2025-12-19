class TemplateManager {
    constructor (phaserScene) {
        this.phaserScene = phaserScene
        this.preloadData()
    }
   
    TEMPLATE_TYPES = {
        //<KEY>.xml -> templates.<VALUES>Data
        "Detritus": "detritus",
        "Inventory": "inventory",
        "NPCs": "npc",
        "PlaceableObject": "placeableObject",
        "Plants": "plant",
        "Player": "player",
        "Soil": "soil",
        "WorldObject": "worldObject",
        "Zone": "zone",
    }
    // This is used to quickly fetch some of the more common variables out of a template
    COMMON_KEYS = {
        "gridFootX": ["GridPosition", "gridFootX", "text"],
        "gridFootY": ["GridPosition", "gridFootY", "text"],
        "isBlocked": ["GridPosition", "isBlocked", "text"],
        "name": ["component", "name", 1, "text"],
        "movieClipFile":["MovieClip", "fileName", "text"],
        "movieClipClass":["MovieClip", "className", "text"],
        "soilType":["Soil", "soil", "text"],

        "seedSoilTarget":["Seed", "soilTarget", "text"],
        "seedPlantItemID":["Seed", "plantItemId", "text"],
        "seedPlantWidth":["Seed", "plantWidth", "text"],
        "seedPlantHeight":["Seed", "plantHeight", "text"],

        "placeableItemEntityTemplate":["PlaceEntity", "entityTemplate", "text"],
        "placeableItemRequiresMove":["PlaceEntity", "requiresMove", "text"],
        "placeableItemWidth":["PlaceEntity", "width", "text"],
        "placeableItemHeight":["PlaceEntity", "height", "text"],
    }

    // TODO : get additional quest info from the NPC file

    /**
     * Runs during the create phase of the load scene
     */
    create() {
        if (this.phaserScene.sharedData.templateManager === undefined) {
            this.phaserScene.sharedData.templateManager = this
            this.initializeData();
        }
    }
    
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

    /**
     * 
     * @param {*} templateID The ID for the template (e.g. H001)
     * @param {*} keys The key for the COMMON_KEYS to check, or an array of key names within the template
     * @returns 
     */
    getTemplateValue(templateID, keys, templateType = undefined) {
        let template = this.getTemplate(templateID, templateType);
        if (!template) return

        let keysArray = keys
        if (!Array.isArray(keys)) { keysArray = this.COMMON_KEYS[keys] } 

        for (let keyindex = 0; keyindex < keysArray.length; keyindex++) {
            const key = keysArray[keyindex];
            if (!template[key]) {
                // console.log(`No value found for ${key} in ${templateID}`)
                return undefined
            }
            template = template[key]

            if (Array.isArray(template) && template.length === 1) {
                template = template[0]
            }
        }
        return template
    }

    getTemplate(templateID, templateType = undefined) {
        if (templateType === undefined) { templateType = this.getTemplateType(templateID) }
        
        if (templateType !== undefined && Object.values(this.TEMPLATE_TYPES).indexOf(templateType) > -1 ) {
            const templateArray = this.#getMatchingTemplates(templateType, templateID)
            this.#mergeTemplates(templateArray)
            
            return templateArray[0]
        }
        console.warn(`No template found for ${templateID}`)
        return undefined
    }

    getTemplateType(templateID) {
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
        if (templateArray[0] === undefined) {console.warn(`No templates found for ${templateID}`)}
        return templateArray
    }
    
    #mergeTemplates(templateArray) {
        const baseTemplate = templateArray[0]
        if (baseTemplate === undefined || baseTemplate.alreadyMerged) return
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
                // If element is an array or an object
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