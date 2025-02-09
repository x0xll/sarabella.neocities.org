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
        const game = this;

        // Loading the questions
        let questionDatas = []
        // Get the possible questions
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onload = function() {
            questionDatas = JSON.parse(this.responseText).questions;

            game.load.setBaseURL('https://bellasara.wiki.gg/images/');

            questionDatas.forEach(question => {     
                game.load.image(`${question.image}_img`, `${question.image}`);
            });

            game.scene.start("Quiz", {questions: questionDatas});
        }

        let datasLang = lang;

        if (!urlExists(`./datas/${datasLang}.json`))
            datasLang = "en"

        xmlHttp.open("GET", `./datas/${datasLang}.json`);
        xmlHttp.send();
    }
}