function log(string)
{
    console.log(string);
}
function warn(string)
{
    console.warn(string);
}
function error(string)
{
    console.error(string);
}

/* General - WS Calls */
/**
 * Replace activateCode(string userId, string countryCode, string code) call
 * @returns an object with the activation result (string activateCodeResult)
 */
function activateCode(userId, countryCode, code)
{
    let codeActivation = {
        result: {
            string: "" // TODO: Figure out the value expected here
        }
    }
    return codeActivation;
}

/**
 * Replace activateCodeDebug(string userId, string countryCode, string code) call
 * @returns an object with the activation result (string activateCodeResult)
 */
function activateCodeDebug(userId, countryCode, code)
{
    return activateCode(userId, countryCode, code);
}

/**
 * Replace activateUserGift(string tokenHigh, string tokenLow, string giftID) call
 * @returns an object with the activation result (string activateUserGiftResponse)
 */
function activateUserGift(tokenHigh, tokenLow, giftID)
{
    let userGift = { result: { } }
    return userGift;
}

/**
 * Replace addCurrency(string uid, string currency) call
 * @returns an object with the activation result (xml addCurrencyResponse)
 */
function addCurrency(uid, currency)
{
    let response = {
        result: {
            xml: "" // TODO: Figure out what was send here
        }
    }
    return response;
}


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

    let freespinSaved = loadData(DATA_TYPES.freespin, GAME_ID.WheelofWonders);
    let lastTimePlayed = loadData(DATA_TYPES.lastPlayed, GAME_ID.WheelofWonders);

    let date = new Date();
    let today = date.getDate().toString() + "/" + (date.getMonth() + 1).toString() + "/" + date.getFullYear().toString();
    if (lastTimePlayed === undefined)
        saveData(DATA_TYPES.lastPlayed, today, GAME_ID.WheelofWonders);

    if (freespinSaved <= 0)
    {
        if (today !== lastTimePlayed)
        {
            freespinSaved = 1;
            saveData(DATA_TYPES.freespin, freespinSaved, GAME_ID.WheelofWonders);    
            saveData(DATA_TYPES.lastPlayed, today, GAME_ID.WheelofWonders);
            updateLastDatePlayed(GAME_ID.WheelofWonders);
        }
    }

    InitWheelReturnValues.result.FreeSpins = freespinSaved;

    // TODO: Get correct color values
    let possibleElements = [
        {swf: "WOW_Charm_Bella_Gold", name: "bellagold", color: 10031000},
        {swf: "WOW_Charm_FlyingHorse_Purple", name: "flyingpurple", color: 16764470},
        {swf: "WOW_Charm_Icon_Flower_Orange", name: "flowerorange", color: 39220},
        {swf: "WOW_Charm_Icon_Heart_Gold", name: "heartgold", color: 16725044},
        {swf: "WOW_Charm_Icon_Horseshoe_Silver", name: "horseshoesilver", color: 101},
        {swf: "WOW_Charm_Icon_Moon_Blue", name: "moonblue", color: 101},
        {swf: "WOW_Charm_Logo_Silver", name: "logosilver", color: 10224127},
        {swf: "WOW_Charm_RunningHorse_pink", name: "runningpink", color: 39220},
        {swf: "WOW_Charm_StandingHorse_Green", name: "standinggreen", color: 10031000},
        {swf: "WOW_Charm_WaterHorse_Teal", name: "waterteal", color: 10077803}
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
    return "<categories>" +
    "<category name=\"Storybooks\" catid=\"1\" />" +
    "<category name=\"Furniture\" catid=\"2\" />" +
    "<category name=\"Flooring\" catid=\"3\" />" +
    "<category name=\"Toys\" catid=\"4\" />" + // includes Magic Match
    "<category name=\"Wall Hangings\" catid=\"5\" />" +
    "<category name=\"Home Decor\" catid=\"6\" />" +
    "<category name=\"Holiday\" catid=\"7\" />" +
    "<category name=\"Knick-Knacks\" catid=\"8\" />" +
    "<category name=\"Wonders\" catid=\"9\" />" +
    "<category name=\"Animals\" catid=\"10\" />" +
    "<category name=\"Doorways\" catid=\"11\" />" +
    "</categories>";
}

/**
 * Replace getAllThings() call
 * @returns an object with the things informations (used in My Things, Cottage, Bazaar, etc.)
 */
