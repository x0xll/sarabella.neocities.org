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

    }

    create ()
    {
        // TESTING
        this.scene.launch("world_canterfarm")
                  .launch("common_ui")
                  .remove();
    }
}