/* General - WS Calls */
const INSPIRATIONS = [
    "Test inspiration",
    "Another test"
]

/**
 * Replace getInspiration(string locale) call
 * @returns an object with the inspiration informations (string localizedInspiration)
 */
function getInspiration()
{
    // TODO: Handle depending on loca
    let InspirationValue = {
        result: {
            string: INSPIRATIONS[Math.random() * INSPIRATIONS.length]
        }
    }

    console.log("InspirationValue: " + InspirationValue.result.string);

    return InspirationValue;
}

/* Marvelous Magic Mathc - WS Calls */
/**
 * Replace InitMagicMatch(string tokenHigh, string tokenLow, string locale) call
 * @returns an object with the prizes informations (string swfName, int objectId, string rarity [0 = common, 1 = uncommon, 2 = rare], string name)
 */
function initMagicMatch()
{
    let InitMagicMatchReturnValues = { result : {played: "No", MMDigitalObjects: []}};

    let possibleElements = [
        {swf: "MM-PLSH-01", name: "blazonedleonis", rarity: "0"},
        {swf: "MM-PLSH-07", name: "bubbleturtle", rarity: "0"},
        {swf: "MM-PLSH-19", name: "cunningflitkit", rarity: "1"},
        {swf: "MM-PLSH-21", name: "fairyphant", rarity: "1"},
        //{swf: "MM-PLSH-", name: "flapuppy", rarity: "0"},
        {swf: "MM-PLSH-10", name: "fringednewt", rarity: "2"},
        {swf: "MM-PLSH-15", name: "gemdiggerdog", rarity: "1"},
        //{swf: "MM-PLSH-", name: "grasspoolotter", rarity: "0"},
        {swf: "MM-PLSH-17", name: "nebulaphim", rarity: "1"},
        {swf: "MM-PLSH-20", name: "neonfrog", rarity: "1"},
        {swf: "MM-PLSH-12", name: "pipsqueaklongtail", rarity: "2"},
        {swf: "MM-PLSH-13", name: "quixiefaun", rarity: "2"},
        //{swf: "MM-PLSH-", name: "sealky", rarity: "0"},
        //{swf: "MM-PLSH-", name: "sparkturtle", rarity: "0"},
        {swf: "MM-PLSH-08", name: "starstoneotter", rarity: "2"},
        {swf: "MM-PLSH-03", name: "suncat", rarity: "0"},
        {swf: "MM-PLSH-16", name: "sweetpeareindeer", rarity: "1"},
        //{swf: "MM-PLSH-", name: "tasselmouse", rarity: "0"},
        {swf: "MM-PLSH-02", name: "tealeafpanda", rarity: "0"},
        {swf: "MM-PLSH-09", name: "twinkleimp", rarity: "2"},
        {swf: "MM-PLSH-04", name: "violetpixie", rarity: "0"},
    ]

    for (let i = 0; i < 3; i++)
    {
        let randPrize = Math.floor(Math.random() * possibleElements.length);
        let prizeData = possibleElements[randPrize];
        possibleElements.splice(randPrize, 1);
        let objID = i + 1;

        InitMagicMatchReturnValues.result.MMDigitalObjects.push(
            {
                swf: prizeData.swf,
                rarity: prizeData.rarity,
                objectID: objID,
                name: getLocalizedText(prizeData.name, "mmprize")
            }
        )
    }

    console.log(InitMagicMatchReturnValues);

    return InitMagicMatchReturnValues;
}

/* Wheel of Wonders - WS Calls */
/**
 * Replace InitWheel(string tokenHigh, string tokenLow, string locale) call
 * @returns an object with the prizes informations (string swfName, int bgColor, int objectID, string localizedName)
 */
function initWheel()
{
    let InitWheelReturnValues = { result : {DigitalObjects : [], FreeSpins: 1, Seed: 1}};

    // TODO: Get correct color values
    let possibleElements = [
        {swf: "WOW_Charm_Bella_Gold", name: "bellagold", color: 15329238},
        {swf: "WOW_Charm_FlyingHorse_Purple", name: "flyingpurple", color: 15329238},
        {swf: "WOW_Charm_Icon_Flower_Orange", name: "flowerorange", color: 15329238},
        {swf: "WOW_Charm_Icon_Heart_Gold", name: "heartgold", color: 15329238},
        {swf: "WOW_Charm_Icon_Horseshoe_Silver", name: "horseshoesilver", color: 15329238},
        {swf: "WOW_Charm_Icon_Moon_Blue", name: "moonblue", color: 15329238},
        {swf: "WOW_Charm_Logo_Silver", name: "logosilver", color: 15329238},
        {swf: "WOW_Charm_RunningHorse_pink", name: "runningpink", color: 15329238},
        {swf: "WOW_Charm_StandingHorse_Green", name: "standinggreen", color: 15329238},
        {swf: "WOW_Charm_WaterHorse_Teal", name: "waterteal", color: 15329238}
    ]

    for (let i = 0; i < 10; i++)
    {
        let randPrize = Math.floor(Math.random() * possibleElements.length);
        let prizeData = possibleElements[randPrize];
        possibleElements.splice(randPrize, 1);
        let objID = i;

        InitWheelReturnValues.result.DigitalObjects.push(
            {
                swf: prizeData.swf + ".swf",
                color: prizeData.color,
                objectID: objID,
                name: getLocalizedText(prizeData.name, "wowprize")
            }
        )
    }

    console.log(InitWheelReturnValues);

    return InitWheelReturnValues;
}

