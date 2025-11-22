class uiInventory extends uiManagerBase
{
    INVENTORY_BACKGROUND_PANEL = "Inventory_Panel";
    INVENTORY_BORDER_PANEL = "Inventory_Panel_Border";
    INVENTORY_CLOSE_BUTTON = "Inventory_CloseBtn";
    INVENTORY_TAB_BACKGROUND = "Inventory_Tabs";
    INVENTORY_BTN_SPECIAL = "Inventory_SpecialBtn";
    INVENTORY_BTN_CLOTHES = "Inventory_ClothesBtn";
    INVENTORY_BTN_PLANT = "Inventory_PlantBtn";
    INVENTORY_BTN_PLACEABLE = "Inventory_PlaceableBtn";
    INVENTORY_BTN_CARDS = "Inventory_CardsBtn";
    INVENTORY_BTN_PRODUCE = "Inventory_ProduceBtn";
    INVENTORY_SLOT = "Inventory_Slot";

    INVENTORY_SLOT_SIZE = 
    {
        xStart: 0,
        yStart: 0,
        xOffset: 52,
        yOffset: 52,
        width: 4,
        height: 3
    }

    #currentTab = ITEM_TYPES.SPECIAL;

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

        // Slot
        this.phaserScene.load.image(this.INVENTORY_SLOT, "./assets/extracted/UI/Inventory/ItemSlot/ItemSlot.png");

        // TODO : Get scroll bar
        // TODO : Get horseshoes bottom section


        // TEST ITEM
        this.phaserScene.load.image("TEST_P001_Produce", "./assets/extracted/Items/Produce/P001_Produce.png");
        this.phaserScene.load.image("TEST_P001_Seed", "./assets/extracted/Items/Seeds/P001_Seed.png");
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
                        .setScale(0.95)
                        .setInteractive();

        specialBtn.on('pointerup', (pointer) =>  
        { 
            this.changeTab(ITEM_TYPES.SPECIAL);
        });

        var clothesBtn = this.phaserScene.add.image(228, 195, this.INVENTORY_BTN_CLOTHES)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setScale(0.95)
                        .setInteractive();

        clothesBtn.on('pointerup', (pointer) =>  
        { 
            this.changeTab(ITEM_TYPES.CLOTHES);
        });

        var plantBtn = this.phaserScene.add.image(225, 235, this.INVENTORY_BTN_PLANT)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setScale(0.95)
                        .setInteractive();

        plantBtn.on('pointerup', (pointer) =>  
        { 
            this.changeTab(ITEM_TYPES.PLANT);
        });

        var placeableBtn = this.phaserScene.add.image(220, 275, this.INVENTORY_BTN_PLACEABLE)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setScale(0.95)
                        .setInteractive();

        placeableBtn.on('pointerup', (pointer) =>  
        { 
            this.changeTab(ITEM_TYPES.PLACEABLE);
        });       

        var cardsBtn = this.phaserScene.add.image(220, 315, this.INVENTORY_BTN_CARDS)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setScale(0.95)
                        .setInteractive();

        cardsBtn.on('pointerup', (pointer) =>  
        { 
            this.changeTab(ITEM_TYPES.CARDS);
        });

        var produceBtn = this.phaserScene.add.image(220, 355, this.INVENTORY_BTN_PRODUCE)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setScale(0.95)
                        .setInteractive();

        produceBtn.on('pointerup', (pointer) =>  
        { 
            this.changeTab(ITEM_TYPES.PRODUCE);
        });

        // TODO: Handle scrolling
        var slotList = [];
        for (let x = this.INVENTORY_SLOT_SIZE.xStart; x < this.INVENTORY_SLOT_SIZE.width; x++)
        {
            for (let y = this.INVENTORY_SLOT_SIZE.yStart; y < this.INVENTORY_SLOT_SIZE.height; y++)
            {
                var slot = this.phaserScene.add.image(x * this.INVENTORY_SLOT_SIZE.xOffset, this.INVENTORY_SLOT_SIZE.yOffset, this.INVENTORY_BTN_PRODUCE)
                            .setOrigin(0)
                            .setScrollFactor(0);

                var slotIcon = this.phaserScene.add.image(x * this.INVENTORY_SLOT_SIZE.xOffset, this.INVENTORY_SLOT_SIZE.yOffset, this.INVENTORY_BTN_PRODUCE)
                                .setOrigin(0)
                                .setScrollFactor(0);

                let slotData = 
                {
                    bg: slot,
                    icon: slotIcon
                }

                slotList.push(slotData);
            }
        }

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
            produceBtn: produceBtn,
            slots: slotList
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

        this.updateSlots();

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

        for (let i = 0; i < this.phaserScene.sharedData.inventory.ui.elements.slots.length; i++)
        {
            this.phaserScene.sharedData.inventory.ui.elements.slots[i].bg.setAlpha(0);
            this.phaserScene.sharedData.inventory.ui.elements.slots[i].icon.setAlpha(0);
        }
    }

    changeTab(newType)
    {
        this.#currentTab = newType;
        this.updateSlots();
    }

    updateSlots()
    {
        let allItems = this.phaserScene.sharedData.inventory.logic.manager.getItemPerType(this.#currentTab);

        for (let i = 0; i < this.phaserScene.sharedData.inventory.ui.elements.slots.length; i++)
        {
            if (i >= allItems.length)
            {
                this.phaserScene.sharedData.inventory.ui.elements.slots[i].bg.setAlpha(0);
                this.phaserScene.sharedData.inventory.ui.elements.slots[i].icon.setAlpha(0);
                return;
            }

            this.phaserScene.sharedData.inventory.ui.elements.slots[i].bg.setAlpha(1);
            this.phaserScene.sharedData.inventory.ui.elements.slots[i].icon.setAlpha(1);
            this.phaserScene.sharedData.inventory.ui.elements.slots[i].icon.setTexture("TEST_" + this.phaserScene.sharedData.inventory.logic.currentItems[i].id);
        }
    }
}