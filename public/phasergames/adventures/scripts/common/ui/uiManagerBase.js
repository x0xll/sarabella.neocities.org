class uiManagerBase
{
    phaserScene;

    constructor(phaserScene, key)
    {
        this.phaserScene = phaserScene;

        this.key = key
        phaserScene.sharedData.UIkeys.push(key)
    }

    load()
    {
        const UI = this.phaserScene

        if (UI.sharedData[this.key] === undefined)
        {
            UI.sharedData[this.key] = {};
        }

        if (UI.sharedData[this.key].ui === undefined)
        {
            UI.sharedData[this.key].ui = {};
            UI.sharedData[this.key].ui.manager = this;
        }
    }

    create()
    {

    }

    initialize()
    {
        this.hide();
    }

    show()
    {
        if (this.phaserScene.sharedData[this.key].ui.elements === undefined)
            this.initialize();

        if (this.phaserScene.sharedData[this.key].ui.open) {
            this.hide();
            return false;
        }

        if (this.phaserScene.sharedData.global.uiOpen)
            return false;

        this.phaserScene.sharedData.global.uiOpen = true;
        this.phaserScene.sharedData[this.key].ui.open = true;

        return true
    }

    hide()
    {
        this.phaserScene.sharedData.global.uiOpen = false;
        this.phaserScene.sharedData[this.key].ui.open = false;
        this.turnOffEvents()
    }

    turnOnEvents()
    {

    }
    turnOffEvents()
    {

    }
}