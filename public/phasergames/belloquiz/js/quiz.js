// Actual game
class Quiz extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: 'Quiz'
        });
    }

    preload ()
    {  
        // Display Loading Bar
        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0x35a3d5, 1);
            progressBar.fillRect(389, 337, 100 * value, 6);
        });    
        this.add.image(444, 261, 'card_back');  
        this.add.graphics().fillStyle(0x000000).fillRect(386, 334, 116, 12);
        const progressBar = this.add.graphics();

        // Load in images and sounds
        this.load.image('background', './images/background.png');
        this.load.image('logo', './images/bella_logo.png');
        this.load.image('button', './images/choice_btn.png');
        this.load.image('img_container', './images/img_container.png');
        this.load.image('data_container', './images/datas_container.png');
        this.load.image('question_container', './images/question_container.png');
    }

    create (data)
    {
        const game = this;
        //  If you disable topOnly it will fire events for all objects the pointer is over, regardless of place on the display list
        this.input.topOnly = true;

        // General vars we need for the game
        const MAX_TURNS = 10;
        const MAX_CHOICE_BTN = 4;
        const SCORE_SAVE_PATH = "belloquizHigshcoreNeoCitiesBellaSara";

        let turnsLeft = MAX_TURNS;

        let score = 0;
        let highScore = 0;

        let usedQuestions = [];
        let choiceBtns = [];

        // Set UI
        this.add.image(0, 0, 'background').setOrigin(0);

        this.add.image(10, 10, 'logo').setOrigin(0).setScale(.75);

        this.add.image(690, 313, 'img_container');
        this.add.image(220, 402, 'question_container');
        this.add.image(215, 135, 'data_container');

        const globalTextSettings = {
            font: 'bold 26px Arial',
            color: 'white',
            align: 'center',
            wordWrap: { width: 450 } ,
        }

        const datasTextSettings = {
            font: 'bold 22px Arial',
            color: 'white',
            align: 'left'
        }


        // TURNS LEFT
        turnsLeft = MAX_TURNS;
        let turnsTxt = this.add.text(220, 125, `Turns Left: `, datasTextSettings);
        
        // SCORE
        score = 0;
        let savedScore = localStorage.getItem(SCORE_SAVE_PATH)
        highScore = (savedScore == null) ? 0 : savedScore;
        let scoreTxt = this.add.text(80, 125, `Score: `, datasTextSettings);

        // Init quiz
        const questionDatas = data.questions;

        usedQuestions = [];
        choiceBtns = [];

        let guessImg = this.add.image(695, 315, `0_img`).setOrigin(.5);
        let guessQuestion = this.add.text(215, 280, `${questionDatas[0].question}`, globalTextSettings).setOrigin(.5, .5);
        let guessQuestionNum = this.add.text(215, 210, `${langData.question}${(MAX_TURNS - turnsLeft) + 1}`, globalTextSettings).setOrigin(.5, .5);

        initializeGuessButtons(this);
        updateGuessQuestion();

        function initializeGuessButtons()
        {
            for (let i = 0; i < MAX_CHOICE_BTN; i++)
                {
                    let btn = game.add.image(217, 380 + (60 * i), 'button').setInteractive({pixelPerfect: true});
                    let btnTxt = game.add.text(217, 383 + (60 * i), `Bella Sara`, globalTextSettings).setOrigin(.5, .5);
            
                    let btnObj = {
                        button : btn,
                        text : btnTxt,
                        goodChoice : false
                    }
        
                    choiceBtns.push(btnObj);
                    btn.on("pointerdown", () => {makeGuess(i)});  
                }        
        }

        function updateGuessQuestion()
        {
            scoreTxt.text = `${langData.score} ${score}`;
            turnsTxt.text = `${langData.turns} ${turnsLeft}`;

            var randQuestion = -1;
            var failsafe = 100;

            do
            {
                randQuestion = Math.floor(Math.random()*questionDatas.length);
                failsafe--;
            }
            while (usedQuestions.length > 0 && usedQuestions.includes(randQuestion) && failsafe > 0)
            usedQuestions.push(randQuestion);
            
            guessImg.setTexture(`${randQuestion}_img`).setDisplaySize(353, 500);

            guessQuestion.text = `${questionDatas[randQuestion].question}`;

            guessQuestionNum.text = `${langData.question}${(MAX_TURNS - turnsLeft) + 1}`;

            var alreadyPickedNums = [];
            alreadyPickedNums.push(randQuestion);

            for (let i = 0; i < MAX_CHOICE_BTN; i++)
            {
                choiceBtns[i].text.text = `${questionDatas[randQuestion].choices[i]}`;

                if (i + 1 == questionDatas[randQuestion].goodAnswer)
                    choiceBtns[i].goodChoice = true;   
                else
                choiceBtns[i].goodChoice = false;
            }
        }

        function makeGuess(buttonClicked)
        {
            if (turnsLeft == 0) return;

            if (choiceBtns[buttonClicked].goodChoice)
                score++;

            turnsLeft--;

            if (turnsLeft <= 0)
            {
                turnsTxt.text = `${langData.turns} ${turnsLeft}`;
                showEndPopup();
                return;
            }
            
            updateGuessQuestion();
        }

        function showEndPopup()
        {
            game.add.image(220, 402, 'question_container')

            var endTitle = "TITLE";
            var endDesc = "DESCRIPTION";

            
            if (score == MAX_TURNS)
            {
                endTitle = langData.perfect_title;
                endDesc = langData.perfect_desc;
            }
            else if (score >= (MAX_TURNS / 2) && score < MAX_TURNS)
            {
                endTitle = langData.good_title;
                endDesc = langData.good_desc;
            }
            else
            {
                endTitle = langData.bad_title;
                endDesc = langData.bad_desc;
            }

            game.add.text(217, 210, endTitle, globalTextSettings).setOrigin(.5, .5);
            game.add.text(217, 320, endDesc, globalTextSettings).setOrigin(.5, .5);
            game.add.text(217, 400, `${langData.end_score} ${score} / ${MAX_TURNS}`, globalTextSettings).setOrigin(.5, .5);

            var retryBtn = game.add.image(217, 500, 'button').setInteractive({pixelPerfect: true}).setOrigin(.5, .5);
            game.add.text(217, 500, langData.retry, globalTextSettings).setOrigin(.5, .5);

            retryBtn.on("pointerdown", () => game.scene.restart());
        }
    }
}