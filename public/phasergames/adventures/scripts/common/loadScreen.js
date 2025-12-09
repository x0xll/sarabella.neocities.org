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
            this.sharedData.worldToLoad = "R050"
        }
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
        this.load.xml(this.sharedData.worldToLoad, `${ZONE_XML_PATH}${this.sharedData.worldToLoad}.xml`);
    }

    create (sharedData)
    {
        const loader = this
        loader.sharedData = sharedData

        if (loader.sharedData.zoneData === undefined) {
            loader.sharedData.zoneData = this.cache.json.get("Zones")
        }
        loader.sharedData.zoneTileData = this.cache.xml.get(loader.sharedData.worldToLoad)

        if (loader.sharedData.collectableData === undefined) {
            loader.sharedData.collectableData = this.cache.json.get("Collectables")
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
        this.scene.launch("common_zone", loader.sharedData);
    }
}