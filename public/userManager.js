// Handles a fake user situation with the help of local storage
// Would store a username, horseshoes, cottage datas, adventures, etc.
// Need to check how much space this would take, to calculate how many users we authorize
// Creating a "share" type button to pass the user saved datas to another navigator could be interesting to prevent loss of progress

const DATA_TYPE_HORSESHOES = "horseshoes";
const DATA_TYPE_HIGHSCORE = "highscore";
const DATA_TYPE_LEVEL = "level";

const USER_KEY = "neocitiesbesa_user_";
const MAX_USERS = 2; // TODO : define based on max size allowed on local storage
const USER_AMOUNT_KEY = "neocities_besa_userAmount"; 
const USER_NAMES_KEY = "neocities_besa_userNames"; 
const CURRENT_USER_KEY = "neocities_besa_currentUser"; 

let currentUser = undefined;

// ------- UI -------
function setupUserDropdown()
{
    userDropdown = document.getElementById("currentUserDropdown");
    userAmount = localStorage.getItem(USER_AMOUNT_KEY);
    userNames = localStorage.getItem(USER_NAMES_KEY);

    for (let i = userDropdown.options.length - 1; i >= 2; i--)
    {
        userDropdown.options.remove(i);
    }

    if (userAmount > 0)
    {
        splittedUserNames = userNames.split("²");
        for (let i = 0; i < userAmount; i++) {
            userDropdown.options[userDropdown.options.length] = new Option(splittedUserNames[i], splittedUserNames[i]);  
        }
    }

    forceChooseUser(localStorage.getItem(CURRENT_USER_KEY));
}
// ------- END UI -------

// ------- USER ------
function createUser()
{
    username = document.getElementById("signup_username").value;

    if (username == undefined)
    {
        alert("Please choose a username to create a user session."); // TODO : localize
        return;
    }

    if (username.includes("²"))
    {
        alert("Please remove \"²\" character from your username.")
        return;
    }

    if (username.toLowerCase() === "guest" || username.toLowerCase() === "create")
    {
        alert("Please choose another username.")
        return;
    }

    var currentUserAmount = (localStorage.getItem(USER_AMOUNT_KEY)) ? localStorage.getItem(USER_AMOUNT_KEY) : 0;
    if (currentUserAmount < MAX_USERS)
    {
        if (localStorage.getItem(USER_KEY + username))
        {
            alert("This username is already used.");
            return;
        }

        let userDatas = 
        {
            usr: currentUser,
            gameDatas: []
        }

        localStorage.setItem(USER_KEY + username, JSON.stringify(userDatas));
        currentUserAmount++;
        localStorage.setItem(USER_AMOUNT_KEY, currentUserAmount);
        userNames = localStorage.getItem(USER_NAMES_KEY);
        if (userNames === null || userNames === undefined || userNames === "")
            userNames = username;
        else
            userNames += "²" + username;
        localStorage.setItem(USER_NAMES_KEY, userNames);

        currentUser = username;
        saveData(DATA_TYPE_HORSESHOES, 100)
        setupUserDropdown();
        forceChooseUser(username);
        return;
    }

    alert("Too many users created on this navigator... Please delete one before creating a new one."); // TODO: localize
}

function chooseUser()
{
    userDropdown = document.getElementById("currentUserDropdown");
    var username = userDropdown.options[userDropdown.selectedIndex].value;
    currentUser = username;

    if (currentUser == "create")
        window.location.href = "/signup.html";
    else
    {
        localStorage.setItem(CURRENT_USER_KEY, currentUser);

        horseshoes = document.getElementById(DATA_TYPE_HORSESHOES);
        horseshoes.innerHTML = "<img src=\"/images/nav/Horseshoe.png\"> " +loadData(DATA_TYPE_HORSESHOES).toString();
    }
}

function forceChooseUser(username)
{
    currentUser = username;
    userDropdown = document.getElementById("currentUserDropdown");

    if (username === undefined)
        userDropdown.selectedIndex = 0;
    else
    {
        for (let i = 0; i < userDropdown.options.length; i++)
        {
            if (userDropdown.options[i].value === username)
            {
                userDropdown.selectedIndex = i;
                break;
            }
        }
        
    }

    chooseUser();
}

