class InventoryManager
{
    constructor(phaserScene) {
        this.phaserScene = phaserScene;

        if (phaserScene.sharedData.inventory === undefined) {
            phaserScene.sharedData.inventory = {
                manager: this,
                allItems: {}
            }
            // this.addItem("P001ProduceTemplate")
            this.addItem("P001SeedTemplate")
            // this.addItem("P002ProduceTemplate")
            // this.addItem("P002SeedTemplate")
            // this.addItem("P003ProduceTemplate")
            // this.addItem("P003SeedTemplate")
            // this.addItem("P004ProduceTemplate")
            // this.addItem("P035SeedTemplate")
            // this.addItem("P005ProduceTemplate")
            // this.addItem("P005SeedTemplate")
            // this.addItem("P006ProduceTemplate")
            // this.addItem("P006SeedTemplate")
            // this.addItem("P007ProduceTemplate")
            // this.addItem("P007SeedTemplate")
            // this.addItem("P008ProduceTemplate")
            // this.addItem("P008SeedTemplate")
            // this.addItem("P010ProduceTemplate")
            // this.addItem("P010SeedTemplate")
            // this.addItem("P011ProduceTemplate")
            // this.addItem("P011SeedTemplate")
            // this.addItem("P012ProduceTemplate")
            // this.addItem("P012SeedTemplate")
            this.addItem("P028SeedTemplate")
            this.addItem("P028ProduceTemplate")
            this.addItem("I0536Template",2)
            this.addItem("I019Template", 1)
        }
        // Note: each item in the inventory (allItems) has a template name as the key and the number of that item as its value
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
    }

    removeItem(itemTemplate, amount=1) {
        const allItems = this.phaserScene.sharedData.inventory.allItems
        const count = this.getItemCount(itemTemplate)

        if (count >= amount) {
            allItems[itemTemplate] = allItems[itemTemplate] - amount
            if (allItems[itemTemplate] === 0) { delete allItems[itemTemplate] }
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
            const template = this.phaserScene.sharedData.templateManager.getTemplate(key, "inventory")

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