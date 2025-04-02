// Handles a fake user situation with the help of local storage
// Would store a username, horseshoes, cottage datas, adventures, etc.
// Need to check how much space this would take, to calculate how many users we authorize
// Creating a "share" type button to pass the user saved datas to another navigator could be interesting to prevent loss of progress

const USER_KEY = "neocitiesbesa_user_";
const MAX_USERS = 5; // TODO : define based on max size allowed on local storage
const USER_AMOUNT_KEY = "neocities_besa_userAmount"; 

let currentUser = undefined;

// ------- USER ------
function createUser(username)
{
    if (username == undefined)
    {
        alert("Please choose a username to create a user session."); // TODO : localize
        return;
    }

    var currentUserAmount = (localStorage.getItem("neocities_besa_userAmount")) ? localStorage.getItem("neocities_besa_userAmount") : 0;
    if (currentUserAmount < MAX_USERS)
    {
        localStorage.setItem(USER_KEY + username, "usr:" + username);
        currentUserAmount++;
        localStorage.setItem(currentUserAmount);

        forceChooseUser(username);
        return;
    }

    alert("Too many users created on this navigator... Please delete one before creating a new one."); // TODO: localize
}

function chooseUser()
{
    userDropdown = document.getElementById("userChoice");
    var username = userDropdown.options[userDropdown.selectedIndex].value;
    currentUser = username;
}

function forceChooseUser(username)
{
    currentUser = username;
    userDropdown = document.getElementById("userChoice");

    if (username === undefined)
        userDropdown.selectedIndex = 0;
    else
        userDropdown.selectedIndex = userDropdown.options.length - 1;
}

function deleteUser(username)
{
    var currentUserAmount = (localStorage.getItem("neocities_besa_userAmount")) ? localStorage.getItem("neocities_besa_userAmount") : 0;
    if (currentUserAmount > 0)
    {
        if (localStorage.getItem(USER_KEY + username))
            localStorage.removeItem(USER_KEY + username);
        currentUserAmount--;
        localStorage.setItem(currentUserAmount);

        if (currentUser == username)
            forceChooseUser(undefined);
        return;
    }

    alert("No user to delete, create a user first.") // TODO : localize
}

// ------- END USER -------

/* Saved the datas to the correct user in localstorage
* @param username : the username used in the local storage, string
* @param dataType : the type of data (eg: horseshoe, adventure_quest, etc) to be saved, string
* @param datas : an object with all the datas to be saved for this dataType
*/
function saveDatasToUser(username, dataType, datas)
{

}

/* Load the datas of a specific user from the localstorage
* @param username : the username used in the local storage, string
* @param dataType : the type of data (eg: horseshoe, adventure_quest, etc) to be loaded, string
* @returns datas : an object with all the saved datas for this dataType 
*/
function loadDatasFromUser(username, dataType)
{

}