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

    phaserScene.minimap = {} // TODO: remove when we setup the map initialization
    phaserScene.minimap.ui = 
    {
        map: map
    };
    hideMinimap(phaserScene);
}

function showMinimap(phaserScene)
{
    if (phaserScene.minimap.ui === undefined)
        initializeMinimapUI(phaserScene);

    if (phaserScene.minimap.ui.open)
    {
        hideMinimap(phaserScene);
        return;
    }

    phaserScene.minimap.ui.open = true;
    phaserScene.minimap.ui.map.setAlpha(1);
}

function hideMinimap(phaserScene)
{
    phaserScene.minimap.ui.open = false;
    phaserScene.minimap.ui.map.setAlpha(0);
}