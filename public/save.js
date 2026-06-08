const CACHE_DATA = {
    AS: getBaseUrl() + "//BellaSaraArtStudioData",
    COT1: getBaseUrl() + "//BellaSaraRoomData",
    COT2: getBaseUrl() + "//BellSaraSignatureData"
}

const GAME_ID = {
    MagicBubbleWand: "MBW",
    SpectacularJumpingGame: "SJG",
    Citrustacked: "CIT",
    ArtStudio: "AS",
    MyCottage: "COT",
    DreamRider: "DR",
    CloudJumper: "CJ",
    TreasuresHunt: "TH",
    SantoQuiz: "SQZ",
    BelloQuiz: "BQZ",
    YinYangMemory: "YYM",
    FirelightFestival: "FF",
    LanceRiding: "LR",
    MyHorse: "FOA",
    DressUp: "DUG",
    AdventuresQuiz: "AQZ",
    AutumnJourneyQuiz: "JQZ",
    Adventures: "ADV",
    Coloring: "COL",
    Puzzle: "PUZ",
    Stables: "STA",
    ArtIdeaGenerator: "AIG",
    Storybook: "STB",
    MarvelousMagicMatch: "MMM",
    WheelofWonders: "WOW",
    BellisimosJumpingContest: "BJC",
    Bellapedia: "BPD",
    DynamosDressageArena: "DDA",
    Trailblazer: "TBZ",
    BellaBeautyBox: "BBB",
    Journal: "JOU",
    Bazaar: "BAZ",
    MyThings: "THI",
    Adventures: "BSA",
}

const DATA_TYPES = {
    horseshoes : "horseshoes",
    highscore : "highscore",
    level : "level",
    creations : "creations",
    game : "game",
    lastPlayed : "lastplayed",
    freespin : "freespin",
    gallery: "gallery",
    translatedQuotes : "settings_tdqt",
    originalTranslations : "settings_tdog",
    horseshoesMultiplier : "settings_hsmul",
    mapPlayPage : "settings_mpp",
    roomData : "roomData",
    roomSignature : "roomSignature"
}

const DATA_DEFAULT = {
    horseshoes : 100,
    highscore : 0,
    level : 0,
    creations : null,
    game : null,
    lastPlayed : -1,
    freespin : 1,
    gallery: null,
    translatedQuotes : true,
    originalTranslations : false,
    horseshoesMultiplier : 1,
    mapPlayPage : false,
    roomData : null,
    roomSignature : null
}

const SAVE_VERSION = 1;

