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
        
        // DEBUG
        this.load.image('mockup', '/phasergames/memory/yinyang/images/mockup.png');
    }

    create ()
    {
        const game = this;
        //  If you disable topOnly it will fire events for all objects the pointer is over, regardless of place on the display list
        this.input.topOnly = true;

        // General vars we need for the game

        // Set UI
        this.add.image(0, 0, 'background').setOrigin(0);

        this.add.image(0, 0, 'mockup').setOrigin(0).setAlpha(0.5); // DEBUG

        // Score

        // Timer

        // Init Memory Game
    }
}
