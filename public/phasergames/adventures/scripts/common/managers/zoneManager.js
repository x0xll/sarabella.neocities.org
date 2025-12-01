class ZoneManager {
    constructor (phaserScene) {
        this.phaserScene = phaserScene
        this.preloadData()
    }

    /**
     * Preloads the xml files for the zonenames into cache so they can be used later. Should be called from the loadScreen scene
     */
    preloadData() {
        this.phaserScene.load.xml("ZoneNames", `${UI_XML_PATH}ZoneNames.xml`);
    }

    /**
     * Loads and parses the xml files from the cache. Should be called from the loadScreen scene
     */
    initializeData() {
        this.phaserScene.sharedData.zoneNames = parseZoneNameXML(this.phaserScene.cache.xml.get("ZoneNames"))
    }

    getZoneName(zoneID)
    {
        let name = "";

        for (let i = 0; i < this.phaserScene.sharedData.zoneNames.location.length; i++)
        {
            if (this.phaserScene.sharedData.zoneNames.location[i].identifier === zoneID)
            {
                name = this.phaserScene.sharedData.zoneNames.location[i].text;
                break;
            }
        }

        return name;
    }

    getCurrentZoneName()
    {
        return this.getZoneName(this.phaserScene.sharedData.global.ZONE_ID);
    }
}