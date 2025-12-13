class uiMinimap extends uiManagerBase
{
    MINIMAP_BORDER = "minimapborder";
    MINIMAP_ICON = "minimapicon";
    MINIMAP_CLOSE_BTN = "minimapclose";
    MINIMAP_ZOOM_ICON = "minimapZoom";
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

    #isFullMap = false;

    constructor(phaserScene)
    {
        super(phaserScene, "minimap");
        
        super.load()
        this.phaserScene.sharedData[this.key].ui.manager = this;
    }

    load()
    {
        // Zone map
        for (let i = 0; i < this.ZONE_NAMES.length; i++)
        {
            this.phaserScene.load.image(this.MINIMAP_IMG + this.ZONE_NAMES[i], "./assets/extracted/MiniMap/" + this.ZONE_NAMES[i] + ".png");
        }

        // Full map
        this.phaserScene.load.image(this.MINIMAP_IMG + "_Full", "./assets/extracted/UI/Map/MapPanel.png");

        // Main border
        this.phaserScene.load.image(this.MINIMAP_BORDER, "./assets/extracted/UI/Magic Tree/MT_Border.png");

        // Zoom
        this.phaserScene.load.image(this.MINIMAP_ZOOM_ICON, "./assets/extracted/UI/Map/Map_ZoomIcon/1.png");
        
        // Icon
        this.phaserScene.load.image(this.MINIMAP_ICON, "./assets/extracted/UI/Map/MapIcon.png");

        // Close btn
        this.phaserScene.load.image(this.MINIMAP_CLOSE_BTN, "./assets/extracted/UI/Quest/closebtn.png")
    }

    create()
    { 
        // Lazy loading UI
        this.phaserScene.load.once('complete', () => {
            this.phaserScene.sharedData.hud.ui.mapButton.on('pointerup', function (pointer){
                this.phaserScene.sharedData[this.key].ui.manager.show();
            }, this)
            this.phaserScene.sharedData.hud.ui.mapButton.setAlpha(1)
        }, this);
        this.load();
        this.phaserScene.load.start();
    }

    initialize()
    {
        var map = this.phaserScene.add.image(100, 70, this.MINIMAP_IMG + 0)
                    .setOrigin(0)
                    .setScrollFactor(0);

        var mapFull = this.phaserScene.add.image(70, 40, this.MINIMAP_IMG + "_Full")
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

        var iconZoom = this.phaserScene.add.image(110, 430, this.MINIMAP_ZOOM_ICON)
                    .setOrigin(0)
                    .setScrollFactor(0)
                    .setInteractive();

        this.phaserScene.sharedData.minimap.ui.elements = 
        {
            map: map,
            mapFull: mapFull,
            border: border,
            icon: icon,
            closeBtn: closeBtn,
            iconZoom: iconZoom
        };

        super.initialize();
    }

    show()
    {
        if (!super.show()) return
        this.turnOnEvents()

        this.phaserScene.sharedData.minimap.ui.elements.map.setAlpha(1);
        this.phaserScene.sharedData.minimap.ui.elements.map.setTexture(this.MINIMAP_IMG + this.phaserScene.sharedData.global.ZONE_ID);
        this.phaserScene.sharedData.minimap.ui.elements.mapFull.setAlpha(0);
        this.phaserScene.sharedData.minimap.ui.elements.border.setAlpha(1);
        this.phaserScene.sharedData.minimap.ui.elements.icon.setAlpha(1);
        this.phaserScene.sharedData.minimap.ui.elements.closeBtn.setAlpha(1);
        this.phaserScene.sharedData.minimap.ui.elements.iconZoom.setAlpha(1);
    }

    hide()
    {
        super.hide();

        this.phaserScene.sharedData.minimap.ui.open = false;
        this.phaserScene.sharedData.minimap.ui.elements.map.setAlpha(0);
        this.phaserScene.sharedData.minimap.ui.elements.border.setAlpha(0);
        this.phaserScene.sharedData.minimap.ui.elements.icon.setAlpha(0);
        this.phaserScene.sharedData.minimap.ui.elements.closeBtn.setAlpha(0);
        this.phaserScene.sharedData.minimap.ui.elements.mapFull.setAlpha(0);
        this.phaserScene.sharedData.minimap.ui.elements.iconZoom.setAlpha(0);
    }

    turnOnEvents()
    {
        this.phaserScene.sharedData.minimap.ui.elements.closeBtn.on('pointerup', (pointer) =>  
        { 
            this.hide();
        });

        this.phaserScene.sharedData.minimap.ui.elements.iconZoom.on('pointerup', (pointer) => 
        {
            this.#isFullMap = !this.#isFullMap;
            if (!this.#isFullMap)
            {
                this.phaserScene.sharedData.minimap.ui.elements.mapFull.setAlpha(0);
                this.phaserScene.sharedData.minimap.ui.elements.map.setAlpha(1);
                this.phaserScene.sharedData.minimap.ui.elements.map.setTexture(this.MINIMAP_IMG + this.phaserScene.sharedData.global.ZONE_ID);
            }
            else
            {
                this.phaserScene.sharedData.minimap.ui.elements.mapFull.setAlpha(1);
                this.phaserScene.sharedData.minimap.ui.elements.map.setAlpha(0);
            }
        });
    }

    turnOffEvents()
    {
        this.phaserScene.sharedData.minimap.ui.elements.closeBtn.off('pointerup');
        this.phaserScene.sharedData.minimap.ui.elements.iconZoom.off('pointerup');
    }
}