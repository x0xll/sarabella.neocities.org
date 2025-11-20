class Common_UI extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'common_ui' });
    }

    preload ()
    {
        const UI = this

    }

    create (sharedData)
    {   
        const UI = this;
        UI.sharedData = sharedData // Used to share data across multiple scenes, managers, &c.

        // initializeLoadingUI(UI);

    }
}