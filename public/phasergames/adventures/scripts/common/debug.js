class Debug {
    constructor () { }

    echo(text) {
        console.log(text)
    }


    // ------- PLAYER FUNCTIONS -------
    playerIgnoreBlocked(ignoreBlocked = true) {
        this.zoneScene.entities["player"].aStar.ignoreBlocked = ignoreBlocked
    }
    // ------- END PLAYER FUNCTIONS -------


    // ------- QUEST FUNCTIONS -------
    addQuest(questID) {
        this.loadScene.sharedData.questManager.makeQuestAvailable(questID)
    }

    removeQuest(questID) {
        this.loadScene.sharedData.questManager.markQuestFinished(questID)
    }

    setSkipDialogue(shouldSkip = true) {
        this.skipDialogue = shouldSkip
    }

    advanceQuest(questID = this.nextQuest, activeOnly = true, skipDialogue = this.skipDialogue) {     
        if (questID === undefined) {
            this.nextQuest = this.loadScene.sharedData.quest.logic.activeQuests[0]
            console.log(this.nextQuest)
            questID = this.nextQuest
        }

        questID = this.getFullQuestID(questID)
        const questData = this.getQuestData(questID)
        let questActive = true
        if (questData.status !== this.loadScene.sharedData.questManager.QUEST_STATES.AVAILABLE) {
            console.log("Quest not available")
            questActive = false
        }

        if (questActive || !activeOnly) {
            const questLine = questData.line
            let endLine
            const startedQuests = []

            for (let index = 0; index < questLine.length; index++) {
                const actions = questLine[index].actions.object;
                
                for (let line = 0; line < actions.length; line++) {
                    if (actions[line].type === "LogQuestEndAction") {
                        endLine = index
                        break
                    }
                }
                if (endLine !== undefined) { 
                    
                    for (let line = 0; line < actions.length; line++) {
                        if (actions[line].type === "AddQuestAction") {
                            startedQuests.push(actions[line].questId)
                        }
                    }
                    break 
                }
            }
            this.loadScene.sharedData.questManager.doQuestAction(questID, endLine);
            this.nextQuest = startedQuests[0]
            return startedQuests
        }
    }

    getActiveQuests(idsOnly = true) {
        if (idsOnly) {
            return this.loadScene.sharedData.quest.logic.activeQuests
        }  else {
            const quests = []
            for (let index = 0; index < this.loadScene.sharedData.quest.logic.activeQuests.length; index++) {
                const questID = this.loadScene.sharedData.quest.logic.activeQuests[index];
                quests.push(this.loadScene.sharedData.questManager.getQuestPerID(questID))
            }
            return quests
        }
    }

    getQuestData(questID) {
        questID = this.getFullQuestID(questID)
        return this.loadScene.sharedData.questManager.getQuestPerID(questID)
    }

    getFullQuestID(questID) {
        if (!Array.isArray(questID)) {
            questID = questID.toString()
            if (!questID.startsWith("QUE-")) {
                questID = "QUE-" + questID
            }
            questID = [undefined, undefined, questID]
        }
        if (!questID[0] || !questID[1]) {questID = this.loadScene.sharedData.questManager.getFullQuestID(questID)}
        return questID
    }
    // ------- END QUEST FUNCTIONS -------


    // ------- INVENTORY FUNCTIONS -------
    addItem(templateID, count = 1) {
        this.loadScene.sharedData.inventory.manager.addItem(templateID, count)
    }

    removeItem(templateID, count = 1) {
        this.loadScene.sharedData.inventory.manager.removeItem(templateID, count)
    }
    // ------- END INVENTORY FUNCTIONS -------


    // ------- ZONE FUNCTIONS -------
    switchZone(zoneID = "Z001") {
        this.zoneScene.goToNextZone(zoneID)
    }

    getEntities(zoneID = undefined) {
        if (zoneID = undefined) {
            return this.zoneScene.entities
        } else {
            return this.zoneScene.sharedData.entities.spawnedEntities[zoneID]
        }
    }
    getEntitiesAt(x, y, idsOnly = true) {
        const entities = this.zoneScene.getEntitiesAt(x, y)
        if (idsOnly) {
            return entities
        } else {
            const entitiesList = []
            for (let index = 0; index < entities.length; index++) {
                entitiesList.push(this.zoneScene.entities[entities[index]])
            }
            return entitiesList
        }
    }
    // ------- END ZONE FUNCTIONS -------

    // ------- START MAGIC TREE FUNCTIONS ------
    getCurrentMagicTreeLevel() {
        return this.zoneScene.sharedData.magicTree.logic.level;
    }

    getCurrentMagicTreeExperience() {
        return this.zoneScene.sharedData.magicTree.logic.experience;
    }

    addMagicTreeLevel(amount = 1) {
        this.zoneScene.sharedData.magicTree.logic.manager.debugAddLevel(amount);
    }

    addMagicTreeExperience(amount) {
        this.zoneScene.sharedData.magicTree.logic.manager.addExperience(amount);
    }

    // ------- END MAGIC TREE FUNCTIONS -------
}