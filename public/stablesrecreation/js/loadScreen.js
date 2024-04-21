// This scene is just used to load the image for the loading screen

queryString = window.location.search;
urlParams = new URLSearchParams(queryString);
let horseName = null
let horseData = null
let xmlhttp = null
let myObj = null


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
        if (loadInto === "Stable") {
            
        // Gets info about the horse from data.json file
            horseName = urlParams.get('name')
            
            function urlExists(url)
            {
                var http = new XMLHttpRequest();
                http.open('HEAD', url, false);
                http.send();
                return http.status!=404;
            }
            
            if (!horseName || !urlExists(`./images/horse/${horseName}`)) {
                horseName ='peter'
            }
            xmlhttp = new XMLHttpRequest();
            xmlhttp.onload = function() {
            myObj = JSON.parse(this.responseText);
            horseData = myObj
            }
            xmlhttp.open("GET", `./images/horse/${horseName}/data.json`);
            xmlhttp.send();


            loadInto = `${horseData.type}Stable`
        }
        this.scene.start(loadInto);
    }
}