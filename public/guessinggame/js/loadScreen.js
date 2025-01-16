// This scene is just used to load the image for the loading screen
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
        if (!locale || !urlExists(`./lang/guessing_${locale}.json`)) {
            locale ='en'
        }
        const xmlHttplocale = new XMLHttpRequest();
        xmlHttplocale.onload = function() {
            const myObj = JSON.parse(this.responseText);
            localeData = myObj
        }
        xmlHttplocale.open("GET", `./lang/guessing_${locale}.json`);
        xmlHttplocale.send();

        this.scene.start('chooseCategory');
    }
}