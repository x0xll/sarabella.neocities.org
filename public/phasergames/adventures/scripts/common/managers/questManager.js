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

//------- QUEST HELPER -------
function getAllQuestsByStatus(phaserScene, status)
{
    var quests = [];

    phaserScene.allQuestsIDs.forEach(id => 
    {
        if (phaserScene.questID[id].status === status)
            quests.push(id);
    });

    return quests;
}

//------- END QUEST HELPER -------

//------- QUEST MECHANIC -------
function initializeQuestDatas(phaserScene)
{
    phaserScene.allQuestsIDs = [];
    phaserScene.quests = {};

    // TODO : get the quests infos from somewhere
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