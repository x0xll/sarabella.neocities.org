// This scene is just used to load the image for the loading screen                

// Load screen scene
class LoadFamily extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'loadFamily' });
    }

    preload ()
    {
        family.data = []
        for (let index = 0; index < family.ids.length; index++) {
            const member = family.ids[index];
            this.load.json(member, `./images/horses/${member}/data.json`);
            this.load.image(member, `./images/horses/${member}/card_image.jpg`);
        }
    }
        

    create ()
    { 
            const types = new Set([horseData.type.substring("foal".length).toLowerCase()])
            
            for (let index = 0; index < family.ids.length; index++) {
                const member = family.ids[index];
                family.data[index] = this.cache.json.get(member)
                if (family.data[index].type.includes("foal"))
                    family.data[index].type = family.data[index].type.substring("foal".length).toLowerCase()
                types.add(family.data[index].type)
            }

            quoteData = {"air": null, "land": null, "water": null}
            types.forEach(type => {
                let langFile = `./lang/${type}`
                if (!locale || !urlExists(`${langFile}_${locale}.json`)) {
                    locale ='en'
                }
                if (localizedQuote) {
                    if (type === horseData.type.substring("foal".length).toLowerCase()) {
                        quoteData[type] = localeData
                    } else {
                        const xmlHttplocale = new XMLHttpRequest();
                        xmlHttplocale.onload = function() {
                            const myObj = JSON.parse(this.responseText);
                            quoteData[type] = myObj
                        }
                        xmlHttplocale.open("GET", `${langFile}_${locale}.json`);
                        xmlHttplocale.send();
                    }
                } else {
                    if (type === horseData.type.substring("foal".length).toLowerCase()) {
                        quoteData[type] = englishData
                    } else {
                        const xmlHttpEnglish = new XMLHttpRequest();
                        xmlHttpEnglish.onload = function() {
                            const myObj = JSON.parse(this.responseText);
                            quoteData[type] = myObj
                        }
                        xmlHttpEnglish.open("GET", `${langFile}_en.json`);
                        xmlHttpEnglish.send();
                    }
                }
                
            });

            loadInto = `${horseData.type}Stable`
        this.scene.start(loadInto);
    }
}