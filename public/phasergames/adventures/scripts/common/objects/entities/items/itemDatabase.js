class ItemDatabase
{
    // TODO: do we go throguh a xml parsing or not for the items? Setup as if no for current testing purposes
    // If we go the parsing route, the file seems to be inventory.xml

    constructor (phaserScene)
    {
        this.phaserScene = phaserScene;
        this.#loadItemVisuals();
    }

    #loadItemVisuals()
    {
        // TODO
    }

    setupDatabase()
    {
        this.phaserScene.sharedData.inventory.logic.allItems = new Map();

        this.#setupSpecial();
        this.#setupClothes();
        this.#setupPlants();
        this.#setupPlaceable();
        this.#setupCards();
        this.#setupProduce();
    }

    #setupSpecial()
    {
        let maxSpecial = 0;

        for (let i = 1; i <= maxSpecial; i++)
        {
            // TODO: Get id data from swf
            let id = "P0" + ((i < 10) ? "0" + i : i);
            let item = new Item(id, ITEM_TYPES.SPECIAL);
            this.phaserScene.sharedData.inventory.logic.allItems.set(item.id, item);
        }
    }

    #setupClothes()
    {
        let maxClothes = 0;

        for (let i = 1; i <= maxClothes; i++)
        {
            // TODO: Get id data from swf
            let id = "IS" + ((i < 10) ? "0" + i : i); // need to handle variants (a, b, etc.)
            let item = new Item(id, ITEM_TYPES.CLOTHES);
            // TODO : set the clothes type
            this.phaserScene.sharedData.inventory.logic.allItems.set(item.id, item);
        } 
    }

    #setupPlants()
    {
        let maxPlants = 1;

        for (let i = 1; i <= maxPlants; i++)
        {
            let id = "P0" + ((i < 10) ? "0" + i : i) + "_Seed";
            let item = new Item(id, ITEM_TYPES.PLANT);
            this.phaserScene.sharedData.inventory.logic.allItems.set(item.id, item);
        } 
    }

    #setupPlaceable()
    {
        let maxPlaceable = 0;

        for (let i = 1; i <= maxPlaceable; i++)
        {
            let id = "IHH0" + ((i < 10) ? "0" + i : i); // TODO: handle promo stuffs ("PROMO")
            let item = new Item(id, ITEM_TYPES.PLACEABLE);
            this.phaserScene.sharedData.inventory.logic.allItems.set(item.id, item);
        } 
    }

    #setupCards()
    {
        let maxCards = 0;

        for (let i = 1; i <= maxCards; i++)
        {
            let id = "IEC0" + ((i < 10) ? "0" + i : i);
            let item = new Item(id, ITEM_TYPES.CARDS);
            this.phaserScene.sharedData.inventory.logic.allItems.set(item.id, item);
        } 
    }

    #setupProduce()
    {
        let maxProduce = 1;

        for (let i = 1; i <= maxProduce; i++)
        {
            let id = "P0" + ((i < 10) ? "0" + i : i) + "_Produce";
            let item = new Item(id, ITEM_TYPES.PRODUCE);
            this.phaserScene.sharedData.inventory.logic.allItems.set(item.id, item);
        }
    }
}