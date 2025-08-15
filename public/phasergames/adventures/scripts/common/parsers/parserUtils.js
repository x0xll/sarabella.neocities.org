function parseZoneXML(xmlObj)
{
    //console.log(xmlObj);

    var result = [];

    // Get the level grid
    var zoneDatas = [];
    xmlObj.querySelectorAll("levelRow").forEach(row => {
        var rowCells = row.textContent.split(",");
        zoneDatas.push(rowCells);
    });
    result.push(zoneDatas);

    // Get the datas for each tile
    var tileDatas = {};
    xmlObj.querySelectorAll("tile").forEach(tile =>{
        if (tileDatas[tile.attributes[0].value] != undefined)
            console.error("Tried setting multiple time the same tile datas: " + tile.attributes[0].value);
        else
        {
            var data = {};

            // Tile attributes
            for (var i = 0; i < tile.attributes.length; i++)
            {
                switch(tile.attributes[i].name)
                {
                    default:
                        break;
                    case "id":
                        data.id = tile.attributes[i].value;
                        break;
                    case "file":
                        data.file = tile.attributes[i].value;
                        break;
                    case "walkable":
                        data.walkable = tile.attributes[i].value;
                        break;
                    // TODO : What can those represent, and how can we use them?
                    case "entities":
                        data.entity = tile.attributes[i].value;
                        break;
                    // TODO : What elements in the game use this value? Do we actually need it?
                    case "isBillboard":
                        data.billboard = tile.attributes[i].billboard;
                        break;
                }
            }

            // Grid kid datas
            var grid = tile.children[0];
            for (var i = 0; i < grid.attributes.length; i++)
                {
                    switch(grid.attributes[i].name)
                    {
                        default:
                            break;
                        case "width":
                            data.width = grid.attributes[i].value;
                            break;
                        case "height":
                            data.height = grid.attributes[i].value;
                            break;
                        case "depth":
                            data.depth = grid.attributes[i].value;
                            break;
                    }
                }

            tileDatas[data.id] = data;
        }   
    });
    result.push(tileDatas);
    //console.log(tileDatas);

    return result;
}

function parseQuestXML(xmlObj)
{
    //console.log(xmlObj);

    var result = [];

    function parseActions(obj, currentData)
    {
        switch(obj.attributes[0].value)
        {
            case "questData.DialogueAction":
                var data = {
                    type: QUEST_ACTIONS.DIALOGUE,
                    text: obj.childNodes[0].nextElementSibling.innerHTML
                }

                currentData.actions.push(data);
                break;
            case "questData.AddMultipleInventoryAction":
                var data = {
                    type: QUEST_ACTIONS.ADDINVENTORY,
                    itemID: obj.childNodes[0].nextElementSibling.innerHTML,
                    count: parseInt(obj.childNodes[1].nextElementSibling.innerHTML)
                }

                currentData.actions.push(data);
                break;
            case "questData.AddQuestAction":
                var data = {
                    type: QUEST_ACTIONS.NEXTQUEST,
                    questID: obj.childNodes[0].nextElementSibling.innerHTML             
                }
                currentData.actions.push(data);
                break;
            case "questData.RemoveQuestAction":
                var data = {
                    type: QUEST_ACTIONS.REMOVEQUEST
                }
                currentData.actions.push(data);
            case "questData.TalkQuestTrigger":

                var id = obj.querySelectorAll("identifier");
                var primary = obj.querySelectorAll("isPrimary");

                var trigger = 
                {
                    id: undefined,
                    isPrimary: undefined
                }

                if (id.length > 0)
                    trigger.id = id[0].innerHTML;
                if (primary.length > 0)
                    trigger.isPrimary = primary[0].innerHTML;

                currentData.trigger = trigger
                break;
            case "questData.AddZoneItemAnywhereAction":
                var data = {
                    type: QUEST_ACTIONS.ADDZONEITEMANYWHEREACTION,
                    template: obj.childNodes[0].nextElementSibling.innerHTML,
                    instanceID: obj.childNodes[1].nextElementSibling.innerHTML,
                    zone: obj.childNodes[2].nextElementSibling.innerHTML,
                    xPos: obj.childNodes[3].nextElementSibling.innerHTML,
                    yPos: obj.childNodes[4].nextElementSibling.innerHTML
                }
                currentData.actions.push(data);
                break;
            case "questData.StopNearTrigger":
                currentData.trigger = {
                    type: QUEST_ACTIONS.STOPNEARTRIGGER,
                    zone: obj.childNodes[0].nextElementSibling.innerHTML,
                    centerX: obj.childNodes[1].nextElementSibling.innerHTML,
                    centerY: obj.childNodes[2].nextElementSibling.innerHTML,
                    radius: obj.childNodes[3].nextElementSibling.innerHTML
                }

                break;
        }
    }

    // Get global file datas
    xmlObj.querySelectorAll("adventures").forEach(adventures => {
        var globalQuestObj = 
        {
            adventuresID : adventures.attributes[0].value,
            description : adventures.attributes[1].value,
            adventureData : []
        }

        adventures.querySelectorAll("adventure").forEach(adventure => {
            var adventureObj = {
                adventureID : adventure.attributes[0].value,
                description : adventure.childNodes[0].nextElementSibling.innerHTML,
                questData : [] 
            }
            globalQuestObj.adventureData.push(adventureObj);

            adventure.querySelectorAll("quest").forEach(quest => {
                var questObj = {
                    questID : quest.attributes[0].value,
                    description : quest.childNodes[0].nextElementSibling.innerHTML,
                    status : QUEST_STATES.UNAVAILABLE,
                    target: {
                        id: undefined,
                        zone: undefined,
                        showIcon: true // Whether we show the exclamation point or not, don't know if necessary yet
                    },
                    lines : []
                }

                adventureObj.questData.push(questObj);

                for(let i = 0; i < quest.attributes.length; i++)
                {
                    switch(quest.attributes[i].name)
                    {
                        case "targetTemplate":
                            questObj.target.id = quest.attributes[i].values;
                            break;
                        case "targetZone":
                            questObj.target.zone = quest.attributes[i].value;
                            break;
                    }
                }

                quest.querySelectorAll("line").forEach(line => {
                    var lineObj = {
                        description: line.attributes[0].innerHTML,
                        trigger: {},
                        conditions: [],
                        actions: []
                    }

                    questObj.lines.push(lineObj);
                    quest.querySelectorAll("object").forEach(action => {
                        parseActions(action, lineObj)
                    });
                    quest.querySelectorAll("trigger").forEach(trigger => {
                        trigger.querySelectorAll("object").forEach(action => {
                            parseActions(action, lineObj)
                        });
                    });
                })
            });
        });

        result = globalQuestObj;
    });

    return result;
}