/**
 * Replace SpinWheel(string tokenHigh, string tokenLow, string seed, string local) call
 * @returns an object with the spin information (int: prize index -> -1 = free spin, -2 = inspiration, 0-9 = charms)
 */
function spinWheel()
{
    let specialPrize = Math.floor(Math.random() * 2);

    let SpinValue = {
        result: {
            int: (specialPrize == 0) ? Math.floor(Math.random() * 9) : specialPrize * -1
        }
    }

    console.log("SpinValue: " + SpinValue.result.int);

    return SpinValue;
}

/* Items - WS Calls*/
/**
 * Replace getCategories(string locale, string uid) call
 * @returns an object with the category informations (used in My Things, Cottage, Bazaar, etc.)
 */
function getCategories()
{
    const CATEGORIES_ID = [
        "art",
        "furniture",
        "flooring",
        "toys",
        "wallhanging",
        "homedecor",
        "holiday",
        "knickknack",
        "curios",
        "jewelry"
    ]

    let CategoriesValues = {result: { categories:[]}}

    for (let i = 0; i < 10; i++)
    {
        let index = i + 1;

        CategoriesValues.result.categories.push({
            name: getLocalizedText(CATEGORIES_ID[i], "categoriesItems"),
            catid: index
        })
    }

    console.log(CategoriesValues);

    return CategoriesValues;
}

/**
 * Replace getAllThings() call
 * @returns an object with the things informations (used in My Things, Cottage, Bazaar, etc.)
 */
function getAllThings()
{
    const ITEMS = [
        {
            itid: 10001,
            name: "Bird", 
            price1: 25,
            description: "Cat Description",
            catid: 1,
            thumb: "/flash/gallery/data/items/bird/",
            swf: "/flash/gallery/data/items/bird/bird.swf"
        }
    ]

    let ThingsValue = {result: { items:[]}}

    for (let i = 0; i < ITEMS.length; i++)
    {
        ThingsValue.result.items.push(ITEMS[i])
    }

    console.log(ThingsValue);

    return ThingsValue;
}

/**
 * Replace getThingsInRoom() call
 * @returns an object with the things present in a room informations (used in My Things, Cottage, Bazaar, etc.)
 */
function getAllThings()
{
    const ITEMS = [
        {
            itid: 10001,
            name: "Bird", 
            price1: 25,
            description: "Cat Description",
            catid: 1,
            thumb: "/flash/gallery/data/items/bird/",
            swf: "/flash/gallery/data/items/bird/bird.swf"
        }
    ]

    let ThingsValue = {result: { items:[]}}

    for (let i = 0; i < ITEMS.length; i++)
    {
        ThingsValue.result.items.push(ITEMS[i])
    }

    console.log(ThingsValue);

    return ThingsValue;
}


