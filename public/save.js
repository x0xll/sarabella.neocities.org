const ART_STUDIO_CACHE = "sarabella.neocities.org//BellaSaraArtStudioData";
//const ART_STUDIO_CACHE = "127.0.0.1//BellaSaraArtStudioData"; // DEBUG ONLY

const DATA_TYPE_HORSESHOES = "horseshoes";
const DATA_TYPE_HIGHSCORE = "highscore";
const DATA_TYPE_LEVEL = "level";
const DATA_TYPE_CREATIONS = "creations";
const DATA_TYPE_GAME = "game";
const DATA_TYPE_SETTINGS_TRANSLATEDQUOTES = "settings_tdqt";
const DATA_TYPE_SETTINGS_ORIGINALTRANSLATIONS = "settings_tdog";
const DATA_TYPE_SETTINGS_HORSESHOEMULTIPLICATOR = "settings_hsmul";
const DATA_TYPE_SETTINGS_MAPPLAYPAGE = "settings_mpp";

const SAVE_VERSION = 1;

/** Saved the data to the correct user in localstorage
* @param dataType : the type of data (eg: horseshoe, adventure_quest, etc) to be saved, string
* @param userData : an object with all the data to be saved for this dataType
* @param gameID : the id of the game, optional
*/
function saveData(dataType, userData, gameID = "")
{
    if (currentUser === "guest") return;

    let savedData = JSON.parse(localStorage.getItem(USER_KEY + currentUser));

    let existingData = false;

    if (gameID !== "")
    {
        for (let i = 0; i < savedData.gameData.length; i++)
        {
            if (savedData.gameData[i].id !== gameID) continue;
    
            existingData = true;

            switch(dataType)
            {
                case DATA_TYPE_HIGHSCORE: savedData.gameData[i].highscore = userData; break;
                case DATA_TYPE_LEVEL: savedData.gameData[i].level = userData; break;
                case DATA_TYPE_CREATIONS:
                    switch(gameID)
                    {
                        case getGameID("ArtStudio"): savedData.gameData[i].creations = localStorage.getItem(ART_STUDIO_CACHE); updateSWFLocaleDatas(gameID); break;
                        default: savedData.gameData[i].creations = userData; break;
                    }
                    break;
                case DATA_TYPE_GAME:
                    if (gameID !== "Adventures")
                        savedData.gameData[i].game = userData;
            }
        }

        if (!existingData)
        {
            let currentGameData = 
            {
                id: gameID,
            }

            switch(dataType)
            {
                case DATA_TYPE_HIGHSCORE: currentGameData.highscore = userData; break;
                case DATA_TYPE_LEVEL: currentGameData.level = userData; break;
                case DATA_TYPE_CREATIONS: 
                    switch(gameID)
                    {
                        case getGameID("ArtStudio"): currentGameData.creations = localStorage.getItem(ART_STUDIO_CACHE); updateSWFLocaleDatas(gameID); break;
                        default: currentGameData.creations = userData; break;
                    }
                    break;
                case DATA_TYPE_GAME:
                    if (gameID !== "Adventures") break;
                    currentGameData.game = userData;
            }

            savedData.gameData.push(currentGameData);
        }
    }
    else
    {
        switch(dataType)
        {
            case DATA_TYPE_HORSESHOES: savedData.horseshoes = userData; break;
            case DATA_TYPE_SETTINGS_TRANSLATEDQUOTES: savedData.translatedquotes = userData.checked; break;
            case DATA_TYPE_SETTINGS_ORIGINALTRANSLATIONS: savedData.oglocas = userData.checked; break;
            case DATA_TYPE_SETTINGS_HORSESHOEMULTIPLICATOR: savedData.horseshoesmul = userData.checked; break;
            case DATA_TYPE_SETTINGS_MAPPLAYPAGE: savedData.playpage = userData.checked; break;
        } 
    }

    localStorage.setItem(USER_KEY + currentUser, JSON.stringify(savedData));
    setupUserDropdown();
}

