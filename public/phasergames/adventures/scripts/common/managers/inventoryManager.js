class InventoryManager
{
    constructor(phaserScene) {
        this.phaserScene = phaserScene;

        if (phaserScene.sharedData.inventory === undefined) {
            phaserScene.sharedData.inventory = {
                manager: this,
                allItems: {}
            }

            this.loadInventory();
        }
        // Note: each item in the inventory (allItems) has a template name as the key and the number of that item as its value
    }

    loadInventory() {
        this.phaserScene.sharedData.inventory.allItems = this.phaserScene.sharedData.saving.getGameData(GAME_DATA_TYPE.inventory)
    }

    addItem(itemTemplate, amount=1) {
        const allItems = this.phaserScene.sharedData.inventory.allItems

        if (typeof itemTemplate !== "string") {
            console.log(`Item not added. ${itemTemplate} is not a string`)
        } else if (allItems[itemTemplate]) { 
            allItems[itemTemplate] = allItems[itemTemplate] + amount 
        } else { 
            allItems[itemTemplate] = amount 
        }
        this.phaserScene.sharedData.saving.setGameData(GAME_DATA_TYPE.inventory, allItems);
    }

    removeItem(itemTemplate, amount=1) {
        const allItems = this.phaserScene.sharedData.inventory.allItems
        const count = this.getItemCount(itemTemplate)

        if (count >= amount) {
            allItems[itemTemplate] = allItems[itemTemplate] - amount
            if (allItems[itemTemplate] === 0) { delete allItems[itemTemplate] }
            this.phaserScene.sharedData.saveManager.setGameData(GAME_DATA_TYPE.inventory, allItems);
            return true
        } else {
            console.log(`Could not remove ${amount} ${itemTemplate}. Only have ${count}`)
            return false
        }
    }

    getItemCount(itemTemplate) {
        const allItems = this.phaserScene.sharedData.inventory.allItems

        let count
        if (allItems[itemTemplate] === undefined) {
            count = 0
        } else {
            count = allItems[itemTemplate]
        }
        return count
    }

    getItemByType(type, itemArray = undefined) {
        let allItems = this.phaserScene.sharedData.inventory.allItems
        if (itemArray !== undefined) {
            allItems = this.getItemByTemplates(itemArray)
        }

        const filteredItems = {}
        for (let [key] of Object.entries(allItems)) {
            const template = this.phaserScene.sharedData.template.manager.getTemplate(key, "inventory")

            let test = false
            switch (type) {
                case ITEM_TYPES.ALL:
                    test = true
                    break;
                case ITEM_TYPES.PRODUCE:
                    // test = template.template === "PlantProduceTemplate"
                    test = template.template === "PlantProduceTemplate"
                            || (template.QuestItem === undefined
                            && template.Seed === undefined
                            && template.CardEntity === undefined
                            && template.PlaceEntity === undefined
                            && template.AvatarCustomizationData === undefined)
                    break;
                case ITEM_TYPES.SPECIAL:
                    test = template.QuestItem !== undefined
                    break;
                case ITEM_TYPES.PLANTS:
                    test = template.Seed !== undefined
                    break;
                case ITEM_TYPES.CARDS:
                    test = template.CardEntity !== undefined
                    break;
                case ITEM_TYPES.PLACEABLE:
                    test = template.PlaceEntity !== undefined
                    break;
                case ITEM_TYPES.CLOTHES:
                    test = template.AvatarCustomizationData !== undefined
                    break;
            
                default:
                    break;
            }
            
            if (test) {
                filteredItems[key] = allItems[key]
            }
        }
        return filteredItems
    }

    getItemByTemplates(itemArray) {
        const allItems = this.phaserScene.sharedData.inventory.allItems

        if (!Array.isArray(itemArray)) { 
            itemArray = [itemArray]
        }

        const filteredItems = {}
        for (let [key] of Object.entries(allItems)) {
            itemArray.forEach(item => {
                if (item.text === key && (item.count === undefined || parseInt(item.count)) <= allItems[key]) {
                    filteredItems[key] = allItems[key]
                }
            });
            
        }
        return filteredItems
    }
}

try{
    module.exports = {
        InventoryManager
    }
}
catch(e) {

}