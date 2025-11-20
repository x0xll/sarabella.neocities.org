class uiManagerBase
{
    phaserScene;

    constructor(phaserScene)
    {
        this.phaserScene = phaserScene;
    }

    load()
    {

    }

    initialize()
    {
        this.hide();
    }

    show()
    {
        this.phaserScene.sharedData.global.uiOpen = true;
    }

    hide()
    {
        this.phaserScene.sharedData.global.uiOpen = false;
    }
}