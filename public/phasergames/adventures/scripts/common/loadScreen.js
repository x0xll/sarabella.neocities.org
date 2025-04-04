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
    }

    create ()
    {
        const loader = this
        loader.data = {}
        // TESTING
        this.scene.launch("world_canterfarm", loader.data)
                  .launch("common_ui", loader.data)
                  .remove();
    }
}