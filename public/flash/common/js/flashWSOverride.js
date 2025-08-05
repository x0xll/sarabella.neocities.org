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


/* HELPER FUNCTIONS */
function getRandomColorNumber() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  const colorNumber = (r << 16) + (g << 8) + b;

  return colorNumber;
}