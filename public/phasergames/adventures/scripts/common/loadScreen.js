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
        this.scene.launch("world_canterfarm", loader.data);

        // Add a delay to make sure the ui is setup after the world loads to prevent null refs
        this.time.delayedCall(5, () => {
            this.scene.launch("common_ui", loader.data)
                      .remove();
        }, [], this); 
    }
}