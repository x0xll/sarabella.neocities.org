class Common_UI extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'common_ui' });
    }

    preload ()
    {

    }

    create ()
    {   
        const game = this;

        initializeLoadingUI(game);
    }
}