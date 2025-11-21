// TODO : Need to handle the loading
// At startup and between scenes

class Common_Load extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'common_load' });
    }

    preload ()
    {
        loadLoadingUI(this);
        preloadQuestData(this)
    }

    create (sharedData)
    {
        const loader = this
        loader.sharedData = sharedData

        if (loader.sharedData.worldToLoad === undefined)
        {
            loader.sharedData.worldToLoad = "world_canterfarm"
        }

        loadQuestData(this)
        // TESTING
        this.scene.launch(loader.sharedData.worldToLoad, loader.sharedData);

        // Add a delay to make sure the ui is setup after the world loads to prevent null refs
        // TODO: find a good value
        this.time.delayedCall(100, () => {
            this.scene.launch("common_ui", loader.sharedData)
                      .stop();
        }, [], this); 
    }
}