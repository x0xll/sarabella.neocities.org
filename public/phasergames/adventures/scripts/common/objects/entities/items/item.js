const ITEM_TYPES = 
{
    NONE: -1,
    SPECIAL: 0,
    CLOTHES: 1,
    PLANT: 2,
    PLACEABLE: 3,
    CARDS: 4,
    PRODUCE: 5
}

class Item
{
    constructor(id, type)
    {
        this.id = id;
        this.type = type;
    }
}