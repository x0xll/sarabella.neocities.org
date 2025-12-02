/* Handles the backend aspect of the quests
*  Save/Load quests, Unlock/Finish, etc.
*/
class QuestManager {
    QUEST_STATES = {
        UNAVAILABLE: -1,
        AVAILABLE: 0,
        FINISHED: 1
    }

    constructor (phaserScene) {
        this.phaserScene = phaserScene
        this.busy = true // Used to prevent trigger checks if the manager is currently checking already
        this.preloadQuestData()
    }


    //------- HELPER FUNCTIONS -------
    /**
     * Finds all quests with the given status
     * @param {*} status The status to match
     * @returns an array of quest values with the given status
     */
    getAllQuestsByStatus(status) {
        var quests = [];

        this.phaserScene.sharedData.quest.logic.quests.forEach(file => {
            for (let [key] of Object.entries(file)) {
                if (!key.includes("ADS")) {continue}
                adventures = file[key]

                for (let [key] of Object.entries(adventures)) {
                    if (!key.includes("ADV")) {continue}
                    adventure = adventures[key]

                    for (let [key] of Object.entries(adventure)) {
                        if (!key.includes("QUE")) {continue}
                        quest = adventure[key]

                        if (quest.status === status)
                            quests.push(quest);
                    }
                }
            }
        });

        return quests;
    }


    /**
     * Finds all quests with the given status
     * @param {*} status The status to match
     * @returns an array of quest values with the given status
     */
    getAllQuestIDsByStatus(status) {
        var quests = [];

        this.phaserScene.sharedData.quest.logic.quests.forEach(file => {
            for (let [adsKey] of Object.entries(file)) {
                if (!adsKey.includes("ADS")) {continue}
                adventures = file[adsKey]

                for (let [advKey] of Object.entries(adventures)) {
                    if (!advKey.includes("ADV")) {continue}
                    adventure = adventures[advKey]

                    for (let [queKey] of Object.entries(adventure)) {
                        if (!queKey.includes("QUE")) {continue}
                        quest = adventure[queKey]

                        if (quest.status === status)
                            quests.push([adsKey, advKey, queKey]);
                    }
                }
            }
        });

        return quests;
    }

    /**
     * Finds the adventure with the matching ID
     * @param {*} adventureID The ID to search for. Should be an array with at least two values [adventuresID, adventureID]
     * @returns The adventure with the given ID
     */
    getAdventurePerID(adventureID) {
        const quests = this.phaserScene.sharedData.quest.logic.quests
        for (let i = 0; i < quests.length; i++)
        {
            if (quests[i][adventureID[0]] &&
                quests[i][adventureID[0]][adventureID[1]]
            ) {
                return quests[i][adventureID[0]][adventureID[1]];
            }
        }

        console.error("No Adventure found! " + adventureID[0] + " - " + adventureID[1]);
    }

    /**
     * Finds the quest with the matching ID
     * @param {*} questID The ID to search for. Should be an array with at least three values [adventuresID, adventureID, questID], though the first two values may be null
     * @returns The quest with the given ID
     */
    getQuestPerID(questID) {
        const quests = this.phaserScene.sharedData.quest.logic.quests
        if (!questID[0] || !questID[1]) {questID = this.getFullQuestID(questID)}
        for (let i = 0; i < quests.length; i++) {
            if (quests[i][questID[0]] &&
                quests[i][questID[0]][questID[1]] &&
                quests[i][questID[0]][questID[1]][questID[2]]
            ) {
                return quests[i][questID[0]][questID[1]][questID[2]];
            }
        }
        
        console.error("No Quest found! " + questID[0] + " - " + questID[1] + " - " + questID[2]);
    }

