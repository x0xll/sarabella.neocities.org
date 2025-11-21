/* Handles the backend aspect of the quests
*  Save/Load quests, Unlock/Finish, etc.
*/

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
    STARTQUEST: -4,
    ENDQUEST: -3,
    REMOVEQUEST: -2,
    NEXTQUEST: -1,
    DIALOGUE: 0,
    ADDINVENTORY: 1,
    REMOVEINVENTORY: 2,
    GIVEITEMTRIGGER: 3,
    TALKQUESTTRIGGER: 4,
    CONTEXTITEMTRIGGER: 5,
    ENTERZONETRIGGER: 6,
    STOPNEARTRIGGER: 7,
    DIALOGUEIMAGEACTION: 8,
    ADDHORSESHOES: 9,
    STARTTRIGGER: 10,
    ONTEMPLATECONDITION: 11,
    TRADETRIGGER: 12,
    ADDZONEITEMANYWHEREACTION: 13,
}


//------- QUEST HELPER -------
function getAllQuestsByStatus(phaserScene, status)
{
    var quests = [];

    phaserScene.sharedData.quest.logic.quests.forEach(quest => 
    {
        quest.adventureData.forEach(adventure => 
        {
            adventure.questData.forEach(data => {
                if (data.status === status)
                    quests.push(data);
            });
        });
    });

    return quests;
}

function getQuestPerID(phaserScene, globalID, adventureID, questID)
{
    // for (let i = 0; i < phaserScene.sharedData.quest.logic.quests.length; i++)
    // {
    //     if (phaserScene.sharedData.quest.logic.quests[i].adventuresID !== globalID) continue;

    //     for (let j = 0; j < phaserScene.sharedData.quest.logic.quests[i].adventureData.length; j++)
    //     {
    //         if (phaserScene.sharedData.quest.logic.quests[i].adventureData[j].adventureID !== adventureID) continue;

    //         for (let k = 0; k < phaserScene.sharedData.quest.logic.quests[i].adventureData[j].questData.length; k++)
    //         {
    //             if (phaserScene.sharedData.quest.logic.quests[i].adventureData[j].questData[k].questID === questID)
    //                 return phaserScene.sharedData.quest.logic.quests[i].adventureData[j].questData[k];
    //         }
    //     }
    // }

    for (let i = 0; i < phaserScene.sharedData.quest.logic.quests.length; i++)
    {
        console.log(phaserScene.sharedData.quest.logic.quests)
        if (phaserScene.sharedData.quest.logic.quests[i].globalID) {
            return phaserScene.sharedData.quest.logic.quests[i][globalID][adventureID][questID];
        }
    }

    console.error("No Quest found! " + globalID + " - " + adventureID + " - " + questID);
}

function getAdventurePerID(phaserScene, globalID, adventureID)
{
    for (let i = 0; i < phaserScene.sharedData.quest.logic.quests.length; i++)
    {
        if (phaserScene.sharedData.quest.logic.quests[i].adventuresID !== globalID) continue;

        for (let j = 0; j < phaserScene.sharedData.quest.logic.quests[i].adventureData.length; j++)
        {
            if (phaserScene.sharedData.quest.logic.quests[i].adventureData[j].adventureID !== adventureID) continue;

            return phaserScene.sharedData.quest.logic.quests[i].adventureData[j];
        }
    }

    console.error("No Adventure found! " + globalID + " - " + adventureID);
}

function getQuestStatus(phaserScene, globalID, adventureID, questID, status)
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
        if (nextLine >= questGlobalData.questData.lines.length) continue;

        let triggerData = questGlobalData.questData.lines[nextLine].trigger;

        if (triggerData.zone != undefined && 
            triggerData.zone == phaserScene.ZONE_ID)
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
    }

    return false;
}

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
        let triggerData = questGlobalData.questData.lines[0].trigger;

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
// TODO : get the quests infos from somewhere
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

async function initializeQuestDatas(phaserScene)
{
    phaserScene.sharedData.quest = {};
    phaserScene.sharedData.quest.logic = 
    {
        quests: phaserScene.sharedData.questData,
        activeQuests: []
    }

    console.log(phaserScene.sharedData.quest.logic.quests);

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

    console.log("Start quest: " + fileID + " - " + adventureID + " - " + questID + " - " + questData.description);
    doQuestAction(phaserScene, globalData);
}

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

function checkIfCanDoQuestAction(phaserScene)
{
    for(let i = 0; i < phaserScene.sharedData.quest.logic.activeQuests.length; i++)
    {
        if (phaserScene.sharedData.quest.logic.activeQuests[i].questData.status != QUEST_STATES.STARTED)
            continue;

        let globalData = phaserScene.sharedData.quest.logic.activeQuests[i];
        if (globalData.questData.lines[globalData.currentLine].currentAction > 0)
            doQuestAction(phaserScene, globalData);
    }
}

function doQuestAction(phaserScene, globalData)
{
    if (globalData.questData.status == QUEST_STATES.UNAVAILABLE ||
        globalData.questData.status == QUEST_STATES.CANCELLED ||
        globalData.questData.status == QUEST_STATES.FINISHED)
        return;

    let actionData = globalData.questData.lines[globalData.currentLine];

    if (actionData.currentAction === undefined)
        actionData.currentAction = 0;

    let actionIndex = actionData.currentAction;

    // TODO: need to check if can have multiple different actions in one actionData
    switch(actionData.actions[actionIndex].type)
    {
        default:
            return;
        case QUEST_ACTIONS.DIALOGUE:
            // TODO: Figure out how to get the name from the iconID
            phaserScene.sharedData.dialogue.ui.manager.show(phaserScene, {name: actionData.actions[actionIndex].iconID, id: actionData.actions[actionIndex].iconID}, actionData.actions[actionIndex].text, undefined);
            break;
        case QUEST_ACTIONS.REMOVEQUEST:
            finishQuest(phaserScene, globalData.fileID, globalData.adventureID, globalData.questID);
            return;
    }

    if (actionData.actions.length > actionIndex)
    {
        actionData.currentAction++;
        // TODO: Figure out when we need to keep going or when we need to wait for user input (eg: when a dialogue needs to have "continue" clicked)
        if (actionData.actions[actionData.currentAction].type == QUEST_ACTIONS.REMOVEQUEST)
            doQuestAction(phaserScene, globalData);
        return;
    }

    actionData.currentAction = 0;

    if (globalData.currentLine + 1 > globalData.questData.lines.length)
    {
        finishQuest(phaserScene, globalData.fileID, globalData.adventureID, globalData.questID);
        return;
    }

    globalData.currentLine++;
}

//------- END QUEST MECHANIC -------