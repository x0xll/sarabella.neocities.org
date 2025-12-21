class uiMagicTree extends uiManagerBase
{
    MAGICTREE_IMAGE = "magicTree_";
    MAGICTREE_BORDER = "magicTreeBorder"
    MAGICTREE_ICON = "magicTreeIcon";
    MAGICTREE_CLOSE_BTN = "magicTreeCloseBtn";

    constructor(phaserScene)
    {
        super(phaserScene,"magicTree");

        this.load()
        this.phaserScene.sharedData[this.key].ui.manager = this;
    }

    load()
    {
        super.load()
        // Main border
        this.phaserScene.load.image(this.MAGICTREE_BORDER, "./assets/extracted/UI/Magic Tree/MT_Border.png");
        
        // Magic Tree
        for (let i = 0; i < 13; i++)
        {
            this.phaserScene.load.image(this.MAGICTREE_IMAGE + i, "./assets/extracted/UI/Magic Tree/Planting Levels/MT_TreeLevel_" + i + ".png")
        }

        // Icon
        this.phaserScene.load.image(this.MAGICTREE_ICON, "./assets/extracted/UI/Magic Tree/MT_Icon.png");

        // Close btn
        this.phaserScene.load.atlas("closeBtn", `${ROOT_ASSETS_PATH}UI/Common/closeBtn.png`, `${ROOT_ASSETS_PATH}UI/Common/closeBtn.json`);
    }

    create()
    {
        this.phaserScene.sharedData.hud.ui.skillProgressButton.on('pointerup', function (pointer) {
            this.phaserScene.sharedData[this.key].ui.manager.show();
        }, this);
    }

    initialize()
    {
        var tree = this.phaserScene.add.image(110, 30, this.MAGICTREE_IMAGE)
                    .setOrigin(0)
                    .setScrollFactor(0);

        var border = this.phaserScene.add.image(107, 42, this.MAGICTREE_BORDER)
                    .setOrigin(0)
                    .setScrollFactor(0)
                    .setScale(.9);

        var icon = this.phaserScene.add.image(75, 30, this.MAGICTREE_ICON)
                    .setOrigin(0)
                    .setScrollFactor(0);

        var closeBtn = this.phaserScene.add.sprite(675, 45, "closeBtn", "up")
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setInteractive({ useHandCursor: true });
        // TODO: Handle masking of the tree image based on the border

        this.phaserScene.sharedData[this.key].ui.elements = 
        {
            tree: tree,
            border: border,
            icon: icon,
            closeBtn: closeBtn
        };
        
        super.initialize();
    }

    show()
    {
            let test = super.show()
            if (!test) return
            
            this.turnOnEvents()

            this.phaserScene.sharedData[this.key].ui.elements.tree.setAlpha(1);
            let level = this.phaserScene.sharedData[this.key].logic.level;
            this.phaserScene.sharedData[this.key].ui.elements.tree.setTexture(this.MAGICTREE_IMAGE + level);

            this.phaserScene.sharedData[this.key].ui.elements.border.setAlpha(1);
            this.phaserScene.sharedData[this.key].ui.elements.icon.setAlpha(1);
            this.phaserScene.sharedData[this.key].ui.elements.closeBtn.setAlpha(1);
    }

    hide()
    {
        super.hide();

        this.phaserScene.sharedData[this.key].ui.open = false;
        this.phaserScene.sharedData[this.key].ui.elements.tree.setAlpha(0);
        this.phaserScene.sharedData[this.key].ui.elements.border.setAlpha(0);
        this.phaserScene.sharedData[this.key].ui.elements.icon.setAlpha(0);
        this.phaserScene.sharedData[this.key].ui.elements.closeBtn.setAlpha(0);
    }

    turnOnEvents()
    {
        this.phaserScene.sharedData[this.key].ui.elements.closeBtn.on('pointerup', (pointer) => { this.hide(); });
        this.phaserScene.sharedData[this.key].ui.elements.closeBtn.on('pointerover', (pointer) => { this.phaserScene.sharedData[this.key].ui.elements.closeBtn.setFrame("over_alt"); });
        this.phaserScene.sharedData[this.key].ui.elements.closeBtn.on('pointerout', (pointer) => { this.phaserScene.sharedData[this.key].ui.elements.closeBtn.setFrame("up"); });
    }

    turnOffEvents()
    {
        this.phaserScene.sharedData[this.key].ui.elements.closeBtn.off('pointerup');
        this.phaserScene.sharedData[this.key].ui.elements.closeBtn.off('pointerover');
        this.phaserScene.sharedData[this.key].ui.elements.closeBtn.off('pointerout');
    }
}