class InventoryManager
{
    constructor(phaserScene) {
        this.phaserScene = phaserScene;

        if (phaserScene.sharedData.inventory === undefined) {
            phaserScene.sharedData.inventory = {
                manager: this,
                allItems: {}
            }
        }
        // Note: each item in the inventory (allItems) has a template name as the key and the number of that item as its value
    }

    addItem(itemTemplate, amount=1) {
        const allItems = this.phaserScene.sharedData.inventory.allItems

        if (allItems[itemTemplate]) { 
            allItems[itemTemplate] = allItems[itemTemplate] + amount 
        }  else { 
            allItems[itemTemplate] = amount 
        }
    }

    removeItem(itemTemplate, amount=1) {
        const allItems = this.phaserScene.sharedData.inventory.allItems
        const count = this.getItemCount(itemTemplate)

        if (count >= amount) {
            allItems[itemTemplate] = allItems[itemTemplate] - amount
            if (allItems[itemTemplate] === 0) { allItems[itemTemplate] }
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

    getItemByType(type) {
        const allItems = this.phaserScene.sharedData.inventory.allItems

        const filteredItems = {}
        for (let [key] of Object.entries(allItems)) {
            const template = this.phaserScene.sharedData.templateManager.getTemplate(key)

            let test = false
            switch (type) {
                case ITEM_TYPES.ALL:
                    test = true
                    break;
                case ITEM_TYPES.PRODUCE:
                    test = template.template === "PlantProduceTemplate"
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

    getItemByTemplates(templateArray) {
        const allItems = this.phaserScene.sharedData.inventory.allItems

        const filteredItems = {}
        for (let [key] of Object.entries(allItems)) {
            templateArray.forEach(templateID => {
                if (templateID === key) {
                    filteredItems[key] = allItems[key]
                }
            });
            
        }
        return filteredItems
    }
}