/* Handles the backend aspect of the quests
*  Save/Load quests, Unlock/Finish, etc.
*/

// TODO make this a class
const QUEST_STATES = 
{
    UNAVAILABLE: -1,
    WAITING: 0,
    STARTED: 1,
    FINISHED: 2,
    CANCELLED: 3
}

const QUEST_ACTIONS = 
{
    STARTQUEST: "LogAdventureBeginAction",
    ENDQUEST: "LogQuestEndAction",
    REMOVEQUEST: "RemoveQuestAction",
    NEXTQUEST: "AddQuestAction",
    DIALOGUE: "DialogueAction",
    ADDINVENTORY: "AddMultipleInventoryAction",
    REMOVEINVENTORY: 2,
    GIVEITEMTRIGGER: "GiveItemTrigger",
    TALKQUESTTRIGGER: "TalkQuestTrigger",
    CONTEXTITEMTRIGGER: "ContextItemTrigger",
    ENTERZONETRIGGER: "EnterZoneTrigger",
    STOPNEARTRIGGER: "StopNearTrigger",
    DIALOGUEIMAGEACTION: "DialogueImageAction",
    ADDHORSESHOES: "AddHorseshoesAction",
    STARTTRIGGER: 10,
    ONTEMPLATECONDITION: "ActionOnTemplateCondition",
    TRADETRIGGER: "TradeTrigger",
    ADDZONEITEMANYWHEREACTION: "AddZoneItemAnywhereAction",
    // "LogAdventureEndAction"
    // "RemoveQuestFileAction"
    // "RemoveZoneItemAnywhereAction"
    // "ActionTrigger"
}


//------- QUEST HELPER -------
function getAllQuestsByStatus(phaserScene, status)
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

function getQuestPerID(phaserScene, globalID, adventureID, questID)
{
    for (let i = 0; i < phaserScene.sharedData.quest.logic.quests.length; i++)
    {
        if (phaserScene.sharedData.quest.logic.quests[i][globalID]) {
            return phaserScene.sharedData.quest.logic.quests[i][globalID][adventureID][questID];
        }
    }

    console.error("No Quest found! " + globalID + " - " + adventureID + " - " + questID);
}

function getAdventurePerID(phaserScene, globalID, adventureID)
{
    for (let i = 0; i < phaserScene.sharedData.quest.logic.quests.length; i++)
    {
        if (phaserScene.sharedData.quest.logic.quests[i][globalID]) {
            return phaserScene.sharedData.quest.logic.quests[i][globalID][adventureID];
        }
    }

    console.error("No Adventure found! " + globalID + " - " + adventureID);
}

function getQuestStatus(phaserScene, globalID, adventureID, questID)
{
    return getQuestPerID(phaserScene, globalID, adventureID, questID).status;
}

//------- END QUEST HELPER -------

//------- QUEST TRIGGERS -------
function tryTriggerQuest(phaserScene, xPos, yPos)
{
    for (let i = 0; i < phaserScene.sharedData.quest.logic.activeQuests.length; i++)
    {
        let questGlobalData = phaserScene.sharedData.quest.logic.activeQuests[i];
        let nextLine = (questGlobalData.currentLine === undefined) ? 0 : questGlobalData.currentLine++;
        if (nextLine >= questGlobalData.questData.line.length || 
            questGlobalData.questData.line[nextLine].trigger === undefined || 
            questGlobalData.questData.line[nextLine].trigger.object === undefined) continue;

        let triggers = questGlobalData.questData.line[nextLine].trigger.object
        for (let index = 0; index < triggers.length; index++) {
            const trigger = triggers[index];
            switch (trigger.type) {
                case QUEST_ACTIONS.STOPNEARTRIGGER:
                        if (stopNearTrigger(phaserScene, xPos, yPos, trigger, i)) {return true}
                    break;
                case QUEST_ACTIONS.TALKQUESTTRIGGER:
                        if (talkQuestTrigger(phaserScene, trigger, i)) {return true}
                    break;
            
                default:
                    break;
            }
        }
    }

    return false;
}

