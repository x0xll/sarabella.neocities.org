class Common_UI extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'common_ui' });
    }

    preload ()
    {
        const UI = this

        UI.minimapUI = new uiMinimap(this);
        UI.minimapUI.load();

    }

    create (sharedData)
    {   
        const UI = this;
        UI.sharedData = sharedData // Used to share data across multiple scenes, managers, &c.

        // initializeLoadingUI(UI);

        function handleMiniMap()
        {
            UI.sharedData.minimap = {};
            UI.sharedData.minimap.ui = {};
            UI.sharedData.minimap.ui.manager = UI.minimapUI;
            UI.minimapUI = undefined;

            UI.sharedData.hud.ui.mapButton.on('pointerup', function (pointer){
                UI.sharedData.minimap.ui.manager.show();
            });
        }

        handleMiniMap();
    }
}