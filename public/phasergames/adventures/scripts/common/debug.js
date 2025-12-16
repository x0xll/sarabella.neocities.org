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

    advanceQuest(questID, activeOnly = true) {        
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
        return this.loadScene.sharedData.questManager.getFullQuestID(questID)
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
    getEntities(zoneID = undefined) {
        if (zoneID = undefined) {
            return this.zoneScene.entities
        } else {
            return this.zoneScene.sharedData.spawnedEntities[zoneID]
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
}