// TODO Make this a private function
function stopNearTrigger(phaserScene, xPos, yPos, triggerData, activeQuest) {
    let questGlobalData = phaserScene.sharedData.quest.logic.activeQuests[activeQuest];
    let nextLine = (questGlobalData.currentLine === undefined) ? 0 : questGlobalData.currentLine++;

    if (triggerData 
        && triggerData.zoneId 
        && triggerData.zoneId === phaserScene.ZONE_ID
    )
    {
        // TODO: need to modify to be a circle check based on radius
        if (parseInt(triggerData.centerX) - parseInt(triggerData.radius) <= xPos && 
            parseInt(triggerData.centerX) + parseInt(triggerData.radius) >= xPos &&
            parseInt(triggerData.centerY) - parseInt(triggerData.radius) <= yPos && 
            parseInt(triggerData.centerY) + parseInt(triggerData.radius) >= yPos)
            {
                if (nextLine == 0)
                {
                    startQuest(phaserScene, questGlobalData.fileID, questGlobalData.adventureID, questGlobalData.questID);
                }
                else
                {
                    doQuestAction(phaserScene, questGlobalData);
                }
                return true;
            }
    } 
    return false
}

// TODO Make this a private function
function talkQuestTrigger(phaserScene, triggerData, activeQuest) {
    let questGlobalData = phaserScene.sharedData.quest.logic.activeQuests[activeQuest];
    let nextLine = (questGlobalData.currentLine === undefined) ? 0 : questGlobalData.currentLine++;

    if (nextLine == 0) {
            startQuest(phaserScene, questGlobalData.fileID, questGlobalData.adventureID, questGlobalData.questID);
        } else {
            doQuestAction(phaserScene, questGlobalData);
        }
        return true;
}

// Todo: update to use new parser
function debug_DrawTriggerQuest(phaserScene)
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
        let questGlobalData = phaserScene.sharedData.quest.logic.activeQuests[i];
        let triggerData = questGlobalData.questData.line[0].trigger;

        if (triggerData.zone != undefined && 
            triggerData.zone == phaserScene.ZONE_ID)
        {
            let pos = phaserScene.playerObj.gridToIsoMap(parseInt(triggerData.centerX), parseInt(triggerData.centerY));
            // TODO: figure out correct values
            let width = (parseInt(triggerData.radius) * 2) * 50;
            let height = (parseInt(triggerData.radius) * 2) * 50;

            // TODO: figure out why alpha isn't working
            // TODO: update to circle shape when we change the trigger check to be more accurate in tryTriggerQuest();
            var rect = new Phaser.GameObjects.Rectangle(phaserScene, pos.x, pos.y, width, height, 0xff0000, 1);
            phaserScene.add.existing(rect);
        }  
    }
}
//------- END QUEST TRIGGERS -------

