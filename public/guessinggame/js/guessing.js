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
var score = 0;
var highScore = 0;
var usedHorses = [];
var choiceBtns = [];
var guessImg;

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
        this.load.image('container', './images/infoBox.png');

        /*this.load.atlas('music_button', './images/airStable/music.png', './images/airStable/music.json');
        
        this.load.audio('background_music', ['./sounds/stable_soundtrack.mp3']);
        
        this.load.audio('inspiration_hover', ['./sounds/inspiration_hover.mp3']);
        this.load.audio('inspiration_sound', ['./sounds/inspiration.mp3']);
        this.load.audio('inspiration_close', ['./sounds/inspiration_close.mp3']);*/
    }

    create ()
    {
        //  If you disable topOnly it will fire events for all objects the pointer is over, regardless of place on the display list
        this.input.topOnly = true;

        const globalTextSettings = {
            font: 'bold 25px Arial',
            color: 'white',
            align: 'center',
        }

        /*const backgroundMusic = this.sound.add('background_music');
        backgroundMusic.loop = true;
        backgroundMusic.play();*/

        var randHorse = Math.floor(Math.random()*horseDatas.length);
        usedHorses.push = randHorse;

        this.add.image(150, 261, "container")
        guessImg = this.add.image(150, 261, `${horseDatas[randHorse].name}_img`).setScale(0.5);
        console.log("Picked: " + horseDatas[randHorse].name);

        var alreadyPickedNums = [];
        alreadyPickedNums.push(randHorse);
        var randGoodChoice = Math.floor(Math.random()*MAX_CHOICE_BTN);

        var btn = this.add.image(500, 201 + (50 * randGoodChoice), 'button').setScale(1.4).setInteractive({pixelPerfect: true});
        var btnTxt = this.add.text(500, 201 + (50 * randGoodChoice), `${horseDatas[randHorse].name}`);

        var btnObj = {
            button : btn,
            text : btnTxt,
            goodChoice : true
        }

        choiceBtns.push(btnObj);
        btn.on("pointerdown", () => {makeGuess(btnObj)});  

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
            while (alreadyPickedNums.includes(otherChoice) && failsafe > 0);

            alreadyPickedNums.push(otherChoice);
            var btn = this.add.image(500, 201 + (50 * otherChoice), 'button').setScale(1.4).setInteractive({pixelPerfect: true});
            var btnTxt = this.add.text(500, 201 + (50 * otherChoice), `${horseDatas[otherChoice].name}`);

            var btnObj = {
                name : "Button ${}",
                button : btn,
                text : btnTxt,
                goodChoice : false
            }
    
            choiceBtns.splice(otherChoice, 0, btnObj);
            btn.on("pointerdown", () => {makeGuess(btnObj)});         
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
            while (usedHorses.includes(randHorse) && failsafe > 0)
            usedHorses.push = randHorse;
            
            guessImg.setTexture(`${horseDatas[randHorse].name}_img`)
            console.log("Picked: " + horseDatas[randHorse].name);

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
                var btnDatas = choiceBtns[otherChoice];
                btnDatas.text.text = `${horseDatas[otherChoice].name}`;
                btnDatas.goodChoice = false;   
            }
        }

        function makeGuess(buttonClicked)
        {
            choiceBtns.forEach(btn => {
                if (btn == buttonClicked)
                {
                    if (btn.goodChoice)
                    {
                        score++;
                        console.log("Good Answer");
                    }
                    else
                        console.log("Wrong Answer");
        
                    turnsLeft--;
        
                    updateGuessQuestion();
                    return;
                }
            });
        }
    }
}
