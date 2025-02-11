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
        this.load.image('card_back', '/phasergames/quiz/belloquiz/images/card_back.png');

        const game = this;

        // Loading the questions
        game.horseDatas = langData.horseDatas;
        game.horseDatas.forEach(horse => {     
            game.load.image(`${game.horseDatas.indexOf(horse)}_img`, `${horse.image}`);
        });
    }

    create ()
    { 
        const game = this;
        game.scene.start("Quiz", {questions: game.horseDatas});
    }
}