//------- QUEST MECHANIC -------
// TODO : get the quests info from somewhere
const QUEST_DATA_FOLDER = "./lang/fr/"; // TODO : Handle with loca system
const QUEST_FILE_NAMES = [
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
function preloadQuestData(phaserScene) {

    QUEST_FILE_NAMES.forEach(file => {
        phaserScene.load.xml(file, `${QUEST_DATA_FOLDER}/${file}.xml`);
    });
}

function loadQuestData(phaserScene) {
    phaserScene.sharedData.questData = []
    for (let index = 0; index < QUEST_FILE_NAMES.length; index++) {
        phaserScene.sharedData.questData.push(altParseQuestXML(phaserScene.cache.xml.get(QUEST_FILE_NAMES[index])))
    }
}

function initializeQuestData(phaserScene)
{
    phaserScene.sharedData.quest = {};
    phaserScene.sharedData.quest.logic = 
    {
        quests: phaserScene.sharedData.questData,
        activeQuests: []
    }

    // console.log(phaserScene.sharedData.quest.logic.quests);

    // TODO: Handle state based on savesystem, for now we assume it's always the first time playing

    // If first time on the game -> we show the first tutorial quests   
    showQuest(phaserScene, "ADS-0000000825", "ADV-0000000899", "QUE-0000002110"); // freeplay_v2.xml
    showQuest(phaserScene, "ADS-0000000825", "ADV-0000000899", "QUE-0000002105"); // freeplay_v2.xml
    //showQuest(phaserScene, "ADS-0000001163", "ADV-0000001798", "QUE-0000006273"); // intro_cottage.xml
}

function showQuest(phaserScene, fileID, adventureID, questID)
{
    var questData = getQuestPerID(phaserScene, fileID, adventureID, questID);
    if (questData === undefined) return;
    questData.status = QUEST_STATES.WAITING;
    console.log("Showing quest: " + fileID + " - " + adventureID + " - " + questID + " - " + questData.description);

    phaserScene.sharedData.quest.logic.activeQuests.push({
        questData: questData,
        fileID: fileID,
        adventureID: adventureID,
        questID: questID
    })

    // TODO: Handle showing icons on map and handling correct triggers
}

function startQuest(phaserScene, fileID, adventureID, questID)
{

    var questData = getQuestPerID(phaserScene, fileID, adventureID, questID);
    if (questData === undefined) return;
    questData.status = QUEST_STATES.STARTED;

    let globalData = {
        questData: questData,
        fileID: fileID,
        adventureID: adventureID,
        questID: questID,
        currentLine: 0
    };

    phaserScene.sharedData.quest.logic.activeQuests.push(globalData);

    // Wait until quest has been added before continuing
    let addingQuest = true
    const duplicates = []
    while (addingQuest) {
        phaserScene.sharedData.quest.logic.activeQuests.forEach(quest => {
            let questMatch = quest.fileID === fileID && quest.adventureID === adventureID && quest.questID === questID
            if (!addingQuest && questMatch) {
                duplicates.push(phaserScene.sharedData.quest.logic.activeQuests.indexOf(quest))
            }
            addingQuest = !questMatch && addingQuest
        });

        // Remove duplicate quests
        let removedTotal = 0
        for (let index = 0; index < duplicates.length; index++) {
            phaserScene.sharedData.quest.logic.activeQuests.splice(duplicates - removedTotal, 1)
        }
    }

    console.log("Start quest: " + fileID + " - " + adventureID + " - " + questID + " - " + questData.description);
    doQuestAction(phaserScene, globalData);
}

// Todo: update to use new parser
function finishQuest(phaserScene, fileID, adventureID, questID)
{
    var questData = getQuestPerID(phaserScene, fileID, adventureID, questID);
    if (questData === undefined) return;
    questData.status = QUEST_STATES.FINISHED;

    let questIndex = -1;

    for (let i = 0; i < phaserScene.sharedData.quest.logic.activeQuests.length; i++)
    {
        if (phaserScene.sharedData.quest.logic.activeQuests[i].questData !== questData) continue;

        questIndex = i;
        break;
    }

    phaserScene.sharedData.quest.logic.activeQuests.splice(questIndex, 1);

    console.log("End quest: " + fileID + " - " + adventureID + " - " + questID + " - " + questData.description);
}

// Todo: update to use new parser
function checkIfCanDoQuestAction(phaserScene)
{
    for(let i = 0; i < phaserScene.sharedData.quest.logic.activeQuests.length; i++)
    {
        if (phaserScene.sharedData.quest.logic.activeQuests[i].questData.status != QUEST_STATES.STARTED)
            continue;

        let globalData = phaserScene.sharedData.quest.logic.activeQuests[i];
        if (globalData.questData.line[globalData.currentLine].currentAction > 0)
            doQuestAction(phaserScene, globalData);
    }
}

function doQuestAction(phaserScene, globalData)
{
    console.log("do action")
    if (globalData.questData.status == QUEST_STATES.UNAVAILABLE ||
        globalData.questData.status == QUEST_STATES.CANCELLED ||
        globalData.questData.status == QUEST_STATES.FINISHED)
        return;

    let actionData = globalData.questData.line[globalData.currentLine].actions;

    for (let index = 0; index < actionData.object.length; index++) {
        const action = actionData.object[index];
        // console.log(action)

        switch(action.type) {
            default:
                break;
            case QUEST_ACTIONS.DIALOGUE:
                console.log("dialogue")
                let character = action.identifier

                let triggers = globalData.questData.line[globalData.currentLine].trigger.object
                for (let index = 0; index < triggers.length; index++) {
                    const trigger = triggers[index];
                    if (trigger.type === QUEST_ACTIONS.TALKQUESTTRIGGER && trigger.identifier) {
                        character = trigger.identifier
                    }
                }
                
                // globalData.questData.line[globalData.currentLine].trigger.identifier
                phaserScene.sharedData.dialogue.ui.manager.show(phaserScene, character, action.text, undefined);
                break;
            case QUEST_ACTIONS.REMOVEQUEST:
                console.log("remove quest")
                finishQuest(phaserScene, globalData.fileID, globalData.adventureID, globalData.questID);
                break;
        }
    }
}

//------- END QUEST MECHANIC -------