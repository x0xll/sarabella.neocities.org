// TODO : Need to handle the loading
// At startup and between scenes

class Common_Load extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'common_load' });
    }

    init (sharedData) {
        // Used to preload certain data for the zone
        this.sharedData = sharedData
        if (this.sharedData.worldToLoad === undefined) {
            this.sharedData.worldToLoad = "Z001"
        }
    }

    preload ()
    {
        loadLoadingUI(this);
        this.questManager = new QuestManager(this);
        this.templateManager = new TemplateManager(this);
        this.inventory = new InventoryManager(this);
        this.zoneManager = new ZoneManager(this);

        this.load.json("Zones", `${ZONE_XML_PATH}zoneConfig.json`);
        this.load.xml(this.sharedData.worldToLoad, `${ZONE_XML_PATH}${this.sharedData.worldToLoad}.xml`);
        this.load.json("QuestConfig", `${COMMON_XML_PATH}questConfig.json`);
    }

    create (sharedData)
    {
        const loader = this
        loader.sharedData = sharedData


        if (loader.sharedData.zoneData === undefined) {
            loader.sharedData.zoneData = this.cache.json.get("Zones")
        }
        loader.sharedData.global = {
            ZONE_ID: sharedData.zoneData[sharedData.worldToLoad].ID
        }
        loader.sharedData.zoneTileData = this.cache.xml.get(loader.sharedData.worldToLoad)

        if (loader.sharedData.collectableData === undefined) {
            loader.sharedData.collectableData = this.cache.json.get("Collectables")
        }

        // Load quest data
        if (loader.sharedData.questConfig === undefined) {
            loader.sharedData.questConfig = this.cache.json.get("QuestConfig")
        }
        if (loader.sharedData.questManager === undefined) {
            loader.sharedData.questManager = loader.questManager
            loader.sharedData.questManager.initializeQuestData();
        }
        this.templateManager.create()

        if (loader.sharedData.zoneManager === undefined){
            loader.sharedData.zoneManager = loader.zoneManager;
            loader.sharedData.zoneManager.initializeData();
        }

        // TESTING
        this.scene.launch("common_ui", loader.sharedData)
                    .stop();


        this.scene.stop("common_zone")
        this.scene.launch("common_zone", loader.sharedData);
    }
}
