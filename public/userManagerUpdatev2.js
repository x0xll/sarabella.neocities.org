// Handles a fake user situation with the help of local storage
// Would store a username, horseshoes, cottage data, adventures, etc.
// Need to check how much space this would take, to calculate how many users we authorize
// Creating a "share" type button to pass the user saved data to another navigator could be interesting to prevent loss of progress

const USER_KEY = "neocitiesbesa_user_";
const MAX_USERS = 2; // TODO : define based on max size allowed on local storage
const USER_AMOUNT_KEY = "neocities_besa_userAmount"; 
const USER_NAMES_KEY = "neocities_besa_userNames"; 
const CURRENT_USER_KEY = "neocities_besa_currentUser"; 

const MANAGER_VERSION = 1; // To track user version in case data structure gets updated

let currentUser = undefined;
let currentGame = undefined;

// ------- UI -------
function setupUserDropdown()
{
    userDropdown = document.getElementById("currentUserDropdown");
    userAmount = localStorage.getItem(USER_AMOUNT_KEY);
    userNames = localStorage.getItem(USER_NAMES_KEY);

    for (let i = userDropdown.options.length - 1; i >= 3; i--)
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

    if (username.includes("\""))
    {
        alert("Please remove \"\"\" character from your username.")
        return;
    }

    if (username.toLowerCase() === "guest" || username.toLowerCase() === "create" || username.toLowerCase() === "create user" || username.toLowerCase() === "settings")
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

        currentUser = username;
        let userData = 
        {
            usr: currentUser,
            v: MANAGER_VERSION,
            gameData: []
        }

        localStorage.setItem(USER_KEY + username, JSON.stringify(userData));
        currentUserAmount++;
        localStorage.setItem(USER_AMOUNT_KEY, currentUserAmount);
        userNames = localStorage.getItem(USER_NAMES_KEY);
        if (userNames === null || userNames === undefined || userNames === "")
            userNames = username;
        else
            userNames += "²" + username;
        localStorage.setItem(USER_NAMES_KEY, userNames);

        saveData(DATA_TYPES.horseshoes, 100)
        setupUserDropdown();
        forceChooseUser(username);
        return;
    }

    alert("Too many users created on this navigator... Please delete one before creating a new one."); // TODO: localize
}

function chooseUser(reloadPage = false)
{
    userDropdown = document.getElementById("currentUserDropdown");
    var username = userDropdown.options[userDropdown.selectedIndex].value;
    currentUser = username;

    if (currentUser == "create")
        window.location.href = "/signup.html";
    else if (currentUser == "settings")
        window.location.href = "/userSettings.html";
    else
    {
        if (window.location.href.includes("/userSettings.html") && currentUser == "guest")
            window.location.href = "/index.html";

        localStorage.setItem(CURRENT_USER_KEY, currentUser);

        horseshoes = document.getElementById(DATA_TYPES.horseshoes);
        horseshoes.innerHTML = "<img src=\"/images/nav/Horseshoe.png\"> " + loadData(DATA_TYPES.horseshoes).toString();

        if (reloadPage)
            location.reload();
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

    if (username === "guest")
        userDropdown.options.remove(2);

    chooseUser();
}

function deleteUser()
{
    username = document.getElementById("currentUserDropdown").value;
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
        forceChooseUser();
        alert("User deleted");
        return;
    }

    alert("No user to delete, create a user first.") // TODO : localize
}

function exportUser()
{
    username = document.getElementById("currentUserDropdown").value;
    let userData = localStorage.getItem(USER_KEY + username);

    if (userData === "" || userData === undefined || userData === null)
    {
        alert("Please choose an existing user to export data.")
        return;
    }

    download(userData, username+".json", "json")
}

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function importUser()
{
    let file = document.getElementById("file").files[0];
    let reader = new FileReader();
    reader.readAsText(file)
    reader.onload = function(event) {
        let userData = event.target.result;
        if (userData === "") {
            alert("Please enter valid data from an exported save");
            return;
        }
        username = JSON.parse(userData).usr

        allUsernames = localStorage.getItem(USER_NAMES_KEY);
        if (allUsernames != undefined && allUsernames != "" && allUsernames != null)
        {
            splittedUsernames = allUsernames.split("²");
            let existingUser = false;
            splittedUserNames.forEach(user => {
                if (user === username)
                {
                    localStorage.setItem(USER_KEY + username, userData);
                    existingUser = true;
                    return;
                }
            });
        
            if (existingUser)
            {
                alert("Data imported succesfully for user: " + username);
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
        localStorage.setItem(USER_KEY + username, userData);

        if (allUsernames === null || allUsernames === undefined || allUsernames === "")
            allUsernames = username;
        else
            allUsernames += "²" + username;
        localStorage.setItem(USER_NAMES_KEY, allUsernames);

        alert("Data imported succesfully for user: " + username);
        setupUserDropdown();
        forceChooseUser(username);
    }
}

// ------- END USER -------

//-------- HELPERS -------
function getCurrentUsername()
{
    return currentUser;
}

function setCurrentUsername()
{
    if (currentUser == null)
    {
        currentUser = localStorage.getItem(CURRENT_USER_KEY)
    }
}

function isGuest()
{
    return getCurrentUsername() === "guest";
}
//------- END HELPERS -------
