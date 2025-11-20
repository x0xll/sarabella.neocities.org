/* Handles the backend aspect of the magic tree
*  eg: Level, etc.
*/

const MAGICTREE_IMAGE = "magicTree";
const MAGICTREE_BORDER = "magicTreeBorder"

function loadMagicTreeUI(phaserScene)
{
    // Main border
    phaserScene.load.image(MAGICTREE_BORDER, "./assets/extracted/UI/Magic Tree/MT_Border.png");
    
    // Magic Tree
    let level = phaserScene.magicTree.level;
    phaserScene.load.image(MAGICTREE_IMAGE, "./assets/extracted/UI/Magic Tree/Planting Levels/MT_TreeLevel_0" + level + ".png")
}

function initializeMagicTreeUI(phaserScene)
{
    var tree = phaserScene.add.image(130, 60, MAGICTREE_IMAGE)
                .setOrigin(0)
                .setScrollFactor(0)
                .setDepth(100);

    var border = phaserScene.add.image(130, 60, MAGICTREE_BORDER)
                .setOrigin(0)
                .setScrollFactor(0)
                .setDepth(100);

    phaserScene.magicTree.ui = 
    {
        tree: tree,
        border: border
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

    phaserScene.magicTree.ui.open = true;
    phaserScene.magicTree.ui.tree.setAlpha(1);
    phaserScene.magicTree.ui.border.setAlpha(1);
}

function hideMagicTree(phaserScene)
{
    phaserScene.magicTree.ui.open = false;
    phaserScene.magicTree.ui.tree.setAlpha(0);
    phaserScene.magicTree.ui.border.setAlpha(0);
}