function getAllThings()
{
    console.log("getting all things")
    let index = 10000
    let items = "<items>" +
    // Furniture
    //pg1
    `<item itid=\"${index++}\" name=\"Clock1\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-CLK-04.swf\" swf=\"/flash/common/swf/things/FTR-CLK-04.swf\" />` +
    `<item itid=\"${index++}\" name=\"Fence\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-FENCE-01.swf\" swf=\"/flash/common/swf/things/FTR-FENCE-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Table\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-TBL-06.swf\" swf=\"/flash/common/swf/things/FTR-TBL-06.swf\" />` +
    `<item itid=\"${index++}\" name=\"Ottoman\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-SOFA-07.swf\" swf=\"/flash/common/swf/things/FTR-SOFA-07.swf\" />` +
    `<item itid=\"${index++}\" name=\"Box\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-BOX-01.swf\" swf=\"/flash/common/swf/things/FTR-BOX-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Toy Chest\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-BOX-03.swf\" swf=\"/flash/common/swf/things/FTR-BOX-03.swf\" />` +
    `<item itid=\"${index++}\" name=\"Clock2\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-CLK-03.swf\" swf=\"/flash/common/swf/things/FTR-CLK-03.swf\" />` +
    //pg2
    `<item itid=\"${index++}\" name=\"Star Sofa\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-STAR-04.swf\" swf=\"/flash/common/swf/things/FTR-STAR-04.swf\" />` +
    `<item itid=\"${index++}\" name=\"Yellow Bunk Bed\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-BED-08.swf\" swf=\"/flash/common/swf/things/FTR-BED-08.swf\" />` +
    `<item itid=\"${index++}\" name=\"Small Star Cabinet\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-CAB-08.swf\" swf=\"/flash/common/swf/things/FTR-CAB-08.swf\" />` +
    `<item itid=\"${index++}\" name=\"Purple Bunk Bed\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-BED-07.swf\" swf=\"/flash/common/swf/things/FTR-BED-07.swf\" />` +
    `<item itid=\"${index++}\" name=\"Brown Cabinet\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-CAB-13.swf\" swf=\"/flash/common/swf/things/FTR-CAB-13.swf\" />` +
    `<item itid=\"${index++}\" name=\"Pink Bunk Bed\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-BED-01.swf\" swf=\"/flash/common/swf/things/FTR-BED-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Small Sofa\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-SOFA-06.swf\" swf=\"/flash/common/swf/things/FTR-SOFA-06.swf\" />` +
    //pg3
    `<item itid=\"${index++}\" name=\"Yellow Cabinet\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-CAB-12.swf\" swf=\"/flash/common/swf/things/FTR-CAB-12.swf\" />` +
    `<item itid=\"${index++}\" name=\"Brown Dresser\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-CAB-09.swf\" swf=\"/flash/common/swf/things/FTR-CAB-09.swf\" />` +
    `<item itid=\"${index++}\" name=\"Clock3\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-CLK-01.swf\" swf=\"/flash/common/swf/things/FTR-CLK-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Clock4\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-CLK-02.swf\" swf=\"/flash/common/swf/things/FTR-CLK-02.swf\" />` +
    `<item itid=\"${index++}\" name=\"Yellow Dresser\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-CAB-15.swf\" swf=\"/flash/common/swf/things/FTR-CAB-15.swf\" />` +
    `<item itid=\"${index++}\" name=\"Treasure Chest\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-BOX-02.swf\" swf=\"/flash/common/swf/things/FTR-BOX-02.swf\" />` +
    `<item itid=\"${index++}\" name=\"Star Dresser\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-CAB-14.swf\" swf=\"/flash/common/swf/things/FTR-CAB-14.swf\" />` +
    `<item itid=\"${index++}\" name=\"Large Star Cabinet\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-CAB-07.swf\" swf=\"/flash/common/swf/things/FTR-CAB-07.swf\" />` +
    `<item itid=\"${index++}\" name=\"Purple Bed\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-BED-02.swf\" swf=\"/flash/common/swf/things/FTR-BED-02.swf\" />` +
    `<item itid=\"${index++}\" name=\"Blue Bed\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-BED-04.swf\" swf=\"/flash/common/swf/things/FTR-BED-04.swf\" />` +
    `<item itid=\"${index++}\" name=\"Glass Table\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-TBL-07.swf\" swf=\"/flash/common/swf/things/FTR-TBL-07.swf\" />` +
    `<item itid=\"${index++}\" name=\"Desk\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-DSK-01.swf\" swf=\"/flash/common/swf/things/FTR-DSK-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Large Sofa\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-SOFA-02.swf\" swf=\"/flash/common/swf/things/FTR-SOFA-02.swf\" />` +
    `<item itid=\"${index++}\" name=\"Table\" price1=\"25\" description=\"Description\" catid=\"2\" thumb=\"/flash/common/swf/things/FTR-TBL-08.swf\" swf=\"/flash/common/swf/things/FTR-TBL-08.swf\" />` +

    
    // Flooring
    `<item itid=\"${index++}\" name=\"Rug 1\" price1=\"25\" description=\"Description\" catid=\"3\" thumb=\"/flash/common/swf/things/FLR-RUG-09.swf\" swf=\"/flash/common/swf/things/FLR-RUG-09.swf\" />` +
    `<item itid=\"${index++}\" name=\"Rug 2\" price1=\"25\" description=\"Description\" catid=\"3\" thumb=\"/flash/common/swf/things/FLR-RUG-12.swf\" swf=\"/flash/common/swf/things/FLR-RUG-12.swf\" />` +
    `<item itid=\"${index++}\" name=\"Rug 3\" price1=\"25\" description=\"Description\" catid=\"3\" thumb=\"/flash/common/swf/things/FLR-RUG-04.swf\" swf=\"/flash/common/swf/things/FLR-RUG-04.swf\" />` +
    `<item itid=\"${index++}\" name=\"Rug 4\" price1=\"25\" description=\"Description\" catid=\"3\" thumb=\"/flash/common/swf/things/FLR-RUG-16.swf\" swf=\"/flash/common/swf/things/FLR-RUG-16.swf\" />` +
    `<item itid=\"${index++}\" name=\"Rug 5\" price1=\"25\" description=\"Description\" catid=\"3\" thumb=\"/flash/common/swf/things/FLR-RUG-11.swf\" swf=\"/flash/common/swf/things/FLR-RUG-11.swf\" />` +
    `<item itid=\"${index++}\" name=\"Rug 6\" price1=\"25\" description=\"Description\" catid=\"3\" thumb=\"/flash/common/swf/things/FLR-RUG-01.swf\" swf=\"/flash/common/swf/things/FLR-RUG-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Rug 7\" price1=\"25\" description=\"Description\" catid=\"3\" thumb=\"/flash/common/swf/things/FLR-RUG-08.swf\" swf=\"/flash/common/swf/things/FLR-RUG-08.swf\" />` +
    `<item itid=\"${index++}\" name=\"Rug 8\" price1=\"25\" description=\"Description\" catid=\"3\" thumb=\"/flash/common/swf/things/FLR-RUG-05.swf\" swf=\"/flash/common/swf/things/FLR-RUG-05.swf\" />` +
    `<item itid=\"${index++}\" name=\"Rug 9\" price1=\"25\" description=\"Description\" catid=\"3\" thumb=\"/flash/common/swf/things/FLR-RUG-07.swf\" swf=\"/flash/common/swf/things/FLR-RUG-07.swf\" />` +
    `<item itid=\"${index++}\" name=\"Rug 10\" price1=\"25\" description=\"Description\" catid=\"3\" thumb=\"/flash/common/swf/things/FLR-RUG-14.swf\" swf=\"/flash/common/swf/things/FLR-RUG-14.swf\" />` +
    `<item itid=\"${index++}\" name=\"Rug 11\" price1=\"25\" description=\"Description\" catid=\"3\" thumb=\"/flash/common/swf/things/FLR-RUG-13.swf\" swf=\"/flash/common/swf/things/FLR-RUG-13.swf\" />` +
    `<item itid=\"${index++}\" name=\"Rug 12\" price1=\"25\" description=\"Description\" catid=\"3\" thumb=\"/flash/common/swf/things/FLR-RUG-17.swf\" swf=\"/flash/common/swf/things/FLR-RUG-17.swf\" />` +
    `<item itid=\"${index++}\" name=\"Rug 13\" price1=\"25\" description=\"Description\" catid=\"3\" thumb=\"/flash/common/swf/things/FLR-RUG-18.swf\" swf=\"/flash/common/swf/things/FLR-RUG-18.swf\" />` +
    `<item itid=\"${index++}\" name=\"Rug 14\" price1=\"25\" description=\"Description\" catid=\"3\" thumb=\"/flash/common/swf/things/FLR-RUG-19.swf\" swf=\"/flash/common/swf/things/FLR-RUG-19.swf\" />` +
    `<item itid=\"${index++}\" name=\"Rug 15\" price1=\"25\" description=\"Description\" catid=\"3\" thumb=\"/flash/common/swf/things/FLR-RUG-03.swf\" swf=\"/flash/common/swf/things/FLR-RUG-03.swf\" />` +

    // Toys
    //pg1
    `<item itid=\"${index++}\" name=\"Flower Flitter Plush\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-MF-01.swf\" swf=\"/flash/common/swf/things/TOY-MF-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Malachite Crab Plush\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-MF-17.swf\" swf=\"/flash/common/swf/things/TOY-MF-17.swf\" />` +
    `<item itid=\"${index++}\" name=\"Rose Dragon Plush\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-MF-53.swf\" swf=\"/flash/common/swf/things/TOY-MF-53.swf\" />` +
    `<item itid=\"${index++}\" name=\"Yarn Yak Plush\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-MF-85.swf\" swf=\"/flash/common/swf/things/TOY-MF-85.swf\" />` +
    //pg2
    `<item itid=\"${index++}\" name=\"Rocking Horse\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-GEN-17.swf\" swf=\"/flash/common/swf/things/TOY-GEN-17.swf\" />` +
    `<item itid=\"${index++}\" name=\"Pink Doll\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-DOLL-03.swf\" swf=\"/flash/common/swf/things/TOY-DOLL-03.swf\" />` +
    `<item itid=\"${index++}\" name=\"Raccoon Plush\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-PLSH-12.swf\" swf=\"/flash/common/swf/things/TOY-PLSH-12.swf\" />` +
    `<item itid=\"${index++}\" name=\"Horse Plush\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-PLSH-08.swf\" swf=\"/flash/common/swf/things/TOY-PLSH-08.swf\" />` +
    `<item itid=\"${index++}\" name=\"Soccor Ball\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-BALL-08.swf\" swf=\"/flash/common/swf/things/TOY-BALL-08.swf\" />` +
    `<item itid=\"${index++}\" name=\"Volleyball\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-BALL-10.swf\" swf=\"/flash/common/swf/things/TOY-BALL-10.swf\" />` +
    `<item itid=\"${index++}\" name=\"Purple Doll\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-DOLL-06.swf\" swf=\"/flash/common/swf/things/TOY-DOLL-06.swf\" />` +
    `<item itid=\"${index++}\" name=\"Cow Plush\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-PLSH-03.swf\" swf=\"/flash/common/swf/things/TOY-PLSH-03.swf\" />` +
    `<item itid=\"${index++}\" name=\"Turtle Plush\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-PLSH-13.swf\" swf=\"/flash/common/swf/things/TOY-PLSH-13.swf\" />` +
    `<item itid=\"${index++}\" name=\"Chess\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-GEN-07.swf\" swf=\"/flash/common/swf/things/TOY-GEN-07.swf\" />` +
    `<item itid=\"${index++}\" name=\"Lion Plush\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-PLSH-09.swf\" swf=\"/flash/common/swf/things/TOY-PLSH-09.swf\" />` +
    `<item itid=\"${index++}\" name=\"Puppet\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-PPT-03.swf\" swf=\"/flash/common/swf/things/TOY-PPT-03.swf\" />` +
    `<item itid=\"${index++}\" name=\"Pig Plush\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-PLSH-10.swf\" swf=\"/flash/common/swf/things/TOY-PLSH-10.swf\" />` +
    //pg3
    `<item itid=\"${index++}\" name=\"Skateboard\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-GEN-18.swf\" swf=\"/flash/common/swf/things/TOY-GEN-18.swf\" />` +
    `<item itid=\"${index++}\" name=\"Cat Plush\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-PLSH-02.swf\" swf=\"/flash/common/swf/things/TOY-PLSH-02.swf\" />` +
    //pg4
    `<item itid=\"${index++}\" name=\"Glow-Eyed Catkin Plush\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-MF-84.swf\" swf=\"/flash/common/swf/things/TOY-MF-84.swf\" />` +
    `<item itid=\"${index++}\" name=\"Cat Puppet\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-PPT-01.swf\" swf=\"/flash/common/swf/things/TOY-PPT-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Purple Balloon\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-BLN-02.swf\" swf=\"/flash/common/swf/things/TOY-BLN-02.swf\" />` +
    `<item itid=\"${index++}\" name=\"Blue Balloon\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-BLN-08.swf\" swf=\"/flash/common/swf/things/TOY-BLN-08.swf\" />` +
    `<item itid=\"${index++}\" name=\"Ball\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-BALL-07.swf\" swf=\"/flash/common/swf/things/TOY-BALL-07.swf\" />` +
    `<item itid=\"${index++}\" name=\"Red Doll\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-DOLL-07.swf\" swf=\"/flash/common/swf/things/TOY-DOLL-07.swf\" />` +
    //pg5
    `<item itid=\"${index++}\" name=\"Ramshaggle Plush\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-MF-78.swf\" swf=\"/flash/common/swf/things/TOY-MF-78.swf\" />` +
    `<item itid=\"${index++}\" name=\"Heart-Tailed Lizard Plush\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-MF-79.swf\" swf=\"/flash/common/swf/things/TOY-MF-79.swf\" />` +
    `<item itid=\"${index++}\" name=\"Dream Mouse Plush\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-MF-80.swf\" swf=\"/flash/common/swf/things/TOY-MF-80.swf\" />` +
    `<item itid=\"${index++}\" name=\"Rainbow Wheebee Plush\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-MF-81.swf\" swf=\"/flash/common/swf/things/TOY-MF-81.swf\" />` +
    `<item itid=\"${index++}\" name=\"Bearn Terrier Plush\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-MF-83.swf\" swf=\"/flash/common/swf/things/TOY-MF-83.swf\" />` +
    //pg6
    `<item itid=\"${index++}\" name=\"Duskpaw Cub Plush\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/TOY-MF-42.swf\" swf=\"/flash/common/swf/things/TOY-MF-42.swf\" />` +
    //magic match (not in bazaar)
    `<item itid=\"${index++}\" name=\"Magic Match\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/MM-PLSH-01.swf\" swf=\"/flash/common/swf/things/MM-PLSH-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Magic Match\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/MM-PLSH-02.swf\" swf=\"/flash/common/swf/things/MM-PLSH-02.swf\" />` +
    `<item itid=\"${index++}\" name=\"Magic Match\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/MM-PLSH-03.swf\" swf=\"/flash/common/swf/things/MM-PLSH-03.swf\" />` +
    `<item itid=\"${index++}\" name=\"Magic Match\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/MM-PLSH-04.swf\" swf=\"/flash/common/swf/things/MM-PLSH-04.swf\" />` +
    `<item itid=\"${index++}\" name=\"Magic Match\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/MM-PLSH-07.swf\" swf=\"/flash/common/swf/things/MM-PLSH-07.swf\" />` +
    `<item itid=\"${index++}\" name=\"Magic Match\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/MM-PLSH-08.swf\" swf=\"/flash/common/swf/things/MM-PLSH-08.swf\" />` +
    `<item itid=\"${index++}\" name=\"Magic Match\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/MM-PLSH-09.swf\" swf=\"/flash/common/swf/things/MM-PLSH-09.swf\" />` +
    `<item itid=\"${index++}\" name=\"Magic Match\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/MM-PLSH-10.swf\" swf=\"/flash/common/swf/things/MM-PLSH-10.swf\" />` +
    `<item itid=\"${index++}\" name=\"Magic Match\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/MM-PLSH-12.swf\" swf=\"/flash/common/swf/things/MM-PLSH-12.swf\" />` +
    `<item itid=\"${index++}\" name=\"Magic Match\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/MM-PLSH-13.swf\" swf=\"/flash/common/swf/things/MM-PLSH-13.swf\" />` +
    `<item itid=\"${index++}\" name=\"Magic Match\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/MM-PLSH-15.swf\" swf=\"/flash/common/swf/things/MM-PLSH-15.swf\" />` +
    `<item itid=\"${index++}\" name=\"Magic Match\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/MM-PLSH-16.swf\" swf=\"/flash/common/swf/things/MM-PLSH-16.swf\" />` +
    `<item itid=\"${index++}\" name=\"Magic Match\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/MM-PLSH-17.swf\" swf=\"/flash/common/swf/things/MM-PLSH-17.swf\" />` +
    `<item itid=\"${index++}\" name=\"Magic Match\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/MM-PLSH-19.swf\" swf=\"/flash/common/swf/things/MM-PLSH-19.swf\" />` +
    `<item itid=\"${index++}\" name=\"Magic Match\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/MM-PLSH-20.swf\" swf=\"/flash/common/swf/things/MM-PLSH-20.swf\" />` +
    `<item itid=\"${index++}\" name=\"Magic Match\" price1=\"25\" description=\"Description\" catid=\"4\" thumb=\"/flash/common/swf/things/MM-PLSH-21.swf\" swf=\"/flash/common/swf/things/MM-PLSH-21.swf\" />` +
    
    // Wall Hangings
    `<item itid=\"${index++}\" name=\"Basket\" price1=\"25\" description=\"Description\" catid=\"5\" thumb=\"/flash/common/swf/things/WALL-BSKT-01.swf\" swf=\"/flash/common/swf/things/WALL-BSKT-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Sign\" price1=\"25\" description=\"Description\" catid=\"5\" thumb=\"/flash/common/swf/things/WALL-SIGN-02.swf\" swf=\"/flash/common/swf/things/WALL-SIGN-02.swf\" />` +
    `<item itid=\"${index++}\" name=\"Amor Poster\" price1=\"25\" description=\"Description\" catid=\"5\" thumb=\"/flash/common/swf/things/ART-HORSES-533.swf\" swf=\"/flash/common/swf/things/ART-HORSES-533.swf\" />` +
    `<item itid=\"${index++}\" name=\"Bella Poster\" price1=\"25\" description=\"Description\" catid=\"5\" thumb=\"/flash/common/swf/things/ART-HORSES-037.swf\" swf=\"/flash/common/swf/things/ART-HORSES-037.swf\" />` +
    `<item itid=\"${index++}\" name=\"Fiona Poster\" price1=\"25\" description=\"Description\" catid=\"5\" thumb=\"/flash/common/swf/things/ART-HORSES-040.swf\" swf=\"/flash/common/swf/things/ART-HORSES-040.swf\" />` +
    `<item itid=\"${index++}\" name=\"Flora Poster\" price1=\"25\" description=\"Description\" catid=\"5\" thumb=\"/flash/common/swf/things/ART-HORSES-492.swf\" swf=\"/flash/common/swf/things/ART-HORSES-492.swf\" />` +
    `<item itid=\"${index++}\" name=\"Froya Poster\" price1=\"25\" description=\"Description\" catid=\"5\" thumb=\"/flash/common/swf/things/ART-HORSES-245.swf\" swf=\"/flash/common/swf/things/ART-HORSES-245.swf\" />` +
    `<item itid=\"${index++}\" name=\"Iceking Poster\" price1=\"25\" description=\"Description\" catid=\"5\" thumb=\"/flash/common/swf/things/ART-HORSES-246.swf\" swf=\"/flash/common/swf/things/ART-HORSES-246.swf\" />` +
    `<item itid=\"${index++}\" name=\"Jewel Poster\" price1=\"25\" description=\"Description\" catid=\"5\" thumb=\"/flash/common/swf/things/ART-HORSES-041.swf\" swf=\"/flash/common/swf/things/ART-HORSES-041.swf\" />` +
    `<item itid=\"${index++}\" name=\"Mandalay Poster\" price1=\"25\" description=\"Description\" catid=\"5\" thumb=\"/flash/common/swf/things/ART-HORSES-222.swf\" swf=\"/flash/common/swf/things/ART-HORSES-222.swf\" />` +
    `<item itid=\"${index++}\" name=\"Misla Poster\" price1=\"25\" description=\"Description\" catid=\"5\" thumb=\"/flash/common/swf/things/ART-HORSES-251.swf\" swf=\"/flash/common/swf/things/ART-HORSES-251.swf\" />` +
    `<item itid=\"${index++}\" name=\"Nike Poster\" price1=\"25\" description=\"Description\" catid=\"5\" thumb=\"/flash/common/swf/things/ART-HORSES-518.swf\" swf=\"/flash/common/swf/things/ART-HORSES-518.swf\" />` +
    `<item itid=\"${index++}\" name=\"Triton Poster\" price1=\"25\" description=\"Description\" catid=\"5\" thumb=\"/flash/common/swf/things/ART-HORSES-520.swf\" swf=\"/flash/common/swf/things/ART-HORSES-520.swf\" />` +
    `<item itid=\"${index++}\" name=\"Tapestry 3\" price1=\"25\" description=\"Description\" catid=\"5\" thumb=\"/flash/common/swf/things/ART-TPST-03.swf\" swf=\"/flash/common/swf/things/ART-TPST-03.swf\" />` +
    `<item itid=\"${index++}\" name=\"Tapestry 2\" price1=\"25\" description=\"Description\" catid=\"5\" thumb=\"/flash/common/swf/things/ART-TPST-02.swf\" swf=\"/flash/common/swf/things/ART-TPST-02.swf\" />` +

    // Home Decor
    //pg1
    `<item itid=\"${index++}\" name=\"Fruit Bowl\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-BOWL-01.swf\" swf=\"/flash/common/swf/things/HD-BOWL-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Plant\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-PLNT-19.swf\" swf=\"/flash/common/swf/things/HD-PLNT-19.swf\" />` +
    `<item itid=\"${index++}\" name=\"Plant\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-PLNT-16.swf\" swf=\"/flash/common/swf/things/HD-PLNT-16.swf\" />` +
    //pg2
    `<item itid=\"${index++}\" name=\"Plant\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-PLNT-06.swf\" swf=\"/flash/common/swf/things/HD-PLNT-06.swf\" />` +
    `<item itid=\"${index++}\" name=\"Tea Set\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-HW-10.swf\" swf=\"/flash/common/swf/things/HD-HW-10.swf\" />` +
    `<item itid=\"${index++}\" name=\"Windchime\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-CLNG-11.swf\" swf=\"/flash/common/swf/things/HD-CLNG-11.swf\" />` +
    `<item itid=\"${index++}\" name=\"Chandelier\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-CLNG-05.swf\" swf=\"/flash/common/swf/things/HD-CLNG-05.swf\" />` +
    `<item itid=\"${index++}\" name=\"Plant\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-PLNT-01.swf\" swf=\"/flash/common/swf/things/HD-PLNT-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Carousel Chime\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-CLNG-08.swf\" swf=\"/flash/common/swf/things/HD-CLNG-08.swf\" />` +
    `<item itid=\"${index++}\" name=\"Plant\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-PLNT-10.swf\" swf=\"/flash/common/swf/things/HD-PLNT-10.swf\" />` +
    `<item itid=\"${index++}\" name=\"Crystal Chime\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-CLNG-06.swf\" swf=\"/flash/common/swf/things/HD-CLNG-06.swf\" />` +
    `<item itid=\"${index++}\" name=\"Bell\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-CLNG-02.swf\" swf=\"/flash/common/swf/things/HD-CLNG-02.swf\" />` +
    `<item itid=\"${index++}\" name=\"Plant\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-PLNT-07.swf\" swf=\"/flash/common/swf/things/HD-PLNT-07.swf\" />` +
    //pg3
    `<item itid=\"${index++}\" name=\"Lemonade\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-HW-09.swf\" swf=\"/flash/common/swf/things/HD-HW-09.swf\" />` +
    `<item itid=\"${index++}\" name=\"Windchime\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-CLNG-12.swf\" swf=\"/flash/common/swf/things/HD-CLNG-12.swf\" />` +
    `<item itid=\"${index++}\" name=\"Swing\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-CLNG-10.swf\" swf=\"/flash/common/swf/things/HD-CLNG-10.swf\" />` +
    `<item itid=\"${index++}\" name=\"Ocean Chime\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-CLNG-09.swf\" swf=\"/flash/common/swf/things/HD-CLNG-09.swf\" />` +
    `<item itid=\"${index++}\" name=\"Pitcher\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-HW-07.swf\" swf=\"/flash/common/swf/things/HD-HW-07.swf\" />` +
    `<item itid=\"${index++}\" name=\"Light\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-LITE-01.swf\" swf=\"/flash/common/swf/things/HD-LITE-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Shelf\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/WALL-SHLF-02.swf\" swf=\"/flash/common/swf/things/WALL-SHLF-02.swf\" />` +
    `<item itid=\"${index++}\" name=\"Plant\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-PLNT-12.swf\" swf=\"/flash/common/swf/things/HD-PLNT-12.swf\" />` +
    `<item itid=\"${index++}\" name=\"Plant\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-PLNT-20.swf\" swf=\"/flash/common/swf/things/HD-PLNT-20.swf\" />` +
    `<item itid=\"${index++}\" name=\"Plant\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-PLNT-17.swf\" swf=\"/flash/common/swf/things/HD-PLNT-17.swf\" />` +
    `<item itid=\"${index++}\" name=\"Plant\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-PLNT-18.swf\" swf=\"/flash/common/swf/things/HD-PLNT-18.swf\" />` +
    //pg4
    `<item itid=\"${index++}\" name=\"Blue Crystal\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-HW-11.swf\" swf=\"/flash/common/swf/things/HD-HW-11.swf\" />` +
    `<item itid=\"${index++}\" name=\"Ship\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-CLNG-01.swf\" swf=\"/flash/common/swf/things/HD-CLNG-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Horse Sculpture\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/ART-SCLP-04.swf\" swf=\"/flash/common/swf/things/ART-SCLP-04.swf\" />` +
    `<item itid=\"${index++}\" name=\"Light\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-LITE-02.swf\" swf=\"/flash/common/swf/things/HD-LITE-02.swf\" />` +
    `<item itid=\"${index++}\" name=\"Sculpture\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/ART-SCLP-01.swf\" swf=\"/flash/common/swf/things/ART-SCLP-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Green Crystal\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-HW-13.swf\" swf=\"/flash/common/swf/things/HD-HW-13.swf\" />` +
    `<item itid=\"${index++}\" name=\"Purple Crystal\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-HW-12.swf\" swf=\"/flash/common/swf/things/HD-HW-12.swf\" />` +
    `<item itid=\"${index++}\" name=\"Hot Air Balloon\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-CLNG-07.swf\" swf=\"/flash/common/swf/things/HD-CLNG-07.swf\" />` +
    `<item itid=\"${index++}\" name=\"Plant\" price1=\"25\" description=\"Description\" catid=\"6\" thumb=\"/flash/common/swf/things/HD-PLNT-09.swf\" swf=\"/flash/common/swf/things/HD-PLNT-09.swf\" />` +

    // Holiday
    `<item itid=\"${index++}\" name=\"Bunny\" price1=\"25\" description=\"Description\" catid=\"7\" thumb=\"/flash/common/swf/things/HOL-EAS-01.swf\" swf=\"/flash/common/swf/things/HOL-EAS-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Christmas Star\" price1=\"25\" description=\"Description\" catid=\"7\" thumb=\"/flash/common/swf/things/HOL-XMAS-01.swf\" swf=\"/flash/common/swf/things/HOL-XMAS-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Stocking\" price1=\"25\" description=\"Description\" catid=\"7\" thumb=\"/flash/common/swf/things/HOL-XMAS-02.swf\" swf=\"/flash/common/swf/things/HOL-XMAS-02.swf\" />` +
    `<item itid=\"${index++}\" name=\"Stocking\" price1=\"25\" description=\"Description\" catid=\"7\" thumb=\"/flash/common/swf/things/HOL-XMAS-14.swf\" swf=\"/flash/common/swf/things/HOL-XMAS-14.swf\" />` +
    `<item itid=\"${index++}\" name=\"Gift\" price1=\"25\" description=\"Description\" catid=\"7\" thumb=\"/flash/common/swf/things/HOL-XMAS-15.swf\" swf=\"/flash/common/swf/things/HOL-XMAS-15.swf\" />` +
    `<item itid=\"${index++}\" name=\"Gift\" price1=\"25\" description=\"Description\" catid=\"7\" thumb=\"/flash/common/swf/things/HOL-XMAS-07.swf\" swf=\"/flash/common/swf/things/HOL-XMAS-07.swf\" />` +
    `<item itid=\"${index++}\" name=\"Baskey\" price1=\"25\" description=\"Description\" catid=\"7\" thumb=\"/flash/common/swf/things/HOL-EAS-02.swf\" swf=\"/flash/common/swf/things/HOL-EAS-02.swf\" />` +
    `<item itid=\"${index++}\" name=\"Bunnies\" price1=\"25\" description=\"Description\" catid=\"7\" thumb=\"/flash/common/swf/things/HOL-VALD-15.swf\" swf=\"/flash/common/swf/things/HOL-VALD-15.swf\" />` +
    `<item itid=\"${index++}\" name=\"Christmas Tree\" price1=\"25\" description=\"Description\" catid=\"7\" thumb=\"/flash/common/swf/things/HOL-XMAS-04.swf\" swf=\"/flash/common/swf/things/HOL-XMAS-04.swf\" />` +
    `<item itid=\"${index++}\" name=\"Snowman\" price1=\"25\" description=\"Description\" catid=\"7\" thumb=\"/flash/common/swf/things/HOL-XMAS-06.swf\" swf=\"/flash/common/swf/things/HOL-XMAS-06.swf\" />` +
    `<item itid=\"${index++}\" name=\"Christmas Village\" price1=\"25\" description=\"Description\" catid=\"7\" thumb=\"/flash/common/swf/things/HOL-XMAS-12.swf\" swf=\"/flash/common/swf/things/HOL-XMAS-12.swf\" />` +
    `<item itid=\"${index++}\" name=\"Wreath\" price1=\"25\" description=\"Description\" catid=\"7\" thumb=\"/flash/common/swf/things/WALL-WRTH-02.swf\" swf=\"/flash/common/swf/things/WALL-WRTH-02.swf\" />` +
    `<item itid=\"${index++}\" name=\"Nutcracker\" price1=\"25\" description=\"Description\" catid=\"7\" thumb=\"/flash/common/swf/things/HOL-XMAS-05.swf\" swf=\"/flash/common/swf/things/HOL-XMAS-05.swf\" />` +
    `<item itid=\"${index++}\" name=\"Snowglobe\" price1=\"25\" description=\"Description\" catid=\"7\" thumb=\"/flash/common/swf/things/HOL-XMAS-11.swf\" swf=\"/flash/common/swf/things/HOL-XMAS-11.swf\" />` +
    `<item itid=\"${index++}\" name=\"Angel\" price1=\"25\" description=\"Description\" catid=\"7\" thumb=\"/flash/common/swf/things/HOL-XMAS-10.swf\" swf=\"/flash/common/swf/things/HOL-XMAS-10.swf\" />` +

    // Knick-Knacks
    //pg1
    `<item itid=\"${index++}\" name=\"Mint Candle\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-39.swf\" swf=\"/flash/common/swf/things/KK-39.swf\" />` +
    `<item itid=\"${index++}\" name=\"Mint Candle\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-38.swf\" swf=\"/flash/common/swf/things/KK-38.swf\" />` +
    `<item itid=\"${index++}\" name=\"Chocolate Candle\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-37.swf\" swf=\"/flash/common/swf/things/KK-37.swf\" />` +
    `<item itid=\"${index++}\" name=\"Chocolate Cndle\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-36.swf\" swf=\"/flash/common/swf/things/KK-36.swf\" />` +
    `<item itid=\"${index++}\" name=\"Lemon Candle\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-35.swf\" swf=\"/flash/common/swf/things/KK-35.swf\" />` +
    `<item itid=\"${index++}\" name=\"Lime Candle\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-34.swf\" swf=\"/flash/common/swf/things/KK-34.swf\" />` +
    `<item itid=\"${index++}\" name=\"Orange Candle\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-31.swf\" swf=\"/flash/common/swf/things/KK-31.swf\" />` +
    `<item itid=\"${index++}\" name=\"Potions\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-32.swf\" swf=\"/flash/common/swf/things/KK-32.swf\" />` +
    `<item itid=\"${index++}\" name=\"Letter\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-15.swf\" swf=\"/flash/common/swf/things/KK-15.swf\" />` +
    `<item itid=\"${index++}\" name=\"Fairy\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-01.swf\" swf=\"/flash/common/swf/things/KK-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Echo\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-HORSEMINIS-227.swf\" swf=\"/flash/common/swf/things/KK-HORSEMINIS-227.swf\" />` +
    //pg2
    `<item itid=\"${index++}\" name=\"Hecate\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-HORSEMINIS-235.swf\" swf=\"/flash/common/swf/things/KK-HORSEMINIS-235.swf\" />` +
    `<item itid=\"${index++}\" name=\"Naiad\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-HORSEMINIS-243.swf\" swf=\"/flash/common/swf/things/KK-HORSEMINIS-243.swf\" />` +
    `<item itid=\"${index++}\" name=\"Neptune\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-HORSEMINIS-244.swf\" swf=\"/flash/common/swf/things/KK-HORSEMINIS-244.swf\" />` +
    `<item itid=\"${index++}\" name=\"Nike\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-HORSEMINIS-245.swf\" swf=\"/flash/common/swf/things/KK-HORSEMINIS-245.swf\" />` +
    `<item itid=\"${index++}\" name=\"Pandora\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-HORSEMINIS-247.swf\" swf=\"/flash/common/swf/things/KK-HORSEMINIS-247.swf\" />` +
    `<item itid=\"${index++}\" name=\"Thalia\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-HORSEMINIS-250.swf\" swf=\"/flash/common/swf/things/KK-HORSEMINIS-250.swf\" />` +
    `<item itid=\"${index++}\" name=\"Uranus\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-HORSEMINIS-254.swf\" swf=\"/flash/common/swf/things/KK-HORSEMINIS-254.swf\" />` +
    `<item itid=\"${index++}\" name=\"Achilles\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-HORSEMINIS-212.swf\" swf=\"/flash/common/swf/things/KK-HORSEMINIS-212.swf\" />` +
    `<item itid=\"${index++}\" name=\"Amor\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-HORSEMINIS-213.swf\" swf=\"/flash/common/swf/things/KK-HORSEMINIS-213.swf\" />` +
    `<item itid=\"${index++}\" name=\"Apollo\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-HORSEMINIS-216.swf\" swf=\"/flash/common/swf/things/KK-HORSEMINIS-216.swf\" />` +
    `<item itid=\"${index++}\" name=\"Bukefalos\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-HORSEMINIS-220.swf\" swf=\"/flash/common/swf/things/KK-HORSEMINIS-220.swf\" />` +
    `<item itid=\"${index++}\" name=\"Jewellery Box\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-22.swf\" swf=\"/flash/common/swf/things/KK-22.swf\" />` +
    `<item itid=\"${index++}\" name=\"Potions\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-13.swf\" swf=\"/flash/common/swf/things/KK-13.swf\" />` +
    `<item itid=\"${index++}\" name=\"Snow Globe\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-09.swf\" swf=\"/flash/common/swf/things/KK-09.swf\" />` +
    `<item itid=\"${index++}\" name=\"Music Box\" price1=\"25\" description=\"Description\" catid=\"8\" thumb=\"/flash/common/swf/things/KK-02.swf\" swf=\"/flash/common/swf/things/KK-02.swf\" />` +

    // Wonders
    // From cards - not in bazaar
    `<item itid=\"${index++}\" name=\"Lilac Gazebo\" price1=\"25\" description=\"Description\" catid=\"9\" thumb=\"/flash/common/swf/things/EN-NOL-05.swf\" swf=\"/flash/common/swf/things/EN-NOL-05.swf\" />` +
    `<item itid=\"${index++}\" name=\"Winged Horse Statue\" price1=\"25\" description=\"Description\" catid=\"9\" thumb=\"/flash/common/swf/things/EN-NOL-09.swf\" swf=\"/flash/common/swf/things/EN-NOL-09.swf\" />` +

    // Animals
    //pg1
    `<item itid=\"${index++}\" name=\"Grouse\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_02.swf\" swf=\"/flash/common/swf/things/ANML_NVL_02.swf\" />` +
        // `<item itid=\"${index++}\" name=\"Deer\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_13.swf\" swf=\"/flash/common/swf/things/ANML_NVL_13.swf\" />` +
    `<item itid=\"${index++}\" name=\"Hamster\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML-06.swf\" swf=\"/flash/common/swf/things/ANML-06.swf\" />` +
    `<item itid=\"${index++}\" name=\"Flamingo\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_53.swf\" swf=\"/flash/common/swf/things/ANML_NVL_53.swf\" />` +
    `<item itid=\"${index++}\" name=\"Moose\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_09.swf\" swf=\"/flash/common/swf/things/ANML_NVL_09.swf\" />` +
    `<item itid=\"${index++}\" name=\"Mouse\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_10.swf\" swf=\"/flash/common/swf/things/ANML_NVL_10.swf\" />` +
    `<item itid=\"${index++}\" name=\"Opossum\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_17.swf\" swf=\"/flash/common/swf/things/ANML_NVL_17.swf\" />` +
        // Starfish?
    `<item itid=\"${index++}\" name=\"Cowlick Grouse\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-31.swf\" swf=\"/flash/common/swf/things/ANM-MF-31.swf\" />` +
    `<item itid=\"${index++}\" name=\"Fey Mouseling\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-32.swf\" swf=\"/flash/common/swf/things/ANM-MF-32.swf\" />` +
    `<item itid=\"${index++}\" name=\"Sun Cat\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-13.swf\" swf=\"/flash/common/swf/things/ANM-MF-13.swf\" />` +
    `<item itid=\"${index++}\" name=\"Melonchilla\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-24.swf\" swf=\"/flash/common/swf/things/ANM-MF-24.swf\" />` +
    `<item itid=\"${index++}\" name=\"Sand-Dollar Crawdad\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-27.swf\" swf=\"/flash/common/swf/things/ANM-MF-27.swf\" />` +
    `<item itid=\"${index++}\" name=\"Glimmer Eel\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-38.swf\" swf=\"/flash/common/swf/things/ANM-MF-38.swf\" />` +
    `<item itid=\"${index++}\" name=\"Sealky\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-39.swf\" swf=\"/flash/common/swf/things/ANM-MF-39.swf\" />` +
    //pg2
    `<item itid=\"${index++}\" name=\"Tea-Leaf Panda\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-09.swf\" swf=\"/flash/common/swf/things/ANM-MF-09.swf\" />` +
    `<item itid=\"${index++}\" name=\"Lotus Hedgehog\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-22.swf\" swf=\"/flash/common/swf/things/ANM-MF-22.swf\" />` +
    `<item itid=\"${index++}\" name=\"Sweetpea Reindeer\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-23.swf\" swf=\"/flash/common/swf/things/ANM-MF-23.swf\" />` +
    `<item itid=\"${index++}\" name=\"Seastelly\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-04.swf\" swf=\"/flash/common/swf/things/ANM-MF-04.swf\" />` +
    `<item itid=\"${index++}\" name=\"Bat\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML-07.swf\" swf=\"/flash/common/swf/things/ANML-07.swf\" />` +
    `<item itid=\"${index++}\" name=\"Bird\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML-02.swf\" swf=\"/flash/common/swf/things/ANML-02.swf\" />` +
    `<item itid=\"${index++}\" name=\"Ant Farm\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML-01.swf\" swf=\"/flash/common/swf/things/ANML-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Starstone Otter\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-05.swf\" swf=\"/flash/common/swf/things/ANM-MF-05.swf\" />` +
    `<item itid=\"${index++}\" name=\"Gemdigger Dog\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-19.swf\" swf=\"/flash/common/swf/things/ANM-MF-19.swf\" />` +
    `<item itid=\"${index++}\" name=\"Quixie Faun\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-15.swf\" swf=\"/flash/common/swf/things/ANM-MF-15.swf\" />` +
    `<item itid=\"${index++}\" name=\"Blackcomb Lion\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-36.swf\" swf=\"/flash/common/swf/things/ANM-MF-36.swf\" />` +
    `<item itid=\"${index++}\" name=\"Beehive\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML-03.swf\" swf=\"/flash/common/swf/things/ANML-03.swf\" />` +
    `<item itid=\"${index++}\" name=\"Snail\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML-12.swf\" swf=\"/flash/common/swf/things/ANML-12.swf\" />` +
    `<item itid=\"${index++}\" name=\"Deer\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML-17.swf\" swf=\"/flash/common/swf/things/ANML-17.swf\" />` +
    `<item itid=\"${index++}\" name=\"Whale\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_11.swf\" swf=\"/flash/common/swf/things/ANML_NVL_11.swf\" />` +
    //pg3
    `<item itid=\"${index++}\" name=\"Fringed Newt\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-10.swf\" swf=\"/flash/common/swf/things/ANM-MF-10.swf\" />` +
    `<item itid=\"${index++}\" name=\"Fire Spoop\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-12.swf\" swf=\"/flash/common/swf/things/ANM-MF-12.swf\" />` +
    `<item itid=\"${index++}\" name=\"Grasspool Otter\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-29.swf\" swf=\"/flash/common/swf/things/ANM-MF-29.swf\" />` +
    `<item itid=\"${index++}\" name=\"Tassel Mouse\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-25.swf\" swf=\"/flash/common/swf/things/ANM-MF-25.swf\" />` +
    `<item itid=\"${index++}\" name=\"Pipsqueak Longtail\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-14.swf\" swf=\"/flash/common/swf/things/ANM-MF-14.swf\" />` +
    `<item itid=\"${index++}\" name=\"Caperberry Hob\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-33.swf\" swf=\"/flash/common/swf/things/ANM-MF-33.swf\" />` +
    `<item itid=\"${index++}\" name=\"Starfall Beetle\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-34.swf\" swf=\"/flash/common/swf/things/ANM-MF-34.swf\" />` +
    `<item itid=\"${index++}\" name=\"Glowball Pooch\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-35.swf\" swf=\"/flash/common/swf/things/ANM-MF-35.swf\" />` +
    `<item itid=\"${index++}\" name=\"Cunning Flitkit\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-37.swf\" swf=\"/flash/common/swf/things/ANM-MF-37.swf\" />` +
    `<item itid=\"${index++}\" name=\"Sprayer Whale\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-26.swf\" swf=\"/flash/common/swf/things/ANM-MF-26.swf\" />` +
    `<item itid=\"${index++}\" name=\"Bubble Turtle\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-30.swf\" swf=\"/flash/common/swf/things/ANM-MF-30.swf\" />` +
    `<item itid=\"${index++}\" name=\"Nebulaphin\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-28.swf\" swf=\"/flash/common/swf/things/ANM-MF-28.swf\" />` +
    `<item itid=\"${index++}\" name=\"Twinkle Imp\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-06.swf\" swf=\"/flash/common/swf/things/ANM-MF-06.swf\" />` +
    `<item itid=\"${index++}\" name=\"Flapuppy\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-11.swf\" swf=\"/flash/common/swf/things/ANM-MF-11.swf\" />` +
    `<item itid=\"${index++}\" name=\"Bobolink\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-08.swf\" swf=\"/flash/common/swf/things/ANM-MF-08.swf\" />` +
    //pg4
        // Yellow otter thing?
    `<item itid=\"${index++}\" name=\"Swordfish\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_55.swf\" swf=\"/flash/common/swf/things/ANML_NVL_55.swf\" />` +
    `<item itid=\"${index++}\" name=\"Polar Bear\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_48.swf\" swf=\"/flash/common/swf/things/ANML_NVL_48.swf\" />` +
    `<item itid=\"${index++}\" name=\"Ant\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_12.swf\" swf=\"/flash/common/swf/things/ANML_NVL_12.swf\" />` +
    `<item itid=\"${index++}\" name=\"Seal\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_46.swf\" swf=\"/flash/common/swf/things/ANML_NVL_46.swf\" />` +
    `<item itid=\"${index++}\" name=\"Snake\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_38.swf\" swf=\"/flash/common/swf/things/ANML_NVL_38.swf\" />` +
    `<item itid=\"${index++}\" name=\"Dolphin\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_33.swf\" swf=\"/flash/common/swf/things/ANML_NVL_33.swf\" />` +
    `<item itid=\"${index++}\" name=\"Raven\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_34.swf\" swf=\"/flash/common/swf/things/ANML_NVL_34.swf\" />` +
    `<item itid=\"${index++}\" name=\"Rabbit\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_27.swf\" swf=\"/flash/common/swf/things/ANML_NVL_27.swf\" />` +
    `<item itid=\"${index++}\" name=\"Armadillo\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_18.swf\" swf=\"/flash/common/swf/things/ANML_NVL_18.swf\" />` +
    `<item itid=\"${index++}\" name=\"Falltide Leafkin\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-03.swf\" swf=\"/flash/common/swf/things/ANM-MF-03.swf\" />` +
    `<item itid=\"${index++}\" name=\"Whiffle Bear\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-01.swf\" swf=\"/flash/common/swf/things/ANM-MF-01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Swineswimmer\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-18.swf\" swf=\"/flash/common/swf/things/ANM-MF-18.swf\" />` +
    `<item itid=\"${index++}\" name=\"Prawn Sprite\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-20.swf\" swf=\"/flash/common/swf/things/ANM-MF-20.swf\" />` +
    `<item itid=\"${index++}\" name=\"Violet Pixie\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-21.swf\" swf=\"/flash/common/swf/things/ANM-MF-21.swf\" />` +
    //pg5
    `<item itid=\"${index++}\" name=\"Fish\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML-18.swf\" swf=\"/flash/common/swf/things/ANML-18.swf\" />` +
    `<item itid=\"${index++}\" name=\"Groundhog\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML-09.swf\" swf=\"/flash/common/swf/things/ANML-09.swf\" />` +
    `<item itid=\"${index++}\" name=\"Lizard\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_14.swf\" swf=\"/flash/common/swf/things/ANML_NVL_14.swf\" />` +
    `<item itid=\"${index++}\" name=\"Lynx\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_15.swf\" swf=\"/flash/common/swf/things/ANML_NVL_15.swf\" />` +
    `<item itid=\"${index++}\" name=\"Badger\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_16.swf\" swf=\"/flash/common/swf/things/ANML_NVL_16.swf\" />` +
    `<item itid=\"${index++}\" name=\"Dog\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_06.swf\" swf=\"/flash/common/swf/things/ANML_NVL_06.swf\" />` +
    `<item itid=\"${index++}\" name=\"Coyote\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_07.swf\" swf=\"/flash/common/swf/things/ANML_NVL_07.swf\" />` +
    `<item itid=\"${index++}\" name=\"Ladybug\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML-08.swf\" swf=\"/flash/common/swf/things/ANML-08.swf\" />` +
    `<item itid=\"${index++}\" name=\"Bird\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML-15.swf\" swf=\"/flash/common/swf/things/ANML-15.swf\" />` +
    `<item itid=\"${index++}\" name=\"Cat\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML-14.swf\" swf=\"/flash/common/swf/things/ANML-14.swf\" />` +
    `<item itid=\"${index++}\" name=\"Dog\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML-05.swf\" swf=\"/flash/common/swf/things/ANML-05.swf\" />` +
    `<item itid=\"${index++}\" name=\"Mountain Lion\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_05.swf\" swf=\"/flash/common/swf/things/ANML_NVL_05.swf\" />` +
    `<item itid=\"${index++}\" name=\"Bat\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_03.swf\" swf=\"/flash/common/swf/things/ANML_NVL_03.swf\" />` +
    `<item itid=\"${index++}\" name=\"Manatee\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_51.swf\" swf=\"/flash/common/swf/things/ANML_NVL_51.swf\" />` +
    `<item itid=\"${index++}\" name=\"Roadrunner\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_52.swf\" swf=\"/flash/common/swf/things/ANML_NVL_52.swf\" />` +
    //pg6
    `<item itid=\"${index++}\" name=\"Wolf\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_26.swf\" swf=\"/flash/common/swf/things/ANML_NVL_26.swf\" />` +
    `<item itid=\"${index++}\" name=\"Antelope\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_31.swf\" swf=\"/flash/common/swf/things/ANML_NVL_31.swf\" />` +
        // `<item itid=\"${index++}\" name=\"Eagle\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_32.swf\" swf=\"/flash/common/swf/things/ANML_NVL_32.swf\" />` +
    `<item itid=\"${index++}\" name=\"Swan\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_35.swf\" swf=\"/flash/common/swf/things/ANML_NVL_35.swf\" />` +
    `<item itid=\"${index++}\" name=\"Hummingbird\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_36.swf\" swf=\"/flash/common/swf/things/ANML_NVL_36.swf\" />` +
    `<item itid=\"${index++}\" name=\"Buffalo\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_37.swf\" swf=\"/flash/common/swf/things/ANML_NVL_37.swf\" />` +
    `<item itid=\"${index++}\" name=\"Elk\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_28.swf\" swf=\"/flash/common/swf/things/ANML_NVL_28.swf\" />` +
    `<item itid=\"${index++}\" name=\"Bear\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_29.swf\" swf=\"/flash/common/swf/things/ANML_NVL_29.swf\" />` +
    `<item itid=\"${index++}\" name=\"Horse\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_39.swf\" swf=\"/flash/common/swf/things/ANML_NVL_39.swf\" />` +
    `<item itid=\"${index++}\" name=\"Squirrel\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_41.swf\" swf=\"/flash/common/swf/things/ANML_NVL_41.swf\" />` +
    `<item itid=\"${index++}\" name=\"Fox\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_43.swf\" swf=\"/flash/common/swf/things/ANML_NVL_43.swf\" />` +
    `<item itid=\"${index++}\" name=\"Duck\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_47.swf\" swf=\"/flash/common/swf/things/ANML_NVL_47.swf\" />` +
    `<item itid=\"${index++}\" name=\"Cardinal\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_56.swf\" swf=\"/flash/common/swf/things/ANML_NVL_56.swf\" />` +
    `<item itid=\"${index++}\" name=\"Falcon\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_49.swf\" swf=\"/flash/common/swf/things/ANML_NVL_49.swf\" />` +
    `<item itid=\"${index++}\" name=\"Big-Horned Sheep\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_50.swf\" swf=\"/flash/common/swf/things/ANML_NVL_50.swf\" />` +
    //pg7
    `<item itid=\"${index++}\" name=\"Spark Turtle\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-40.swf\" swf=\"/flash/common/swf/things/ANM-MF-40.swf\" />` +
    `<item itid=\"${index++}\" name=\"Neon Frog\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-41.swf\" swf=\"/flash/common/swf/things/ANM-MF-41.swf\" />` +
    `<item itid=\"${index++}\" name=\"Chocolate Sparrow\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-42.swf\" swf=\"/flash/common/swf/things/ANM-MF-42.swf\" />` +
    `<item itid=\"${index++}\" name=\"Marsh Blix\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-43.swf\" swf=\"/flash/common/swf/things/ANM-MF-43.swf\" />` +
    `<item itid=\"${index++}\" name=\"Tufted Trollbuck\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-44.swf\" swf=\"/flash/common/swf/things/ANM-MF-44.swf\" />` +
    `<item itid=\"${index++}\" name=\"Fairyphant\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-45.swf\" swf=\"/flash/common/swf/things/ANM-MF-45.swf\" />` +
    `<item itid=\"${index++}\" name=\"Fuzzhorn\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-46.swf\" swf=\"/flash/common/swf/things/ANM-MF-46.swf\" />` +
    `<item itid=\"${index++}\" name=\"Blazoned Leonis\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-07.swf\" swf=\"/flash/common/swf/things/ANM-MF-07.swf\" />` +
    `<item itid=\"${index++}\" name=\"Yulung Dragon\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-16.swf\" swf=\"/flash/common/swf/things/ANM-MF-16.swf\" />` +
    `<item itid=\"${index++}\" name=\"Ivy-Tailed Dragon\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-17.swf\" swf=\"/flash/common/swf/things/ANM-MF-17.swf\" />` +
    `<item itid=\"${index++}\" name=\"Squawking Teaser\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANM-MF-02.swf\" swf=\"/flash/common/swf/things/ANM-MF-02.swf\" />` +
    `<item itid=\"${index++}\" name=\"Hawk\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_19.swf\" swf=\"/flash/common/swf/things/ANML_NVL_19.swf\" />` +
    `<item itid=\"${index++}\" name=\"Porcupine\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_20.swf\" swf=\"/flash/common/swf/things/ANML_NVL_20.swf\" />` +
    `<item itid=\"${index++}\" name=\"Owl\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_22.swf\" swf=\"/flash/common/swf/things/ANML_NVL_22.swf\" />` +
    `<item itid=\"${index++}\" name=\"Turkey\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_24.swf\" swf=\"/flash/common/swf/things/ANML_NVL_24.swf\" />` +
    //pg8
    `<item itid=\"${index++}\" name=\"Weasel\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_23.swf\" swf=\"/flash/common/swf/things/ANML_NVL_23.swf\" />` +
    `<item itid=\"${index++}\" name=\"Beaver\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_21.swf\" swf=\"/flash/common/swf/things/ANML_NVL_21.swf\" />` +
    `<item itid=\"${index++}\" name=\"Turtle\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_25.swf\" swf=\"/flash/common/swf/things/ANML_NVL_25.swf\" />` +
    `<item itid=\"${index++}\" name=\"Butterflies\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_40.swf\" swf=\"/flash/common/swf/things/ANML_NVL_40.swf\" />` +
    `<item itid=\"${index++}\" name=\"Orca\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_30.swf\" swf=\"/flash/common/swf/things/ANML_NVL_30.swf\" />` +
    `<item itid=\"${index++}\" name=\"Otter\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_44.swf\" swf=\"/flash/common/swf/things/ANML_NVL_44.swf\" />` +
    `<item itid=\"${index++}\" name=\"Dragonfly\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_45.swf\" swf=\"/flash/common/swf/things/ANML_NVL_45.swf\" />` +
    `<item itid=\"${index++}\" name=\"Frog\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_42.swf\" swf=\"/flash/common/swf/things/ANML_NVL_42.swf\" />` +
    `<item itid=\"${index++}\" name=\"Salmon\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_54.swf\" swf=\"/flash/common/swf/things/ANML_NVL_54.swf\" />` +
    `<item itid=\"${index++}\" name=\"Spider\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_04.swf\" swf=\"/flash/common/swf/things/ANML_NVL_04.swf\" />` +
    `<item itid=\"${index++}\" name=\"Skunk\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_01.swf\" swf=\"/flash/common/swf/things/ANML_NVL_01.swf\" />` +
    `<item itid=\"${index++}\" name=\"Crow\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML_NVL_08.swf\" swf=\"/flash/common/swf/things/ANML_NVL_08.swf\" />` +
    `<item itid=\"${index++}\" name=\"Hamster\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML-10.swf\" swf=\"/flash/common/swf/things/ANML-10.swf\" />` +
    `<item itid=\"${index++}\" name=\"Dragonfly\" price1=\"25\" description=\"Description\" catid=\"10\" thumb=\"/flash/common/swf/things/ANML-16.swf\" swf=\"/flash/common/swf/things/ANML-16.swf\" />` +

    // Doors
    `<item itid=\"637\" name=\"Bedroom\" price1=\"25\" description=\"Description\" catid=\"11\" thumb=\"/flash/common/swf/things/DOOR-03-THUMB.swf\" swf=\"/flash/common/swf/things/DOOR-03-THUMB.swf\" allowmultipurchase=\"False\" />` +
    `<item itid=\"635\" name=\"Theatre\" price1=\"25\" description=\"Description\" catid=\"11\" thumb=\"/flash/common/swf/things/DOOR-01-THUMB.swf\" swf=\"/flash/common/swf/things/DOOR-01-THUMB.swf\" allowmultipurchase=\"False\" />` +
    `<item itid=\"636\" name=\"Astronamy\" price1=\"25\" description=\"Description\" catid=\"11\" thumb=\"/flash/common/swf/things/DOOR-02-THUMB.swf\" swf=\"/flash/common/swf/things/DOOR-02-THUMB.swf\" allowmultipurchase=\"False\" />` +
    `<item itid=\"725\" name=\"Patio\" price1=\"25\" description=\"Description\" catid=\"11\" thumb=\"/flash/common/swf/things/Door-04-Thumb.swf\" swf=\"/flash/common/swf/things/Door-04.swf\" allowmultipurchase=\"False\" />` +
    `<item itid=\"${index++}\" name=\"Rolandsgaard Castle\" price1=\"25\" description=\"Description\" catid=\"11\" thumb=\"/flash/common/swf/things/ROY-Bellasara-Thumb.swf\" swf=\"/flash/common/swf/things/ROY-Bellasara-Thumb.swf\" allowmultipurchase=\"False\" />` +

    "</items>"

    // console.log(index)
    return items
}
function getAllActiveThings() {
    console.log("getting all active things")
    return getAllThings()
}

