class NPCManager {
    constructor (phaserScene) {
        this.phaserScene = phaserScene
        this.preloadData()
    }

    // Used to place NPCs into each zone
    NPCLocations = {
        "Z001": {
            "H047": [16, 4]
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
        this.phaserScene.sharedData.npcData = parseTemplateXML(this, this.phaserScene.cache.xml.get("NPCs"))
        // console.log(this.phaserScene.sharedData.npcData);
    }
}