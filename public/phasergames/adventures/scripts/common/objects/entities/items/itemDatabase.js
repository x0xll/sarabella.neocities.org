class ItemDatabase
{
    constructor (phaserScene)
    {
        this.phaserScene = phaserScene;
        this.loadItemVisuals();
    }

    loadItemVisuals()
    {
        // TODO
    }

    setupDatabase()
    {
        this.phaserScene.sharedData.inventory.logic.allItems = new Map();

        // TODO: Initialize all items datas here
        let itemA = new Item("test", ITEM_TYPES.SPECIAL);
        this.phaserScene.sharedData.inventory.logic.allItems.set(itemA.id, itemA);


    }
}