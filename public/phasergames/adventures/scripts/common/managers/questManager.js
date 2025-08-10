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
        "tutorials",
        /*"collectibles",
        "freeplay",
        "free_springfestival",
        "intro_cottage",
        "repeatable",
        "sc_1",
        "sc_6",
        "spc1activation",
        "gp",
        "furniturestore"*/
    ]

    for (let i = 0; i < QUEST_FILES_NAMES.length; i++)
    {
        var questObj = await loadXML(QUEST_DATAS_FOLDER + QUEST_FILES_NAMES[i] + ".xml");
        phaserScene.questManager.quests.push(parseQuestXML(questObj));
    }

    //console.log(phaserScene.questManager.quests);
}

function startQuest(phaserScene, questID)
{
    phaserScene.quests[questID].status = QUEST_STATES.STARTED
}

function updateQuest(phaserScene, questID, newStatus)
{

}

function finishQuest(phaserScene, questID)
{
    phaserScene.quests[questID].status = QUEST_STATES.FINISHED
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