const INSPIRATIONS = [
    "Test inspiration",
    "Another test"
]

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

function initWheel()
{
    let InitWheelReturnValues = 
    {
        // TODO: get the names from locas

        result : {
            DigitalObjects : [
                {
                    swf: "WOW_Charm_Bella_Gold.swf",
                    color: getRandomColorNumber(),
                    objectID: 0,
                    name: "Bella Gold"
                },
                {
                    swf: "WOW_Charm_FlyingHorse_Purple.swf",
                    color: getRandomColorNumber(),
                    objectID: 1,
                    name: "Bella Gold"
                },
                {
                    swf: "WOW_Charm_Icon_Flower_Orange.swf",
                    color: getRandomColorNumber(),
                    objectID: 2,
                    name: "Bella Gold"
                },
                {
                    swf: "WOW_Charm_Icon_Heart_Gold.swf",
                    color: getRandomColorNumber(),
                    objectID: 3,
                    name: "Bella Gold"
                },
                {
                    swf: "WOW_Charm_Icon_Horseshoe_Silver.swf",
                    color: getRandomColorNumber(),
                    objectID: 4,
                    name: "Bella Gold"
                },
                {
                    swf: "WOW_Charm_Icon_Moon_Blue.swf",
                    color: getRandomColorNumber(),
                    objectID: 5,
                    name: "Bella Gold"
                },
                {
                    swf: "WOW_Charm_Logo_Silver.swf",
                    color: getRandomColorNumber(),
                    objectID: 6,
                    name: "Bella Gold"
                },
                {
                    swf: "WOW_Charm_RunningHorse_pink.swf",
                    color: getRandomColorNumber(),
                    objectID: 7,
                    name: "Bella Gold"
                },
                {
                    swf: "WOW_Charm_StandingHorse_Green.swf",
                    color: getRandomColorNumber(),
                    objectID: 8,
                    name: "Bella Gold"
                },
                {
                    swf: "WOW_Charm_WaterHorse_Teal.swf",
                    color: getRandomColorNumber(),
                    objectID: 9,
                    name: "Bella Gold"
                }
            ],
            FreeSpins: 1,
            Seed: 179
        }
    }

    return InitWheelReturnValues;
}

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