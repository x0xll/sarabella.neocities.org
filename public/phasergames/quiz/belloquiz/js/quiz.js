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
        this.load.image('background', '/phasergames/quiz/belloquiz/images/background.png');
        this.load.image('logo', '/phasergames/quiz/belloquiz/images/bella_logo.png');
        this.load.image('button', '/phasergames/quiz/belloquiz/images/choice_btn.png');
        this.load.image('img_container', '/phasergames/quiz/belloquiz/images/img_container.png');
        this.load.image('data_container', '/phasergames/quiz/belloquiz/images/datas_container.png');
        this.load.image('question_container', '/phasergames/quiz/belloquiz/images/question_container.png');
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

        let usedHorses = [];
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
            wordWrap: { width: 400 } ,
        }

        const answerTextSettings = {
            font: 'bold 18px Arial',
            color: 'white',
            align: 'center',
            wordWrap: { width: 370 } ,
            lineSpacing: -5
        }

        const datasTextSettings = {
            font: 'bold 22px Arial',
            color: 'white',
            align: 'left'
        }


        // TURNS LEFT
        turnsLeft = MAX_TURNS;
        let turnsTxt = this.add.text(220, 125, `${langData.ui.turns}${turnsLeft}`, datasTextSettings);
        if (lang == "fr")
            turnsTxt.x = 190;

        // SCORE
        score = 0;
        let savedScore = localStorage.getItem(SCORE_SAVE_PATH)
        highScore = (savedScore == null) ? 0 : savedScore;
        let scoreTxt = this.add.text(80, 125, `${langData.ui.score}${score}`, datasTextSettings);
        if (lang == "fr")
            scoreTxt.x = 60;

        // Init quiz
        const horseDatas = data.questions;

        usedHorses = [];
        choiceBtns = [];

        let guessImg = this.add.image(690, 315, `0_img`).setOrigin(.5);
        let guessQuestion = this.add.text(215, 280, `${horseDatas[0].question}`, globalTextSettings).setOrigin(.5, .5);
        let guessQuestionNum = this.add.text(215, 210, `${langData.ui.question}${(MAX_TURNS - turnsLeft) + 1}`, globalTextSettings).setOrigin(.5, .5);

        initializeGuessButtons(this);
        updateGuessQuestion();

        function initializeGuessButtons()
        {
            for (let i = 0; i < MAX_CHOICE_BTN; i++)
                {
                    let btn = game.add.image(217, 380 + (60 * i), 'button').setInteractive({pixelPerfect: true});
                    let btnTxt = game.add.text(217, 383 + (60 * i), `Bella Sara`, answerTextSettings).setOrigin(.5, .5);
            
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
            var randHorse = -1;
            var failsafe = 100;

            do
            {
                randHorse = Math.floor(Math.random()*horseDatas.length);
                failsafe--;
            }
            while (usedHorses.length > 0 && usedHorses.includes(randHorse) && failsafe > 0)
            usedHorses.push(randHorse);
            
            guessImg.setTexture(`${randHorse}_img`).setDisplaySize(353, 500);

            var question = -1;
            var attributeType = "";

            do
            {
                question = Math.floor(Math.random() * langData.questions.length);
                attributeType = langData.questions[question].attribute;
            }
            while 
            (
                (attributeType == "name" && horseDatas[randHorse].name == undefined) ||
                (attributeType == "quote" && horseDatas[randHorse].quote == undefined)
            )

            guessQuestion.text = `${langData.questions[question].question}`;

            guessQuestionNum.text = `${langData.ui.question}${(MAX_TURNS - turnsLeft) + 1}`;

            var alreadyPickedNums = [];
            alreadyPickedNums.push(randHorse);
            var randGoodChoice = Math.floor(Math.random() * MAX_CHOICE_BTN);

            var btnDatas = choiceBtns[randGoodChoice];

            switch(attributeType)
            {
                default:
                case "name":
                    btnDatas.text.text = `${horseDatas[randHorse].name}`;
                    break;
                case "quote":
                    btnDatas.text.text = `${horseDatas[randHorse].quote}`;
                    break;
            }

            btnDatas.goodChoice = true;   

            for (let i = 0; i < MAX_CHOICE_BTN; i++)
            {
                if (randGoodChoice == i) continue; 

                var otherChoice;
                var failsafe = 100;

                do{
                    otherChoice = Math.floor(Math.random()*horseDatas.length);
                    failsafe--;
                }
                while (alreadyPickedNums.includes(otherChoice) || failsafe <= 0);

                alreadyPickedNums.push(otherChoice);
                var btnDatas = choiceBtns[i];
                switch(attributeType)
                {
                    default:
                    case "name":
                        btnDatas.text.text = `${horseDatas[otherChoice].name}`;
                        break;
                    case "quote":
                        btnDatas.text.text = `${horseDatas[otherChoice].quote}`;
                        break;
                }
                btnDatas.goodChoice = false;   
            }
        }

        function makeGuess(buttonClicked)
        {
            if (turnsLeft == 0) return;

            if (choiceBtns[buttonClicked].goodChoice)
                score++;

            turnsLeft--;

            scoreTxt.text = `${langData.ui.score}${score}`;
            turnsTxt.text = `${langData.ui.turns}${turnsLeft}`;

            if (turnsLeft <= 0)
            {
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
                endTitle = langData.ui.perfect_title;
                endDesc = langData.ui.perfect_desc;
            }
            else if (score >= (MAX_TURNS / 2) && score < MAX_TURNS)
            {
                endTitle = langData.ui.good_title;
                endDesc = langData.ui.good_desc;
            }
            else
            {
                endTitle = langData.ui.bad_title;
                endDesc = langData.ui.bad_desc;
            }

            game.add.text(217, 210, endTitle, globalTextSettings).setOrigin(.5, .5);
            game.add.text(217, 320, endDesc, globalTextSettings).setOrigin(.5, .5);
            game.add.text(217, 400, `${langData.ui.end_score} ${score} / ${MAX_TURNS}`, globalTextSettings).setOrigin(.5, .5);

            var retryBtn = game.add.image(217, 500, 'button').setInteractive({pixelPerfect: true}).setOrigin(.5, .5);
            game.add.text(217, 500, langData.ui.retry, globalTextSettings).setOrigin(.5, .5);

            retryBtn.on("pointerdown", () => game.scene.restart());
        }
    }
}
