/* Handles the backend aspect of the magic tree
*  eg: Level, etc.
*/

const MAGICTREE_IMAGE = "magicTree";
const MAGICTREE_BORDER = "magicTreeBorder"
const MAGICTREE_ICON = "magicTreeIcon";
const MAGICTREE_CLOSE_BTN = "magicTreeCloseBtn";

function loadMagicTreeUI(phaserScene)
{
    // Main border
    phaserScene.load.image(MAGICTREE_BORDER, "./assets/extracted/UI/Magic Tree/MT_Border.png");
    
    // Magic Tree
    let level = phaserScene.magicTree.level;
    phaserScene.load.image(MAGICTREE_IMAGE, "./assets/extracted/UI/Magic Tree/Planting Levels/MT_TreeLevel_0" + level + ".png")

    // Icon
    phaserScene.load.image(MAGICTREE_ICON, "./assets/extracted/UI/Magic Tree/MT_Icon.png");

    // Close btn
    phaserScene.load.image(MAGICTREE_CLOSE_BTN, "./assets/extracted/UI/Quest/closebtn.png")
}

function initializeMagicTreeUI(phaserScene)
{
    var tree = phaserScene.add.image(110, 30, MAGICTREE_IMAGE)
                .setOrigin(0)
                .setScrollFactor(0)
                .setDepth(100);

    var border = phaserScene.add.image(107, 42, MAGICTREE_BORDER)
                .setOrigin(0)
                .setScrollFactor(0)
                .setDepth(100)
                .setScale(.9);

    var icon = phaserScene.add.image(75, 30, MAGICTREE_ICON)
                .setOrigin(0)
                .setScrollFactor(0)
                .setDepth(100);

    var closeBtn = phaserScene.add.image(675, 45, MAGICTREE_CLOSE_BTN)
                    .setOrigin(0)
                    .setScrollFactor(0)
                    .setDepth(100)
                    .setInteractive();

    closeBtn.on('pointerup', function (pointer) 
    { 
        hideMagicTree(phaserScene);
    });

    // TODO: Handle masking of the tree image based on the border

    phaserScene.magicTree.ui = 
    {
        tree: tree,
        border: border,
        icon: icon,
        closeBtn: closeBtn
    };
    hideMagicTree(phaserScene);
}

function showMagicTree(phaserScene)
{
    if (phaserScene.magicTree.ui === undefined)
        initializeMagicTree(phaserScene);

    if (phaserScene.magicTree.ui.open)
    {
        hideMagicTree(phaserScene);
        return;
    }

    if (phaserScene.uiOpen)
        return;

    phaserScene.uiOpen = true;
    phaserScene.magicTree.ui.open = true;
    phaserScene.magicTree.ui.tree.setAlpha(1);
    phaserScene.magicTree.ui.border.setAlpha(1);
    phaserScene.magicTree.ui.icon.setAlpha(1);
    phaserScene.magicTree.ui.closeBtn.setAlpha(1);
}

function hideMagicTree(phaserScene)
{
    phaserScene.uiOpen = false;
    phaserScene.magicTree.ui.open = false;
    phaserScene.magicTree.ui.tree.setAlpha(0);
    phaserScene.magicTree.ui.border.setAlpha(0);
    phaserScene.magicTree.ui.icon.setAlpha(0);
    phaserScene.magicTree.ui.closeBtn.setAlpha(0);
}