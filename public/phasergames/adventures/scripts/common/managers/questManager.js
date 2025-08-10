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
    TRADETRIGGER: 12
}

//------- QUEST HELPER -------
function getAllQuestsByStatus(phaserScene, status)
{
    var quests = [];

    phaserScene.questManager.quests.forEach(quest => 
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
    for (let i = 0; i < phaserScene.questManager.quests.length; i++)
    {
        if (phaserScene.questManager.quests[i].adventuresID !== globalID) continue;

        for (let j = 0; j < phaserScene.questManager.quests[i].adventureData.length; j++)
        {
            if (phaserScene.questManager.quests[i].adventureData[j].adventureID !== adventureID) continue;

            for (let k = 0; k < phaserScene.questManager.quests[i].adventureData[j].questData.length; k++)
            {
                if (phaserScene.questManager.quests[i].adventureData[j].questData[k].questID === questID)
                    return phaserScene.questManager.quests[i].adventureData[j].questData[k];
            }
        }
    }

    console.error("No Quest found! " + globalID + " - " + adventureID + " - " + questID);
}

function getQuestStatus(phaserScene, globalID, adventureID, questID, status)
{
    return getQuestPerID(phaserScene, globalID, adventureID, questID).status;
}

//------- END QUEST HELPER -------

//------- QUEST MECHANIC -------
async function initializeQuestDatas(phaserScene)
{
    phaserScene.questManager = 
    {
        quests: []
    }

    // TODO : get the quests infos from somewhere
    const QUEST_DATAS_FOLDER = "./lang/fr/"; // TODO : Handle with loca system
    const QUEST_FILES_NAMES = [
        "freeplay_v2",
        /*"tutorials",
        "collectibles",
        "free_springfestival",
        "intro_cottage",
        "repeatable",
        "sc_1",
        "sc_6",
        "spc1activation",
        "gp",
        "furniturestore"*/
        //"freeplay" // not sure this one is used since there is a "freeplay_v2.xml" file
    ]

    for (let i = 0; i < QUEST_FILES_NAMES.length; i++)
    {
        var questObj = await loadXML(QUEST_DATAS_FOLDER + QUEST_FILES_NAMES[i] + ".xml");
        phaserScene.questManager.quests.push(parseQuestXML(questObj));
    }

    // TODO: Handle state based on savesystem, for now we assume it's always the first time playing

    // If first time on the game -> we show the first tutorial quests   
    showQuest(phaserScene, "ADS-0000000825", "ADV-0000000899", "QUE-0000002105"); // freeplay_v2.xml
    //showQuest(phaserScene, "ADS-0000001163", "ADV-0000001798", "QUE-0000006273"); // intro_cottage.xml
}

function showQuest(phaserScene, fileID, adventureID, questID)
{
    var questData = getQuestPerID(phaserScene, fileID, adventureID, questID);
    if (questData === undefined) return;
    questData.status = QUEST_STATES.WAITING;
    console.log("Showing quest: " + fileID + " - " + adventureID + " - " + questID + " - " + questData.description);

    // TODO: Handle showing icons on map and handling correct triggers
}

function startQuest(phaserScene, fileID, adventureID, questID)
{
    var questData = getQuestPerID(phaserScene, fileID, adventureID, questID);
    if (questData === undefined) return;
    questData.status = QUEST_STATES.STARTED;
    console.log("Start quest: " + fileID + " - " + adventureID + " - " + questID + " - " + questData.description);
}

function finishQuest(phaserScene, fileID, adventureID, questID)
{
    var questData = getQuestPerID(phaserScene, fileID, adventureID, questID);
    if (questData === undefined) return;
    questData.status = QUEST_STATES.FINISHED;
    console.log("End quest: " + fileID + " - " + adventureID + " - " + questID + " - " + questData.description);
}

//------- END QUEST MECHANIC -------

//------- QUEST JOURNAL UI -------
function loadQuestJournalUI(phaserScene)
{

}

function initializeQuestJournalUI(phaserScene)
{
    phaserScene.questJournal =
    {
        open: false
    }
}

function showQuestJournal(phaserScene)
{
    if (phaserScene.questJournal === undefined)
        initializeQuestJournalUI(phaserScene);
}

function hideQuestJournal(phaserScene)
{

}
//------- END QUEST JOURNAL UI -------