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
        this.questManager = new QuestManager(this);
        this.templateManager = new TemplateManager(this);
        this.itemDatabase = new ItemDatabase(this);
        this.inventory = new InventoryManager(this);
        this.zoneManager = new ZoneManager(this);

        this.load.json("Zones", `${ZONE_XML_PATH}zoneConfig.json`);
        this.load.json("Collectables", `${COMMON_XML_PATH}collectablesConfig.json`);
    }

    create (sharedData)
    {
        const loader = this
        loader.sharedData = sharedData

        if (loader.sharedData.zoneData === undefined) {
            loader.sharedData.zoneData = this.cache.json.get("Zones")
        }

        if (loader.sharedData.collectableData === undefined) {
            loader.sharedData.collectableData = this.cache.json.get("Collectables")
        }

        if (loader.sharedData.worldToLoad === undefined) {
            loader.sharedData.worldToLoad = "Z001"
        }
        loader.sharedData.global = {
            ZONE_ID: sharedData.zoneData[sharedData.worldToLoad].ID
        }

        // TODO: handle through save data
        loader.sharedData.magicTree =  {
            logic:  {
                level: 0
            }
        }
        loader.sharedData.inventory =  {
            logic: {
                manager: loader.inventory
            }
        }
        loader.itemDatabase.setupDatabase();

        // Load quest data
        if (loader.sharedData.questManager === undefined) {
            loader.sharedData.questManager = loader.questManager
            loader.sharedData.questManager.initializeQuestData();
        }
        if (loader.sharedData.templateManager === undefined) {
            loader.sharedData.templateManager = loader.templateManager
            loader.sharedData.templateManager.initializeData();
        }

        if (loader.sharedData.zoneManager === undefined){
            loader.sharedData.zoneManager = loader.zoneManager;
            loader.sharedData.zoneManager.initializeData();
        }

        // TESTING
        this.scene.launch("common_ui", loader.sharedData)
                    .stop();


        this.scene.stop("common_zone")
        // this.scene.launch(loader.sharedData.worldToLoad, loader.sharedData);
        this.scene.launch("common_zone", loader.sharedData);
    }
}