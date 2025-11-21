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

const CLOTHE_TYPES = 
{
    DYE: -1,
    HAIR: 0,
    TSHIRT: 1,
    PANTS: 2,
    SHOES: 3,
    ACCESORY: 4
}

class Item
{
    constructor(id, type)
    {
        this.id = id;
        this.type = type;
    }
}