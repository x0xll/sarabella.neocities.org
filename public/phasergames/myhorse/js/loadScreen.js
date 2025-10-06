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
        this.load.image('card_back', './images/card_back.png');
    }

    create ()
    { 
        var langFile = `./lang/foal`   
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

        this.scene.start("Stable");
    }
}