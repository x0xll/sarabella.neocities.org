// Get the possible questions
let horseDatas = []
const xmlHttp = new XMLHttpRequest();
xmlHttp.onload = function() {
    const myObj = JSON.parse(this.responseText);

    for (let index = 0; index < myObj.horses.length; index++) {
        horseDatas.push(myObj.horses[index]);
    };
}

xmlHttp.open("GET", './data/guessingDatas.json');
xmlHttp.send();

// General vars we need for the game
const MAX_TURNS = 10;
const MAX_CHOICE_BTN = 3;
const SCORE_SAVE_PATH = "neocities_bellaSara_guessingGame_highscore";

var turnsLeft = MAX_TURNS;
var turnsTxt;

var scoreTxt;
var score = 0;
var highScore = 0;

var usedHorses = [];
var choiceBtns = [];
var guessImg;

var scene;

// Actual game
class Guessing extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: 'guessing'
        });
    }

    preload (data)
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
        const progressText = this.add.text(344, 133, '', { fontFamily: 'Arial', fontSize: 12, color: '#ffffff', align: 'center' });
            
        // Load in images and sounds

        horseDatas.forEach(horse => {
            this.load.image(`${horse.name}_img`, `${horse.imgAdventurePath}`);
        });

        this.load.image('button', './images/nameplate.png');
        this.load.image('container', './images/InfoBox.png');
        this.load.image('background', './images/background.png');

        scene = this;
    }

    create ()
    {
        //  If you disable topOnly it will fire events for all objects the pointer is over, regardless of place on the display list
        this.input.topOnly = true;

        this.add.image(0, 0, 'background').setOrigin(0, 0);

        const globalTextSettings = {
            font: 'bold 20px Arial',
            color: 'white',
            align: 'center'
        }

        const datasTextSettings = {
            font: 'bold 15px Arial',
            color: 'white',
            align: 'left'
        }

        turnsLeft = MAX_TURNS;
        score = 0;
        highScore = 0; // TODO : Get from local storage

        usedHorses = [];
        choiceBtns = [];

        turnsTxt = this.add.text(50, 30, `Turns Left: ${turnsLeft}`, datasTextSettings);
        scoreTxt = this.add.text(50, 50, `Score: ${score}`, datasTextSettings);

        this.add.image(300, 261, "container")
        guessImg = this.add.image(300, 261, `${horseDatas[0].name}_img`).setScale(0.5);

        initializeGuessButtons(this);
        updateGuessQuestion();

        function initializeGuessButtons()
        {
            for (let i = 0; i < MAX_CHOICE_BTN; i++)
                {
                    var btn = scene.add.image(620, 201 + (50 * i), 'button').setScale(1.4).setInteractive({pixelPerfect: true});
                    var btnTxt = scene.add.text(620, 203 + (50 * i), `Bella Sara`, globalTextSettings).setOrigin(.5, .5);
            
                    var btnObj = {
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
            scoreTxt.text = `Score: ${score}`;
            turnsTxt.text = `Turns Left: ${turnsLeft}`;

            var randHorse = -1;
            var failsafe = 100;

            do
            {
                randHorse = Math.floor(Math.random()*horseDatas.length);
                failsafe--;
            }
            while (usedHorses.length > 0 && usedHorses.includes(randHorse) && failsafe > 0)
            usedHorses.push(randHorse);
            
            guessImg.setTexture(`${horseDatas[randHorse].name}_img`)

            var alreadyPickedNums = [];
            alreadyPickedNums.push(randHorse);
            var randGoodChoice = Math.floor(Math.random()*MAX_CHOICE_BTN);

            var btnDatas = choiceBtns[randGoodChoice];
            btnDatas.text.text = `${horseDatas[randHorse].name}`;
            btnDatas.goodChoice = true;   

            for (let i = 0; i < MAX_CHOICE_BTN; i++)
            {
                if (randGoodChoice == i)
                {
                    continue;               
                }

                var otherChoice;

                var failsafe = 100;

                do{
                    otherChoice = Math.floor(Math.random()*horseDatas.length);
                    failsafe--;
                }
                while (alreadyPickedNums.includes(otherChoice) || failsafe <= 0);

                alreadyPickedNums.push(otherChoice);
                var btnDatas = choiceBtns[i];
                btnDatas.text.text = `${horseDatas[otherChoice].name}`;
                btnDatas.goodChoice = false;   
            }
        }

        function makeGuess(buttonClicked)
        {
            if (choiceBtns[buttonClicked].goodChoice)
            {
                score++;
                console.log("Good Answer!");
            }
            else
            {
                console.log("Wrong Answer!");
            }

            turnsLeft--;

            if (turnsLeft <= 0)
            {
                showEndPopup();
                return;
            }
            
            updateGuessQuestion();
        }

        function showEndPopup()
        {
            scoreTxt.setAlpha(0);
            turnsTxt.setAlpha(0);

            scene.add.image(444, 260, 'container')
                     .setOrigin(.5, .5)
                     .setScale(3.5, 1.15)

            scene.add.text(444, 100, "Well Done!").setOrigin(.5, .5);
            scene.add.text(444, 150, "You know your horses well!").setOrigin(.5, .5);
            scene.add.text(444, 250, `Score: ${score} / ${MAX_TURNS}`).setOrigin(.5, .5);

            var retryBtn = scene.add.image(300, 350, 'button').setInteractive({pixelPerfect: true}).setOrigin(.5, .5);
            scene.add.text(300, 350, "Retry").setOrigin(.5, .5);

            var categoryBtn = scene.add.image(500, 350, 'button').setInteractive({pixelPerfect: true}).setOrigin(.5, .5);
            scene.add.text(500, 350, "Categories").setOrigin(.5, .5);

            retryBtn.on("pointerdown", function(pointer)
            {
                scene.scene.restart();
            })

            categoryBtn.on("pointerdown", function(pointer)
            {
                scene.scene.start("chooseCategory");
            })
        }
    }
}
