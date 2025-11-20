class uiInventory extends uiManagerBase
{
    INVENTORY_BACKGROUND_PANEL = "Inventory_Panel";
    INVENTORY_BORDER_PANEL = "Inventory_Panel_Border";
    INVENTORY_ICON_BAG = "Inventory_Icon_Bag";
    INVENTORY_ICON_BAG_BORDER = "Inventory_Icon_Bag_Border";

    constructor(phaserScene)
    {
        super(phaserScene);
    }

    load()
    {
        // Main border
        this.phaserScene.load.image(this.INVENTORY_BORDER_PANEL, "./assets/extracted/UI/Inventory/InventoryBorder.png");

        // Background panel
        // TODO: Get all elements separately
        this.phaserScene.load.image(this.INVENTORY_BACKGROUND_PANEL, "./assets/extracted/UI/Inventory/InventoryPanel.png");

        // Bag Icon
        this.phaserScene.load.image(this.INVENTORY_ICON_BAG, "./assets/extracted/UI/Inventory/Bag.png");

        // Bag Border
        this.phaserScene.load.image(this.INVENTORY_ICON_BAG_BORDER, "./assets/extracted/UI/Inventory/BagBorder.png");

        // TODO : Get scroll bar
        // TODO : Get tabs
        // TODO : Get horseshoes bottom section
        // TODO : Get item slot background
    }

    initialize()
    {
        var background = this.phaserScene.add.image(130, 60, this.INVENTORY_BACKGROUND_PANEL)
                    .setOrigin(0)
                    .setScrollFactor(0);

        var border = this.phaserScene.add.image(260, 100, this.INVENTORY_BORDER_PANEL)
                    .setOrigin(0)
                    .setScrollFactor(0);

        var bagIcon = this.phaserScene.add.image(260, 100, this.INVENTORY_ICON_BAG)
                    .setOrigin(0)
                    .setScrollFactor(0);

        var bagBorder = this.phaserScene.add.image(245, 85, this.INVENTORY_ICON_BAG_BORDER)
                        .setOrigin(0)
                        .setScrollFactor(0);

        this.phaserScene.sharedData.inventory.ui.elements = {
            background: background,
            border: border,
            bagIcon: bagIcon,
            bagBorder: bagBorder
        };

        super.initialize();
    }

    show()
    {
        if (this.phaserScene.sharedData.inventory.ui.elements === undefined)
            this.initialize();

        if (this.phaserScene.sharedData.inventory.ui.open) {
            this.hide();
            return;
        }

        if (this.phaserScene.sharedData.global.uiOpen)
            return;

        this.phaserScene.sharedData.inventory.ui.open =  true;
        this.phaserScene.sharedData.inventory.ui.elements.background.setAlpha(1);
        this.phaserScene.sharedData.inventory.ui.elements.border.setAlpha(1);
        this.phaserScene.sharedData.inventory.ui.elements.bagIcon.setAlpha(1);
        this.phaserScene.sharedData.inventory.ui.elements.bagBorder.setAlpha(1);

        super.show();
    }

    hide()
    {
        super.hide();

        this.phaserScene.sharedData.inventory.ui.open = false;
        this.phaserScene.sharedData.inventory.ui.elements.background.setAlpha(0);
        this.phaserScene.sharedData.inventory.ui.elements.border.setAlpha(0);
        this.phaserScene.sharedData.inventory.ui.elements.bagIcon.setAlpha(0);
        this.phaserScene.sharedData.inventory.ui.elements.bagBorder.setAlpha(0);
    }
}