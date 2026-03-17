class uiHUD extends uiManagerBase
{
    SOUNDS = {
        hudButtonOver: "hudButtonOver",
        hudButtonDown: "hudButtonDown",
        hudMapDown: "hudMapDown",
        hudInventoryDown: "hudInventoryDown",
        hudJournalDown: "hudJournalDown",
    }

    constructor(phaserScene)
    {

        super(phaserScene, "hud");
        this.load()
    }

    load()
    {
        super.load()

        const HUDAssetsPath = `${ROOT_ASSETS_PATH}/UI/HUD`

        this.phaserScene.load.audio(this.SOUNDS.hudButtonOver, `${ROOT_ASSETS_PATH}Audio/HUD/92.mp3`);
        this.phaserScene.load.audio(this.SOUNDS.hudButtonDown, `${ROOT_ASSETS_PATH}Audio/HUD/93.mp3`);
        this.phaserScene.load.audio(this.SOUNDS.hudMapDown, `${ROOT_ASSETS_PATH}Audio/HUD/99.mp3`);
        this.phaserScene.load.audio(this.SOUNDS.hudInventoryDown, `${ROOT_ASSETS_PATH}Audio/HUD/105.mp3`);
        this.phaserScene.load.audio(this.SOUNDS.hudJournalDown, `${ROOT_ASSETS_PATH}Audio/HUD/110.mp3`);

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

        this.phaserScene.load.spineAtlas(`sparkle-atlas`, `${ROOT_ASSETS_PATH}UI/Common/Sparkle/skeleton.atlas`);
        this.phaserScene.load.spineJson(`sparkle-json`, `${ROOT_ASSETS_PATH}UI/Common/Sparkle/skeleton.json`);
    }

    create()
    {
        this.phaserScene.sharedData.hud.ui.manager.initialize();
    }

    initialize()
    {
        this.phaserScene.add.image(-7, 0, 'HUD_Main').setOrigin(0, 0).setScrollFactor(0).setDepth(100);
        // UI.add.image(-7, 0, 'HUD_Ref').setOrigin(0, 0).setScrollFactor(0).setAlpha(.5)
        this.phaserScene.sharedData.hud.ui.timeIndicator = this.phaserScene.add.sprite(748, 52, 'timeIndicator', 'day1').setScale(.3333).setDepth(100);

        this.hudButtonDown = this.phaserScene.sound.add(this.SOUNDS.hudButtonDown, {volume: VOLUME});
        this.hudButtonOver = this.phaserScene.sound.add(this.SOUNDS.hudButtonOver, {volume: VOLUME});
        this.hudMapDown = this.phaserScene.sound.add(this.SOUNDS.hudMapDown, {volume: VOLUME});
        this.hudInventoryDown = this.phaserScene.sound.add(this.SOUNDS.hudInventoryDown, {volume: VOLUME});
        this.hudJournalDown = this.phaserScene.sound.add(this.SOUNDS.hudJournalDown, {volume: VOLUME});

        this.phaserScene.sharedData.hud.ui.potrait = this.phaserScene.add.sprite(282, 561, 'portrait', 'up').setScale(.56).setDepth(100);
        this.phaserScene.sharedData.hud.ui.mapButton = this.phaserScene.add.sprite(337, 549, 'mapButton', 'up').setScale(.75).setInteractive({ useHandCursor: true }).setDepth(100);
        this.phaserScene.sharedData.hud.ui.inventoryButton = this.phaserScene.add.sprite(400, 549, 'inventoryButton', 'up').setScale(.75).setInteractive({ useHandCursor: true }).setDepth(100);
        this.phaserScene.sharedData.hud.ui.journalButton = this.phaserScene.add.sprite(463, 549, 'journalButton', 'up').setScale(.75).setInteractive({ useHandCursor: true }).setDepth(100);
        this.phaserScene.sharedData.hud.ui.skillProgressButton = this.phaserScene.add.sprite(526, 550, 'skillProgressButton').setScale(.6).setInteractive({ useHandCursor: true }).setDepth(100);
        this.phaserScene.sharedData.hud.ui.levelIndicator = this.phaserScene.add.sprite(519, 552, 'levelIndicator', this.phaserScene.sharedData.magicTree.logic.level.toString()).setScale(.75).setDepth(100);
        this.phaserScene.sharedData.hud.ui.levelText = this.phaserScene.add.text(543, 559, this.phaserScene.sharedData.magicTree.logic.level.toString(), {font: "700 10px Arial", color: "#ffffffff"}).setDepth(100).setOrigin(.5);

        this.phaserScene.sharedData.hud.ui.saveButton = this.phaserScene.add.sprite(681, 565, 'saveButton', 'up').setScale(.9).setDepth(100).setInteractive({ useHandCursor: true });
        this.phaserScene.sharedData.hud.ui.saveButton.on("pointerdown", () => {
            this.phaserScene.sharedData.saving.saveGameData();
            this.phaserScene.sharedData.hud.ui.saveButton.setFrame("down")
            this.hudButtonDown.play()
        }, this);
        this.phaserScene.sharedData.hud.ui.saveButton.on('pointerup', function (pointer) {
            this.phaserScene.sharedData.hud.ui.saveButton.setFrame("up")
        }, this);
        this.phaserScene.sharedData.hud.ui.saveButton.on('pointerover', function (pointer) {
            this.phaserScene.sharedData.hud.ui.saveButton.setFrame("over")
            this.hudButtonOver.play()
        }, this);
        this.phaserScene.sharedData.hud.ui.saveButton.on('pointerout', function (pointer) {
            this.phaserScene.sharedData.hud.ui.saveButton.setFrame("up")
        }, this);


        this.phaserScene.sharedData.hud.ui.helpButton = this.phaserScene.add.sprite(751, 564, 'helpButton', 'up').setScale(.66).setDepth(100).setInteractive({ useHandCursor: true });
        this.phaserScene.sharedData.hud.ui.helpButton.on("pointerdown", () => {
            goToExternalURL("https://web.archive.org/web/20100528225638/http://bellasara.com/bsa-helphome.aspx");
            this.phaserScene.sharedData.hud.ui.helpButton.setFrame("down")
        }, this);
        this.phaserScene.sharedData.hud.ui.helpButton.on('pointerup', function (pointer) {
            this.phaserScene.sharedData.hud.ui.helpButton.setFrame("up")
        }, this);
        this.phaserScene.sharedData.hud.ui.helpButton.on('pointerover', function (pointer) {
            this.phaserScene.sharedData.hud.ui.helpButton.setFrame("over")
            this.hudButtonOver.play()
        }, this);
        this.phaserScene.sharedData.hud.ui.helpButton.on('pointerout', function (pointer) {
            this.phaserScene.sharedData.hud.ui.helpButton.setFrame("up")
        }, this);
        
        this.phaserScene.sharedData.hud.ui.saveText = this.phaserScene.add.text(680, 565, this.phaserScene.sharedData.ui.localization.items[0].hudSave[0].text, {font: "700 13px Arial", color: "#ffffffff"}).setDepth(100).setOrigin(.5);
        

        this.phaserScene.sharedData.hud.ui.areaName = this.phaserScene.add.text(400, 20, "zoneName", {font: "18px Arial", color: "#000000ff"}).setDepth(100);


        this.phaserScene.sharedData.hud.ui.sparkle = this.phaserScene.add.spine(519, 536, `sparkle-json`, `sparkle-atlas`)
                    .setAlpha(0)
                    .setDepth(100)
                    .setScrollFactor(0);
    
        this.updateTexts();
        this.updateLevel();
    }

    updateTexts()
    {
        const zoneName = this.phaserScene.sharedData.zone.manager.getCurrentZoneName()
        this.phaserScene.sharedData.hud.ui.areaName.text = zoneName;
        this.phaserScene.sharedData.hud.ui.areaName.setOrigin(.5)
    }

    updateLevel()
    {
        if (this.phaserScene.sharedData.hud.ui.levelIndicator === undefined
            || this.phaserScene.sharedData.hud.ui.levelIndicator.scene === undefined
        ) { 
            return;
        }

        this.phaserScene.sharedData.hud.ui.levelIndicator.setTexture('levelIndicator', this.phaserScene.sharedData.magicTree.logic.level.toString())
        this.phaserScene.sharedData.hud.ui.levelText.setText(this.phaserScene.sharedData.magicTree.logic.level.toString())
    }

    playLevelSparkle() {
        this.phaserScene.sharedData.hud.ui.sparkle.animationState.setAnimation(0, `animation`, false)
        this.phaserScene.sharedData.hud.ui.sparkle.setAlpha(1)

        let UI = this
        this.phaserScene.sharedData[this.key].ui.sparkle.animationState.addListener({
                complete: function endAnimation(entry) { 
                    UI.phaserScene.sharedData[UI.key].ui.sparkle.setAlpha(0)
                }       
             })
    }
}
