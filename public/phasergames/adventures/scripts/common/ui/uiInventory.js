class uiInventory extends uiManagerBase
{
    INVENTORY_SLOT = "Inventory_Slot";
    SCROLL = "Scroll_Elements";

    INVENTORY_SLOT_SIZE = 
    {
        xStart: 300 ,
        yStart: 170,
        xOffset: 52,
        yOffset: 52,
        width: 4,
        height: 3
    }
    SOUNDS = {
        itemHover: 'invItem_hover',
        itemDown: 'invItem_down',
        tabHover: 'inv_hover',
        tabDown: 'inv_down'
    }

    #currentTab = ITEM_TYPES.ALL;
    buttons = {}

    constructor(phaserScene)
    {
        super(phaserScene);
        this.slots = {}
        this.disabled = {
            "main": false,
            "special": false,
            "clothes": false,
            "plants": false,
            "placeable": false,
            "cards": false,
            "produce": false,
        }
    }

    load()
    {   
        this.buttons[ITEM_TYPES.ALL] = "main"
        this.buttons[ITEM_TYPES.SPECIAL] = "special"
        this.buttons[ITEM_TYPES.CLOTHES] = "clothes"
        this.buttons[ITEM_TYPES.PLANTS] = "plants"
        this.buttons[ITEM_TYPES.PLACEABLE] = "placeable"
        this.buttons[ITEM_TYPES.CARDS] = "cards"
        this.buttons[ITEM_TYPES.PRODUCE] = "produce"

        // Slot
        // TODO : Get scroll bar
        // TODO : Get horseshoes bottom section

        this.phaserScene.load.audio(this.SOUNDS.itemHover, `${ROOT_ASSETS_PATH}Audio/Inventory/12.mp3`);
        this.phaserScene.load.audio(this.SOUNDS.itemDown, `${ROOT_ASSETS_PATH}Audio/Inventory/13.mp3`);
        this.phaserScene.load.audio(this.SOUNDS.tabHover, `${ROOT_ASSETS_PATH}Audio/Inventory/35.mp3`);
        this.phaserScene.load.audio(this.SOUNDS.tabDown, `${ROOT_ASSETS_PATH}Audio/Inventory/37.mp3`);

        
        this.phaserScene.load.spineAtlas(`inventory-atlas`, `${ROOT_ASSETS_PATH}UI/Inventory/skeleton.atlas`);
        this.phaserScene.load.spineJson(`inventory-json`, `${ROOT_ASSETS_PATH}UI/Inventory/skeleton.json`);

        this.phaserScene.load.atlas(this.INVENTORY_SLOT, `${ROOT_ASSETS_PATH}UI/Inventory/itemSlot.png`, `${ROOT_ASSETS_PATH}UI/Inventory/itemSlot.json`);
        this.phaserScene.load.atlas(this.SCROLL, `${ROOT_ASSETS_PATH}UI/scroll.png`, `${ROOT_ASSETS_PATH}UI/scroll.json`);

        this.phaserScene.load.atlas('inv_items', `${ROOT_ASSETS_PATH}Items/items.png`, `${ROOT_ASSETS_PATH}/Items/items.json`);
        this.phaserScene.load.atlas('inv_items2', `${ROOT_ASSETS_PATH}Items/items2.png`, `${ROOT_ASSETS_PATH}/Items/items2.json`);
        this.phaserScene.load.atlas('inv_plantinventory', `${ROOT_ASSETS_PATH}Items/plantinventory.png`, `${ROOT_ASSETS_PATH}/Items/plantinventory.json`);
    }

    initialize()
    {
        this.tabHoverSound = this.phaserScene.sound.add(this.SOUNDS.tabHover, {volume: VOLUME});
        this.tabDownSound = this.phaserScene.sound.add(this.SOUNDS.tabDown, {volume: VOLUME});
        this.itemHoverSound = this.phaserScene.sound.add(this.SOUNDS.itemHover, {volume: VOLUME});
        this.itemDownSound = this.phaserScene.sound.add(this.SOUNDS.itemDown, {volume: VOLUME});
        // TODO make inventory bag clickable so it can be clicked to remove show ITEM_TYPES.ALL
        // TODO mask background based on border
        const sprite = this.phaserScene.add.spine(405, 265, `inventory-json`, `inventory-atlas`)
                    .setScrollFactor(0);

        const hitboxes = [
            this.phaserScene.add.graphics().setInteractive(new Phaser.Geom.Rectangle(249, 82, 64, 78), Phaser.Geom.Rectangle.Contains).setScrollFactor(0), // main
            // this.phaserScene.add.zone(249, 82, 64, 78).setScrollFactor(0).setOrigin(0).setInteractive(), // main
            this.phaserScene.add.graphics().setInteractive(new Phaser.Geom.Rectangle(225, 155, 35, 35), Phaser.Geom.Rectangle.Contains).setScrollFactor(0), // special
            this.phaserScene.add.graphics().setInteractive(new Phaser.Geom.Rectangle(233, 194, 35, 35), Phaser.Geom.Rectangle.Contains).setScrollFactor(0), // clothes
            this.phaserScene.add.graphics().setInteractive(new Phaser.Geom.Rectangle(229, 233, 35, 35), Phaser.Geom.Rectangle.Contains).setScrollFactor(0), // plants
            this.phaserScene.add.graphics().setInteractive(new Phaser.Geom.Rectangle(225, 275, 35, 35), Phaser.Geom.Rectangle.Contains).setScrollFactor(0), // placeable
            this.phaserScene.add.graphics().setInteractive(new Phaser.Geom.Rectangle(225, 314, 35, 35), Phaser.Geom.Rectangle.Contains).setScrollFactor(0), // cards
            this.phaserScene.add.graphics().setInteractive(new Phaser.Geom.Rectangle(225, 355, 35, 35), Phaser.Geom.Rectangle.Contains).setScrollFactor(0), // produce
            this.phaserScene.add.graphics().setInteractive(new Phaser.Geom.Rectangle(508, 104, 35, 35), Phaser.Geom.Rectangle.Contains).setScrollFactor(0) // close
        ]

        // Uncomment to see hitboxes:
        // this.phaserScene.add.graphics().fillStyle(0x000000).fillRect(249, 82, 64, 78).setAlpha(.5); // main
        // this.phaserScene.add.graphics().fillStyle(0x000000).fillRect(225, 155, 35, 35).setAlpha(.5); // special
        // this.phaserScene.add.graphics().fillStyle(0x000000).fillRect(233, 194, 35, 35).setAlpha(.5); // clothes
        // this.phaserScene.add.graphics().fillStyle(0x000000).fillRect(229, 233, 35, 35).setAlpha(.5); // plants
        // this.phaserScene.add.graphics().fillStyle(0x000000).fillRect(225, 275, 35, 35).setAlpha(.5); // placeable
        // this.phaserScene.add.graphics().fillStyle(0x000000).fillRect(225, 314, 35, 35).setAlpha(.5); // cards
        // this.phaserScene.add.graphics().fillStyle(0x000000).fillRect(225, 355, 35, 35).setAlpha(.5); // produce
        // this.phaserScene.add.graphics().fillStyle(0x000000).fillRect(508, 104, 35, 35).setAlpha(.5); // close

        for (let [key] of Object.entries(ITEM_TYPES)) {
            const buttonIndex = ITEM_TYPES[key]+1
            const hitbox = hitboxes[buttonIndex]
            hitbox.on('pointerout', (pointer) =>  
                { 
                    if (buttonIndex !== this.#currentTab+1) {
                        sprite.animationState.setAnimation(buttonIndex, `${this.buttons[buttonIndex-1]}/up`, false)
                    }
                });
            hitbox.on('pointerover', (pointer) =>  
                { 
                    if (buttonIndex !== this.#currentTab+1) {
                        sprite.animationState.setAnimation(buttonIndex, `${this.buttons[buttonIndex-1]}/over`, false)
                        this.tabHoverSound.play()
                    }
                });
            hitbox.on('pointerdown', (pointer) =>  
                {  
                    if (buttonIndex !== this.#currentTab+1) {
                        sprite.animationState.setAnimation(buttonIndex, `${this.buttons[buttonIndex-1]}/down`, false)
                        this.tabDownSound.play()
                    }
                });
            hitbox.on('pointerup', (pointer) =>  
                {  
                    this.changeTab(ITEM_TYPES[key]);
                });
        }
        hitboxes[7].on('pointerup', (pointer) =>  
        { 
            this.hide();
        });
        hitboxes[7].on('pointerout', (pointer) =>  
        { 
            sprite.animationState.setAnimation(7, `x/up`, false)
        });
        hitboxes[7].on('pointerover', (pointer) =>  
        { 
            sprite.animationState.setAnimation(7, `x/over`, false)
        });
        hitboxes[7].on('pointerdown', (pointer) =>  
        { 
            sprite.animationState.setAnimation(7, `x/down`, false)
        });
        sprite.animationState.setAnimation(8, `scroll/hide`, false)


        // TODO: Handle scrolling
        // this.phaserScene.add.graphics().fillStyle(0x000000).fillRect(270, 173, 275, 200).setAlpha(.5).setScrollFactor(0);
        const scrollMask = new Phaser.Display.Masks.GeometryMask(this.phaserScene, this.phaserScene.make.graphics().fillRect(270, 173, 275, 200)
                        .setScrollFactor(0))
        // this.phaserScene.add.graphics().fillStyle(0x000000).fillRect(511, 192, 20, 174).setAlpha(.5).setScrollFactor(0);
        const scrollZone = this.phaserScene.add.zone(511, 192, 20, 174)
                        .setScrollFactor(0)
                        .setOrigin(0)
                        .setInteractive()
        const scrollBar = this.phaserScene.add.sprite(515, 191, this.SCROLL, "scroll")
                        .setScrollFactor(0)
                        .setOrigin(0);
        const scrollUp = this.phaserScene.add.sprite(scrollZone.x, scrollZone.y-21, this.SCROLL, "arrowScroll_1")
                        .setScrollFactor(0)
                        .setOrigin(0);
        const scrollDown = this.phaserScene.add.sprite(scrollZone.x, scrollZone.y + scrollZone.height + 20, this.SCROLL, "arrowScroll_1")
                        .setScrollFactor(0)
                        .setOrigin(1, 0)
                        .setAngle(180);
        
        const scrollAmountOnClick = 55
        this.scrollAmount = 0
        const arrows = [scrollUp, scrollDown]
        arrows.forEach(arrow => {
            arrow.on('pointerout', (pointer) =>  
            { 
                arrow.setFrame("arrowScroll_1")
            });
            arrow.on('pointerup', (pointer) =>  
            { 
                arrow.setFrame("arrowScroll_1")
            });
            arrow.on('pointerover', (pointer) =>  
            { 
                arrow.setFrame("arrowScroll_2")
            });
        });
        scrollUp.on('pointerdown', (pointer) =>  
        { 
            const scrollBar = this.phaserScene.sharedData.inventory.ui.elements.scrollBar
            const slotNumber = Object.keys(this.slots).length - 1
            const topPos = this.phaserScene.sharedData.inventory.ui.elements.scrollZone.y + (scrollBar.height/2)
            let moveText = this.scrollAmount - scrollAmountOnClick
            const slotsHeight = (((slotNumber - (slotNumber % 4)) / 4) + 1) * 55 // height the slots take up
            const maskHeight = 200//scrollMask.height
            const scrollHeight = this.phaserScene.sharedData.inventory.ui.elements.scrollZone.height - scrollBar.height

            if (moveText < 0) {
                moveText = 0
            }

            scrollBar.y = topPos - (scrollBar.height/2) + (moveText * scrollHeight /(slotsHeight-maskHeight))
            for (let [key] of Object.entries(this.slots)) {
                this.slots[key].resetSlot(-moveText)
            }
            this.scrollAmount = moveText
        });
        scrollDown.on('pointerdown', (pointer) =>  
        {
            const scrollBar = this.phaserScene.sharedData.inventory.ui.elements.scrollBar
            const slotNumber = Object.keys(this.slots).length - 1
            const topPos = this.phaserScene.sharedData.inventory.ui.elements.scrollZone.y + (scrollBar.height/2)
            let moveText = this.scrollAmount + scrollAmountOnClick
            const slotsHeight = (((slotNumber - (slotNumber % 4)) / 4) + 1) * 55 // height the slots take up
            const maskHeight = 200//scrollMask.height
            const scrollHeight = this.phaserScene.sharedData.inventory.ui.elements.scrollZone.height - scrollBar.height

            if (moveText > slotsHeight-maskHeight) {
                moveText = slotsHeight-maskHeight
            }

            scrollBar.y = topPos - (scrollBar.height/2) + (moveText * scrollHeight /(slotsHeight-maskHeight))
            for (let [key] of Object.entries(this.slots)) {
                this.slots[key].resetSlot(-moveText)
            }
            this.scrollAmount = moveText
        });
        const UI = this
        scrollZone.on('pointermove', function (pointer) {
                if (pointer.isDown)
                {
                    const slotNumber = Object.keys(UI.slots).length - 1
                    const scrollBar = UI.phaserScene.sharedData.inventory.ui.elements.scrollBar

                    const topPos = scrollZone.y + (scrollBar.height/2)
                    const scrollHeight = scrollZone.height - scrollBar.height
                    const slotsHeight = (((slotNumber - (slotNumber % 4)) / 4) + 1) * 55 // height the slots take up
                    const maskHeight = 200//scrollMask.height

                    scrollBar.y = pointer.y - (scrollBar.height/2)
                    let moveText = (pointer.y - topPos) / scrollHeight * (slotsHeight - maskHeight)

                    let percentage = (pointer.y - topPos) / scrollHeight * 100
                    if (percentage < 7) {
                        moveText = 0
                        scrollBar.y = topPos - (scrollBar.height/2)
                    } else if (percentage > 93) {
                        moveText = slotsHeight - maskHeight
                        scrollBar.y = topPos + scrollHeight - (scrollBar.height/2)
                    }

                    for (let [key] of Object.entries(UI.slots)) {
                        UI.slots[key].resetSlot(-moveText)
                    }
                    UI.scrollAmount = moveText
                }
            });
        scrollZone.on('pointerdown', function (pointer) {
                const slotNumber = Object.keys(UI.slots).length - 1
                const scrollBar = UI.phaserScene.sharedData.inventory.ui.elements.scrollBar

                const topPos = scrollZone.y + (scrollBar.height/2)
                const scrollHeight = scrollZone.height - scrollBar.height
                const slotsHeight = (((slotNumber - (slotNumber % 4)) / 4) + 1) * 55 // height the slots take up
                const maskHeight = 200//scrollMask.height

                scrollBar.y = pointer.y - (scrollBar.height/2)
                let moveText = (pointer.y - topPos) / scrollHeight * (slotsHeight - maskHeight)

                let percentage = (pointer.y - topPos) / scrollHeight * 100
                if (percentage < 7) {
                    moveText = 0
                    scrollBar.y = topPos - (scrollBar.height/2)
                } else if (percentage > 93) {
                    moveText = slotsHeight - maskHeight
                    scrollBar.y = topPos + scrollHeight - (scrollBar.height/2)
                }

                for (let [key] of Object.entries(UI.slots)) {
                    UI.slots[key].resetSlot(-moveText)
                }
                UI.scrollAmount = moveText
            });

        this.phaserScene.sharedData.inventory.ui.elements = {
            main: sprite,
            hitboxes: hitboxes,
            scrollMask: scrollMask,
            scrollZone: scrollZone,
            scrollBar: scrollBar,
            scrollUp: scrollUp,
            scrollDown: scrollDown
        };

        super.initialize();
        this.setSelected(ITEM_TYPES.ALL)
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

        this.setSelected(ITEM_TYPES.ALL)
        this.phaserScene.sharedData.inventory.ui.open =  true;
        this.phaserScene.sharedData.inventory.ui.elements.main.setAlpha(1);

        this.updateSlots();
        this.updateScrollBar()

        const hitboxes = this.phaserScene.sharedData.inventory.ui.elements.hitboxes
        for (let index = 0; index < hitboxes.length; index++) {
            const hitbox = hitboxes[index];
            hitbox.setInteractive()
        }

        super.show();
    }

    hide()
    {
        super.hide();


        for (let [key, value] of Object.entries(this.slots)) {
            this.slots[key].destroy()
        }

        this.phaserScene.sharedData.inventory.ui.open = false;
        this.phaserScene.sharedData.inventory.ui.elements.main.setAlpha(0);

        this.phaserScene.sharedData.inventory.ui.elements.scrollBar.setAlpha(0);
        this.phaserScene.sharedData.inventory.ui.elements.main.animationState.setAnimation(8, `scroll/hide`, false)
        this.phaserScene.sharedData.inventory.ui.elements.scrollZone.disableInteractive()
        this.phaserScene.sharedData.inventory.ui.elements.scrollUp.setAlpha(0).disableInteractive();
        this.phaserScene.sharedData.inventory.ui.elements.scrollDown.setAlpha(0).disableInteractive();

        const hitboxes = this.phaserScene.sharedData.inventory.ui.elements.hitboxes
        for (let index = 0; index < hitboxes.length; index++) {
            const hitbox = hitboxes[index];
            hitbox.disableInteractive()
        }
    }

    changeTab(newType)
    {
        this.setSelected(newType)
        this.updateSlots();
        this.updateScrollBar();
    }

    setSelected(selected) 
    {
        const sprite = this.phaserScene.sharedData.inventory.ui.elements.main

        sprite.animationState.setAnimation(selected+1, `select/${this.buttons[selected]}`, false)
        sprite.animationState.setAnimation(this.#currentTab+1, `${this.buttons[this.#currentTab]}/up`, false)

        this.#currentTab = selected;
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
        const slotNumber = Object.keys(UI.slots).length - 1
        if (((slotNumber - (slotNumber % 4)) / 4) > 2) {
            this.phaserScene.sharedData.inventory.ui.elements.main.animationState.setAnimation(8, `scroll/visible`, false)

            const scrollBar = UI.phaserScene.sharedData.inventory.ui.elements.scrollBar
            const topPos = UI.phaserScene.sharedData.inventory.ui.elements.scrollZone.y + (scrollBar.height/2)

            scrollBar.y = topPos - (scrollBar.height/2)
            for (let [key, value] of Object.entries(UI.slots)) {
                UI.slots[key].resetSlot()
            }
            this.phaserScene.sharedData.inventory.ui.elements.scrollBar.setAlpha(1);
            this.phaserScene.sharedData.inventory.ui.elements.scrollZone.setInteractive()
            this.phaserScene.sharedData.inventory.ui.elements.scrollUp.setAlpha(1).setInteractive();
            this.phaserScene.sharedData.inventory.ui.elements.scrollDown.setAlpha(1).setInteractive();
        } else {
            this.phaserScene.sharedData.inventory.ui.elements.scrollBar.setAlpha(0);
            this.phaserScene.sharedData.inventory.ui.elements.main.animationState.setAnimation(8, `scroll/hide`, false)
            this.phaserScene.sharedData.inventory.ui.elements.scrollZone.disableInteractive()
            this.phaserScene.sharedData.inventory.ui.elements.scrollUp.setAlpha(0).disableInteractive();
            this.phaserScene.sharedData.inventory.ui.elements.scrollDown.setAlpha(0).disableInteractive();
        }
    }
}