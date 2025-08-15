/* Handles the backend aspect of the quests
*  Save/Load quests, Unlock/Finish, etc.
*/

const QUEST_PANEL_IMG = "quest_bgpanel"

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

const THIN_TEXT_BLACK_SETTINGS = 
{
    font: "12px Arial",
    color: "black",
    wordWrap: { width: 650 }
}

const BOLD_TEXT_BLACK_SETTINGS = 
{
    font: "24px Arial bold",
    color: "black",
    wordWrap: { width: 250 }
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

function getAdventurePerID(phaserScene, globalID, adventureID)
{
    for (let i = 0; i < phaserScene.questManager.quests.length; i++)
    {
        if (phaserScene.questManager.quests[i].adventuresID !== globalID) continue;

        for (let j = 0; j < phaserScene.questManager.quests[i].adventureData.length; j++)
        {
            if (phaserScene.questManager.quests[i].adventureData[j].adventureID !== adventureID) continue;

            return phaserScene.questManager.quests[i].adventureData[j];
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
    for (let i = 0; i < phaserScene.questManager.activeQuests.length; i++)
    {
        let questGlobalData = phaserScene.questManager.activeQuests[i];
        let triggerData = questGlobalData.questData.lines[0].trigger;

        if (triggerData.zone != undefined && 
            triggerData.zone == phaserScene.ZONE_ID)
        {
            // TODO: need to modify to be a circle check based on radius
            if (parseInt(triggerData.centerX) - parseInt(triggerData.radius) <= xPos && 
                parseInt(triggerData.centerX) + parseInt(triggerData.radius) >= xPos &&
                parseInt(triggerData.centerY) - parseInt(triggerData.radius) <= yPos && 
                parseInt(triggerData.centerY) + parseInt(triggerData.radius) >= yPos)
                {
                    startQuest(phaserScene, questGlobalData.fileID, questGlobalData.adventureID, questGlobalData.questID);
                    return true;
                }

            console.log("Hello");
        }  
    }

    return false;
}
//------- END QUEST TRIGGERS -------

//------- QUEST MECHANIC -------
async function initializeQuestDatas(phaserScene)
{
    phaserScene.questManager = 
    {
        quests: [],
        activeQuests: []
    }

    // TODO : get the quests infos from somewhere
    const QUEST_DATAS_FOLDER = "./lang/fr/"; // TODO : Handle with loca system
    const QUEST_FILES_NAMES = [
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

    for (let i = 0; i < QUEST_FILES_NAMES.length; i++)
    {
        var questObj = await loadXML(QUEST_DATAS_FOLDER + QUEST_FILES_NAMES[i] + ".xml");
        phaserScene.questManager.quests.push(parseQuestXML(questObj));
    }

    console.log(phaserScene.questManager.quests);

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

    phaserScene.questManager.activeQuests.push({
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

    phaserScene.questManager.activeQuests.push({
        questData: questData,
        fileID: fileID,
        adventureID: adventureID,
        questID: questID
    })

    console.log("Start quest: " + fileID + " - " + adventureID + " - " + questID + " - " + questData.description);
}

function finishQuest(phaserScene, fileID, adventureID, questID)
{
    var questData = getQuestPerID(phaserScene, fileID, adventureID, questID);
    if (questData === undefined) return;
    questData.status = QUEST_STATES.FINISHED;

    let questIndex = -1;

    for (let i = 0; i < phaserScene.questManager.activeQuests.length; i++)
    {
        if (phaserScene.questManager.activeQuests[i].questData !== questData) continue;

        questIndex = i;
        break;
    }

    phaserScene.questManager.activeQuests.splice(questIndex, 1);

    console.log("End quest: " + fileID + " - " + adventureID + " - " + questID + " - " + questData.description);
}

//------- END QUEST MECHANIC -------

//------- QUEST JOURNAL UI -------
function loadQuestJournalUI(phaserScene)
{
    // Background panel
    phaserScene.load.image(QUEST_PANEL_IMG, "./assets/extracted/UI/Quest/Journal_Panel.png");

    // Close btn
    phaserScene.load.image("closebtn", "./assets/extracted/UI/Quest/closebtn.png")
}

function initializeQuestJournalUI(phaserScene)
{
    var panel = phaserScene.add.image(35, -20, QUEST_PANEL_IMG)
                    .setOrigin(0)
                    .setScrollFactor(0)
                    .setDepth(100);

    // Left page
    // TODO: scrollview with quests

    // Right page
    var currentQuestTitle = phaserScene.add.text(430, 140, 'Quest Title', BOLD_TEXT_BLACK_SETTINGS)
                    .setOrigin(0)
                    .setScrollFactor(0)
                    .setDepth(100);

    // TODO: Link to loca
    var lookforTxt = phaserScene.add.text(520, 200, 'Look for:', THIN_TEXT_BLACK_SETTINGS)
                    .setOrigin(0)
                    .setScrollFactor(0)
                    .setDepth(100);

    var lookforDescTxt = phaserScene.add.text(540, 220, 'Thing to look for', THIN_TEXT_BLACK_SETTINGS)
                    .setOrigin(0)
                    .setScrollFactor(0)
                    .setDepth(100);

    // TODO: Link to loca
    var locationTxt = phaserScene.add.text(520, 250, 'Location:', THIN_TEXT_BLACK_SETTINGS)
                    .setOrigin(0)
                    .setScrollFactor(0)
                    .setDepth(100);

    var locationDescTxt = phaserScene.add.text(540, 270, 'Place to go to', THIN_TEXT_BLACK_SETTINGS)
                    .setOrigin(0)
                    .setScrollFactor(0)
                    .setDepth(100);
        
    // TODO: Link to loca
    var goalTxt = phaserScene.add.text(435, 310, 'Goal:', THIN_TEXT_BLACK_SETTINGS)
                    .setOrigin(0)
                    .setScrollFactor(0)
                    .setDepth(100);

    var goalDescTxt = phaserScene.add.text(455, 330, 'Goal to do', THIN_TEXT_BLACK_SETTINGS)
                    .setOrigin(0)
                    .setScrollFactor(0)
                    .setDepth(100);

    var questIcon = phaserScene.add.image(455, 222.5, "closebtn")
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setDepth(100);

    var closeBtn = phaserScene.add.image(687, 112, "closebtn")
                    .setOrigin(0)
                    .setScrollFactor(0)
                    .setDepth(100)
                    .setInteractive();

    closeBtn.on('pointerup', function (pointer) 
    { 
        hideQuestJournal(phaserScene);
    });

    phaserScene.questManager.journal =
    {
        open: false,
        panelImg: panel,
        closeBtn: closeBtn,
        // Right page
        questTitle: currentQuestTitle,
        lookforTxt: lookforTxt,
        lookforDescTxt: lookforDescTxt,
        locationTxt: locationTxt,
        locationDescTxt: locationDescTxt,
        goalTxt: goalTxt,
        goalDescTxt: goalDescTxt,
        questIcon: questIcon
        // Left page
    }

    hideQuestJournal(phaserScene);
}

function showQuestJournal(phaserScene)
{
    if (phaserScene.questManager.journal.open)
        hideQuestJournal(phaserScene);

    if (phaserScene.questManager.questJournal === undefined)
        initializeQuestJournalUI(phaserScene);
    
    phaserScene.questManager.journal.open = true;
    phaserScene.questManager.journal.panelImg.setAlpha(1);
    phaserScene.questManager.journal.closeBtn.setAlpha(1);

    if (phaserScene.questManager.activeQuests !== undefined && phaserScene.questManager.activeQuests.length > 0)
    {
        // We default on the first quest, if it isn't possible to show it (ie: waiting state + no trigger)
        // Then we try the next one until we either have one or nothing
        let firstQuest = phaserScene.questManager.activeQuests[0];
        let isShowable = false;
        for (let i = 0; i < phaserScene.questManager.activeQuests.length; i++)
        {
            firstQuest = phaserScene.questManager.activeQuests[i];
            let isShowable = selectCurrentQuestForDetails(phaserScene, firstQuest.fileID, firstQuest.adventureID, firstQuest.questID);
            if (isShowable)
                break;
        }
    }
}

function hideQuestJournal(phaserScene)
{
    phaserScene.questManager.journal.open = false;
    phaserScene.questManager.journal.panelImg.setAlpha(0);
    phaserScene.questManager.journal.closeBtn.setAlpha(0);
    phaserScene.questManager.journal.questTitle.setAlpha(0);
    phaserScene.questManager.journal.lookforTxt.setAlpha(0);
    phaserScene.questManager.journal.lookforDescTxt.setAlpha(0);
    phaserScene.questManager.journal.locationTxt.setAlpha(0);
    phaserScene.questManager.journal.locationDescTxt.setAlpha(0);
    phaserScene.questManager.journal.goalTxt.setAlpha(0);
    phaserScene.questManager.journal.goalDescTxt.setAlpha(0);
    phaserScene.questManager.journal.questIcon.setAlpha(0);
}

function selectCurrentQuestForDetails(phaserScene, globalID, adventureID, questID)
{
    let quest = getQuestPerID(phaserScene, globalID, adventureID, questID);

    if (quest.target.id === undefined && quest.status == QUEST_STATES.WAITING) return false;

    if (quest === undefined) return false;

    phaserScene.questManager.journal.questTitle.setAlpha(1);
    phaserScene.questManager.journal.lookforTxt.setAlpha(1);
    phaserScene.questManager.journal.lookforDescTxt.setAlpha(1);
    phaserScene.questManager.journal.locationTxt.setAlpha(1);
    phaserScene.questManager.journal.locationDescTxt.setAlpha(1);
    phaserScene.questManager.journal.goalTxt.setAlpha(1);
    phaserScene.questManager.journal.goalDescTxt.setAlpha(1);
    phaserScene.questManager.journal.questIcon.setAlpha(1);

    phaserScene.questManager.journal.questTitle.setText(getAdventurePerID(phaserScene, globalID, adventureID).description);
    phaserScene.questManager.journal.lookforDescTxt.setText(""); // TODO: find where we get
    phaserScene.questManager.journal.locationDescTxt.setText(""); // TODO: find where we get
    phaserScene.questManager.journal.goalDescTxt.setText(quest.description);
    //phaserScene.questManager.journal.questIcon.setTexture(); // TODO: find where we get
    return true;
}
//------- END QUEST JOURNAL UI -------