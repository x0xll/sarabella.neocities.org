// This scene is just used to load the image for the loading screen                

// Load screen scene
class Load extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'Load' });
    }

    preload ()
    {
        this.load.image('card_back', './images/selector/card_back.png');
    }

    create ()
    { 
        if (loadInto === "Stables") {

            let langFile = null
            if (horseData.type === 'dressup') {
                langFile = `./lang/dressup`
            } else {
                langFile = `./lang/${horseData.type}`
            }
            if (!locale || !urlExists(`${langFile}_${locale}.json`)) {
                locale ='en'
            }
            const xmlHttplocale = new XMLHttpRequest();
            xmlHttplocale.onload = function() {
                const myObj = JSON.parse(this.responseText);
                localeData = myObj
            }
            xmlHttplocale.open("GET", `${langFile}_${locale}.json`);
            xmlHttplocale.send();

            if (horseData.type !== 'dressup'){
            const xmlHttpEnglish = new XMLHttpRequest();
            xmlHttpEnglish.onload = function() {
                const myObj = JSON.parse(this.responseText);
                englishDatas = myObj
            }
            xmlHttpEnglish.open("GET", `${langFile}_en.json`);
            xmlHttpEnglish.send();
            }

            loadInto = `${horseData.type}Stable`
        }
        this.scene.start(loadInto);
    }
}