function deleteUser()
{
    username = document.getElementById("signup_username").value;
    userDropdown = document.getElementById("currentUserDropdown");

    if (username.toLowerCase() === "guest" || username.toLowerCase() === "create")
    {
        alert("Please choose another username.")
        return;
    }

    if (!localStorage.getItem(USER_KEY + username))
    {
        alert("User doesn't exists.")
        return;
    }

    var currentUserAmount = (localStorage.getItem(USER_AMOUNT_KEY)) ? localStorage.getItem(USER_AMOUNT_KEY) : 0;
    if (currentUserAmount > 0)
    {
        localStorage.removeItem(USER_KEY + username);
        currentUserAmount--;
        localStorage.setItem(USER_AMOUNT_KEY, currentUserAmount);

        for(let i = userDropdown.options.length - 1; i >= 1; i--)
        {
            if (userDropdown.options[i].value === username)
            {
                userDropdown.options.remove(i);
                break;
            }
        }   

        userNames = localStorage.getItem(USER_NAMES_KEY);
        splittedUserNames = userNames.split("²");
        userNames = "";
        for (let i = splittedUserNames.length - 1; i >= 0; i--) {
            if (splittedUserNames[i] === username) continue;
            
            if (userNames === "")
                userNames = splittedUserNames[i];
            else
                userNames += "²" + splittedUserNames[i];
        }
        localStorage.setItem(USER_NAMES_KEY, userNames);

        setupUserDropdown();

        if (currentUser == username)
            forceChooseUser();

        alert("User deleted");
        return;
    }

    alert("No user to delete, create a user first.") // TODO : localize
}

function exportUser()
{
    username = document.getElementById("signup_username").value;
    let copyText = localStorage.getItem(USER_KEY + username);

    if (copyText === "" || copyText === undefined || copyText === null)
    {
        alert("Please choose an existing user to export datas.")
        return;
    }

    let input = document.getElementById('copy');
    input.value = copyText
    input.style.display = 'inline'
    document.getElementById('copyLable').style.display = 'inline'

    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        // handle iOS devices
        input.contenteditable = true;
        input.readonly = false;

        let range = document.createRange();
        range.selectNodeContents(input);

        let selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        input.setSelectionRange(0, 999999);
        } else {
        // other devices are easy
        input.select()
        }
        document.execCommand('copy');
        
    // Alert the copied text
    alert(copyText);
}

function importUser()
{
    datas = document.getElementById("datas").value;
    if (datas === "")
    {
        alert("Please enter valid datas from an exported save");
        return;
    }

    splittedDatas = datas.split("²");
    username = splittedDatas[0].split(":")[1];

    allUsernames = localStorage.getItem(USER_NAMES_KEY);

    if (allUsernames != undefined && allUsernames != "" && allUsernames != null)
    {
        splittedUsernames = allUsernames.split("²");
        let existingUser = false;
        splittedUserNames.forEach(user => {
            if (user === username)
            {
                localStorage.setItem(USER_KEY + username, datas);
                existingUser = true;
                return;
            }
        });
    
        if (existingUser)
        {
            alert("Datas imported succesfully for user: " + username);
            forceChooseUser(username);
            return;
        }
    }
    
    userAmount = localStorage.getItem(USER_AMOUNT_KEY);
    if (userAmount >= MAX_USERS)
    {
        alert("Too many users. Please delete an account before importing a new one.")
        return;
    }

    userAmount++;
    localStorage.setItem(USER_AMOUNT_KEY, userAmount);
    localStorage.setItem(USER_KEY + username, datas);

    if (allUsernames === null || allUsernames === undefined || allUsernames === "")
        allUsernames = username;
    else
        allUsernames += "²" + username;
    localStorage.setItem(USER_NAMES_KEY, allUsernames);

    alert("Datas imported succesfully for user: " + username);
    setupUserDropdown();
    forceChooseUser(username);
}

// ------- END USER -------

/* Saved the datas to the correct user in localstorage
* @param dataType : the type of data (eg: horseshoe, adventure_quest, etc) to be saved, string
* @param datas : an object with all the datas to be saved for this dataType
* @param gameID : the id of the game, optional
*/
function saveData(dataType, datas, gameID = "")
{
    if (currentUser === "guest") return;

    let savedDatas = JSON.parse(localStorage.getItem(USER_KEY + currentUser));

    let existingDatas = false;

    if (gameID !== "")
    {
        for (let i = 0; i < savedDatas.gameDatas.length; i++)
        {
            if (savedDatas.gameDatas[i].id !== gameID) continue;
    
            existingDatas = true;

            switch(dataType)
            {
                case DATA_TYPE_HIGHSCORE: savedDatas.gameDatas[i].highscore = datas; break;
                case DATA_TYPE_LEVEL: savedDatas.gameDatas[i].level = datas; break;
            }
        }

        if (!existingDatas)
        {
            let currentGameData = 
            {
                id: gameID,
            }

            switch(dataType)
            {
                case DATA_TYPE_HIGHSCORE: currentGameData.highscore = datas; break;
                case DATA_TYPE_LEVEL: currentGameData.level = datas; break;
            }

            savedDatas.gameDatas.push(currentGameData);
        }
    }

    switch(dataType)
    {
        case DATA_TYPE_HORSESHOES: savedDatas.horseshoes = datas; break;
    } 

    localStorage.setItem(USER_KEY + currentUser, JSON.stringify(savedDatas));
    setupUserDropdown();
}