    /**
     * Takes a partial quest ID and finds the matching adventuresID and adventureID
     * @param {*} questID  The ID to search for. Should be an array with at least three values [adventuresID, adventureID, questID], though the first two values may be null
     * @returns 
     */
    getFullQuestID(questID) {
        const quests = this.phaserScene.sharedData.quest.logic.quests
        for (let i = 0; i < quests.length; i++) {
            for (let [adsKey] of Object.entries(quests[i])) {
                if (questID[0]) { adsKey = questID[0]; continue}
                if (!adsKey.includes("ADS")) {continue}
                adventures = quests[i][adsKey]

                for (let [advKey] of Object.entries(adventures)) {
                    if (questID[1]) { advKey = questID[1]; continue}
                    if (!advKey.includes("ADV")) {continue}
                    adventure = adventures[advKey]

                    for (let [queKey] of Object.entries(adventure)) {
                        if (!queKey.includes("QUE")) {continue}
                        else if (queKey === questID[2]) {return [adsKey, advKey, queKey]}
                    }
                }
            }
        }

        console.error("No Quest found from partial ID! " + questID[0] + " - " + questID[1] + " - " + questID[2]);
    }

    getQuestStatus(questID) {
        var questData = this.getQuestPerID(questID);
        if (questData !== undefined) return questData.status;
    }

    debug_DrawTriggerQuest(phaserScene) {
        if (phaserScene.questTriggerDebug === undefined)
            phaserScene.questTriggerDebug = [];
        else {
            for (let i = phaserScene.questTriggerDebug.length - 1; i >= 0; i--) {
                phaserScene.questTriggerDebug[i].destroy();
                phaserScene.questTriggerDebug.pop(i);
            }
        }

        for (let i = 0; i < phaserScene.sharedData.quest.logic.activeQuests.length; i++) {
            let questGlobalData = this.getQuestPerID(phaserScene.sharedData.quest.logic.activeQuests[i]);

            for (let lineIndex = 0; index < questGlobalData.line.length; lineIndex++) {
                let triggerData = questGlobalData.line[lineIndex].trigger.object[0];

                if (triggerData.zoneId != undefined && 
                    triggerData.zoneId == phaserScene.sharedData.global.ZONE_ID) {
                    for (let x = triggerData.centerX - triggerData.radius; x < triggerData.centerX + triggerData.radius; x++) {
                        for (let y = triggerData.centerY - triggerData.radius; y < triggerData.centerY + triggerData.radius; y++) {
                            if (Math.abs(x - triggerData.centerX) + Math.abs(y - triggerData.centerY) <= triggerData.radius) {
                                let pos = phaserScene.gridToIsoMap(parseInt(x), parseInt(y));
                                var rect = new Phaser.GameObjects.Rectangle(phaserScene, pos.x, pos.y, 25, 12, 0xff0000, 1).setAlpha(.5);
                                phaserScene.add.existing(rect);
                            }
                        }
                    }
                }
            }
        }
    }


