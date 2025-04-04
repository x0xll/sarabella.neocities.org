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
    }

    create (sharedData)
    {   
        const UI = this;
        UI.sharedData = sharedData

        UI.add.image(-7, 0, 'HUD_Main').setOrigin(0, 0).setScrollFactor(0)
        UI.sharedData.timeIndicator = UI.add.sprite(748, 52, 'timeIndicator', 'day1').setScale(.3333)

        // UI.add.image(-7, 0, 'HUD_Ref').setOrigin(0, 0).setScrollFactor(0).setAlpha(.5)
        // initializeLoadingUI(UI);
    }
}