/* Load the datas of a specific user from the localstorage
* @param dataType : the type of data (eg: horseshoe, adventure_quest, etc) to be loaded, string
* @returns datas : an object with all the saved datas for this dataType 
* @param gameID : the id of the game, optional
*/
function loadData(dataType, gameID = "")
{
    if (currentUser === "guest")
    {
        switch(dataType)
        {
            case DATA_TYPE_HORSESHOES:
                return 10000;
            case DATA_TYPE_HIGHSCORE:
            case DATA_TYPE_LEVEL:
                return 0;
        }
    }

    let savedDatas = JSON.parse(localStorage.getItem(USER_KEY + currentUser));

    if (gameID != "")
    {
        for (let i = 0; i < savedDatas.gameDatas.length; i++)
        {
            if (savedDatas.gameDatas[i].id !== gameID) continue;
    
            switch(dataType)
            {
                case DATA_TYPE_HIGHSCORE:
                    if (savedDatas.gameDatas[i].highscore === undefined)
                        return 0;
                    return savedDatas.gameDatas[i].highscore;
                case DATA_TYPE_LEVEL: 
                    if (savedDatas.gameDatas[i].level === undefined)
                        return 0;
                    return savedDatas.gameDatas[i].level;
            }
        }
    }

    switch(dataType)
    {
        case DATA_TYPE_HORSESHOES:
            if (savedDatas.horseshoes === undefined)
                return 0;
            return savedDatas.horseshoes;
    }

    return 0;
}

function addHorseshoes(amountAdded)
{
    currentAmount = loadData(DATA_TYPE_HORSESHOES);
    
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
        loadedData = loadData(DATA_TYPE_HIGHSCORE, getGameID(data));
        highscoreTxt = document.getElementById("highscore");
        highscoreTxt.innerHTML = "<b>Highscore: " + loadedData + "</b>";
        return;
    }

    // Actually update
    gameID = getGameID(splittedData[1]);

    loadedData = loadData(DATA_TYPE_HIGHSCORE, gameID);
    if (parseInt(splittedData[0]) > loadedData)
    {
        saveData(DATA_TYPE_HIGHSCORE, splittedData[0], gameID);

        // TODO : Clean up
        highscoreTxt = document.getElementById("highscore");
        highscoreTxt.innerHTML = "<b>Highscore: " + splittedData[0].toString() + "</b>";
    }
}

function updateLevelReached(data)
{
    splittedData = data.split("@");

    gameID = getGameID(splittedData[1]);

    loadedData = loadData(DATA_TYPE_LEVEL, gameID);
    if (parseInt(splittedData[0]) > loadedData)
        saveData(DATA_TYPE_LEVEL, splittedData[0], gameID);
}

//-------- HELPERS -------
function getGameID(game)
{
    switch(game)
    {
        case "MagicBubbleWand": return "MBW";
        case "SpectacularJumpingGame": return "SJG";
        case "Citrustacked": return "CIT";
        case "ArtStudio": return "AS";
        case "MyCottage": return "COT";
        case "DreamRider": return "DR";
        case "CloudJumper": return "CJ";
        case "TreasuresHunt": return "TH";
        case "SantoQuiz": return "SQZ";
        case "BelloQuiz": return "BQZ";
        case "YinYangMemory": return "YYM";
        case "FirelightFestival": return "FF";
        case "LanceRiding": return "LR";
        case "MyHorse": return "FOA";
        case "DressUp": return "DUG";
        case "AdventuresQuiz": return "AQZ";
        case "AutumnJourneyQuiz": return "JQZ";
        case "Adventures": return "ADV";
        case "Coloring": return "COL";
        case "Puzzle": return "PUZ";
        case "Stables": return "STA";
        case "ArtIdeaGenerator": return "AIG";
        case "Storybook": return "STB";
        case "MarvelousMagicMatch": return "MMM";
        case "Wheel of Wonders": return "WOW";
        case "BellisimosJumpingContest": return "BJC";
        case "Bellapedia": return "BPD";
        case "DynamosDressageArena": return "DDA";
        case "Trailblazer": return "TBZ";
        case "BellaBeautyBox": return "BBB";
        case "Journal": return "JOU";
        case "Bazaar": return "BAZ";
        case "MyThings": return "THI";
    }
}
//------- END HELPERS -------
