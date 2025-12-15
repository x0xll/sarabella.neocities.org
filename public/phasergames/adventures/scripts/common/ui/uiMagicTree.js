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
        this.phaserScene.sharedData[this.key].logic =  {
                level: 0
            }
    }

    load()
    {
        super.load()
        // Main border
        this.phaserScene.load.image(this.MAGICTREE_BORDER, "./assets/extracted/UI/Magic Tree/MT_Border.png");
        
        // Magic Tree
        for (let i = 0; i < 10; i++)
        {
            this.phaserScene.load.image(this.MAGICTREE_IMAGE + i, "./assets/extracted/UI/Magic Tree/Planting Levels/MT_TreeLevel_0" + i + ".png")
        }

        // Icon
        this.phaserScene.load.image(this.MAGICTREE_ICON, "./assets/extracted/UI/Magic Tree/MT_Icon.png");

        // Close btn
        this.phaserScene.load.image(this.MAGICTREE_CLOSE_BTN, "./assets/extracted/UI/Quest/closebtn.png")
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

        var closeBtn = this.phaserScene.add.image(675, 45, this.MAGICTREE_CLOSE_BTN)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setInteractive();
        // TODO: Handle masking of the tree image based on the border

        this.phaserScene.sharedData.magicTree.ui.elements = 
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

            this.phaserScene.sharedData.magicTree.ui.elements.tree.setAlpha(1);
            let level = this.phaserScene.sharedData.magicTree.logic.level;
            this.phaserScene.sharedData.magicTree.ui.elements.tree.setTexture(this.MAGICTREE_IMAGE + level);

            this.phaserScene.sharedData.magicTree.ui.elements.border.setAlpha(1);
            this.phaserScene.sharedData.magicTree.ui.elements.icon.setAlpha(1);
            this.phaserScene.sharedData.magicTree.ui.elements.closeBtn.setAlpha(1);
    }

    hide()
    {
        super.hide();

        this.phaserScene.sharedData.magicTree.ui.open = false;
        this.phaserScene.sharedData.magicTree.ui.elements.tree.setAlpha(0);
        this.phaserScene.sharedData.magicTree.ui.elements.border.setAlpha(0);
        this.phaserScene.sharedData.magicTree.ui.elements.icon.setAlpha(0);
        this.phaserScene.sharedData.magicTree.ui.elements.closeBtn.setAlpha(0);
    }

    turnOnEvents()
    {
        this.phaserScene.sharedData.magicTree.ui.elements.closeBtn.on('pointerup', (pointer) => { this.hide(); });
    }

    turnOffEvents()
    {
        this.phaserScene.sharedData.magicTree.ui.elements.closeBtn.off('pointerup');
    }
}