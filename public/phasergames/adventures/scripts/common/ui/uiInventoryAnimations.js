class uiInventoryAnimations extends uiManagerBase
{
    ADD_ITEM_ATLAS = "addItem-atlas"
    ADD_ITEM_JSON = "addItem-json"
    REMOVE_ITEM_ATLAS = "removeItem-atlas"
    REMOVE_ITEM_JSON = "removeItem-json"
    ITEM_SIZE = 40
    Y_START_ADD = 470
    Y_START_REMOVE = 440
    ADD_SOUND = "inv_add"
    REMOVE_SOUND = "inv_remove"
    

    constructor(phaserScene)
    {
        // Note: not tracking the key so it doesn't get included in global checks for uis being open
        super(phaserScene, "inventoryAnimation", false);
        this.itemsQueue = []

        this.load()
    }

    load()
    {   
        super.load()

        this.phaserScene.load.spineAtlas(this.ADD_ITEM_ATLAS, `${ROOT_ASSETS_PATH}UI/Inventory/ReceiveItem/skeleton.atlas`);
        this.phaserScene.load.spineJson(this.ADD_ITEM_JSON, `${ROOT_ASSETS_PATH}UI/Inventory/ReceiveItem/skeleton.json`);
        this.phaserScene.load.audio(this.ADD_SOUND, `${ROOT_ASSETS_PATH}Audio/Inventory/Animations/13.mp3`);
        this.phaserScene.load.audio(this.REMOVE_SOUND, `${ROOT_ASSETS_PATH}Audio/Inventory/Animations/68.mp3`);

        // Note: item and horseshoe images are loaded from uiInventory
    }

    create()
    {
    }

    initialize()
    {
        const animationSpine = this.phaserScene.add.spine(400, this.yStart, this.ADD_ITEM_JSON, this.ADD_ITEM_ATLAS)

        this.addSound = this.phaserScene.sound.add(this.ADD_SOUND, {volume: VOLUME});
        this.removeSound = this.phaserScene.sound.add(this.REMOVE_SOUND, {volume: VOLUME});

        let spriteClass
        let spriteFile
        if (this.templateID === "horseshoe") {
            spriteClass = "horseshoe"
            spriteFile = "horseshoe"
        } else {
            spriteClass = this.phaserScene.sharedData.template.manager.getTemplateValue(this.templateID, "movieClipClass", "inventory")
            spriteFile = this.phaserScene.sharedData.template.manager.getTemplateValue(this.templateID, "movieClipFile", "inventory")
                spriteFile = spriteFile.split("/")
                spriteFile = spriteFile[spriteFile.length - 1].replace(".swf", "")
        }
        const itemImage = this.phaserScene.add.sprite(400, this.yStart, "inv_"+spriteFile, spriteClass)


        let bigger = itemImage.width > itemImage.height ? itemImage.width : itemImage.height
        this.itemScale = this.ITEM_SIZE / bigger
        itemImage.setScale(this.itemScale)

        // TODO: add the text above the animation

        this.phaserScene.sharedData[this.key].ui.elements = {
            animationSpine: animationSpine,
            itemImage: itemImage
        };
    }

    /**
     * 
     * @param {*} itemID 
     * @param {*} count The number of items or horseshoes
     * @param {*} add True to play the receive animation, false to play the remove animation
     */
    show(itemID, count = 1, add = true) {
        // Using a queue so we can keep up with mutiple items and other UIs trying to display at the same time
        this.itemsQueue.push({itemID: itemID, count: count, add: add})
    }

    #actuallyShow(itemID, count = 1, add = true)
    {
        this.phaserScene.sharedData[this.key].ui.open = true

        // Initialize and set variables
        this.templateID = itemID
        if (add) {
            this.yStart = this.Y_START_ADD
        } else {
            this.yStart = this.Y_START_REMOVE
        }
        this.initialize(add)


        if (add) {
            this.phaserScene.sharedData[this.key].ui.elements.animationSpine.animationState.setAnimation(0, "recieveItem", false)
            this.addSound.play()
        } else if (itemID === "horseshoe") {
            this.phaserScene.sharedData[this.key].ui.elements.animationSpine.animationState.setAnimation(0, "removeHorseshoes", false)
            this.removeSound.play()
        } else {
            this.phaserScene.sharedData[this.key].ui.elements.animationSpine.animationState.setAnimation(0, "removeItem", false)
            this.removeSound.play()
        }
        
        let UI = this
        this.phaserScene.sharedData[this.key].ui.elements.animationSpine.animationState.addListener({
                complete: function endAnimation(entry) { 
                    UI.hide()
                }       
             })
    }

    update() {
        if (this.phaserScene.sharedData[this.key].ui.open) {
            const bone = this.phaserScene.sharedData.inventoryAnimation.ui.elements.animationSpine.skeleton.bones[2]
            const itemImage = this.phaserScene.sharedData.inventoryAnimation.ui.elements.itemImage

            // Copy spine animation data over to item image
            itemImage.setY(this.yStart - bone.y)
            itemImage.setScale(this.itemScale*bone.scaleX)
            itemImage.setAlpha(this.phaserScene.sharedData.inventoryAnimation.ui.elements.animationSpine.skeleton.slots[2].color.a)
        } else if (this.itemsQueue.length > 0 && !this.phaserScene.sharedData.global.uiOpen) {
            const nextItem = this.itemsQueue.pop()
            this.#actuallyShow(nextItem.itemID, nextItem.count, nextItem.add)
        }
    }

    hide()
    {
        this.phaserScene.sharedData[this.key].ui.elements.animationSpine.destroy()
        this.phaserScene.sharedData[this.key].ui.elements.itemImage.destroy()
        this.phaserScene.sharedData[this.key].ui.elements = {}
        
        this.phaserScene.sharedData[this.key].ui.open = false
    }
}