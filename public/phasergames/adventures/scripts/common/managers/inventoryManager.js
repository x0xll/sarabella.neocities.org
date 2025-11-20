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

    phaserScene.inventory = {}; // TODO : Remoev when we actually setup the inventory initialization
    phaserScene.inventory.ui = 
    {
        background: background,
        border: border,
        bagIcon: bagIcon,
        bagBorder: bagBorder
    };

    hideInventory(phaserScene);
}

function showInventory(phaserScene)
{
    if (phaserScene.inventory === undefined)
        initializeInventoryUI(phaserScene);

    if (phaserScene.inventory.ui.open)
    {
        hideInventory(phaserScene);
        return;
    }

    if (phaserScene.uiOpen)
        return;

    phaserScene.uiOpen = true;
    phaserScene.inventory.ui.open =  true;
    phaserScene.inventory.ui.background.setAlpha(1);
    phaserScene.inventory.ui.border.setAlpha(1);
    phaserScene.inventory.ui.bagIcon.setAlpha(1);
    phaserScene.inventory.ui.bagBorder.setAlpha(1);
}

function hideInventory(phaserScene)
{
    phaserScene.uiOpen = false;
    phaserScene.inventory.ui.open = false;
    phaserScene.inventory.ui.background.setAlpha(0);
    phaserScene.inventory.ui.border.setAlpha(0);
    phaserScene.inventory.ui.bagIcon.setAlpha(0);
    phaserScene.inventory.ui.bagBorder.setAlpha(0);
}