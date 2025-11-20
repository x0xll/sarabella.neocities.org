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
        this.phaserScene.uiOpen = true;
    }

    hide()
    {
        this.phaserScene.uiOpen = false;
    }
}