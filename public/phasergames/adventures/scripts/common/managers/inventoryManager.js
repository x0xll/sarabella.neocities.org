class InventoryManager
{
    constructor(phaserScene)
    {
        this.phaserScene = phaserScene;
    }

    addItem(itemData, amount)
    {
        let logicContainer = this.phaserScene.sharedData.inventory.logic;

        if (logicContainer.allItems.get(itemData.id) === undefined)
        {
            console.log("No item created with this id!");
            return;
        }

        if (logicContainer.currentItems === undefined)
            logicContainer.currentItems = new Map();

        let currentAmount = logicContainer.currentItems.get(itemData.id);
        if (currentAmount === undefined)
            currentAmount = 0;
        logicContainer.currentItems.set(itemData.id, currentAmount + amount);
    }

    removeItem(itemData, amount)
    {
        let logicContainer = this.phaserScene.sharedData.inventory.logic;

        if (logicContainer.allItems.get(itemData.id) === undefined)
        {
            console.log("No item created with this id!");
            return;
        }

        if (logicContainer.currentItems === undefined)
            logicContainer.currentItems = new Map();

        let currentAmount = logicContainer.currentItems.get(itemData.id);
        if (currentAmount === undefined || currentAmount - amount <= 0)
        {
            logicContainer.currentItems.delete(itemData.id);
            return;
        }

        logicContainer.currentItems.set(itemData.id, currentAmount - amount);
    }

    hasItem(itemData, amount)
    {
        let logicContainer = this.phaserScene.sharedData.inventory.logic;

        if (logicContainer.allItems.get(itemData.id) === undefined)
        {
            console.log("No item created with this id!");
            return;
        }

        if (logicContainer.currentItems === undefined)
            logicContainer.currentItems = new Map();

        let currentAmount = logicContainer.currentItems.get(itemData.id);
        if (currentAmount === undefined)
            currentAmount = 0;

        return currentAmount >= amount;
    }
}