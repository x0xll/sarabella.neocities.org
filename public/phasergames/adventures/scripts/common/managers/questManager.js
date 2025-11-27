/* Handles the backend aspect of the quests
*  Save/Load quests, Unlock/Finish, etc.
*/
class QuestManager {
    QUEST_STATES = {
        UNAVAILABLE: -1,
        WAITING: 0,
        STARTED: 1,
        FINISHED: 2,
        CANCELLED: 3
    }

    constructor () {
    }


    //------- HELPER FUNCTIONS -------
    getAllQuestsByStatus(phaserScene, status)
    {
        var quests = [];

        phaserScene.sharedData.quest.logic.quests.forEach(file => 
        {
            for (let [key] of Object.entries(file)) {
                adventures = file[key]

                for (let [key] of Object.entries(adventures)) {
                    adventure = adventures[key]

                    for (let [key] of Object.entries(adventure)) {
                        quest = adventure[key]

                        if (quest.status === status)
                            quests.push(quest);
                    }
                }
            }
        });

        return quests;
    }

    getAdventurePerID(phaserScene, adventureID)
    {
        for (let i = 0; i < phaserScene.sharedData.quest.logic.quests.length; i++)
        {
            if (phaserScene.sharedData.quest.logic.quests[i][adventureID[0]] &&
                phaserScene.sharedData.quest.logic.quests[i][adventureID[0]][adventureID[1]]
            ) {
                return phaserScene.sharedData.quest.logic.quests[i][adventureID[0]][adventureID[1]];
            }
        }

        console.error("No Adventure found! " + adventureID[0] + " - " + adventureID[1]);
    }

    getQuestPerID(phaserScene, questID)
    {
        for (let i = 0; i < phaserScene.sharedData.quest.logic.quests.length; i++)
        {
            if (phaserScene.sharedData.quest.logic.quests[i][questID[0]] &&
                phaserScene.sharedData.quest.logic.quests[i][questID[0]][questID[1]] &&
                phaserScene.sharedData.quest.logic.quests[i][questID[0]][questID[1]][questID[2]]
            ) {
                return phaserScene.sharedData.quest.logic.quests[i][questID[0]][questID[1]][questID[2]];
            }
        }

        console.error("No Quest found! " + questID[0] + " - " + questID[1] + " - " + questID[2]);
    }

    getQuestStatus(phaserScene, questID)
    {
        var questData = this.getQuestPerID(phaserScene, questID);
        if (questData !== undefined) return questData.status;
    }

    startQuest(phaserScene, questID)
    {
        var questData = this.getQuestPerID(phaserScene, questID);
        if (questData === undefined) return;
        questData.status = this.QUEST_STATES.STARTED;
        questData.currentLine = 0

        console.log("Start quest: " + questID[0] + " - " + questID[1] + " - " + questID[2] + " - " + questData.description);
        this.doQuestAction(phaserScene, questID, questData);
    }


// Todo: update to use new parser
debug_DrawTriggerQuest(phaserScene)
{
    if (phaserScene.questTriggerDebug === undefined)
        phaserScene.questTriggerDebug = [];
    else
    {
        for (let i = phaserScene.questTriggerDebug.length - 1; i >= 0; i--)
        {
            phaserScene.questTriggerDebug[i].destroy();
            phaserScene.questTriggerDebug.pop(i);
        }
    }

    for (let i = 0; i < phaserScene.sharedData.quest.logic.activeQuests.length; i++)
    {
        let questGlobalData = this.getQuestPerID(phaserScene, phaserScene.sharedData.quest.logic.activeQuests[i]);
        let triggerData = questGlobalData.line[0].trigger.object[0];

        if (triggerData.zoneId != undefined && 
            triggerData.zoneId == phaserScene.ZONE_ID)
        {
            for (let x = triggerData.centerX - triggerData.radius; x < triggerData.centerX + triggerData.radius; x++) {
                for (let y = triggerData.centerY - triggerData.radius; y < triggerData.centerY + triggerData.radius; y++) {
                    if (Math.abs(x - triggerData.centerX) + Math.abs(y - triggerData.centerY) <= triggerData.radius) {
                        let pos = phaserScene.playerObj.gridToIsoMap(parseInt(x), parseInt(y));
                        var rect = new Phaser.GameObjects.Rectangle(phaserScene, pos.x, pos.y, 25, 12, 0xff0000, 1).setAlpha(.5);
                        phaserScene.add.existing(rect);
                    }
                }
            }
        }  
    }
}


