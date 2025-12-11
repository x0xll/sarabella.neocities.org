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
        xStart: 300 ,
        yStart: 170,
        xOffset: 52,
        yOffset: 52,
        width: 4,
        height: 3
    }

    #currentTab = ITEM_TYPES.ALL;

    constructor(phaserScene)
    {
        super(phaserScene);
        this.slots = {}
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

        this.phaserScene.load.atlas('inv_items', './assets/extracted/Items/items.png', './assets/extracted/Items/items.json');
        this.phaserScene.load.atlas('inv_items2', './assets/extracted/Items/items2.png', './assets/extracted/Items/items2.json');
        this.phaserScene.load.atlas('inv_plantinventory', './assets/extracted/Items/plantinventory.png', './assets/extracted/Items/plantinventory.json');
    }

    initialize()
    {
        // TODO make inventory bag clickable so it can be clicked to remove show ITEM_TYPES.ALL
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
            this.changeTab(ITEM_TYPES.PLANTS);
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
        // this.phaserScene.add.graphics().fillStyle(0x000000).fillRect(270, 170, 275, 200).setAlpha(.5)
        //                 .setScrollFactor(0);
        const scrollMask = new Phaser.Display.Masks.GeometryMask(this.phaserScene, this.phaserScene.make.graphics().fillRect(270, 170, 275, 200)
                        .setScrollFactor(0))
        const tempScrollBar = this.phaserScene.add.graphics().fillStyle(0x000000).fillRect(510, 170, 29, 200).setAlpha(.5)
                        .setScrollFactor(0);
        const scrollZone = this.phaserScene.add.zone(510, 170, 29, 200)
                        .setScrollFactor(0)
                        .setOrigin(0)
                        .setInteractive()

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
            scrollMask: scrollMask,
            scrollZone: scrollZone,
            tempScrollBar: tempScrollBar
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
        this.updateScrollBar()

        super.show();
    }

    hide()
    {
        super.hide();


        for (let [key, value] of Object.entries(this.slots)) {
            this.slots[key].destroy()
        }

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

        this.phaserScene.sharedData.inventory.ui.elements.tempScrollBar.setAlpha(0);
        this.phaserScene.sharedData.inventory.ui.elements.scrollZone.off("pointermove")
    }

    changeTab(newType)
    {
        this.#currentTab = newType;
        this.updateSlots();
        this.updateScrollBar();
    }

    updateSlots()
    {
        let allItems = this.phaserScene.sharedData.inventory.manager.getItemByType(this.#currentTab);

        for (let [key, value] of Object.entries(this.slots)) {
            if (allItems[key] === undefined) {
                this.slots[key].destroy()
            }
        }

        let slotCount = 0
        for (let [key, value] of Object.entries(allItems)) {
            if (this.slots[key] === undefined) {
                this.slots[key] = new InventorySlot(this.phaserScene, key, value, slotCount)
            } else {
                this.slots[key].resetSlot(0, slotCount)
            }
            slotCount++
        }
    }

    updateScrollBar() {
        const UI = this
        const slotNumber = Object.keys(UI.slots).length
        if (((slotNumber - (slotNumber % 4)) / 4) > 2) {
            this.phaserScene.sharedData.inventory.ui.elements.tempScrollBar.setAlpha(.5);
            this.phaserScene.sharedData.inventory.ui.elements.scrollZone.on('pointermove', function (pointer) {
                if (pointer.isDown)
                {
                    const slotNumber = Object.keys(UI.slots).length

                    const topPos = UI.phaserScene.sharedData.inventory.ui.elements.scrollZone.y
                    const scrollHeight = UI.phaserScene.sharedData.inventory.ui.elements.scrollZone.height
                    const slotsHeight = (((slotNumber - (slotNumber % 4)) / 4) + 1) * 55 // height the slots take up
                    const maskHeight = 200//scrollMask.height
                    // game.entryScroll.y = pointer.y
                    let moveText = (pointer.y - topPos) / scrollHeight * (slotsHeight - maskHeight)

                    let percentage = (pointer.y - topPos) / scrollHeight * 100
                    if (percentage < 7) {
                        moveText = 0
                        // game.entryScroll.y = topPos
                    } else if (percentage > 93) {
                        moveText = slotsHeight - maskHeight
                        // game.entryScroll.y = topPos + scrollHeight
                    }

                    for (let [key, value] of Object.entries(UI.slots)) {
                        UI.slots[key].resetSlot(-moveText)
                    }
                }

            });
        } else {
            this.phaserScene.sharedData.inventory.ui.elements.tempScrollBar.setAlpha(0);
            this.phaserScene.sharedData.inventory.ui.elements.scrollZone.off("pointermove")
        }
    }
}