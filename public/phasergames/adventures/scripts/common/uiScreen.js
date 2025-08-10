class Common_UI extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'common_ui' });
    }

    preload ()
    {
        const UI = this
        const HUDAssetsPath = "./assets/extracted/UI/HUD"
        UI.load.image("HUD_Ref", `${HUDAssetsPath}/HUD_Ref.png`)
        UI.load.image("HUD_Main", `${HUDAssetsPath}/HUD_Main.png`)
        UI.load.atlas('timeIndicator', `${HUDAssetsPath}/timeIndicator.png`, `${HUDAssetsPath}/timeIndicator.json`);
        UI.load.atlas('portrait', `${HUDAssetsPath}/portrait.png`, `${HUDAssetsPath}/portrait.json`);
        UI.load.atlas('mapButton', `${HUDAssetsPath}/btnMap.png`, `${HUDAssetsPath}/btnMap.json`);
        UI.load.atlas('inventoryButton', `${HUDAssetsPath}/btnInventory.png`, `${HUDAssetsPath}/btnInventory.json`);
        UI.load.atlas('journalButton', `${HUDAssetsPath}/btnJournal.png`, `${HUDAssetsPath}/btnJournal.json`);
        UI.load.image('skillProgressButton', `${HUDAssetsPath}/btnSkillProgress.png`);
        UI.load.atlas('levelIndicator', `${HUDAssetsPath}/levels.png`, `${HUDAssetsPath}/levels.json`);
        UI.load.atlas('saveButton', `${HUDAssetsPath}/btnSave.png`, `${HUDAssetsPath}/btnSave.json`);
        UI.load.atlas('helpButton', `${HUDAssetsPath}/btnHelp.png`, `${HUDAssetsPath}/btnHelp.json`);
    }

    create (sharedData)
    {   
        const UI = this;
        UI.sharedData = sharedData // Used to share data across multiple scenes, managers, &c.

        UI.add.image(-7, 0, 'HUD_Main').setOrigin(0, 0).setScrollFactor(0)
        // UI.add.image(-7, 0, 'HUD_Ref').setOrigin(0, 0).setScrollFactor(0).setAlpha(.5)
        UI.sharedData.timeIndicator = UI.add.sprite(748, 52, 'timeIndicator', 'day1').setScale(.3333)

        UI.sharedData.potrait = UI.add.sprite(282, 561, 'portrait', 'up').setScale(.56)
        UI.sharedData.mapButton = UI.add.sprite(337, 549, 'mapButton', 'up').setScale(.75)
        UI.sharedData.inventoryButton = UI.add.sprite(400, 549, 'inventoryButton', 'up').setScale(.75)
        UI.sharedData.journalButton = UI.add.sprite(463, 549, 'journalButton', 'up').setScale(.75).setInteractive()
        UI.sharedData.skillProgressButton = UI.add.sprite(526, 550, 'skillProgressButton').setScale(.6)
        UI.sharedData.levelIndicator = UI.add.sprite(519, 552, 'levelIndicator', '0').setScale(.75)

        UI.sharedData.saveButton = UI.add.sprite(681, 565, 'saveButton', 'up').setScale(.9)
        UI.sharedData.helpButton = UI.add.sprite(751, 564, 'helpButton', 'up').setScale(.66)

        // initializeLoadingUI(UI);
    }
}