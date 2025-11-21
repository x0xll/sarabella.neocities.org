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


function parseXMLNode(node, parentNodeObject, customName = "") {
    // Ignore blank lines
    if (node.nodeName === "#text" && !node.textContent.replace(/\s/g, "")) 
        return
    else if (node.nodeName === "#text") {
        parentNodeObject.text = node.wholeText
        return
    }

    let nodeObject = {}

    // Add node attributes
    if (node.attributes){
        for (let index = 0; index < node.attributes.length; index++) {
            const attribute = node.attributes[index];
            if (attribute.name !== "id" && (node.nodeName !== "object" && attribute.name !== "type")){
                nodeObject[attribute.name] = attribute.value
            }
        }
    }

    // Check child nodes
    if (node.childNodes && node.childNodes.length > 0) {
        node.childNodes.forEach(childNode => {
            const textOnlyNodes = [
                "text",
                "zoneId",
                "zoneName",
                "centerX",
                "centerY",
                "radius",
                "identifier",
                "imageFileName",
                "fileName",
                "hspace",
                "vspace",
                "count"
            ]
            if (textOnlyNodes.includes(childNode.nodeName)) {
                nodeObject[childNode.nodeName] = childNode.childNodes[0].wholeText
            } else {
                parseXMLNode(childNode, nodeObject)
            }
        });
    } else {
        if (node.nodeValue) {nodeObject = node.nodeValue}
    }

    // Determine node name
    let nodeName
    if (customName !== ""){
        nodeName = customName
    } else if (node.attributes && node.attributes["id"]) {
        nodeName = node.attributes["id"].value
    } else if (node.nodeName === "object" && node.attributes && node.attributes["type"]) {
        nodeName = node.attributes.type.nodeValue
    } else {
        nodeName = node.nodeName
    }

    // Determine if node object should be in an array or not
    const nonArrayNodes = [
        "description",
        "trigger",
        "conditions",
        "actions",
        "text"
    ]
    const inArray = !nonArrayNodes.includes(node.nodeName) || (node.attributes && node.attributes["id"])
    
    // Add to parent object
    if (inArray) {
        if (!parentNodeObject[nodeName]) {
            parentNodeObject[nodeName] = []
        }
        parentNodeObject[nodeName].push(nodeObject)
    } else {
        parentNodeObject[nodeName] = nodeObject
    }
}

function altParseQuestXML(xmlObj) {
    let result = {}


    xmlObj.querySelectorAll("adventures").forEach(adventures => {
        parseXMLNode(adventures, result)
    })

   return result
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
                    text: obj.childNodes[1].innerHTML,
                }

                if (obj.childNodes.length > 3 && obj.childNodes[3] != null)
                    data.iconID = obj.childNodes[3].innerHTML

                currentData.actions.push(data);
                break;
            case "questData.AddMultipleInventoryAction":
                var data = {
                    type: QUEST_ACTIONS.ADDINVENTORY,
                    itemID: obj.childNodes[1].innerHTML,
                    count: parseInt(obj.childNodes[2].innerHTML)
                }

                currentData.actions.push(data);
                break;
            case "questData.AddQuestAction":
                var data = {
                    type: QUEST_ACTIONS.NEXTQUEST,
                    questID: obj.childNodes[1].innerHTML             
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
                    template: obj.childNodes[1].innerHTML,
                    instanceID: obj.childNodes[2].innerHTML,
                    zone: obj.childNodes[3].innerHTML,
                    xPos: parseInt(obj.childNodes[4].innerHTML),
                    yPos: parseInt(obj.childNodes[5].innerHTML)
                }
                currentData.actions.push(data);
                break;
            case "questData.StopNearTrigger":
                currentData.trigger = {
                    type: QUEST_ACTIONS.STOPNEARTRIGGER,
                    zone: obj.childNodes[1].innerHTML,
                    // TODO: check centerX and centerY, they seem to not init correctly
                    centerX: parseInt(obj.childNodes[3].innerHTML),
                    centerY: parseInt(obj.childNodes[5].innerHTML),
                    radius: parseInt(obj.childNodes[7].innerHTML)
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
                        description: line.attributes[0].value,
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