/* Extract helper from .swf
var _categoriesSampleXml = "<categories><category name=\"Art\" catid=\"1\" /><category name=\"Furniture\" catid=\"2\" /><category name=\"Flooring\" catid=\"3\" /><category name=\"Toys\" catid=\"4\" /><category name=\"Wall Hangings\" catid=\"5\" /><category name=\"Home Decor\" catid=\"6\" /><category name=\"Holiday\" catid=\"7\" /><category name=\"Knick-Knacks\" catid=\"8\" /><category name=\"Curios\" catid=\"9\" /><category name=\"Jewelry\" catid=\"10\" /></categories>";
   var _allThingsSampleXml = "<items><item itid=\"10001\" name=\"Bird\" price1=\"25\" description=\"Bird Description\" catid=\"1\" thumb=\"path\" swf=\"../things/bird.swf\" /><item itid=\"10002\" name=\"Cat\" price1=\"26\" description=\"Cat Description\" catid=\"1\" thumb=\"path\" swf=\"../things/cat.swf\" /><item itid=\"10003\" name=\"Chair\" price1=\"27\" description=\"Stuffed Description\" catid=\"1\" thumb=\"path\" swf=\"../things/chair.swf\" /><item itid=\"10004\" name=\"Chandelier\" price1=\"28\" description=\"Chandelier Description\" catid=\"2\" thumb=\"path\" swf=\"../things/chandelier.swf\" /><item itid=\"10005\" name=\"Crystals\" price1=\"29\" description=\"Crystals Description\" catid=\"1\" thumb=\"path\" swf=\"../things/crystals.swf\" /><item itid=\"10006\" name=\"Feathers\" price1=\"30\" description=\"Feathers Description\" catid=\"1\" thumb=\"path\" swf=\"../things/feathers.swf\" /><item itid=\"10007\" name=\"Glass Sculpture\" price1=\"31\" description=\"Glass Sculpture Description\" catid=\"2\" thumb=\"path\" swf=\"../things/glass_sculpture.swf\" /><item itid=\"10008\" name=\"Harp\" price1=\"32\" description=\"Harp Description\" catid=\"1\" thumb=\"path\" swf=\"../things/harp.swf\" /><item itid=\"10009\" name=\"Jelly Beans\" price1=\"33\" description=\"Jelly Beans Description\" catid=\"1\" thumb=\"path\" swf=\"../things/jellybeans.swf\" /><item itid=\"10010\" name=\"Orchid\" price1=\"25\" description=\"Orchid Description\" catid=\"1\" thumb=\"path\" swf=\"../things/orchid.swf\" /><item itid=\"10011\" name=\"Ribbon1\" price1=\"26\" description=\"Ribbon1 Description\" catid=\"1\" thumb=\"path\" swf=\"../things/ribbon1.swf\" /><item itid=\"10012\" name=\"Ribbon2\" price1=\"27\" description=\"Ribbon2 Description\" catid=\"1\" thumb=\"path\" swf=\"../things/ribbon2.swf\" /><item itid=\"10013\" name=\"Ribbon3\" price1=\"28\" description=\"Ribbon3 Description\" catid=\"1\" thumb=\"path\" swf=\"../things/ribbon3.swf\" /><item itid=\"10014\" name=\"Rug\" price1=\"29\" description=\"Rug Description\" catid=\"2\" thumb=\"path\" swf=\"../things/rug.swf\" /><item itid=\"10015\" name=\"Table\" price1=\"250\" description=\"Table Description\" catid=\"1\" thumb=\"path\" swf=\"../things/table.swf\" /><item itid=\"10016\" name=\"Tree\" price1=\"41\" description=\"Tree Description\" catid=\"1\" thumb=\"path\" swf=\"../things/tree.swf\" /><item itid=\"10017\" name=\"Trophy1\" price1=\"42\" description=\"Trophy1 Description\" catid=\"1\" thumb=\"path\" swf=\"../things/trophy1.swf\" /><item itid=\"10018\" name=\"Trophy2\" price1=\"43\" description=\"Trophy2 Description\" catid=\"1\" thumb=\"path\" swf=\"../things/trophy2.swf\" /><item itid=\"10019\" name=\"Feathers2\" price1=\"30\" description=\"Feathers2 Description\" catid=\"1\" thumb=\"path\" swf=\"../things/feathers.swf\" /></items>";
   var _thingsSampleXml = "<items><item iid=\"101\" itid=\"10001\" rid=\"1\" x=\"0\" y=\"0\" z=\"1001\" s=\"100\" a=\"1\" /><item iid=\"102\" itid=\"10002\" rid=\"1\" x=\"0\" y=\"0\" z=\"1002\" s=\"100\" a=\"1\" /><item iid=\"103\" itid=\"10003\" rid=\"1\" x=\"0\" y=\"0\" z=\"1003\" s=\"100\" a=\"1\" /><item iid=\"104\" itid=\"10004\" rid=\"1\" x=\"0\" y=\"0\" z=\"1004\" s=\"100\" a=\"1\" /><item iid=\"105\" itid=\"10005\" rid=\"1\" x=\"0\" y=\"0\" z=\"1005\" s=\"100\" a=\"1\" /><item iid=\"106\" itid=\"10006\" rid=\"1\" x=\"0\" y=\"0\" z=\"1006\" s=\"100\" a=\"1\" /><item iid=\"107\" itid=\"10007\" rid=\"1\" x=\"0\" y=\"0\" z=\"1007\" s=\"100\" a=\"1\" /><item iid=\"108\" itid=\"10008\" rid=\"1\" x=\"0\" y=\"0\" z=\"1008\" s=\"100\" a=\"1\" /><item iid=\"109\" itid=\"10009\" rid=\"1\" x=\"0\" y=\"0\" z=\"1009\" s=\"100\" a=\"1\" /><item iid=\"110\" itid=\"10010\" rid=\"1\" x=\"0\" y=\"0\" z=\"1010\" s=\"100\" a=\"1\" /><item iid=\"111\" itid=\"10011\" rid=\"1\" x=\"0\" y=\"0\" z=\"1011\" s=\"100\" a=\"1\" /><item iid=\"112\" itid=\"10012\" rid=\"1\" x=\"0\" y=\"0\" z=\"1012\" s=\"100\" a=\"1\" /><item iid=\"113\" itid=\"10013\" rid=\"1\" x=\"0\" y=\"0\" z=\"1013\" s=\"100\" a=\"1\" /><item iid=\"114\" itid=\"10014\" rid=\"1\" x=\"0\" y=\"0\" z=\"1014\" s=\"100\" a=\"1\" /><item iid=\"115\" itid=\"10015\" rid=\"1\" x=\"0\" y=\"0\" z=\"1015\" s=\"100\" a=\"1\" /><item iid=\"116\" itid=\"10016\" rid=\"1\" x=\"0\" y=\"0\" z=\"1016\" s=\"100\" a=\"1\" /><item iid=\"117\" itid=\"10017\" rid=\"1\" x=\"0\" y=\"0\" z=\"1017\" s=\"100\" a=\"1\" /><item iid=\"118\" itid=\"10018\" rid=\"1\" x=\"0\" y=\"0\" z=\"1018\" s=\"100\" a=\"1\" /></items>";
   var _visitorThingsSampleXml = "<items><item iid=\"101\" itid=\"10001\" rid=\"3\" x=\"10\" y=\"20\" z=\"1001\" s=\"100\" a=\"1\" /><item iid=\"102\" itid=\"10002\" rid=\"3\" x=\"40\" y=\"100\" z=\"1002\" s=\"100\" a=\"1\" /><item iid=\"103\" itid=\"10003\" rid=\"3\" x=\"200\" y=\"200\" z=\"1003\" s=\"100\" a=\"1\" /><item iid=\"104\" itid=\"10004\" rid=\"3\" x=\"300\" y=\"300\" z=\"1004\" s=\"100\" a=\"1\" /><item iid=\"105\" itid=\"10005\" rid=\"3\" x=\"100\" y=\"327\" z=\"1005\" s=\"100\" a=\"1\" /><item iid=\"106\" itid=\"10006\" rid=\"3\" x=\"50\" y=\"221\" z=\"1006\" s=\"100\" a=\"1\" /><item iid=\"107\" itid=\"10007\" rid=\"6\" x=\"400\" y=\"30\" z=\"1007\" s=\"100\" a=\"1\" /><item iid=\"108\" itid=\"10008\" rid=\"6\" x=\"500\" y=\"300\" z=\"1008\" s=\"100\" a=\"1\" /><item iid=\"109\" itid=\"10009\" rid=\"6\" x=\"56\" y=\"126\" z=\"1009\" s=\"100\" a=\"1\" /><item iid=\"110\" itid=\"10010\" rid=\"6\" x=\"150\" y=\"80\" z=\"1010\" s=\"100\" a=\"1\" /><item iid=\"111\" itid=\"10011\" rid=\"6\" x=\"250\" y=\"400\" z=\"1011\" s=\"100\" a=\"1\" /><item iid=\"112\" itid=\"10012\" rid=\"6\" x=\"300\" y=\"240\" z=\"1012\" s=\"100\" a=\"1\" /><item iid=\"113\" itid=\"10013\" rid=\"3\" x=\"290\" y=\"200\" z=\"1013\" s=\"100\" a=\"1\" /><item iid=\"114\" itid=\"10014\" rid=\"3\" x=\"250\" y=\"140\" z=\"1014\" s=\"100\" a=\"1\" /><item iid=\"115\" itid=\"10015\" rid=\"3\" x=\"100\" y=\"130\" z=\"1015\" s=\"100\" a=\"1\" /><item iid=\"116\" itid=\"10016\" rid=\"6\" x=\"140\" y=\"29\" z=\"1016\" s=\"100\" a=\"1\" /><item iid=\"117\" itid=\"10017\" rid=\"3\" x=\"140\" y=\"350\" z=\"1017\" s=\"100\" a=\"1\" /><item iid=\"118\" itid=\"10018\" rid=\"6\" x=\"360\" y=\"370\" z=\"1018\" s=\"100\" a=\"1\" /></items>";
   var _cottageInfoSampleXml = "<cottage open=\"1\"><room rid=\"2\" w=\"1\" f=\"1\" ld=\"1\" rd=\"1\" /><room rid=\"3\" w=\"1\" f=\"1\"  /><room rid=\"4\" w=\"1\" f=\"1\" /><room rid=\"5\" w=\"1\" f=\"1\" /><room rid=\"6\" w=\"1\" f=\"1\" /><room rid=\"7\" w=\"1\" f=\"1\" /></cottage>";
   var _visitorCottageSampleXml = "<cottage><room rid=\"2\" w=\"1\" f=\"1\" ld=\"1\" rd=\"1\" /><room rid=\"3\" w=\"1\" f=\"1\"  /><room rid=\"4\" w=\"1\" f=\"1\" /><room rid=\"5\" w=\"1\" f=\"1\" /><room rid=\"6\" w=\"1\" f=\"1\" /><room rid=\"7\" w=\"1\" f=\"1\" /></cottage>";
   var _purchaseSampleXml = "<bazaarpurchase><item purchased=\"yes\" currency1=\"50000\" /></bazaarpurchase>";
   var _balanceSampleXml = "<balance><user currency1=\"51000\" /></balance>";
   var _messagesSampleXml = "<messages><message mid=\"77\" sid=\"idHiddenCity\" siid=\"1\" sn=\"Bella Sara\" v=\"0\" t=\"Bazaar Sale\" r=\"0\" d=\"1194999817982\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\" /><message mid=\"78\" sid=\"idUser341341\" siid=\"1\" sn=\"Bella Sara\" v=\"1\" t=\"From a Cottage Visitor\" r=\"0\" d=\"1194999817982\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\" /><message mid=\"79\" sid=\"idHiddenCity\" siid=\"1\" sn=\"Bella Sara\" v=\"0\" t=\"This Week\" r=\"1\" d=\"1194999817982\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\" /><message mid=\"80\" sid=\"idUser839181\" siid=\"1\" sn=\"Bella Sara\" v=\"1\" t=\"From a Cottage Visitor\" r=\"1\" d=\"1194999817982\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\" /><message mid=\"83\" sid=\"idHiddenCity\" siid=\"1\" sn=\"Bella Sara\" v=\"0\" t=\"Hurry!\" r=\"1\" d=\"1194999817982\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\" /><message mid=\"84\" sid=\"idHiddenCity\" siid=\"1\" sn=\"Bella Sara\" v=\"0\" t=\"Important Notice\" r=\"1\" d=\"1194999817982\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\" /><message mid=\"85\" sid=\"idHiddenCity\" siid=\"1\" sn=\"Bella Sara\" v=\"0\" t=\"Do Not Forget\" r=\"1\" d=\"1194999817982\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\" /></messages>";
   var _messageBodySampleXml = "<message mid=\"1\"><body>Sale Now on Magic Doors!</body><link url=\"bazaarPage\">Go To Bazaar</link></message>";
   var _commentsSampleXml = "<messages><message mid=\"78\" siid=\"1\" b=\"Wonderful decorating!\" d=\"1194999817982\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\" /><message mid=\"80\" siid=\"2\" b=\"Incredible place!\" d=\"1194999817982\" n=\"Quintin\" m=\"Think positive every day! Feel the bliss of joy and energy that comes with it.\" /></messages>";
   var _cannedCommentsSampleXml = "<messages><message cmid=\"1001\" b=\"Wonderful decorating!\" /><message cmid=\"1002\" b=\"Incredible place!\" /><message cmid=\"1003\" b=\"Beautiful cottage!\" /><message cmid=\"1004\" b=\"Love it!\" /><message cmid=\"1005\" b=\"Way to decorate!\" /><message cmid=\"1006\" b=\"A+!\" /><message cmid=\"1007\" b=\"Awesome!\" /><message cmid=\"1008\" b=\"Nice pad!\" /><message cmid=\"1009\" b=\"Very unique!\" /><message cmid=\"1010\" b=\"Great design!\" /><message cmid=\"1011\" b=\"Very cool!\" /></messages>";
   var _signatureSampleXml = "<signature cid=\"0\" />";
   var _albumsSampleXml = "<albums><album collId = \"0\" c=\"2\" t=\"1\" n=\"My Album\" /></albums>";
   var _dreamriderGallerySampleXml = "<gallery><creation siid=\"1\" sn=\"Caper\" sm=\"Find love by making someone else\'s day brighter.\" MyTitle=\"Sample 1\" HitObjects=\"248.6,265.75,14;;;331.45,302.85,15;;;105.7,254.3,4;;;391.45,345.75,4;;;\" LineObjects = \"1$3$false$1074.3$1040.05$;;;1$1$false$-17.15$268.6$-17.15,268.6!-17.15,268.6!-14.3,268.6!0,268.6!;;;1$1$false$0$268.6$22.85,268.6!48.6,268.6!71.45,268.6!88.6,268.6!;;;1$1$false$88.6$268.6$105.7,268.6!122.85,268.6!148.6,268.6!177.15,268.6!;;;1$1$false$177.15$268.6$200,274.3!220,277.15!240,282.85!260,288.6!;;;1$1$false$260$288.6$280,297.15!294.3,305.75!311.45,314.3!331.45,325.75!;;;1$1$false$331.45$325.75$348.6,337.15!368.6,342.85!394.3,357.15!425.75,368.6!;;;1$1$false$425.75$368.6$457.15,382.85!482.9,394.3!520,402.85!571.45,417.15!;;;1$1$false$571.45$417.15$611.45,431.45!645.75,440!668.6,445.75!697.15,451.45!;;;1$1$false$697.15$451.45$720,457.15!740,460!751.45,468.6!765.75,480!;;;1$1$false$765.75$480$788.6,494.3!808.6,502.9!831.45,505.75!854.3,508.6!;;;1$1$false$854.3$508.6$888.6,508.6!917.15,500!937.15,488.6!951.45,482.85!;;;1$1$false$951.45$482.85$962.9,482.85!980.05,482.85!1005.75,482.85!1034.3,482.85!;;;1$1$false$1034.3$482.85$1060.05,482.85!1088.6,482.85!1105.75,482.85!1117.2,482.85!;;;1$1$false$1117.2$482.85$1125.75,485.75!1145.75,485.75!1162.9,485.75!;;;1$1$false$1162.9$485.75$1185.75,485.75!1205.75,485.75!1220.05,485.75!1234.3,485.75!;;;1$1$false$1234.3$485.75$1251.45,491.45!1271.45,491.45!1285.75,497.15!1300.05,497.15!;;;1$1$false$1300.05$497.15$1311.45,500!1322.9,500!1322.9,500!;;;1$1$false$1654.35$1068.6$;;;\" Stickers = \"1262.9,794.7,4;;;151.45,250.65,5;;;208.6,253.5,5;;;537.15,384.5,5;;;\" /><creation siid=\"4\" sn=\"Striker\" sm=\"Find joy by sharing fun times with good friends.\" MyTitle=\"Sample 2\" HitObjects=\"165.7,265.75,7;;;242.85,331.45,5;;;\" LineObjects=\"1$3$false$-5.7$268.6$-5.7,268.6!-5.7,268.6!-5.7,268.6!-2.85,268.6!;;;1$3$false$-2.85$268.6$0,268.6!8.6,268.6!17.15,268.6!31.45,268.6!;;;1$3$false$31.45$268.6$48.6,268.6!68.6,268.6!88.6,271.45!117.15,280!;;;1$3$false$117.15$280$137.15,285.75!154.3,291.45!171.45,300!;;;1$3$false$171.45$300$185.7,308.6!208.6,322.85!228.6,337.15!;;;1$3$false$228.6$337.15$245.75,348.6!265.75,362.85!282.85,374.3!308.6,391.45!;;;1$3$false$308.6$391.45$325.75,400!340,411.45!354.3,420!;;;1$3$false$354.3$420$371.45,428.6!385.75,434.3!405.75,440!;;;1$3$false$405.75$440$420,442.85!434.3,442.85!454.3,445.75!477.15,445.75!;;;1$3$false$477.15$445.75$497.15,445.75!514.3,445.75!542.9,445.75!;;;1$3$false$542.9$445.75$565.75,445.75!597.15,445.75!625.75,445.75!;;;1$3$false$625.75$445.75$651.45,445.75!677.15,445.75!702.9,445.75!731.45,445.75!;;;1$3$false$731.45$445.75$751.45,445.75!771.45,445.75!794.3,451.45!;;;1$3$false$794.3$451.45$814.3,460!834.3,462.85!842.9,462.85!;;;1$3$false$842.9$462.85$845.75,462.85!845.75,462.85!;;;1$3$false$1057.2$982.9$;;;1$1$false$817.15$568.6$817.15,568.6!817.15,565.75!825.75,560!848.6,548.6!;;;1$1$false$848.6$548.6$885.75,537.15!931.45,522.9!991.45,502.9!1057.2,485.75!;;;1$1$false$1057.2$485.75$1111.45,462.85!1162.9,440!1225.75,408.6!;;;1$1$false$1225.75$408.6$1280.05,374.3!1340.05,337.15!1397.2,308.6!1460.05,282.85!;;;1$1$false$1460.05$282.85$1525.75,268.6!1585.75,260!1642.9,260!1688.6,260!;;;1$1$false$1688.6$260$1717.2,260!1728.6,260!1731.5,262.85!1731.5,262.85!;;;1$1$false$1731.5$262.85$1731.5,262.85!1731.5,262.85!1731.5,262.85!;;;1$1$false$1271.45$1008.6$;;;1$1$false$637.15$-8.55$637.15,-8.55!640,-2.85!640,22.85!640,45.7!;;;1$1$false$640$45.7$640,68.6!642.9,82.85!645.75,97.15!645.75,97.15!;;;1$1$false$645.75$97.15$;;;1$1$false$668.6$-2.85$668.6,-2.85!668.6,11.45!668.6,28.6!668.6,42.85!;;;1$1$false$668.6$42.85$674.3,54.3!677.15,62.85!680,71.45!680,74.3!;;;1$1$false$680$74.3$680,74.3!;;;1$1$false$614.3$31.45$614.3,31.45!637.15,31.45!677.15,31.45!708.6,31.45!;;;1$1$false$708.6$31.45$717.15,31.45!717.15,31.45!717.15,31.45!717.15,31.45!;;;1$1$false$717.15$31.45$;;;1$1$false$622.9$57.15$622.9,57.15!637.15,57.15!660,54.3!674.3,51.45!;;;1$1$false$674.3$51.45$677.15,48.6!677.15,48.6!677.15,48.6!682.9,48.6!;;;1$1$false$682.9$48.6$694.3,48.6!;;;1$1$false$760.05$51.45$760.05,51.45!760.05,48.6!771.45,37.15!802.9,17.15!;;;1$1$false$802.9$17.15$825.75,2.85!834.3,0!834.3,0!834.3,0!;;;1$1$false$834.3$0$837.15,11.45!840.05,34.3!840.05,62.85!840.05,82.85!;;;1$1$false$840.05$82.85$840.05,102.85!840.05,111.45!840.05,111.45!840.05,111.45!;;;1$1$false$840.05$111.45$840.05,111.45!;;;1$1$false$788.6$125.7$791.45,122.85!814.3,114.3!851.45,108.6!880.05,102.85!;;;1$1$false$880.05$102.85$891.45,102.85!891.45,102.85!891.45,102.85!891.45,102.85!;;;1$1$false$891.45$102.85$891.45,102.85!891.45,102.85!;;;1$1$false$1480.05$991.45$;;;\" /></gallery>";
   var _dreamriderCreationsSampleXml = "<creations><creation MyTitle = \"Sample 1\" HitObjects=\"\" LineObjects=\"\" Stickers=\"\" + SubmissionID=\"1\"/></creations>";
   var _artStudioGallerySampleXml = "<paintings></paintings>";
   var _beautyBoxGallerySampleXml = "<beautyBoxes><beautyBox cid = \"194\" b=\"3\" s=\"2,0,419,241,1,1,0,180,81,3,2,1,87,114,4,2,5,472,371,3,2,4,294,371,3,1,1,204,135,3,1,4,340,109,1,2,1,624,287,4,2,2,132,263,4,1,3,187,151,3,1,5,594,113,1,1,6,448,140,1,1,2,667,169,4\"/></beautyBoxes>";
   var _beautyBoxSampleXml = "<beautyBox siid=\"2\" sn = \"Kate\" sm=\"Find love by making someone else\'s day brighter.\" n=\"Ingrid\" cid=\"108\" m=\"Find love by making someone else\'s day brighter.\" b=\"3\" s=\"2,0,419,241,1,1,0,180,81,3,2,1,87,114,4,2,5,472,371,3,2,4,294,371,3,1,1,204,135,3,1,4,340,109,1,2,1,624,287,4,2,2,132,263,4,1,3,187,151,3,1,5,594,113,1,1,6,448,140,1,1,2,667,169,4\"/>";
   var _masterCardCollectionSampleXml = "<cards><card cid=\"139\" t=\"1\" hid=\"1107\" n=\"Ano\" siid=\"4\" path=\"../images/cards/en-us/red.jpg\" m=\"Find joy by sharing fun times with good friends.\" /><card cid=\"159\" t=\"3\" hid=\"152\" n=\"Bella\" siid=\"2\" path=\"../images/cards/en-us/blue.jpg\" m=\"Think positive every day! Feel the bliss of joy and energy that comes with it.\" /><card cid=\"144\" t=\"1\" hid=\"1107\" n=\"Caper\" siid=\"1\" path=\"../images/cards/en-us/green.jpg\" m=\"Find love by making someone else\'s day brighter.\" /><card cid=\"107\" t=\"4\" hid=\"1107\" n=\"Diedra\" siid=\"4\" path=\"../images/cards/en-us/red.jpg\" m=\"Find joy by sharing fun times with good friends.\" /><card cid=\"111\" t=\"2\" hid=\"128\" n=\"Edward\" siid=\"2\" path=\"../images/cards/en-us/blue.jpg\" m=\"Think positive every day! Feel the bliss of joy and energy that comes with it.\" /><card cid=\"21\" t=\"1\" hid=\"1107\" n=\"Francesca\" siid=\"1\" path=\"../images/cards/en-us/green.jpg\" m=\"Find love by making someone else\'s day brighter.\" /><card cid=\"80a\" t=\"5\" hid=\"1107\" n=\"Grace\" siid=\"4\" path=\"../images/cards/en-us/red.jpg\" m=\"Find joy by sharing fun times with good friends.\" /><card cid=\"03\" t=\"1\" hid=\"1107\" n=\"Howard\" siid=\"2\" path=\"../images/cards/en-us/blue.jpg\" m=\"Think positive every day! Feel the bliss of joy and energy that comes with it.\" /><card cid=\"194\" t=\"2\" hid=\"128\" n=\"Ingrid\" siid=\"1\" path=\"../images/cards/en-us/green.jpg\" m=\"Find love by making someone else\'s day brighter.\" /><card cid=\"14\" t=\"1\" hid=\"1107\" n=\"Jack\" siid=\"4\" path=\"../images/cards/en-us/red.jpg\" m=\"Find joy by sharing fun times with good friends.\" /><card cid=\"12\" t=\"4\" hid=\"1107\" n=\"Kate\" siid=\"2\" path=\"../images/cards/en-us/blue.jpg\" m=\"Think positive every day! Feel the bliss of joy and energy that comes with it.\" /><card cid=\"90b\" t=\"2\" hid=\"128\" n=\"Lock Keeper\" siid=\"1\" path=\"../images/cards/en-us/green.jpg\" m=\"Find love by making someone else\'s day brighter.\" /><card cid=\"99\" t=\"1\" hid=\"1107\" n=\"Mildred\" siid=\"4\" path=\"../images/cards/en-us/red.jpg\" m=\"Find joy by sharing fun times with good friends.\" /><card cid=\"141\" t=\"1\" hid=\"1107\" n=\"Nautilus\" siid=\"2\" path=\"../images/cards/en-us/blue.jpg\" m=\"Think positive every day! Feel the bliss of joy and energy that comes with it.\" /><card cid=\"199\" t=\"2\" hid=\"128\" n=\"Oliver\" siid=\"1\" path=\"../images/cards/en-us/green.jpg\" m=\"Find love by making someone else\'s day brighter.\" /><card cid=\"57\" t=\"1\" hid=\"1107\" n=\"Pat\" siid=\"4\" path=\"../images/cards/en-us/red.jpg\" m=\"Find joy by sharing fun times with good friends.\" /><card cid=\"182\" t=\"5\" hid=\"1107\" n=\"Quintin\" siid=\"2\" path=\"../images/cards/en-us/blue.jpg\" m=\"Think positive every day! Feel the bliss of joy and energy that comes with it.\" /><card cid=\"266\" t=\"1\" hid=\"1107\" n=\"Rupert\" siid=\"1\" path=\"../images/cards/en-us/green.jpg\" m=\"Find love by making someone else\'s day brighter.\" /><card cid=\"262\" t=\"1\" hid=\"1107\" n=\"Striker\" siid=\"4\" path=\"../images/cards/en-us/red.jpg\" m=\"Find joy by sharing fun times with good friends.\" /><card cid=\"191\" t=\"3\" hid=\"152\" n=\"Tanza\" siid=\"2\" path=\"../images/cards/en-us/blue.jpg\" m=\"Think positive every day! Feel the bliss of joy and energy that comes with it.\" /><card cid=\"255\" t=\"2\" hid=\"128\" n=\"Usal\" siid=\"1\" path=\"../images/cards/en-us/green.jpg\" m=\"Find love by making someone else\'s day brighter.\" /><card cid=\"75\" t=\"1\" hid=\"1107\" n=\"Valiance\" siid=\"4\" path=\"../images/cards/en-us/red.jpg\" m=\"Find joy by sharing fun times with good friends.\" /><card cid=\"28\" t=\"1\" hid=\"1107\" n=\"West Walker\" siid=\"2\" path=\"../images/cards/en-us/blue.jpg\" m=\"Think positive every day! Feel the bliss of joy and energy that comes with it.\" /><card cid=\"33\" t=\"5\" hid=\"1107\" n=\"Xavier\" siid=\"1\" path=\"../images/cards/en-us/green.jpg\" m=\"Find love by making someone else\'s day brighter.\" /><card cid=\"66\" t=\"1\" hid=\"1107\" n=\"Yonder\" siid=\"4\" path=\"../images/cards/en-us/red.jpg\" m=\"Find joy by sharing fun times with good friends.\" /><card cid=\"71\" t=\"2\" hid=\"128\" n=\"Zee\" siid=\"2\" path=\"../images/cards/en-us/blue.jpg\" m=\"Think positive every day! Feel the bliss of joy and energy that comes with it.\" /></cards>";
   var _cardCollectionsSampleXml = "<collections><collection i=\"6\" collId=\"1001\" n=\"New Set 1\" /><collection i=\"7\" collId=\"1002\" n=\"New Set 2\" /><collection i=\"8\" collId=\"1003\" n=\"New Set 3\" /><collection i=\"9\" collId=\"1004\" n=\"New Set 4\" /><collection i=\"10\" collId=\"1005\" n=\"New Set 5\" /><collection i=\"11\" collId=\"1006\" n=\"New Set 6\" /><collection i=\"12\" collId=\"1007\" n=\"New Set 7\" /><collection i=\"13\" collId=\"1008\" n=\"New Set 8\" /><collection i=\"14\" collId=\"1009\" n=\"New Set 9\" /></collections>";
   var _friendsCottagesSampleXml = "<cottages><cottage coid=\"1\" vn=\"Name Label 1\" viid=\"1\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\"/><cottage coid=\"2\" vn=\"Name Label 2\" viid=\"1\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\"/><cottage coid=\"3\" vn=\"Name Label 3\" viid=\"1\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\"/><cottage coid=\"4\" vn=\"Name Label 4\" viid=\"1\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\"/><cottage coid=\"5\" vn=\"Name Label 5\" viid=\"1\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\"/><cottage coid=\"6\" vn=\"Name Label 6\" viid=\"1\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\"/><cottage coid=\"7\" vn=\"Name Label 7\" viid=\"1\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\"/><cottage coid=\"8\" vn=\"Name Label 8\" viid=\"1\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\"/><cottage coid=\"9\" vn=\"Name Label 9\" viid=\"1\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\"/><cottage coid=\"10\" vn=\"Name Label 10\" viid=\"1\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\"/><cottage coid=\"11\" vn=\"Name Label 11\" viid=\"1\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\"/><cottage coid=\"12\" vn=\"Name Label 12\" viid=\"1\" n=\"Ingrid\" m=\"Find love by making someone else\'s day brighter.\"/></cottages>";
   var _wisdomCardSampleXml = "<WisdomCard sfn=\"4\" bcfn=\"3\" siid=\"1\"><Name>Ano</Name><Message>Find joy by sharing fun times with good friends.</Message></WisdomCard>";
 */