// function forceRefreshThingsData()
// {
//     let test = true
//     if (loadData(DATA_TYPES.roomData, GAME_ID.MyCottage)) {
//         test = false
//     }
//     return test
// }

function getThings()
{
    let things = getRoomData()
    if (!things) {
        console.log("No existing things data - resetting things")


        things = "<items>"
        // TODO: do we want to add a default inventory?
        // const knownIDs = [
        //     "635",
        //     "636",
        //     "637",
        //     "725",
        //     "468"
        // ]

        // for (let index = 0; index < knownIDs.length; index++) {
        //     things = things + `<item iid=\"${101+index}\" itid=\"${knownIDs[index]}\" rid=\"1\" x=\"0\" y=\"0\" z=\"${1001 + index}\" s=\"100\" a=\"1\" />`
        // }

        // for (let index = 0; index < knownIDs.length+299; index++) {
        //     things = things + `<item iid=\"${101 + index + knownIDs.length}\" itid=\"${10000 + index}\" rid=\"1\" x=\"0\" y=\"0\" z=\"${1001 + index + knownIDs.length}\" s=\"100\" a=\"1\" />`
        // }
        things = things + "</items>"
    }

    return things;

    // return "<items><item iid=\"101\" itid=\"10001\" rid=\"1\" x=\"0\" y=\"0\" z=\"1001\" s=\"100\" a=\"1\" /><item iid=\"102\" itid=\"10002\" rid=\"1\" x=\"0\" y=\"0\" z=\"1002\" s=\"100\" a=\"1\" /><item iid=\"103\" itid=\"10003\" rid=\"1\" x=\"0\" y=\"0\" z=\"1003\" s=\"100\" a=\"1\" /><item iid=\"104\" itid=\"10004\" rid=\"1\" x=\"0\" y=\"0\" z=\"1004\" s=\"100\" a=\"1\" /><item iid=\"105\" itid=\"10005\" rid=\"1\" x=\"0\" y=\"0\" z=\"1005\" s=\"100\" a=\"1\" /><item iid=\"106\" itid=\"10006\" rid=\"1\" x=\"0\" y=\"0\" z=\"1006\" s=\"100\" a=\"1\" /><item iid=\"107\" itid=\"10007\" rid=\"1\" x=\"0\" y=\"0\" z=\"1007\" s=\"100\" a=\"1\" /><item iid=\"108\" itid=\"10008\" rid=\"1\" x=\"0\" y=\"0\" z=\"1008\" s=\"100\" a=\"1\" /><item iid=\"109\" itid=\"10009\" rid=\"1\" x=\"0\" y=\"0\" z=\"1009\" s=\"100\" a=\"1\" /><item iid=\"110\" itid=\"10010\" rid=\"1\" x=\"0\" y=\"0\" z=\"1010\" s=\"100\" a=\"1\" /><item iid=\"111\" itid=\"10011\" rid=\"1\" x=\"0\" y=\"0\" z=\"1011\" s=\"100\" a=\"1\" /><item iid=\"112\" itid=\"10012\" rid=\"1\" x=\"0\" y=\"0\" z=\"1012\" s=\"100\" a=\"1\" /><item iid=\"113\" itid=\"10013\" rid=\"1\" x=\"0\" y=\"0\" z=\"1013\" s=\"100\" a=\"1\" /><item iid=\"114\" itid=\"10014\" rid=\"1\" x=\"0\" y=\"0\" z=\"1014\" s=\"100\" a=\"1\" /><item iid=\"115\" itid=\"10015\" rid=\"1\" x=\"0\" y=\"0\" z=\"1015\" s=\"100\" a=\"1\" /><item iid=\"116\" itid=\"10016\" rid=\"1\" x=\"0\" y=\"0\" z=\"1016\" s=\"100\" a=\"1\" /><item iid=\"117\" itid=\"10017\" rid=\"1\" x=\"0\" y=\"0\" z=\"1017\" s=\"100\" a=\"1\" /><item iid=\"118\" itid=\"10018\" rid=\"1\" x=\"0\" y=\"0\" z=\"1018\" s=\"100\" a=\"1\" /></items>";
}
function getVisitorThings() {return getThings()}
function getThingsInMyThings() {return getThings()}
/**
 * Updates the room data with a new value
 * @param {*} data the new data for the rooms
 */
