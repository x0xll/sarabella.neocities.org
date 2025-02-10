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
        game.questionDatas = langData.questions;
        game.questionDatas.forEach(question => {     
            game.load.image(`${game.questionDatas.indexOf(question)}_img`, `${question.image}`);
        });
    }

    create ()
    { 
        const game = this;
        game.scene.start("Quiz", {questions: game.questionDatas});
    }
}