/** Saved the data to the correct user in localstorage
* @param dataType : the type of data (eg: horseshoe, adventure_quest, etc) to be saved, string
* @param userData : an object with all the data to be saved for this dataType
* @param gameID : the id of the game, optional
*/
function saveData(dataType, userData, gameID = "")
{
    if (currentUser === "guest") return;

    gameID = (GAME_ID[gameID] !== undefined) ? GAME_ID[gameID] : gameID;

    let data = JSON.parse(localStorage.getItem(USER_KEY + currentUser));

    if (!data) {
        data = {
            version : SAVE_VERSION,
            gameData : []
        }
    }

    let gameIndex = getGameIdSaveIndex(gameID, data);
    if (gameIndex === -1)
    {       
        gameIndex = data.gameData.length;
        data.gameData.push({
            id: gameID
        })
    }

    switch(dataType)
    {
        case DATA_TYPES.creations: {
            if (gameID === GAME_ID.DressUp) {
                data.gameData[gameIndex][dataType] = userData; 
            } else {
                data.gameData[gameIndex][dataType] = localStorage.getItem(CACHE_DATA[gameID]); 
                updateSWFLocaleDatas(gameID, gameID, dataType); 
            }
            break;
        }
        case DATA_TYPES.roomData:
        case DATA_TYPES.roomSignature: {
            data.gameData[gameIndex][DATA_TYPES.roomData] = localStorage.getItem(CACHE_DATA["COT1"]); 
            data.gameData[gameIndex][DATA_TYPES.roomSignature] = localStorage.getItem(CACHE_DATA["COT2"]); 
            updateSWFLocaleDatas(gameID, "COT1", DATA_TYPES.roomData); 
            updateSWFLocaleDatas(gameID, "COT2", DATA_TYPES.roomSignature); 
            break;
        }
        default: {
            if (gameID === "") {
                if (userData.checked === undefined) {
                    data[dataType] = userData;
                }
                else {
                    data[dataType] = userData.checked; 
                }
            }
            else {
                data.gameData[gameIndex][dataType] = userData;
            }
            break;
        }
    }

    localStorage.setItem(USER_KEY + currentUser, JSON.stringify(data));
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
            case DATA_TYPES.horseshoes: {
                return 10000;
            }
            default: {
                return DATA_DEFAULT[getKeyByValue(DATA_TYPES, dataType)];
            }
        }
    }

    let data = JSON.parse(localStorage.getItem(USER_KEY + currentUser));
    if (!data) {      
        data = 
        {
            version : SAVE_VERSION,
            gameData: []
        }
    }
    let gameIndex = getGameIdSaveIndex(gameID, data);

    if ((gameID === "" && data[dataType] === undefined) ||
        (gameID !== "" && (data.gameData[gameIndex] === undefined || (data.gameData[gameIndex] !== undefined && data.gameData[gameIndex][dataType] === undefined)))) {
            return DATA_DEFAULT[getKeyByValue(DATA_TYPES, dataType)];
        }
    else {
        data = gameID === "" ? data : data.gameData[gameIndex]
        switch(dataType)
        {
            case DATA_TYPES.creations:
                if (gameID === GAME_ID.DressUp) {
                    return JSON.parse(data[dataType]);
                } else {
                    return data[dataType]
                }
            case DATA_TYPES.lastPlayed: 
            case DATA_TYPES.roomData: 
            case DATA_TYPES.roomSignature: 
            case DATA_TYPES.gallery: 
            case DATA_TYPES.translatedQuotes: 
            case DATA_TYPES.game: 
            case DATA_TYPES.mapPlayPage: 
            case DATA_TYPES.originalTranslations: {
                return data[dataType]
            }
            case DATA_TYPES.highscore:
            case DATA_TYPES.freespin:
            case DATA_TYPES.horseshoes:
            case DATA_TYPES.level: {
                return parseInt(data[dataType]);
            }
            case DATA_TYPES.horseshoesMultiplier: {
                return (data[dataType]) ? 100 : 1;
            }
        }
    }

    
}

function loadSettings()
{
    horseshoemultiplicator = document.getElementById("horseshoemultiplicator");
    horseshoemultiplicator.checked = (loadData(DATA_TYPES.horseshoesMultiplier) == 1 ? false : true);
    translatedquotes = document.getElementById("translatedquotes");
    translatedquotes.checked = loadData(DATA_TYPES.translatedQuotes);
    mapplaypage = document.getElementById("mapplaypage");
    mapplaypage.checked = loadData(DATA_TYPES.mapPlayPage);
}

function addHorseshoes(amountAdded)
{
    if (typeof(amountAdded) !== "number")
    {
        amountAdded = parseInt(amountAdded);
    }

    currentAmount = loadData(DATA_TYPES.horseshoes);
    amountAdded *= loadData(DATA_TYPES.horseshoesMultiplier);
    
    if (Number.MAX_SAFE_INTEGER - amountAdded - currentAmount < 0)
        currentAmount = Number.MAX_SAFE_INTEGER;
    else
        currentAmount += amountAdded;

    saveData(DATA_TYPES.horseshoes, currentAmount);
}

function removeHorseshoes(amountRemoved)
{
    if (typeof(amountRemoved) !== "number")
    {
        amountRemoved = parseInt(amountRemoved);
    }

    currentAmount = loadData(DATA_TYPES.horseshoes);
    
    if (currentAmount - amountRemoved < 0)
        currentAmount = 0;
    else
        currentAmount -= amountRemoved;

    saveData(DATA_TYPES.horseshoes, currentAmount);
}

