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

            if (!locale || !urlExists(`./lang/${horseData.type}_${locale}.json`)) {
                locale ='en'
            }
            const xmlHttplocale = new XMLHttpRequest();
            xmlHttplocale.onload = function() {
                const myObj = JSON.parse(this.responseText);
                localeData = myObj
                console.log(localeData)
            }
            xmlHttplocale.open("GET", `./lang/${horseData.type}_${locale}.json`);
            xmlHttplocale.send();

            loadInto = `${horseData.type}Stable`
        }
        this.scene.start(loadInto);
    }
}