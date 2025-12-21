// TODO : Need to handle the loading
// At startup and between scenes

class Common_Load extends Phaser.Scene 
{
    ZONES_ARRAY = [
        "R001",
        "R010",
        "R011",
        "R050",
        "Z001",
        "Z002",
        "Z003",
        "Z004",
        "Z005",
        "Z006",
        "Z007",
        "Z008",
        "Z009",
        "Z010",
        "Z011",
        "Z012",
        "Z013",
        "Z015",
        "Z016",
        "Z022",
        "Z023",
        "Z025",
        "Z026",
        "Z027",
        "Z028",
    ]

    constructor ()
    {
        super({ key: 'common_load' });
    }

    init (sharedData) {
        // Used to preload certain data for the zone
        this.sharedData = sharedData

        if (this.sharedData.zoneData === undefined) {
            this.sharedData.zoneData = {}
            this.sharedData.zoneData.ZONES_ARRAY = this.ZONES_ARRAY
        }

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

        this.load.json("ZoneConfig", `${ZONE_XML_PATH}zoneConfig.json`);

        // Loading xml for all zones so we can use it to find entity locations
        this.ZONES_ARRAY.forEach(zone => {
            this.load.xml(`${zone}Tiles`, `${ZONE_XML_PATH}${zone}.xml`);
        });

        this.load.xml("SharedUI", `${UI_XML_PATH}shared.xml`);
        this.load.json("QuestConfig", `${COMMON_XML_PATH}questConfig.json`);
        this.load.json("NPCConfig", `${COMMON_XML_PATH}npcConfig.json`);

        debug.loadScene = this
    }

    create (sharedData)
    {
        const loader = this
        loader.sharedData = sharedData

        loader.sharedData.sharedLocalizationUI = parseSharedXML(this.cache.xml.get("SharedUI"))

        if (loader.sharedData.zoneData.config === undefined) {
            loader.sharedData.zoneData.config = this.cache.json.get("ZoneConfig")
        }
        loader.sharedData.global = {
            ZONE_ID: sharedData.zoneData.config[sharedData.worldToLoad].ID
        }

        if (loader.sharedData.zoneTileData === undefined || loader.sharedData.zoneTileData[loader.sharedData.worldToLoad] === undefined) {
            // Loading xml for all zones so we can use it to find entity locations
            loader.sharedData.zoneTileData = {}
            this.ZONES_ARRAY.forEach(zone => {
                this.sharedData.zoneTileData[zone] = this.cache.xml.get(`${zone}Tiles`)
            });
        }

        // Load NPC base setup
        if (loader.sharedData.npcConfig === undefined) {
            loader.sharedData.npcConfig = this.cache.json.get("NPCConfig");
        }

        // Load quest data
        if (loader.sharedData.questConfig === undefined) {
            loader.sharedData.questConfig = this.cache.json.get("QuestConfig")
        }
        if (loader.sharedData.questManager === undefined) {
            loader.sharedData.questManager = loader.questManager
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

        let triggerInfo = {
            type: "ApplicationStartTrigger"
        }
        this.sharedData.questManager.tryTriggerQuest(this, triggerInfo);
    }
}