function updateHighscore(data)
{
    splittedData = data.split("@");

    // Initialize
    if (splittedData.length == 1)
    {
        currentGame = data;
        gameID = (GAME_ID[data] !== undefined) ? GAME_ID[data] : "";
        updateHighscoreUI(loadData(DATA_TYPES.highscore, gameID))
        return;
    }

    // Actually update
    gameID = (GAME_ID[splittedData[1]] !== undefined) ? GAME_ID[splittedData[1]] : "";

    loadedData = loadData(DATA_TYPES.highscore, gameID);
    if (parseInt(splittedData[0]) > loadedData)
    {
        saveData(DATA_TYPES.highscore, splittedData[0], gameID);

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

    gameID = (GAME_ID[splittedData[1]] !== undefined) ? GAME_ID[splittedData[1]] : "";

    loadedData = loadData(DATA_TYPES.level, gameID);
    if (parseInt(splittedData[0]) > loadedData)
        saveData(DATA_TYPES.level, splittedData[0], gameID);
}

function updateCreations(data)
{
    splittedData = data.split("@");

    gameID = (GAME_ID[splittedData[1]] !== undefined) ? GAME_ID[splittedData[1]] : "";
    saveData(DATA_TYPES.creations, splittedData[0], gameID);
}

function updateAdventuresData(data)
{
    saveData(DATA_TYPES.game, data, GAME_ID.Adventures);
}

function updateSWFLocaleDatas(game, cache, dataType)
{
    game = (GAME_ID[game] !== undefined) ? GAME_ID[game] : game;
    let loadedDatas = loadData(dataType, game);
    if (loadedDatas === "" || loadedDatas === undefined || loadedDatas === null)
        localStorage.removeItem(CACHE_DATA[cache]);
    else
        localStorage.setItem(CACHE_DATA[cache], loadedDatas);
}

function addGalleryItem(itemName)
{
    gallery = loadData(DATA_TYPES.gallery);
    if (gallery == null)
        gallery = []

    let existed = false;

    gallery.forEach(item => {
        if (item.name == itemName)
        {
            existed = true;
            item.quantity++;
            saveData(DATA_TYPES.gallery, gallery);
            return;
        }
    });

    if (existed) return;

    gallery.push(
        {
            name: itemName,
            quantity: 1
        }
    )
    
    saveData(DATA_TYPES.gallery, gallery);
}

function updateLastDatePlayed(gameID)
{
    gameID = (GAME_ID[gameID] !== undefined) ? GAME_ID[gameID] : gameID;
    date = new Date();
    playedDate = loadData(DATA_TYPES.lastPlayed, gameID);
    playedDate = date.getDate().toString() + "/" + (date.getMonth() + 1).toString() + "/" + date.getFullYear().toString();
    saveData(DATA_TYPES.lastPlayed, playedDate , gameID);
}

/**
 * Updates the room data with a new value
 * @param {*} data the new data for the rooms
 */
function updateRoomData(data) {
    console.log("updating room data", roomID, data)
    saveData(DATA_TYPES.roomData, data, GAME_ID.MyCottage)
}

function removeFreeSpin()
{
    freespin = loadData(DATA_TYPES.freespin, GAME_ID.WheelofWonders);
    freespin -= 1;
    saveData(DATA_TYPES.freespin, freespin, GAME_ID.WheelofWonders);
}

function addFreeSpin()
{
    freespin = loadData(DATA_TYPES.freespin, GAME_ID.WheelofWonders);
    freespin += 1;
    saveData(DATA_TYPES.freespin, freespin, GAME_ID.WheelofWonders);
}

function getGameIdSaveIndex(gameID, data)
{
    if (gameID === undefined || gameID === "")
        return -2;

    for (let i = 0; i < data.gameData.length; i++)
    {
        if (data.gameData[i].id !== gameID) continue;
        return i;
    }

    return -1;
}

function getBaseUrl() {
    let url = window.location.origin;
    return url.replace("http://", "").replace(":5500", "");
}
function getKeyByValue(object, value) {
    return Object.keys(object).find(key =>
        object[key] === value);
}

function getHorseshoes()
{
    return loadData(DATA_TYPES.horseshoes);
}