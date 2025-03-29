class World_CanterFarm extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'world_canterfarm' });
    }

    preload ()
    {
        // Parse the zone file
        async function loadZoneFromXMLDatas()
        {
            const ZONE_XML_NAME = ZONE_XML_PATH + "Z001.xml";
            var zoneObj = await loadXML(ZONE_XML_NAME);
            var zoneParsed = parseZoneXML(zoneObj);

            // TODO : Load / Place all the visual elements based on the zoneParsed datas
        }
        loadZoneFromXMLDatas();
    }

    create ()
    {
        
    }
}