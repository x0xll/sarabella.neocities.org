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
    // TODO: Get all elements separately
    phaserScene.load.image(INVENTORY_BACKGROUND_PANEL, "./assets/extracted/UI/Inventory/InventoryPanel.png");

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
    var background = phaserScene.add.image(130, 60, INVENTORY_BACKGROUND_PANEL)
                .setOrigin(0)
                .setScrollFactor(0)
                .setDepth(100);

    var border = phaserScene.add.image(260, 100, INVENTORY_BORDER_PANEL)
                .setOrigin(0)
                .setScrollFactor(0)
                .setDepth(100);

    var bagIcon = phaserScene.add.image(260, 100, INVENTORY_ICON_BAG)
                .setOrigin(0)
                .setScrollFactor(0)
                .setDepth(100);

    var bagBorder = phaserScene.add.image(245, 85, INVENTORY_ICON_BAG_BORDER)
                    .setOrigin(0)
                    .setScrollFactor(0)
                    .setDepth(100);

    phaserScene.inventory = 
    {
        background: background,
        border: border,
        bagIcon: bagIcon,
        bagBorder: bagBorder
    };
}

function showInventory(phaserScene)
{
    if (phaserScene.inventory === undefined)
        initializeInventoryUI(phaserScene);

    phaserScene.inventory.background.setAlpha(1);
    phaserScene.inventory.border.setAlpha(1);
    phaserScene.inventory.bagIcon.setAlpha(1);
    phaserScene.inventory.bagBorder.setAlpha(1);
}

function hideInventory(phaserScene)
{
    phaserScene.inventory.background.setAlpha(0);
    phaserScene.inventory.border.setAlpha(0);
    phaserScene.inventory.bagIcon.setAlpha(0);
    phaserScene.inventory.bagBorder.setAlpha(0);
}