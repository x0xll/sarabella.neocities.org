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

            this.phaserScene.sharedData.inventory.currentItem = {
                templateID: this.templateID,
            }
            const template = this.phaserScene.sharedData.templateManager.getTemplate(this.templateID)
            if (template.template === "PlantProduceTemplate") {
                // PRODUCE
                console.warn("Produce item use not yet implemented")
            } else if (template.QuestItem !== undefined) {
                // SPECIAL
                console.warn("Special item use not yet implemented")
            } else if (template.Seed !== undefined) {
                // PLANTS
                this.phaserScene.sharedData.inventory.currentItem = {
                    templateID: this.templateID,
                    soilTarget: this.phaserScene.sharedData.templateManager.getTemplateValue(this.templateID, "seedSoilTarget"),
                    plantItemID: this.phaserScene.sharedData.templateManager.getTemplateValue(this.templateID, "seedPlantItemID"),
                    plantWidth: this.phaserScene.sharedData.templateManager.getTemplateValue(this.templateID, "seedPlantWidth"),
                    plantHeight: this.phaserScene.sharedData.templateManager.getTemplateValue(this.templateID, "seedPlantHeight")
                }
                this.phaserScene.sharedData.player.cursor.cursorMode = this.phaserScene.sharedData.player.cursor.MODE.planting
                this.phaserScene.sharedData.inventory.ui.manager.hide()
            } else if (template.CardEntity !== undefined) {
                // CARDS
                console.warn("Card item use not yet implemented")
            } else if (template.PlaceEntity !== undefined) {
                // PLACEABLE
                this.phaserScene.sharedData.inventory.currentItem = {
                    templateID: this.templateID,
                    entityTemplate: this.phaserScene.sharedData.templateManager.getTemplateValue(this.templateID, "placeableItemEntityTemplate"),
                    requiresMove: this.phaserScene.sharedData.templateManager.getTemplateValue(this.templateID, "placeableItemRequiresMove"),
                    width: this.phaserScene.sharedData.templateManager.getTemplateValue(this.templateID, "placeableItemWidth"),
                    height: this.phaserScene.sharedData.templateManager.getTemplateValue(this.templateID, "placeableItemHeight")
                }
                this.phaserScene.sharedData.player.cursor.cursorMode = this.phaserScene.sharedData.player.cursor.MODE.placing
                this.phaserScene.sharedData.inventory.ui.manager.hide()
            } else if (template.AvatarCustomizationData !== undefined) {
                // CLOTHING
                console.warn("Clothing item use not yet implemented")
            } else {
                console.warn("Da frick is this?!", template)
            }
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