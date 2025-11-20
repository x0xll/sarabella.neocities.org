class uiMinimap extends uiManagerBase
{
    MINIMAP_IMG = "minimap_";
    ZONE_NAMES = [
        "Z001",
        "Z002",
        "Z007",
        "Z008",
        "Z009",
        "Z010",
        "Z011",
        "Z012",
        "Z022",
        "Z026"
    ]

    constructor(phaserScene)
    {
        super(phaserScene);
    }

    load()
    {
        // Main border
        for (let i = 0; i < this.ZONE_NAMES.length; i++)
        {
            this.phaserScene.load.image(this.MINIMAP_IMG + this.ZONE_NAMES[i], "./assets/extracted/MiniMap/" + this.ZONE_NAMES[i] + ".png");
        }
    }

    initialize()
    {
        var map = this.phaserScene.add.image(130, 60, this.MINIMAP_IMG + 0)
                    .setOrigin(0)
                    .setScrollFactor(0);

        this.phaserScene.sharedData.minimap.ui.elements = 
        {
            map: map
        };

        super.initialize();
    }

    show()
    {
        if (this.phaserScene.sharedData.minimap.ui.elements === undefined)
            this.initialize();

        if (this.phaserScene.sharedData.minimap.ui.open)
        {
            this.hide();
            return;
        }

        if (this.phaserScene.uiOpen)
            return;

        this.phaserScene.sharedData.minimap.ui.open = true;
        this.phaserScene.sharedData.minimap.ui.elements.map.setAlpha(1);
        this.phaserScene.sharedData.minimap.ui.elements.map.setTexture(this.MINIMAP_IMG + this.phaserScene.sharedData.global.ZONE_ID);

        super.show();
    }

    hide()
    {
        super.hide();

        this.phaserScene.sharedData.minimap.ui.open = false;
        this.phaserScene.sharedData.minimap.ui.elements.map.setAlpha(0);
    }
}