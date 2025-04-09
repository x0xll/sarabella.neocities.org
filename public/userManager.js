// Handles a fake user situation with the help of local storage
// Would store a username, horseshoes, cottage datas, adventures, etc.
// Need to check how much space this would take, to calculate how many users we authorize
// Creating a "share" type button to pass the user saved datas to another navigator could be interesting to prevent loss of progress

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

        localStorage.setItem(USER_KEY + username, "usr:" + username);
        currentUserAmount++;
        localStorage.setItem(USER_AMOUNT_KEY, currentUserAmount);
        userNames = localStorage.getItem(USER_NAMES_KEY);
        if (userNames === null || userNames === undefined || userNames === "")
            userNames = username;
        else
            userNames += "²" + username;
        localStorage.setItem(USER_NAMES_KEY, userNames);

        saveDatasToUser(username, "horseshoes", 100)
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

        horseshoes = document.getElementById("horseshoes");
        horseshoes.innerHTML = loadDatasFromUser(currentUser, "horseshoes").toString() + " <img src=\"/images/nav/Horseshoe.png\">";
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
* @param username : the username used in the local storage, string
* @param dataType : the type of data (eg: horseshoe, adventure_quest, etc) to be saved, string
* @param datas : an object with all the datas to be saved for this dataType
*/
function saveDatasToUser(username, dataType, datas)
{
    if (username === "guest") return;

    savedDatas = localStorage.getItem(USER_KEY + username);
    splittedDatas = savedDatas.split("²");

    let existingDatas = false;

    splittedDatas.forEach(data => {
        switch(dataType)
        {
            case "horseshoes":
                if (data.includes("h:"))
                {
                    data = "h:" + datas.toString();
                    existingDatas = true;
                }
                break;
        }
    });

    if (!existingDatas)
    {
        switch(dataType)
        {
            case "horseshoes":
                savedDatas += "²h:" + datas.toString();
                break;
        }

        localStorage.setItem(USER_KEY + username, savedDatas);
        return;
    }

    savedDatas = splittedDatas[0]; // Username

    splittedDatas.forEach(data => {
        savedDatas += "²" + data;
    });

    localStorage.setItem(USER_KEY + username, savedDatas);
}

/* Load the datas of a specific user from the localstorage
* @param username : the username used in the local storage, string
* @param dataType : the type of data (eg: horseshoe, adventure_quest, etc) to be loaded, string
* @returns datas : an object with all the saved datas for this dataType 
*/
function loadDatasFromUser(username, dataType)
{
    if (username === "guest")
    {
        switch(dataType)
        {
            case "horseshoes":
                return 200;
        }
    }

    loadedDatas = localStorage.getItem(USER_KEY + username);
    splittedDatas = loadedDatas.split("²");

    for (let i = 0; i < splittedDatas.length; i++) {
        switch(dataType)
        {
            case "horseshoes":
                if (splittedDatas[i].includes("h:"))
                    return splittedDatas[i].split(":")[1];
                break;
        }
    }
}