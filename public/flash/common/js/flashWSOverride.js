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

    // TODO: Get correct color values
    let possibleElements = [
        {swf: "MM_PLSH-01", name: "blazonedleonis", rarity: "0"},
        {swf: "MM_PLSH-07", name: "bubbleturtle", rarity: "0"},
        {swf: "MM_PLSH-19", name: "cunningflitkit", rarity: "1"},
        {swf: "MM_PLSH-21", name: "fairyphant", rarity: "1"},
        //{swf: "MM_PLSH-", name: "flapuppy", rarity: "0"},
        {swf: "MM_PLSH-10", name: "fringednewt", rarity: "2"},
        {swf: "MM_PLSH-15", name: "gemdiggerdog", rarity: "1"},
        //{swf: "MM_PLSH-", name: "grasspoolotter", rarity: "0"},
        {swf: "MM_PLSH-17", name: "nebulaphim", rarity: "1"},
        {swf: "MM_PLSH-20", name: "neonfrog", rarity: "1"},
        {swf: "MM_PLSH-12", name: "pipsqueaklongtail", rarity: "2"},
        {swf: "MM_PLSH-13", name: "quixiefaun", rarity: "2"},
        //{swf: "MM_PLSH-", name: "sealky", rarity: "0"},
        //{swf: "MM_PLSH-", name: "sparkturtle", rarity: "0"},
        {swf: "MM_PLSH-08", name: "starstoneotter", rarity: "2"},
        {swf: "MM_PLSH-03", name: "suncat", rarity: "0"},
        {swf: "MM_PLSH-16", name: "sweetpeareindeer", rarity: "1"},
        //{swf: "MM_PLSH-", name: "tasselmouse", rarity: "0"},
        {swf: "MM_PLSH-02", name: "tealeafpanda", rarity: "0"},
        {swf: "MM_PLSH-09", name: "twinkleimp", rarity: "2"},
        {swf: "MM_PLSH-04", name: "violetpixie", rarity: "0"},
    ]

    for (let i = 0; i < 3; i++)
    {
        let randPrize = Math.floor(Math.random() * possibleElements.length);
        let prizeData = possibleElements[randPrize];
        possibleElements.splice(randPrize, 1);
        let objID = i + 1;

        InitMagicMatchReturnValues.result.MMDigitalObjects.push(
            {
                swf: prizeData.swf + ".swf",
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