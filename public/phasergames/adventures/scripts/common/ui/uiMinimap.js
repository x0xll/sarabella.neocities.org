class uiMinimap extends uiManagerBase
{
    MINIMAP_BORDER = "minimapborder";
    MINIMAP_ICON = "minimapicon";
    MINIMAP_CLOSE_BTN = "minimapclose";
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

        // Main border
        this.phaserScene.load.image(this.MINIMAP_BORDER, "./assets/extracted/UI/Magic Tree/MT_Border.png");
        
        // TODO: Change for correct map one
        // Icon
        this.phaserScene.load.image(this.MINIMAP_ICON, "./assets/extracted/UI/Magic Tree/MT_Icon.png");

        // Close btn
        this.phaserScene.load.image(this.MINIMAP_CLOSE_BTN, "./assets/extracted/UI/Quest/closebtn.png")
    }

    initialize()
    {
        var map = this.phaserScene.add.image(100, 70, this.MINIMAP_IMG + 0)
                    .setOrigin(0)
                    .setScrollFactor(0);

        var border = this.phaserScene.add.image(98, 60, this.MINIMAP_BORDER)
                    .setOrigin(0)
                    .setScrollFactor(0)
                    .setScale(.9, .85);

        var icon = this.phaserScene.add.image(75, 40, this.MINIMAP_ICON)
                    .setOrigin(0)
                    .setScrollFactor(0);

        var closeBtn = this.phaserScene.add.image(668, 62, this.MINIMAP_CLOSE_BTN)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setInteractive();

        closeBtn.on('pointerup', (pointer) =>  
        { 
            this.hide();
        });

        this.phaserScene.sharedData.minimap.ui.elements = 
        {
            map: map,
            border: border,
            icon: icon,
            closeBtn: closeBtn
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

        if (this.phaserScene.sharedData.global.uiOpen)
            return;

        this.phaserScene.sharedData.minimap.ui.open = true;
        this.phaserScene.sharedData.minimap.ui.elements.map.setAlpha(1);
        this.phaserScene.sharedData.minimap.ui.elements.map.setTexture(this.MINIMAP_IMG + this.phaserScene.sharedData.global.ZONE_ID);
        this.phaserScene.sharedData.minimap.ui.elements.border.setAlpha(1);
        this.phaserScene.sharedData.minimap.ui.elements.icon.setAlpha(1);
        this.phaserScene.sharedData.minimap.ui.elements.closeBtn.setAlpha(1);

        super.show();
    }

    hide()
    {
        super.hide();

        this.phaserScene.sharedData.minimap.ui.open = false;
        this.phaserScene.sharedData.minimap.ui.elements.map.setAlpha(0);
        this.phaserScene.sharedData.minimap.ui.elements.border.setAlpha(0);
        this.phaserScene.sharedData.minimap.ui.elements.icon.setAlpha(0);
        this.phaserScene.sharedData.minimap.ui.elements.closeBtn.setAlpha(0);
    }
}