function updateRoomData(data, alreadyMini = false) {
    console.log("updating room data", roomID, data)
    if (!alreadyMini) {
        data = minifyInventoryData(data)
    }
    saveData(DATA_TYPES.roomData, data, GAME_ID.MyCottage)
}
function minifyInventoryData(data)
{
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data,"text/xml");
    if (xmlDoc.getElementsByTagName("items") && xmlDoc.getElementsByTagName("items")[0] && xmlDoc.getElementsByTagName("items")[0].childNodes) {
        let items = xmlDoc.getElementsByTagName("items")[0].childNodes
        let minify = ""

        for (let index = 0; index < items.length; index++) {
            const item = items[index].attributes;
            minify = minify + "_" + minifyInventoryItemData(item)
        }
        return minify.slice(1)
    }
    return ""
}
function minifyInventoryItemData(item)
{
    const separator = "*"
    let itemData = item.itid.nodeValue+separator+item.rid.nodeValue+
    separator+item.x.nodeValue+separator+item.y.nodeValue+separator+item.z.nodeValue+separator+item.s.nodeValue+separator+item.a.nodeValue
    return itemData
}
/**
 * 
 * @returns The save data for the rooms
 */
function getRoomData(unminify = true) {
    roomData = loadData(DATA_TYPES.roomData, GAME_ID.MyCottage)
    if (roomData && unminify) {
        roomData = unminifyInventoryData(roomData)
    }
    return roomData
}
function unminifyInventoryData(itemsData) {
    things = "<items>"
    itemsDataArray = itemsData.split("_")
    for (let index = 0; index < itemsDataArray.length; index++) {
        const itemData = itemsDataArray[index];
        itemDataArray = itemData.split("*")
        item = `<item iid=\"${101+index}\" itid=\"${itemDataArray[0]}\" rid=\"${itemDataArray[1]}\" x=\"${itemDataArray[2]}\" y=\"${itemDataArray[3]}\" z=\"${itemDataArray[4]}\" s=\"${itemDataArray[5]}\" a=\"${itemDataArray[6]}\" />`
        things = things+item
    }
    return things + "</items>";
}

