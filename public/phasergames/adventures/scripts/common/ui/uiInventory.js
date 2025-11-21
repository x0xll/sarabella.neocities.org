class uiInventory extends uiManagerBase
{
    INVENTORY_BACKGROUND_PANEL = "Inventory_Panel";
    INVENTORY_BORDER_PANEL = "Inventory_Panel_Border";
    INVENTORY_CLOSE_BUTTON = "Inventory_CloseBtn";
    INVENTORY_TAB_BACKGROUND = "Inventory_Tabs";
    INVENTORY_BTN_SPECIAL = "Inventory_SpecialBtn"
    INVENTORY_BTN_CLOTHES = "Inventory_ClothesBtn"
    INVENTORY_BTN_PLANT = "Inventory_PlantBtn"
    INVENTORY_BTN_PLACEABLE = "Inventory_PlaceableBtn"
    INVENTORY_BTN_CARDS = "Inventory_CardsBtn"
    INVENTORY_BTN_PRODUCE = "Inventory_ProduceBtn"

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
        this.phaserScene.load.image(this.INVENTORY_BACKGROUND_PANEL, "./assets/extracted/UI/Inventory/InventoryBackground.png");

        // Close btn
        this.phaserScene.load.image(this.INVENTORY_CLOSE_BUTTON, "./assets/extracted/UI/Quest/closebtn.png")

        // Tab background
        this.phaserScene.load.image(this.INVENTORY_TAB_BACKGROUND, "./assets/extracted/UI/Inventory/TabButton/1.png");

        // TODO: Update with animations instead
        // Tabs
        this.phaserScene.load.image(this.INVENTORY_BTN_SPECIAL, "./assets/extracted/UI/Inventory/SpecialButton/1.png");
        this.phaserScene.load.image(this.INVENTORY_BTN_CLOTHES, "./assets/extracted/UI/Inventory/ClothesButton/1.png");
        this.phaserScene.load.image(this.INVENTORY_BTN_PLANT, "./assets/extracted/UI/Inventory/PlantButton/1.png");
        this.phaserScene.load.image(this.INVENTORY_BTN_PLACEABLE, "./assets/extracted/UI/Inventory/PlaceableButton/1.png");
        this.phaserScene.load.image(this.INVENTORY_BTN_CARDS, "./assets/extracted/UI/Inventory/CardsButton/1.png");
        this.phaserScene.load.image(this.INVENTORY_BTN_PRODUCE, "./assets/extracted/UI/Inventory/ProduceButton/1.png");

        // TODO : Get scroll bar
        // TODO : Get horseshoes bottom section
        // TODO : Get item slot background
    }

    initialize()
    {
        // TODO mask background based on border
        var background = this.phaserScene.add.image(270, 120, this.INVENTORY_BACKGROUND_PANEL)
                    .setOrigin(0)
                    .setScrollFactor(0)
                    .setScale(1.25, 1.47);

        var border = this.phaserScene.add.image(260, 100, this.INVENTORY_BORDER_PANEL)
                    .setOrigin(0)
                    .setScrollFactor(0);

        var tabBg = this.phaserScene.add.image(225, 75, this.INVENTORY_TAB_BACKGROUND)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setScale(1.1);

        var specialBtn = this.phaserScene.add.image(220, 155, this.INVENTORY_BTN_SPECIAL)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setScale(0.95);

        var clothesBtn = this.phaserScene.add.image(228, 195, this.INVENTORY_BTN_CLOTHES)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setScale(0.95);

        var plantBtn = this.phaserScene.add.image(225, 235, this.INVENTORY_BTN_PLANT)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setScale(0.95);

        var placeableBtn = this.phaserScene.add.image(220, 275, this.INVENTORY_BTN_PLACEABLE)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setScale(0.95);

        var cardsBtn = this.phaserScene.add.image(220, 315, this.INVENTORY_BTN_CARDS)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setScale(0.95);

        var produceBtn = this.phaserScene.add.image(220, 355, this.INVENTORY_BTN_PRODUCE)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setScale(0.95);

        var closeBtn = this.phaserScene.add.image(510, 105, this.INVENTORY_CLOSE_BUTTON)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setInteractive();

        closeBtn.on('pointerup', (pointer) =>  
        { 
            this.hide();
        });

        this.phaserScene.sharedData.inventory.ui.elements = {
            background: background,
            border: border,
            closeBtn: closeBtn,
            tabBg: tabBg,
            specialBtn: specialBtn,
            clothesBtn: clothesBtn,
            plantBtn: plantBtn,
            placeableBtn: placeableBtn,
            cardsBtn: cardsBtn,
            produceBtn: produceBtn
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
        this.phaserScene.sharedData.inventory.ui.elements.closeBtn.setAlpha(1);
        this.phaserScene.sharedData.inventory.ui.elements.tabBg.setAlpha(1);
        this.phaserScene.sharedData.inventory.ui.elements.specialBtn.setAlpha(1);
        this.phaserScene.sharedData.inventory.ui.elements.clothesBtn.setAlpha(1);
        this.phaserScene.sharedData.inventory.ui.elements.plantBtn.setAlpha(1);
        this.phaserScene.sharedData.inventory.ui.elements.placeableBtn.setAlpha(1);
        this.phaserScene.sharedData.inventory.ui.elements.cardsBtn.setAlpha(1);
        this.phaserScene.sharedData.inventory.ui.elements.produceBtn.setAlpha(1);

        super.show();
    }

    hide()
    {
        super.hide();

        this.phaserScene.sharedData.inventory.ui.open = false;
        this.phaserScene.sharedData.inventory.ui.elements.background.setAlpha(0);
        this.phaserScene.sharedData.inventory.ui.elements.border.setAlpha(0);
        this.phaserScene.sharedData.inventory.ui.elements.closeBtn.setAlpha(0);
        this.phaserScene.sharedData.inventory.ui.elements.tabBg.setAlpha(0);
        this.phaserScene.sharedData.inventory.ui.elements.specialBtn.setAlpha(0);
        this.phaserScene.sharedData.inventory.ui.elements.clothesBtn.setAlpha(0);
        this.phaserScene.sharedData.inventory.ui.elements.plantBtn.setAlpha(0);
        this.phaserScene.sharedData.inventory.ui.elements.placeableBtn.setAlpha(0);
        this.phaserScene.sharedData.inventory.ui.elements.cardsBtn.setAlpha(0);
        this.phaserScene.sharedData.inventory.ui.elements.produceBtn.setAlpha(0);
    }
}