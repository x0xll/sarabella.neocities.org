// This scene is just used to load the image for the loading screen
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
            loadInto = `${horseData.type}Stable`
        }
        this.scene.start(loadInto);
    }
}