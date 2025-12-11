const ITEM_TYPES = 
{
    ALL: -1,
    SPECIAL: 0,
    CLOTHES: 1,
    PLANTS: 2,
    PLACEABLE: 3,
    CARDS: 4,
    PRODUCE: 5
}

const CLOTHE_TYPES = 
{
    DYE: -1,
    HAIR: 0,
    TSHIRT: 1,
    PANTS: 2,
    SHOES: 3,
    ACCESORY: 4
}

class InventorySlot
{
    PADDING = {x: 55, y: 55}
    POS_START = {x: 318, y: 200}
    SIZE = 40
    TEXT_SETTINGS = 
    {
        font: "12px Arial",
        color: "#000000"
    }
    NUMBER_OFFSET = {x: 24, y: 26}
    constructor(phaserScene, templateID, itemCount, slotNumber)
    {
        this.phaserScene = phaserScene
        this.templateID = templateID;
        this.itemCount = itemCount;
        this.slotNumber = slotNumber
        this.create()
    }

    create() {
        let spriteClass = this.phaserScene.sharedData.templateManager.getTemplateValue(this.templateID, "movieClipClass")
        let spriteFile = this.phaserScene.sharedData.templateManager.getTemplateValue(this.templateID, "movieClipFile")
            spriteFile = spriteFile.split("/")
            spriteFile = spriteFile[spriteFile.length - 1].replace(".swf", "")

        const slotPos = this.getSlotPos()

        this.background = this.phaserScene.add.sprite(slotPos.x, slotPos.y, this.phaserScene.sharedData.inventory.ui.manager.INVENTORY_SLOT, "up").setInteractive()
        this.image = this.phaserScene.add.sprite(slotPos.x, slotPos.y, "inv_"+spriteFile, spriteClass)
        this.text = this.phaserScene.add.text(slotPos.x + this.NUMBER_OFFSET.x, slotPos.y + this.NUMBER_OFFSET.y, this.itemCount, this.TEXT_SETTINGS)
                    .setOrigin(1)
                    .setScrollFactor(0);

        
        this.background.on('pointerout', (pointer) =>  
        { 
            this.background.setFrame("up")
        });
        this.background.on('pointerover', (pointer) =>  
        { 
            this.background.setFrame("over")
            this.phaserScene.sharedData.inventory.ui.manager.itemDownSound.play()
        });
        this.background.on('pointerdown', (pointer) =>  
        { 
            this.background.setFrame("down")
            this.phaserScene.sharedData.inventory.ui.manager.itemDownSound.play()
        });

        // Set mask
        const mask = this.phaserScene.sharedData.inventory.ui.elements.scrollMask
        this.background.setMask(mask);
        this.image.setMask(mask);
        this.text.setMask(mask);

        let bigger = this.image.width > this.image.height ? this.image.width : this.image.height
        let scale = this.SIZE / bigger
        this.image.setScale(scale)
    }

    resetSlot(scroll = 0, slotNumber = this.slotNumber) {
        this.slotNumber = slotNumber
        let slotPos = this.getSlotPos()
        slotPos.y = slotPos.y + scroll
        this.background.setPosition(slotPos.x, slotPos.y)
        this.image.setPosition(slotPos.x, slotPos.y)
        this.text.setPosition(slotPos.x + this.NUMBER_OFFSET.x, slotPos.y + this.NUMBER_OFFSET.y)
    }

    getSlotPos(scroll = 0, slotNumber = this.slotNumber) {
        const gridPos = {x: slotNumber % 4, y: (slotNumber - (slotNumber % 4)) / 4}
        return {x: this.POS_START.x + (gridPos.x* this.PADDING.x), y: this.POS_START.y - scroll + (gridPos.y* this.PADDING.y)}
    }

    destroy() {
        this.image.destroy()
        this.background.destroy()
        this.text.destroy()
        delete this.phaserScene.sharedData.inventory.ui.manager.slots[this.templateID]
    }
}