    //------- QUEST LOADING -------
    // TODO : get the quests info from somewhere
    #QUEST_FILE_NAMES = [
        "freeplay_v2",
        "tutorials",
        "collectibles",
        "free_springfestival",
        "intro_cottage",
        "repeatable",
        "sc_1",
        "sc_6",
        "spc1activation",
        "gp",
        "furniturestore"
        //"freeplay" // not sure this one is used since there is a "freeplay_v2.xml" file
    ]
    
    /**
     * Preloads the xml files for the quests into cache so they can be used later. Should be called from the loadScreen scene
     */
    preloadQuestData() {
        this.#QUEST_FILE_NAMES.forEach(file => {
            this.phaserScene.load.xml(file, `${QUEST_XML_PATH}${file}.xml`);
        });
    }

    /**
     * Loads and parses the xml files from the cache, and then initializes the quests. Should be called from the loadScreen scene
     */
    async initializeQuestData() {
        const savedUserQuestData = this.#parseSavedQuestData()

        let questData = []
        for (let index = 0; index < this.#QUEST_FILE_NAMES.length; index++) {
            questData.push(parseQuestXML(this, this.phaserScene.cache.xml.get(this.#QUEST_FILE_NAMES[index])))
        }

        this.phaserScene.sharedData.quest = {};
        this.phaserScene.sharedData.quest.logic =  {
            quests: questData,
            activeQuests: []
        }

        // console.log(phaserScene.sharedData.quest.logic.quests);

        // TODO: Handle state based on savesystem, for now we assume it's always the first time playing

        // If first time on the game -> we show the first tutorial quests
        // await this.makeQuestAvailable(["ADS-0000000825", "ADV-0000000899", "QUE-0000002110"]); // freeplay_v2.xml
        // await this.makeQuestAvailable(["ADS-0000000825", "ADV-0000000899", "QUE-0000002105"]); // freeplay_v2.xml
        // await this.makeQuestAvailable(["ADS-0000001163", "ADV-0000001798", "QUE-0000006273"]); // intro_cottage.xml

        // Make quests available based on the user save data
        for (let index = 0; index < savedUserQuestData[0].length; index++) {
            await this.makeQuestAvailable(savedUserQuestData[0][index]);
        }
        for (let index = 0; index < savedUserQuestData[1].length; index++) {
            await this.markQuestFinished(savedUserQuestData[1][index]);
        }

        // this.saveUserQuestData()
        this.busy = false
    }

    /**
     * Parses the saved quest data for the user
     * @returns an array with the active quest save data and the finished quest save data
     */
    #parseSavedQuestData() {
        function unstringifyQuest(savedData) {
            savedData = savedData.split("_")
            // Currently ignoring version since there's only one so far
            for (let index = 1; index < savedData.length; index++) {
                let quest = savedData[index].replace("Q", "").split("-")
                quest[0] = "ADS-" + quest[0]
                quest[1] = "ADV-" + quest[1]
                quest[2] = "QUE-" + quest[2]
                savedData[index] = quest
            }
            savedData.splice(0, 1)
            return savedData
        }

        // TODO replace with a call to fetch the actual save data
        const activeSavedString = "v1_Q0000000825-0000000899-0000002110_Q0000000825-0000000899-0000002105"
        const activeSavedData = unstringifyQuest(activeSavedString)

        const finisedSavedString = "v1"
        const finishedSavedData = unstringifyQuest(finisedSavedString)
        return [activeSavedData, finishedSavedData]
    }

    /**
     * Saves the player's current quest data
     */
    saveUserQuestData() {
        const version = "v1"
        function stringifyQuest(quest) {
            const ads = quest[0].replace("ADS-", "")
            const adv = quest[1].replace("ADV", "")
            const que = quest[2].replace("QUE", "")
            return "_Q" + ads+adv+que
        }

        let saveString = version
        this.phaserScene.sharedData.quest.logic.activeQuests.forEach(activeQuest => {
            saveString = saveString + stringifyQuest(activeQuest)
        });

        let finishedString = version
        let finishedQuests = this.getAllQuestIDsByStatus(this.QUEST_STATES.FINISHED)
        finishedQuests.forEach(finishedQuest => {
            finishedString = finishedString + stringifyQuest(finishedQuest)
        });

        // TODO replace with a call to actually save the data
        console.log(saveString)
        console.log(finishedString)
    }

    /**
     * Makes the specified quest available. Is async to more easily ensure the quest is added before continuing
     * @param {*} questID The ID array for the quest to be added
     */
    async makeQuestAvailable(questID) {
        if (!questID[0] || !questID[1]) {questID = this.getFullQuestID(questID)}
        var questData = this.getQuestPerID(questID);
        if (questData === undefined) return;
        questData.status = this.QUEST_STATES.AVAILABLE;
        console.log("Quest made available: " + questID[0] + " - " + questID[1] + " - " + questID[2] + " - " + questData.description.text);

        this.phaserScene.sharedData.quest.logic.activeQuests.push(questID)

        // TODO: Handle showing icons on map and handling correct triggers

        let awaitingQuestActivation = true
        while (awaitingQuestActivation) {
            for (let i = 0; i < this.phaserScene.sharedData.quest.logic.activeQuests.length; i++) {
                if (questID[2] === this.phaserScene.sharedData.quest.logic.activeQuests[i][2]) { awaitingQuestActivation = false }
                break;
            }
            return
        }
    }

    /**
     * Makes the specified quest finished. Is async to more easily ensure the quest is removed before continuing
     * @param {*} questID The ID array for the quest to be removed
     */
    async markQuestFinished(questID) {
        if (!questID[0] || !questID[1]) {questID = this.getFullQuestID(questID)}
        let questData = this.getQuestPerID(questID);
        if (questData === undefined || questData.status === this.QUEST_STATES.FINISHED) return;
        questData.status = this.QUEST_STATES.FINISHED;


        let questIndex = -1
        for (let i = 0; i < this.phaserScene.sharedData.quest.logic.activeQuests.length; i++) {
            if (questID[2] === this.phaserScene.sharedData.quest.logic.activeQuests[i][2]) { 
                questIndex = i 
                break;
            }
        }
        
        if (questIndex >=0) {
            this.phaserScene.sharedData.quest.logic.activeQuests.splice(questIndex, 1);
            console.log("End quest: " + questID[0] + " - " + questID[1] + " - " + questID[2] + " - " + questData.description.text);
        }
        
        return
    }


    //------- QUEST TRIGGERS -------
    /**
     * Checks if any active quests should be triggered.
     * @param {*} phaserScene 
     * @param {*} triggerData The data to send to the trigger function
     * @returns 
     */
    tryTriggerQuest(phaserScene, triggerData) {
        // TODO Add variable to pass in a known known trigger type (e.g. try trigger after dialogue click, so only check dialogue trigger)
        if (!this.busy) {
            this.busy = true
            for (let activeQuestIndex = 0; activeQuestIndex < phaserScene.sharedData.quest.logic.activeQuests.length; activeQuestIndex++) {
                let questGlobalData = this.getQuestPerID(phaserScene.sharedData.quest.logic.activeQuests[activeQuestIndex]);

                for (let lineIndex = 0; lineIndex < questGlobalData.line.length; lineIndex++) {
                    const triggers = questGlobalData.line[lineIndex].trigger.object
                    for (let index = 0; index < triggers.length; index++) {
                        const trigger = triggers[index];
                        if (this.#QUEST_TRIGGERS[trigger.type]) {
                            if (this.#QUEST_TRIGGERS[trigger.type](phaserScene, trigger, activeQuestIndex, lineIndex, triggerData)) {
                                this.busy = false
                                return true
                            }
                        }
                    }
                }
            }
            this.busy = false
        }

        return false;
    }

    #QUEST_TRIGGERS = {
        "TalkQuestTrigger": this.#talkQuestTrigger,
        "StopNearTrigger": this.#stopNearTrigger,
        "RemoveEntityTrigger": this.#missingTrigger,
        "ActionTrigger": this.#missingTrigger,
        "ContextItemTrigger": this.#missingTrigger,
        "GiveItemTrigger": this.#missingTrigger,
        "DialogueChoiceTrigger": this.#missingTrigger,
        "ApplyItemTrigger": this.#missingTrigger,
        "PlantGrownInRadiusTrigger": this.#missingTrigger,
        "EnterZoneTrigger": this.#missingTrigger,
        "TradeTrigger": this.#missingTrigger,
        "ApplicationStartTrigger": this.#missingTrigger,
        "NullTrigger": this.#missingTrigger
    }

    #missingTrigger (phaserScene, trigger, activeQuestIndex, lineIndex, triggerData) {
        console.warn(`Missing trigger: ${trigger.type}`)
        return false
    }

    #stopNearTrigger(phaserScene, trigger, activeQuestIndex, lineIndex, triggerData) {
        let questGlobalID = phaserScene.sharedData.quest.logic.activeQuests[activeQuestIndex];

        if (trigger 
            && trigger.zoneId 
            && trigger.zoneId === phaserScene.zoneConfig.ID
            && triggerData.x !== undefined
            && triggerData.y !== undefined
        ) {
            for (let x = triggerData.centerX - triggerData.radius; x < triggerData.centerX + triggerData.radius; x++) {
                for (let y = triggerData.centerY - triggerData.radius; y < triggerData.centerY + triggerData.radius; y++) {
                    if (Math.abs(x - triggerData.centerX) + Math.abs(y - triggerData.centerY) <= triggerData.radius) {
                        let pos = phaserScene.gridToIsoMap(parseInt(x), parseInt(y));
                        var rect = new Phaser.GameObjects.Rectangle(phaserScene, pos.x, pos.y, 25, 12, 0xff0000, 1).setAlpha(.5);
                        phaserScene.add.existing(rect);
                    }
                }
            }
            // TODO: verify if this seems correct for quest trigger
            if (Math.abs(triggerData.x - trigger.centerX) + Math.abs(triggerData.y - trigger.centerY) <= trigger.radius) {
                phaserScene.sharedData.questManager.doQuestAction(questGlobalID, lineIndex);
                return true;
            }
        } 
        return false
    }

    // TODO: This function is a placeholder to trigger the dialogue box
    #talkQuestTrigger(phaserScene, trigger, activeQuestIndex, lineIndex, triggerData) {
        let questGlobalID = phaserScene.sharedData.quest.logic.activeQuests[activeQuestIndex];
        const entity = triggerData.entityID;
        if (entity === trigger.identifier) {
            phaserScene.sharedData.questManager.doQuestAction(questGlobalID, lineIndex);
            return true
        }
        return false
    }


    //------- QUEST CONDITIONS -------
    // TODO: add condition checks
    #QUEST_CONDITIONS = {
        "ActionOnTemplateCondition": this.#missingCondition,
        "HasMultipleItemsCondition": this.#missingCondition,
        "ContainsTokenItemCondition": this.#missingCondition,
        "HasQuestCondition": this.#missingCondition
    }

    #missingCondition (conditionType) {
        console.warn(`Missing condition: ${conditionType}`)
    }


    //------- QUEST ACTIONS -------
    async doQuestAction(questGlobalID, lineIndex, actionIndex = 0) {
        let questData = this.getQuestPerID(questGlobalID);
        if (questData.status == this.QUEST_STATES.UNAVAILABLE ||
            questData.status == this.QUEST_STATES.CANCELLED ||
            questData.status == this.QUEST_STATES.FINISHED ||
            questData.line[lineIndex] === undefined)
            return;

        let actionData = questData.line[lineIndex].actions;

        for (let index = actionIndex; index < actionData.object.length; index++) {
            const action = actionData.object[index];

            if (this.#QUEST_ACTIONS[action.type]) {
                if ((this.#ACTIONS_TO_PAUSE.indexOf(action.type) > -1) &&
                    index+1 < actionData.object.length)
                {
                    questData.currentLine= lineIndex
                    questData.currentAction= index+1
                    this.#QUEST_ACTIONS[action.type](this.phaserScene, questGlobalID, lineIndex, action)
                    return
                } else {

                await this.#QUEST_ACTIONS[action.type](this.phaserScene, questGlobalID, lineIndex, action)
                }
            }
        }
    }
    #QUEST_ACTIONS = {
        "LogAdventureBeginAction": this.#missingAction,
        "LogAdventureEndAction": this.#logAdventureEndAction,
        "LogQuestEndAction": this.#missingAction,
        "AddQuestAction": this.#addQuestAction,
        "RemoveQuestAction": this.#removeQuestAction,
        "AddQuestFileAction": this.#missingAction,
        "RemoveQuestFileAction": this.#missingAction,
        "ShowAdventureCompleteAction": this.#missingAction,
        "DialogueAction": this.#dialogueAction,
        "DialogueImageAction": this.#dialogueImageAction,
        "DialogueChoiceAction": this.#missingAction,
        "MonologueAction": this.#missingAction,
        "AddZoneItemAnywhereAction": this.#addZoneItemAnywhereAction,
        "RemoveZoneItemAnywhereAction": this.#missingAction,
        "TryAddZoneItemToAction": this.#missingAction,
        "AddHorseshoesAction": this.#missingAction,
        "AddMultipleInventoryAction": this.#missingAction,
        "RemoveMultipleInventoryAction": this.#missingAction,
        "AddTokenItemAction": this.#missingAction,
        "RemoveTokenAction": this.#missingAction,
        "TemporaryAnimationAction": this.#missingAction,
        "PlayMovieClipAction": this.#missingAction,
        "PlayHeadsUpDisplayMovieClipAction": this.#missingAction,
        "NullAction": this.#missingAction
    }
    #ACTIONS_TO_PAUSE = [
        "DialogueAction"
        // "DialogueImageAction",
        // "DialogueChoiceAction",
        // "MonologueAction"
    ]

    async #missingAction (phaserScene, questID, lineIndex, action) {
        console.warn(`Missing action: ${action.type}`)
    }

    async #logAdventureEndAction(phaserScene, questID, lineIndex, action) {
        let adventure = phaserScene.sharedData.questManager.getAdventurePerID(questID)
        console.log(`Ending adventure ${questID[0]} - ${questID[1]}`)
        for (let [key] of Object.entries(adventure)) {
            if (!key.includes("QUE")) {continue}
            await phaserScene.sharedData.questManager.markQuestFinished([questID[0], questID[1], key])
        }
    }

    async #addQuestAction(phaserScene, questID, lineIndex, action) {
        await phaserScene.sharedData.questManager.makeQuestAvailable([null, null, action.questId])
    }

    async #removeQuestAction(phaserScene, questID, lineIndex, action) {
        await phaserScene.sharedData.questManager.markQuestFinished(questID)
    }

    async #dialogueAction(phaserScene, questID, lineIndex, action) {
        let questData = phaserScene.sharedData.questManager.getQuestPerID(questID);

        let character = undefined
        if (action.identifier) {character = action.identifier}
        if (character === undefined) {
            let triggers = questData.line[lineIndex].trigger.object
            for (let index = 0; index < triggers.length; index++) {
                const trigger = triggers[index];
                if (trigger.type === "TalkQuestTrigger" && trigger.identifier) {
                    character = trigger.identifier
                }
            }
        }
        if (character === undefined) {
            let actions = questData.line[lineIndex].actions.object
            for (let index = 0; index < actions.length; index++) {
                const action = actions[index];
                if (action.type === "DialogueAction" 
                    && action.identifier) {
                    character = action.identifier
                }
            }
        }

        
        // TODO Need some way to detect once the user has closed the dialogue
        phaserScene.sharedData.dialogue.ui.manager.show(questID, character, action.text, undefined);
    }

    async #dialogueImageAction(phaserScene, questID, lineIndex, action) {
        let questData = phaserScene.sharedData.questManager.getQuestPerID(questID);
        let triggers = questData.line[lineIndex].trigger.object

        let character = undefined
        if (action.identifier) {character = action.identifier}
        if (character === undefined) {
            for (let index = 0; index < triggers.length; index++) {
                const trigger = triggers[index];
                if (trigger.type === "TalkQuestTrigger" && trigger.identifier) {
                    character = trigger.identifier
                }
            }
        }
        if (character === undefined) {
            let actions = questData.line[lineIndex].actions.object
            for (let index = 0; index < actions.length; index++) {
                const action = actions[index];
                if (action.type === "DialogueAction" 
                    && action.identifier) {
                    character = action.identifier
                }
            }
        }

        let img = undefined;
        if (action.imageFileName) { img = action.imageFileName }
        
        // TODO Need some way to detect once the user has closed the dialogue
        phaserScene.sharedData.dialogue.ui.manager.show(questID, character, action.text, undefined, img);
    }

    async #addZoneItemAnywhereAction (phaserScene, questID, lineIndex, action) {
        // TODO Add item to world
        // TODO check all template files
        // TODO Actually add this for realsies
        console.warn(`Missing action: ${action.type}`)
        // console.log(action.template)
        // console.log(phaserScene.sharedData.templateManager.getTemplate(action.template))
    }
}