    //------- QUEST LOADING -------
    // TODO : get the quests info from somewhere
    #QUEST_DATA_FOLDER = "./lang/fr/"; // TODO : Handle with loca system
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
     * @param {*} phaserScene 
     */
    preloadQuestData(phaserScene) {
        this.#QUEST_FILE_NAMES.forEach(file => {
            phaserScene.load.xml(file, `${this.#QUEST_DATA_FOLDER}/${file}.xml`);
        });
    }

    /**
     * Loads and parses the xml files from the cache, and then initializes the quests. Should be called from the loadScreen scene
     * @param {*} phaserScene 
     */

    initializeQuestData(phaserScene)
    {
        phaserScene.sharedData.questData = []
        for (let index = 0; index < this.#QUEST_FILE_NAMES.length; index++) {
            phaserScene.sharedData.questData.push(altParseQuestXML(this, phaserScene.cache.xml.get(this.#QUEST_FILE_NAMES[index])))
        }

        phaserScene.sharedData.quest = {};
        phaserScene.sharedData.quest.logic = 
        {
            quests: phaserScene.sharedData.questData,
            activeQuests: []
        }

        // console.log(phaserScene.sharedData.quest.logic.quests);

        // TODO: Handle state based on savesystem, for now we assume it's always the first time playing

        // If first time on the game -> we show the first tutorial quests   
        this.#makeQuestAvailable(phaserScene, "ADS-0000000825", "ADV-0000000899", "QUE-0000002110"); // freeplay_v2.xml
        this.#makeQuestAvailable(phaserScene, "ADS-0000000825", "ADV-0000000899", "QUE-0000002105"); // freeplay_v2.xml
        //this.#makeQuestAvailable(phaserScene, "ADS-0000001163", "ADV-0000001798", "QUE-0000006273"); // intro_cottage.xml
    }

    #makeQuestAvailable(phaserScene, fileID, adventureID, questID)
    {
        var questData = this.getQuestPerID(phaserScene, [fileID, adventureID, questID]);
        if (questData === undefined) return;
        questData.status = this.QUEST_STATES.WAITING;
        console.log("Showing quest: " + fileID + " - " + adventureID + " - " + questID + " - " + questData.description);

        phaserScene.sharedData.quest.logic.activeQuests.push([fileID, adventureID, questID])

        // TODO: Handle showing icons on map and handling correct triggers
    }


    //------- QUEST TRIGGERS -------
    /**
     * Checks if any active quests should be triggered.
     * @param {*} phaserScene 
     * @param {*} triggerData The data to send to the trigger function
     * @returns 
     */
    tryTriggerQuest(phaserScene, triggerData)
    {
        for (let i = 0; i < phaserScene.sharedData.quest.logic.activeQuests.length; i++)
        {
            let questGlobalData = this.getQuestPerID(phaserScene, phaserScene.sharedData.quest.logic.activeQuests[i]);
            let nextLine = (questGlobalData.currentLine === undefined) ? 0 : questGlobalData.currentLine + 1;
            if (nextLine >= questGlobalData.line.length || 
                questGlobalData.line[nextLine].trigger === undefined || 
                questGlobalData.line[nextLine].trigger.object === undefined) continue;

            let triggers = questGlobalData.line[nextLine].trigger.object
            for (let index = 0; index < triggers.length; index++) {
                const trigger = triggers[index];
                if (this.#QUEST_TRIGGERS[trigger.type]) {
                    this.#QUEST_TRIGGERS[trigger.type](phaserScene, trigger, i, triggerData)
                }
            }
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

    #missingTrigger (phaserScene, trigger, activeQuestIndex, triggerData) {
        console.warn(`Missing trigger: ${trigger.type}`)
    }

    #stopNearTrigger(phaserScene, trigger, activeQuestIndex, triggerData) {
        let questGlobalID = phaserScene.sharedData.quest.logic.activeQuests[activeQuestIndex];
        let questGlobalData = phaserScene.sharedData.questManager.getQuestPerID(phaserScene, questGlobalID);
        let nextLine = (questGlobalData.currentLine === undefined) ? 0 : questGlobalData.currentLine + 1;

        if (trigger 
            && trigger.zoneId 
            && trigger.zoneId === phaserScene.ZONE_ID
            && triggerData.x !== undefined
            && triggerData.y !== undefined
        ) {


            {
                for (let x = triggerData.centerX - triggerData.radius; x < triggerData.centerX + triggerData.radius; x++) {
                    for (let y = triggerData.centerY - triggerData.radius; y < triggerData.centerY + triggerData.radius; y++) {
                        if (Math.abs(x - triggerData.centerX) + Math.abs(y - triggerData.centerY) <= triggerData.radius) {
                            let pos = phaserScene.playerObj.gridToIsoMap(parseInt(x), parseInt(y));
                            var rect = new Phaser.GameObjects.Rectangle(phaserScene, pos.x, pos.y, 25, 12, 0xff0000, 1).setAlpha(.5);
                            phaserScene.add.existing(rect);
                        }
                    }
                }
            }  
            // TODO: verify if this seems correct for quest trigger
            if (Math.abs(triggerData.x - trigger.centerX) + Math.abs(triggerData.y - trigger.centerY) <= trigger.radius) {
                if (nextLine == 0)
                {
                    phaserScene.sharedData.questManager.startQuest(phaserScene, questGlobalID);
                }
                else
                {
                    phaserScene.sharedData.questManager.doQuestAction(phaserScene, questGlobalID, questGlobalData);
                }
                return true;
            }
        } 
        return false
    }

    // TODO: This function is a placeholder to trigger the dialogue box
    #talkQuestTrigger(phaserScene, trigger, activeQuestIndex, triggerData) {
        let questGlobalID = phaserScene.sharedData.quest.logic.activeQuests[activeQuestIndex];
        let questGlobalData = phaserScene.sharedData.questManager.getQuestPerID(phaserScene, questGlobalID);
        let nextLine = (questGlobalData.currentLine === undefined) ? 0 : questGlobalData.currentLine + 1;

        console.warn("TalkQuestTrigger is currently a placeholder function")
        if (nextLine == 0) {
                phaserScene.sharedData.questManager.startQuest(phaserScene, questGlobalID);
            } else {
                phaserScene.sharedData.questManager.doQuestAction(phaserScene, questGlobalID, questGlobalData);
            }
            return true;
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
    // Todo: update to use new parser (Note: unused function)
    checkIfCanDoQuestAction(phaserScene) {
        for(let i = 0; i < phaserScene.sharedData.quest.logic.activeQuests.length; i++)
        {
            let questData = this.getQuestPerID(phaserScene, phaserScene.sharedData.quest.logic.activeQuests[i])
            if (questData.status != this.QUEST_STATES.STARTED)
                continue;

            if (questData.line[globalData.currentLine].currentAction > 0)
                this.doQuestAction(phaserScene, i, questData);
        }
    }

    doQuestAction(phaserScene, questGlobalID, globalData) {
        if (globalData.status == this.QUEST_STATES.UNAVAILABLE ||
            globalData.status == this.QUEST_STATES.CANCELLED ||
            globalData.status == this.QUEST_STATES.FINISHED)
            return;

        let actionData = globalData.line[globalData.currentLine].actions;

        for (let index = 0; index < actionData.object.length; index++) {
            const action = actionData.object[index];
            // console.log("do action")
            // console.log(action)

            if (this.#QUEST_ACTIONS[action.type]) {
                this.#QUEST_ACTIONS[action.type](phaserScene, questGlobalID, action)
            }
        }
    }
    #QUEST_ACTIONS = {
        "LogAdventureBeginAction": this.#missingAction,
        "LogAdventureEndAction": this.#missingAction,
        "LogQuestEndAction": this.#missingAction,
        "AddQuestAction": this.#missingAction,
        "RemoveQuestAction": this.#removeQuestAction,
        "AddQuestFileAction": this.#missingAction,
        "RemoveQuestFileAction": this.#missingAction,
        "ShowAdventureCompleteAction": this.#missingAction,
        "DialogueAction": this.#dialogueAction,
        "DialogueImageAction": this.#missingAction,
        "DialogueChoiceAction": this.#missingAction,
        "MonologueAction": this.#missingAction,
        "AddZoneItemAnywhereAction": this.#missingAction,
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

    #missingAction (phaserScene, questID, action) {
        console.warn(`Missing action: ${action.type}`)
    }

    // Todo: update to use new parser
    #removeQuestAction(phaserScene, questID, action)
    {
        var questData = phaserScene.sharedData.questManager.getQuestPerID(phaserScene, questID);
        if (questData === undefined) return;
        questData.status = phaserScene.sharedData.questManager.QUEST_STATES.FINISHED;

        let questIndex = -1;

        for (let i = 0; i < phaserScene.sharedData.quest.logic.activeQuests.length; i++)
        {
            if (phaserScene.sharedData.quest.logic.activeQuests[i].questData !== questData) continue;

            questIndex = i;
            break;
        }

        phaserScene.sharedData.quest.logic.activeQuests.splice(questIndex, 1);

        console.log("End quest: " + questID[0] + " - " + questID[1] + " - " + questID[2] + " - " + questData.description);
    }

    #dialogueAction(phaserScene, questID, action) {
        let character = action.identifier
        let globalData = phaserScene.sharedData.questManager.getQuestPerID(phaserScene, questID);

        
        let triggers = globalData.line[globalData.currentLine].trigger.object
        for (let index = 0; index < triggers.length; index++) {
            const trigger = triggers[index];
            if (trigger.type === "TalkQuestTrigger" && trigger.identifier) {
                character = trigger.identifier
            }
        }
        
        // Add check for this existing or load it earlier
        phaserScene.sharedData.dialogue.ui.manager.show(phaserScene, character, action.text, undefined);
    }
}