function getHorseshoes()
{
    return loadData(DATA_TYPES.horseshoes);
}

function getCurrentUser()
{
    return currentUser
}    

function getBalance() {
    return `<balance><user currency1=\"${loadData(DATA_TYPES.horseshoes)}\" /></balance>`
}

function buyThing(itid) {
    const xml = getAllThings()
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml,"text/xml");
    let items = xmlDoc.getElementsByTagName("items")[0].childNodes

    let itemPurchased = "no"
    let currency1 = loadData(DATA_TYPES.horseshoes)
    let cost = 0

    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        if (item.attributes.itid.nodeValue === itid) {
            console.log(item.attributes)
            cost = parseInt(item.attributes.price1.nodeValue)
            if (cost <= currency1) {
                itemPurchased = "yes"
                removeHorseshoes(cost)
                addThingToMyThings(itid)
            }
            break
        }
    }

    // console.log(itemPurchased, currency1-cost)
    return `<bazaarpurchase><item purchased=\"${itemPurchased}\" currency1=\"${currency1 - cost}\" /></bazaarpurchase>`
}

function addThingToMyThings(itid) {
    let things = getThingsInMyThings()
    things = minifyInventoryData(things.toString())
    newItem = `${itid}*1*0*0*1000*100*1`
    if (things) {
        things = things+"_"+newItem
    }
    else {
        things = newItem
    }

    updateRoomData(things, true)
}


/* Extract helper from .swf
                           "<categories><category name=\"Art\" catid=\"1\" /><category name=\"Furniture\" catid=\"2\" /><category name=\"Flooring\" catid=\"3\" /><category name=\"Toys\" catid=\"4\" /><category name=\"Wall Hangings\" catid=\"5\" /><category name=\"Home Decor\" catid=\"6\" /><category name=\"Holiday\" catid=\"7\" /><category name=\"Knick-Knacks\" catid=\"8\" /><category name=\"Curios\" catid=\"9\" /><category name=\"Jewelry\" catid=\"10\" /></categories>";
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