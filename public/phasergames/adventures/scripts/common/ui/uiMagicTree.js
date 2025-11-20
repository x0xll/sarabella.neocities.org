class uiMagicTree extends uiManagerBase
{
    MAGICTREE_IMAGE = "magicTree_";
    MAGICTREE_BORDER = "magicTreeBorder"
    MAGICTREE_ICON = "magicTreeIcon";
    MAGICTREE_CLOSE_BTN = "magicTreeCloseBtn";

    constructor(phaserScene)
    {
        super(phaserScene);
    }

    load()
    {
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

        closeBtn.on('pointerup', (pointer) =>  
        { 
            this.hide();
        });

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
        if (this.phaserScene.sharedData.magicTree.ui.elements === undefined)
            this.initialize();

        if (this.phaserScene.sharedData.magicTree.ui.open)
        {
            this.hide();
            return;
        }

        if (this.phaserScene.sharedData.global.uiOpen)
            return;

        this.phaserScene.sharedData.magicTree.ui.open = true;
        this.phaserScene.sharedData.magicTree.ui.elements.tree.setAlpha(1);
        let level = this.phaserScene.sharedData.magicTree.logic.level;
        this.phaserScene.sharedData.magicTree.ui.elements.tree.setTexture(this.MAGICTREE_IMAGE + level);

        this.phaserScene.sharedData.magicTree.ui.elements.border.setAlpha(1);
        this.phaserScene.sharedData.magicTree.ui.elements.icon.setAlpha(1);
        this.phaserScene.sharedData.magicTree.ui.elements.closeBtn.setAlpha(1);

        super.show();
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
}