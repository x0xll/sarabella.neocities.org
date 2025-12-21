class Common_UI extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'common_ui' });
    }

    init (sharedData) {
        this.sharedData = sharedData // Used to share data across multiple scenes, managers, &c.
    }

    preload ()
    {
        const UI = this
        UI.sharedData.ui.keys = []

        UI.hudUI = new uiHUD(this);
        UI.inventoryUI = new uiInventory(this);
        UI.magicTreeUI = new uiMagicTree(this);
        UI.questUI = new uiQuest(this);
        UI.minimapUI = new uiMinimap(this);
        UI.dialogueUI = new uiDialogue(this);

        debug.uiScene = this
    }

    create (sharedData)
    {   
        const UI = this;
        UI.sharedData.global.uiOpen = false
        this.sharedData.ui.isInitialized = false

        this.sharedData.ui.keys.forEach(key => {
            this.sharedData[key].ui.manager.phaserScene = this
            this.sharedData[key].ui.manager.create()
            if (this.sharedData[this.key]
                && this.sharedData[this.key].ui
            ) {
                this.sharedData[this.key].ui.open = false
            }
        });
        this.sharedData.ui.isInitialized = true
        while (!this.sharedData.ui.isInitialized) {}
        this.sharedData.quest.manager.tryZoneStartTriggers()
    }
}