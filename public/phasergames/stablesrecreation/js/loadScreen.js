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

            let accurateTrad = loadData(DATA_TYPES.accurateTranslations);
            let langFile = null
            if (horseData.type === 'dressup') {
                if (accurateTrad)
                    langFile = `./lang/og/dressup`
                else
                    langFile = `./lang/improved/dressup`

                if (!locale || !urlExists(`${langFile}_${locale}.json`)) {
                    if ((!accurateTrad && !urlExists(`./lang/og/dressup_${locale}.json`)) || accurateTrad)
                    {
                        locale ='en'
                        langFile = `./lang/og/dressup_${locale}.json`
                    }
                    else
                    {
                        langFile = `./lang/og/dressup_${locale}.json`
                    }
                }
            } else {
                if (accurateTrad)
                    langFile = `./lang/og/${horseData.type}`
                else
                    langFile = `./lang/improved/${horseData.type}`

                if (!locale || !urlExists(`${langFile}_${locale}.json`)) {
                    if ((!accurateTrad && !urlExists(`./lang/og/${horseData.type}.json`)) || accurateTrad)
                    {
                        locale ='en'
                        langFile = `./lang/og/${horseData.type}.json`
                    }
                    else
                    {
                        langFile = `./lang/og/${horseData.type}.json`
                    }
                }
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