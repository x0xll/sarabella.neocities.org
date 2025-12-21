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
        this.phaserScene.sharedData.zone.data.names = parseZoneNameXML(this.phaserScene.cache.xml.get("ZoneNames"))
    }

    getZoneName(zoneID)
    {
        let name = "";

        for (let i = 0; i < this.phaserScene.sharedData.zone.data.names.location.length; i++)
        {
            if (this.phaserScene.sharedData.zone.data.names.location[i].identifier === zoneID)
            {
                name = this.phaserScene.sharedData.zone.data.names.location[i].text;
                break;
            }
        }

        return name;
    }

    getCurrentZoneName()
    {
        if (this.phaserScene.sharedData.global.currentZone === undefined) return "";
        return this.getZoneName(this.phaserScene.sharedData.global.currentZone);
    }
}