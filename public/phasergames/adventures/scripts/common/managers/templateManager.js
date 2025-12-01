class TemplateManager {
    constructor (phaserScene) {
        this.phaserScene = phaserScene
        this.preloadData()
    }

    // Used to place NPCs into each zone
    NPCLocations = {
        "Z001": {
            "H047": [15, 6]
        } 
    }

    // TODO : get the quests info from somewhere
    
    /**
     * Preloads the xml files for the quests into cache so they can be used later. Should be called from the loadScreen scene
     */
    preloadData() {
        this.phaserScene.load.xml("NPCs", `${TEMPLATE_XML_PATH}NPCs.xml`);
    }

    /**
     * Loads and parses the xml files from the cache, and then initializes the quests. Should be called from the loadScreen scene
     */
    initializeData() {
        this.phaserScene.sharedData.templates = {}
        this.phaserScene.sharedData.templates.npcData = parseTemplateXML(this, this.phaserScene.cache.xml.get("NPCs"))
        // console.log(this.phaserScene.sharedData.templates.npcData)
    }

    getTemplate(templateType, templateID, templateArray = []) {
        const allTemplates = this.phaserScene.sharedData.templates[`${templateType}Data`].things[0]
        const template = allTemplates[templateID]
        templateArray.push(template[0])
        if (template[0].template) {
            this.getTemplate(templateType, template[0].template, templateArray)
        }
        return templateArray
    }
}