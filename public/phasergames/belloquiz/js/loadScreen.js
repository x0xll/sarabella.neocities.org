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

        const game = this;

        // Loading the questions
        game.questionDatas = []
        // Get the possible questions
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onload = function() {
            game.questionDatas = JSON.parse(this.responseText).questions;

            game.questionDatas.forEach(question => {     
                game.load.image(`${game.questionDatas.indexOf(question)}_img`, `${question.image}`);
            });
        }

        let datasLang = lang;

        if (!urlExists(`./datas/${datasLang}.json`))
            datasLang = "en"

        xmlHttp.open("GET", `./datas/${datasLang}.json`);
        xmlHttp.send();
    }

    create ()
    { 
        const game = this;
        game.scene.start("Quiz", {questions: game.questionDatas});
    }
}