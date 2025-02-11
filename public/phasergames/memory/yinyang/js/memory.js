// Actual game
class Memory extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: 'Memory'
        });
    }

    preload ()
    {  
        // Display Loading Bar
        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0x35a3d5, 1);
            progressBar.fillRect(422, 443, 100 * value, 6);
        });    
        this.add.image(475, 315, 'card_back'); 
        this.add.graphics().fillStyle(0x000000).fillRect(420, 440, 116, 12);
        const progressBar = this.add.graphics();

        // Loading horse sprites

        // Load in images and sounds
        this.load.image('background', '/phasergames/memory/yinyang/images/background.png');
        this.load.image('data_container', '/phasergames/memory/yinyang/images/datas_container.png');
        this.load.image('img_container', '/phasergames/memory/yinyang/images/img_container.png');
        this.load.image('button', '/phasergames/memory/yinyang/images/choice_btn.png');
        
        // DEBUG
        this.load.image('testImg', '/images/horses/bella.png')
    }

    create ()
    {
        const game = this;
        //  If you disable topOnly it will fire events for all objects the pointer is over, regardless of place on the display list
        this.input.topOnly = true;

        // General var
        const START_POS_X = 510;
        const START_POS_Y = 156;
        const CELL_SIZE_X = 90;
        const CELL_SIZE_Y = 130;
        const OFFSET_X = 140;
        const OFFSET_Y = 168;

        // Set UI
        this.add.image(0, 0, 'background').setOrigin(0);
        this.add.image(840, 47, 'data_container').setScale(.8, .7);


        const globalTextSettings = {
            font: 'bold 26px Arial',
            color: 'white',
            align: 'center',
            wordWrap: { width: 400 } ,
        }

        const datasTextSettings = {
            font: 'bold 20px Arial',
            color: 'white',
            align: 'left'
        }

        // Score
        let score = 0;
        let scoreTxt = this.add.text(718, 36, `${langData.score}${score}`, datasTextSettings);

        // Timer
        let timer = "00:00";
        let timerTxt = this.add.text(858, 36, `${langData.time}${timer}`, datasTextSettings);

        // Init Memory Game
        initCards();

        function initCards()
        {
            let cards = [];
            for (let xColumn = 0; xColumn < 4; xColumn++)
            {
                cards[xColumn] = []
    
                for(let yRow = 0; yRow < 3; yRow++)
                {
                    let card = game.add.image(START_POS_X + xColumn * OFFSET_X,
                                              START_POS_Y + yRow * OFFSET_Y,
                                              'card_back')
                                              .setOrigin(0.5)
                                              .setDisplaySize(CELL_SIZE_X, CELL_SIZE_Y)
                                              .setInteractive({pixelPerfect: true});
    
                    let cardDatas = 
                    {
                        x: xColumn,
                        y: yRow,
                        cardObj: card,
                        cardImgRef: "test",
                        visibleSide: false
                    }
    
                    card.on("pointerdown", () =>
                    {
                        userChoseCard(cardDatas);
                    });
    
                    cards[xColumn].push(cardDatas)
                }
            }
        }

        function userChoseCard(cardDatas)
        {
            console.log(cardDatas);
            RotateCard(cardDatas);
        }

        // ROTATE CARD
        function RotateCard(cardData)
        {
            let startTween = game.tweens.add({
                targets: cardData.cardObj,
                scaleX: 0,
                duration: 1000,
                ease: "Linear",
                onComplete: function() {
                    if (cardData.visibleSide == false) {
                        cardData.cardObj.setTexture("testImg")
                    } else {
                        cardData.cardObj.setTexture("card_back")
                    }

                    cardData.visibleSide = !cardData.visibleSide;                       
                    let endTween = game.tweens.add({
                        targets: cardData.cardObj,
                        scaleX: 1,
                        duration: 1000,
                        ease: "Linear",
                        onComplete: function()
                        {
                            cardData.cardObj.setDisplaySize(CELL_SIZE_X, CELL_SIZE_Y);
                            endTween.destroy();
                        }
                    });

                    startTween.destroy();
                }
            });
        }

        // END POPUP
        this.showEndPopup = showEndPopup;

        function showEndPopup(won)
        {
            game.add.image(710, 325, 'img_container')
                    .setScale(1.12, .79);

            game.over = true;

            let endTitleTxt = (won) ? langData.congrats : langData.oops;
            let endDescTxt = (won) ? langData.won : langData.lost;

            game.add.text(710, 200, endTitleTxt, globalTextSettings).setOrigin(.5);
            game.add.text(710, 250, endDescTxt, globalTextSettings).setOrigin(.5);

            let retryBtn = game.add.image(710, 400, 'button').setOrigin(.5).setInteractive({pixelPerfect: true});
            game.add.text(710, 400, langData.retry, globalTextSettings).setOrigin(.5);
            retryBtn.on("pointerdown", () => game.scene.restart());
        }
    }

    update()
    {
        if (game.over) return;

        // TURN CARD

        // HANDLE TIMER
    }
}