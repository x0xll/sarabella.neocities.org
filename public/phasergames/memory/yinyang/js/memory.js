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
        const cardPaths = 
        [
            "/images/horses/bella.png",
            "/images/horses/bellisimo.png",
            "/images/horses/bello.png",
            "/images/horses/fiona.png",
            "/images/horses/rain.png",
            "/images/horses/shaman.png",
            "/images/horses/thunder.png",
            "/images/horses/yinyang.png"
        ]
        this.possibleCards = [];
        cardPaths.forEach(card => {     
            this.load.image(`${card}_img`, `${card}`);

            this.possibleCards.push(`${card}_img`)
        });

        // Load in images and sounds
        this.load.image('background', '/phasergames/memory/yinyang/images/background.png');
        this.load.image('data_container', '/phasergames/memory/yinyang/images/datas_container.png');
        this.load.image('img_container', '/phasergames/memory/yinyang/images/img_container.png');
        this.load.image('button', '/phasergames/memory/yinyang/images/choice_btn.png');
    }

    create ()
    {
        const game = this;
        //  If you disable topOnly it will fire events for all objects the pointer is over, regardless of place on the display list
        this.input.topOnly = true;

        this.over = false;

        // General var
        const START_POS_X = 510;
        const START_POS_Y = 156;
        const CELL_SIZE_X = 90;
        const CELL_SIZE_Y = 130;
        const OFFSET_X = 140;
        const OFFSET_Y = 168;

        let cardsVisible = [];

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
        const TIMER_START = 25;
        let timerEvent = this.time.addEvent({delay: 1000, callback: onEvent, callbackScope: this, loop: true })
        let timer = TIMER_START;
        let timerTxt = this.add.text(858, 36, `${langData.time}${formatTime(timer)}`, datasTextSettings);

        function formatTime(seconds){
            var minutes = Math.floor(seconds/60);
            var partInSeconds = seconds%60;
            partInSeconds = partInSeconds.toString().padStart(2,'0');
            return `${minutes}:${partInSeconds}`;
        }

        function onEvent ()
        {
            timer -= 1;
            timerTxt.text = `${langData.time}${formatTime(timer)}`

            if (timer == 0)
            {
                showEndPopup(false);
            }
        }


        // Init Memory Game
        initCards();

        function initCards()
        {
            let usedCards = []

            for(let i = 0; i < 6; i++)
            {
                // Choose the cards we will use
                let cardIndex = -1;
                do
                {
                    cardIndex = Math.floor(Math.random()*game.possibleCards.length);
                }
                while(usedCards.includes(cardIndex))

                usedCards.push(cardIndex);
                usedCards.push(cardIndex);
            }

            let cards = [];
            for (let xColumn = 0; xColumn < 4; xColumn++)
            {
                cards[xColumn] = []
    
                for(let yRow = 0; yRow < 3; yRow++)
                {
                    let randCard = Math.floor(Math.random()*usedCards.length);
                    let cardIndex = usedCards[randCard];
                    usedCards.splice(randCard, 1);

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
                        refImg: game.possibleCards[cardIndex],
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
            if (game.over) return;

            if (cardsVisible.length >= 2) return;

            cardsVisible.push(cardDatas);
            RotateCard(cardDatas);
        }

        // ROTATE CARD
        function RotateCard(cardData)
        {
            let newTexture = (cardData.visibleSide) ? "card_back" : cardData.refImg;   

            let startTween = game.tweens.add({
                targets: cardData.cardObj,
                scaleX: 0,
                duration: 300,
                ease: "Linear",
                onComplete: function() {
                    cardData.cardObj.setTexture(newTexture).setDisplaySize(CELL_SIZE_X, CELL_SIZE_Y);   

                    let scaleEndTween = (cardData.visibleSide) ? 0.596 : ((CELL_SIZE_X * 100) / cardData.cardObj.width) / 100;

                    cardData.cardObj.setTexture(newTexture).setScale(0, cardData.cardObj.scaleY);

                    cardData.visibleSide = !cardData.visibleSide;   

                    let endTween = game.tweens.add({
                        targets: cardData.cardObj,
                        scaleX: scaleEndTween,
                        duration: 300,
                        ease: "Linear",
                        onComplete: function()
                        {
                            cardData.cardObj.setScale(scaleEndTween);
                            cardData.cardObj.setDisplaySize(CELL_SIZE_X, CELL_SIZE_Y)

                            if (cardsVisible[1] === cardData)
                                CheckCards();
                        }
                    })
                }
            });
        }

        function CheckCards()
        {
            if (cardsVisible.length != 2) return;

            if (cardsVisible[0].refImg === cardsVisible[1].refImg)
            {
                score++;
                scoreTxt.text = `${langData.score}${score}`;

                hideCards();

                if (score >= 6) // WE WON
                    showEndPopup(true);
            }
            else
            {
                RotateCard(cardsVisible[0]);
                RotateCard(cardsVisible[1]);
            }

            cardsVisible = [];
        }

        function hideCards()
        {
            let card1 = cardsVisible[0].cardObj
            let card2 = cardsVisible[1].cardObj

            game.tweens.add({
                targets: card1,
                alpha: 0,
                duration: 300,
                ease: "Linear",
                onComplete: function() {
                    card1.setVisible(false);
                }
            });

            game.tweens.add({
                targets: card2,
                alpha: 0,
                duration: 300,
                ease: "Linear",
                onComplete: function() {
                    card2.setVisible(false);
                }
            });
        }

        // END POPUP
        this.showEndPopup = showEndPopup;

        function showEndPopup(won)
        {
            timerEvent.remove();
            timerEvent.destroy();

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
}