/** Load the data of a specific user from the localstorage
* @param dataType : the type of data (eg: horseshoe, adventure_quest, etc) to be loaded, string
* @returns userData : an object with all the saved userData for this dataType 
* @param gameID : the id of the game, optional
*/
function loadData(dataType, gameID = "")
{
    setCurrentUsername();

    if (currentUser === "guest")
    {
        switch(dataType)
        {
            case DATA_TYPE_SETTINGS_HORSESHOEMULTIPLICATOR:
                return 1;
            case DATA_TYPE_SETTINGS_MAPPLAYPAGE:
            case DATA_TYPE_SETTINGS_ORIGINALTRANSLATIONS:
                return false;
            case DATA_TYPE_SETTINGS_TRANSLATEDQUOTES:
                return true;
            case DATA_TYPE_HORSESHOES:
                return 10000;
            case DATA_TYPE_HIGHSCORE:
            case DATA_TYPE_LEVEL:
                return 0;
            case DATA_TYPE_CREATIONS:
            case DATA_TYPE_GAME:
                return null;
        }
    }

    let savedData = JSON.parse(localStorage.getItem(USER_KEY + currentUser));

    if (gameID != "")
    {
        for (let i = 0; i < savedData.gameData.length; i++)
        {
            if (savedData.gameData[i].id !== gameID) continue;
    
            switch(dataType)
            {
                case DATA_TYPE_HIGHSCORE:
                    if (savedData.gameData[i].highscore === undefined)
                        return 0;
                    return savedData.gameData[i].highscore;
                case DATA_TYPE_LEVEL: 
                    if (savedData.gameData[i].level === undefined)
                        return 0;
                    return savedData.gameData[i].level;
                case DATA_TYPE_CREATIONS:
                    if (savedData.gameData[i].creations === undefined)
                        return "";
                    return savedData.gameData[i].creations
                case DATA_TYPE_GAME:
                    if (savedData.gameData[i].game === undefined)
                        return "";
                    return JSON.parse(savedData.gameData[i].game);
            }
        }
    }

    switch(dataType)
    {
        case DATA_TYPE_SETTINGS_TRANSLATEDQUOTES:
            if (savedData.translatedquotes === undefined)
                return true;
            return savedData.translatedquotes;
        case DATA_TYPE_SETTINGS_ORIGINALTRANSLATIONS:
            if (savedData.oglocas === undefined)
                return false;
            return savedData.oglocas;
        case DATA_TYPE_SETTINGS_HORSESHOEMULTIPLICATOR:
            if (savedData.horseshoesmul === undefined)
                return 1;
            return (savedData.horseshoesmul) ? 100 : 1;
        case DATA_TYPE_SETTINGS_MAPPLAYPAGE:
            if (savedData.playpage === undefined)
                return false;
            return savedData.playpage;
        case DATA_TYPE_HORSESHOES:
            if (savedData.horseshoes === undefined)
                return 0;
            return parseInt(savedData.horseshoes);
        case DATA_TYPE_CREATIONS:
            return null;
        default:
            return 0;
    }
}

function loadSettings()
{
    horseshoemultiplicator = document.getElementById("horseshoemultiplicator");
    horseshoemultiplicator.checked = (loadData(DATA_TYPE_SETTINGS_HORSESHOEMULTIPLICATOR) == 1 ? false : true);
    translatedquotes = document.getElementById("translatedquotes");
    translatedquotes.checked = loadData(DATA_TYPE_SETTINGS_TRANSLATEDQUOTES);
    mapplaypage = document.getElementById("mapplaypage");
    mapplaypage.checked = loadData(DATA_TYPE_SETTINGS_MAPPLAYPAGE);
}

function addHorseshoes(amountAdded)
{
    if (typeof(amountAdded) !== "number")
    {
        amountAdded = parseInt(amountAdded);
    }

    currentAmount = loadData(DATA_TYPE_HORSESHOES);
    amountAdded *= loadData(DATA_TYPE_SETTINGS_HORSESHOEMULTIPLICATOR);
    
    if (Number.MAX_SAFE_INTEGER - amountAdded - currentAmount < 0)
        currentAmount = Number.MAX_SAFE_INTEGER;
    else
        currentAmount += amountAdded;

    saveData(DATA_TYPE_HORSESHOES, currentAmount);
}

function updateHighscore(data)
{
    splittedData = data.split("@");

    // Initialize
    if (splittedData.length == 1)
    {
        currentGame =  data;
        updateHighscoreUI(loadData(DATA_TYPE_HIGHSCORE, getGameID(data)))
        return;
    }

    // Actually update
    gameID = getGameID(splittedData[1]);

    loadedData = loadData(DATA_TYPE_HIGHSCORE, gameID);
    if (parseInt(splittedData[0]) > loadedData)
    {
        saveData(DATA_TYPE_HIGHSCORE, splittedData[0], gameID);

        updateHighscoreUI(splittedData[0].toString())
    }
}

function updateHighscoreUI(value)
{
    highscoreTxt = document.getElementById("highscore");
    if (highscoreTxt !== null)
        highscoreTxt.innerHTML = "<b>Highscore: " + value + "</b>";
}

function updateLevelReached(data)
{
    splittedData = data.split("@");

    gameID = getGameID(splittedData[1]);

    loadedData = loadData(DATA_TYPE_LEVEL, gameID);
    if (parseInt(splittedData[0]) > loadedData)
        saveData(DATA_TYPE_LEVEL, splittedData[0], gameID);
}

function updateCreations(data)
{
    splittedData = data.split("@");

    gameID = getGameID(splittedData[1]);
    saveData(DATA_TYPE_CREATIONS, splittedData[0], gameID);
}

function updateAdventuresData(data)
{
    gameID = getGameID("Adventures");
    saveData(DATA_TYPE_GAME, data, gameID);
}

function updateSWFLocaleDatas(game)
{
    switch(game)
    {
        case "ArtStudio":
            let loadedDatas = loadData(DATA_TYPE_CREATIONS, getGameID(game));
            if (loadedDatas === "" || loadedDatas === undefined || loadedDatas === null)
                localStorage.removeItem(ART_STUDIO_CACHE);
            else
                localStorage.setItem(ART_STUDIO_CACHE, loadedDatas);
        break;
    }
}