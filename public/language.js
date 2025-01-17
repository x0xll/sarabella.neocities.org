var currentLang = 'en';

const NEOCITIES_PATH = '/localization/neocitiesLoca_';
const NEOCITIES_DEFAULT_PATH = '/localization/neocitiesLoca_en.json';
const NEOCITIES_KEY = "neocities";

const savedVar = "selectedLanguageBellaSaraNeoCity";

var localizedElements;
var localizedDatas = {};
var defaultLocas = {};

// Used for first time users
function checkBrowserLanguage() {
    var lang = navigator.language;

    // TODO : handle region based languages too
    lang = lang.slice(0, 2);

    changeLanguage(lang);
}

function saveLanguagePref(langSelected) {
    localStorage.setItem(savedVar, langSelected);
}

function loadLanguagePref(updatePage = true) {
    // Get the elements to update with the json
    localizedElements = document.querySelectorAll('[data-il8n]');

    // Load the language to use
    if (localStorage.getItem(savedVar)) {
        var langSaved = localStorage.getItem(savedVar);

        currentLang = langSaved;

        if (updatePage)
            changeLanguage(langSaved);
    }
    else if (updatePage){
        checkBrowserLanguage();
    }
}

async function changeLanguage(langSelected, reload = false) {
    var lang = langSelected;

    currentLang = lang;

    saveLanguagePref(lang);
    //console.log(lang);

    if (reload)
        location.reload();
    else
    {
        loadNewLocalizationFile()    

        document.documentElement.lang = lang;
    }
}

function getCurrentLanguageCode()
{
    return currentLang;
}

function getLocalizedText(key, name = NEOCITIES_KEY)
{
    var txt = localizedDatas[name][key];
    if (txt == undefined) // Go back to english if the translation is not done yet
         return defaultLocas[name][key];
               
    //return key + " - " + currentLang; // To check if all the text was setup with the localization system just uncomment this    
    return txt;
}

async function loadNewLocalizationFile(pathjson = NEOCITIES_PATH + currentLang + '.json', pathjsonDefault = NEOCITIES_DEFAULT_PATH, name = NEOCITIES_KEY)
{
    const jsonFile = await fetch(pathjson)
                        .then(function(file) {return file.json();})
                        .then(function(json) {
                            localizedDatas[name] = json;
                        })

    const jsonFileDefault = await fetch(pathjsonDefault)
    .then(function(file) {return file.json();})
    .then(function(json) {
        defaultLocas[name] = json;
    })

    // Update the texts elements based on HTML
    localizedElements.forEach(element => 
        {
            var locaKey = element.getAttribute('data-il8n');

            var locaTxt = getLocalizedText(locaKey, name);
            if (locaTxt != undefined)
                element.innerHTML = locaTxt;
        }
    )
}