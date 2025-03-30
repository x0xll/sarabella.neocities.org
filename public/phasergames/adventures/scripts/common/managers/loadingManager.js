const LOADING_PANEL = "Loading_Panel"

function loadLoadingUI(phaserScene)
{
    // Panel
    phaserScene.load.image(LOADING_PANEL, "./assets/extracted/UI/Loading/LoadingScreen.png");
}

function initializeLoadingUI(phaserScene)
{
    // Panel
    var panel = phaserScene.add.image(0, 0, LOADING_PANEL)
    .setOrigin(0)
    .setScrollFactor(0)
    .setDepth(1000);

    phaserScene.loadingUI = 
    {
        isLoading: false,
        panel: panel
    };
}

function showLoading(phaserScene)
{
    if (phaserScene.loadLoadingUI === undefined)
        initializeLoadingUI(phaserScene);

    phaserScene.loadingUI.panel.setAlpha(1);

    phaserScene.loadLoadingUI.isLoading = true;
}

function hideLoading(phaserScene)
{
    phaserScene.loadingUI.panel.setAlpha(0);

    phaserScene.loadLoadingUI.isLoading = false;
}