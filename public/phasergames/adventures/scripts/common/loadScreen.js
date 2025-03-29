nextScreen = false


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
        this.scene.launch("world_canterfarm")
                  .launch("common_ui")
                  .remove();
    }
}