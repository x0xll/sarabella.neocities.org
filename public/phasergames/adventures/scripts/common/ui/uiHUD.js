class uiHUD extends uiManagerBase
{
    constructor(phaserScene)
    {
        super(phaserScene);
    }

    load()
    {
        const HUDAssetsPath = "./assets/extracted/UI/HUD"
        this.phaserScene.load.image("HUD_Ref", `${HUDAssetsPath}/HUD_Ref.png`)
        this.phaserScene.load.image("HUD_Main", `${HUDAssetsPath}/HUD_Main.png`)
        this.phaserScene.load.atlas('timeIndicator', `${HUDAssetsPath}/timeIndicator.png`, `${HUDAssetsPath}/timeIndicator.json`);
        this.phaserScene.load.atlas('portrait', `${HUDAssetsPath}/portrait.png`, `${HUDAssetsPath}/portrait.json`);
        this.phaserScene.load.atlas('mapButton', `${HUDAssetsPath}/btnMap.png`, `${HUDAssetsPath}/btnMap.json`);
        this.phaserScene.load.atlas('inventoryButton', `${HUDAssetsPath}/btnInventory.png`, `${HUDAssetsPath}/btnInventory.json`);
        this.phaserScene.load.atlas('journalButton', `${HUDAssetsPath}/btnJournal.png`, `${HUDAssetsPath}/btnJournal.json`);
        this.phaserScene.load.image('skillProgressButton', `${HUDAssetsPath}/btnSkillProgress.png`);
        this.phaserScene.load.atlas('levelIndicator', `${HUDAssetsPath}/levels.png`, `${HUDAssetsPath}/levels.json`);
        this.phaserScene.load.atlas('saveButton', `${HUDAssetsPath}/btnSave.png`, `${HUDAssetsPath}/btnSave.json`);
        this.phaserScene.load.atlas('helpButton', `${HUDAssetsPath}/btnHelp.png`, `${HUDAssetsPath}/btnHelp.json`);
    }

    initialize()
    {
        this.phaserScene.add.image(-7, 0, 'HUD_Main').setOrigin(0, 0).setScrollFactor(0).setDepth(100);
        // UI.add.image(-7, 0, 'HUD_Ref').setOrigin(0, 0).setScrollFactor(0).setAlpha(.5)
        this.phaserScene.sharedData.hud.ui.timeIndicator = this.phaserScene.add.sprite(748, 52, 'timeIndicator', 'day1').setScale(.3333).setDepth(100);

        this.phaserScene.sharedData.hud.ui.potrait = this.phaserScene.add.sprite(282, 561, 'portrait', 'up').setScale(.56).setDepth(100);
        this.phaserScene.sharedData.hud.ui.mapButton = this.phaserScene.add.sprite(337, 549, 'mapButton', 'up').setScale(.75).setInteractive().setDepth(100);
        this.phaserScene.sharedData.hud.ui.inventoryButton = this.phaserScene.add.sprite(400, 549, 'inventoryButton', 'up').setScale(.75).setInteractive().setDepth(100);
        this.phaserScene.sharedData.hud.ui.journalButton = this.phaserScene.add.sprite(463, 549, 'journalButton', 'up').setScale(.75).setInteractive().setDepth(100);
        this.phaserScene.sharedData.hud.ui.skillProgressButton = this.phaserScene.add.sprite(526, 550, 'skillProgressButton').setScale(.6).setInteractive().setDepth(100);
        this.phaserScene.sharedData.hud.ui.levelIndicator = this.phaserScene.add.sprite(519, 552, 'levelIndicator', this.phaserScene.sharedData.magicTree.logic.level.toString()).setScale(.75).setDepth(100);

        this.phaserScene.sharedData.hud.ui.saveButton = this.phaserScene.add.sprite(681, 565, 'saveButton', 'up').setScale(.9).setDepth(100);
        this.phaserScene.sharedData.hud.ui.helpButton = this.phaserScene.add.sprite(751, 564, 'helpButton', 'up').setScale(.66).setDepth(100);
        
        this.phaserScene.sharedData.hud.ui.saveText = this.phaserScene.add.text(665, 555, "Save", {font: "15px Arial", color: "#ffffffff"}).setDepth(100);
    
        this.updateTexts();
    }

    updateTexts()
    {
        if (this.phaserScene.sharedData.hud.ui.areaName === undefined)
            this.phaserScene.sharedData.hud.ui.areaName = this.phaserScene.add.text(350, 10, this.phaserScene.sharedData.zoneManager.getCurrentZoneName(), {font: "18px Arial", color: "#000000ff"}).setDepth(100);
        else{
            this.phaserScene.sharedData.hud.ui.areaName.text = this.phaserScene.sharedData.zoneManager.getCurrentZoneName();
        }
    }
}