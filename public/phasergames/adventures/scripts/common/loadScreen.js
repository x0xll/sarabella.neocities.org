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

    create ()
    {
        const loader = this
        loader.sharedData = {}

        loadQuestData(this)
        // TESTING
        this.scene.launch("world_canterfarm", loader.sharedData)
                  .launch("common_ui", loader.sharedData)
                  .remove();
    }
}