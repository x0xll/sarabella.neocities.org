const savedVar = "selectedLanguageBellaSaraNeoCity";
var currentLang = 'en';

var localizedElements;
var localizedDatas;
var defaultLocas;

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
        // Load the json file to use
        var pathjson = '/localization/neocitiesLoca_' + lang + '.json';
        var pathjsonDefault = '/localization/neocitiesLoca_en.json';
        const jsonFile = await fetch(pathjson)
                            .then(function(file) {return file.json();})
                            .then(function(json) {
                                localizedDatas = json;
                            })

        const jsonFileDefault = await fetch(pathjsonDefault)
        .then(function(file) {return file.json();})
        .then(function(json) {
            defaultLocas = json;
        })

        // Update the texts elements based on HTML
        localizedElements.forEach(element => 
            {
                var locaKey = element.getAttribute('data-il8n');
                element.innerHTML = getLocalizedText(locaKey);
            }
        )    

        document.documentElement.lang = lang;
    }
}

function getCurrentLanguageCode()
{
    return currentLang;
}

function getLocalizedText(key)
{
    var txt = localizedDatas[key];
    if (txt == undefined) // Go back to english if the translation is not done yet
         return defaultLocas[key];
               
    //return key + " - " + currentLang; // To check if all the text was setup with the localization system just uncomment this    
    return txt;
}