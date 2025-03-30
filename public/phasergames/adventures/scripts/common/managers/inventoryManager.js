/* Handles the backend aspect of the inventory
*  Save/Load inventory, Add/Remove item, etc.
*/

const INVENTORY_BACKGROUND_PANEL = "Inventory_Panel";
const INVENTORY_BORDER_PANEL = "Inventory_Panel_Border";
const INVENTORY_ICON_BAG = "Inventory_Icon_Bag";
const INVENTORY_ICON_BAG_BORDER = "Inventory_Icon_Bag_Border";


function loadInventoryUI(phaserScene)
{
    // Main border
    phaserScene.load.image(INVENTORY_BORDER_PANEL, "./assets/extracted/UI/Inventory/InventoryBorder.png");

    // Background panel
    //phaserScene.load.image(DIALOGUE_PANEL_IMG, "./assets/extracted/UI/Dialogue/Panel.png");

    // Bag Icon
    phaserScene.load.image(INVENTORY_ICON_BAG, "./assets/extracted/UI/Inventory/Bag.png");

    // Bag Border
    phaserScene.load.image(INVENTORY_ICON_BAG_BORDER, "./assets/extracted/UI/Inventory/BagBorder.png");

    // TODO : Get scroll bar
    // TODO : Get tabs
    // TODO : Get horseshoes bottom section
    // TODO : Get item slot background
}

function initializeInventoryUI(phaserScene)
{
    phaserScene.inventory = 
    {

    };
}

function showInventory(phaserScene)
{
    if (phaserScene.inventory === undefined)
        initializeInventoryUI(phaserScene);
}

function hideInventory(phaserScene)
{

}