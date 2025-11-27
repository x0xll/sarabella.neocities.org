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
        this.questManager = new QuestManager();
        this.questManager.preloadQuestData(this)
        this.itemDatabase = new ItemDatabase(this);
        this.inventory = new InventoryManager(this);
    }

    create (sharedData)
    {
        const loader = this
        loader.sharedData = sharedData

        if (loader.sharedData.worldToLoad === undefined) {
            loader.sharedData.worldToLoad = "world_canterfarm"
        }

        // TODO: handle through save data
        loader.sharedData.magicTree = 
        {
            logic: 
            {
                level: 0
            }
        }
        loader.sharedData.inventory = 
        {
            logic:
            {
                manager: loader.inventory
            }
        }
        loader.itemDatabase.setupDatabase();

        // Load quest data
        if (loader.sharedData.questManager === undefined) {
            loader.sharedData.questManager = loader.questManager
            loader.sharedData.questManager.initializeQuestData(loader);
        }


        // TESTING
        this.scene.launch("common_ui", loader.sharedData)
                    .stop();

        this.scene.launch(loader.sharedData.worldToLoad, loader.sharedData);
    }
}