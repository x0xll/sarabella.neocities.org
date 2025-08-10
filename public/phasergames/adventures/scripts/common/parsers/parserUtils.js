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
                    actions : []
                }

                adventureObj.questData.push(questObj);

                quest.querySelectorAll("object").forEach(action => {
                        switch(action.attributes[0].value)
                        {
                            case "questData.DialogueAction":
                                questObj.actions.push(
                                    {
                                        type: QUEST_ACTIONS.DIALOGUE,
                                        text: action.childNodes[0].nextElementSibling.innerHTML
                                    });
                                break;
                            case "questData.AddMultipleInventoryAction":
                                questObj.actions.push(
                                    {
                                        type: QUEST_ACTIONS.ADDINVENTORY,
                                        itemID: action.childNodes[0].nextElementSibling.innerHTML,
                                        count: parseInt(action.childNodes[1].nextElementSibling.innerHTML)
                                    });
                                break;
                            case "questData.AddQuestAction":
                                questObj.actions.push({
                                    type: QUEST_ACTIONS.NEXTQUEST,
                                    questID: action.childNodes[0].nextElementSibling.innerHTML
                                });
                                break;
                        }
                })
            });
        });

        result = globalQuestObj;
    });

    return result;
}