/* Handles the backend aspect of the map
*  eg: Changing map
*/

const MINIMAP_IMG = "minimap";

function loadMinimapUI(phaserScene)
{
    // Main border
    phaserScene.load.image(MINIMAP_IMG, "./assets/extracted/MiniMap/" + phaserScene.ZONE_ID + ".png");
}

function initializeMinimapUI(phaserScene)
{
    var map = phaserScene.add.image(130, 60, MINIMAP_IMG)
                .setOrigin(0)
                .setScrollFactor(0)
                .setDepth(100);

    phaserScene.minimap = map;
    hideMinimap(phaserScene);
}

function showMinimap(phaserScene)
{
    if (phaserScene.minimap === undefined)
        initializeMinimapUI(phaserScene);

    phaserScene.minimap.setAlpha(1);
}

function hideMinimap(phaserScene)
{
    phaserScene.minimap.setAlpha(0);
}