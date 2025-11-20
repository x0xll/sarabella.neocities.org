class Common_UI extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'common_ui' });
    }

    preload ()
    {
        const UI = this

        UI.hudUI = new uiHUD(this);
        UI.hudUI.load();

        UI.inventoryUI = new uiInventory(this);
        UI.inventoryUI.load();

        UI.minimapUI = new uiMinimap(this);
        UI.minimapUI.load();

    }

    create (sharedData)
    {   
        const UI = this;
        UI.sharedData = sharedData // Used to share data across multiple scenes, managers, &c.

        // initializeLoadingUI(UI);

        function handleInventory()
        {
            UI.sharedData.inventory = {};
            UI.sharedData.inventory.ui = {};
            UI.sharedData.inventory.ui.manager = UI.inventoryUI;
            UI.inventoryUI = undefined;

            UI.sharedData.hud.ui.inventoryButton.on('pointerup', function (pointer) {
                UI.sharedData.inventory.ui.manager.show();
            });
        }

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

        function handleHUD()
        {
            UI.sharedData.hud = {};
            UI.sharedData.hud.ui = {};
            UI.sharedData.hud.ui.manager = UI.hudUI;
            UI.hudUI = undefined;
            UI.sharedData.hud.ui.manager.initialize();
        }

        handleHUD();
        handleInventory();
        handleMiniMap();
    }
}