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
    if ((node.nodeName === "#text" && !node.textContent.replace(/\s/g, "")) ||
        node.nodeName === "#comment") 
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
            if (node.nodeName === "object" && attribute.name === "type") {
                nodeObject[attribute.name] = attribute.value.replace("questData.", "")
            } else if (attribute.name !== "id") {
                nodeObject[attribute.name] = attribute.value
            }
        }
    }

    // Check child nodes
    if (node.childNodes && node.childNodes.length > 0) {
        node.childNodes.forEach(childNode => {
            const textOnlyNodes = [
                "text"
            ]
            if (textOnlyNodes.includes(childNode.nodeName) || node.nodeName === "object") {
                if (childNode.childNodes && childNode.childNodes.length > 0) {
                    nodeObject[childNode.nodeName] = childNode.childNodes[0].wholeText
                }
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
    } else {
        nodeName = node.nodeName
    }
    
    // Determine if node object should be in an array or not
    const nonArrayNodes = [
        "description",
        "trigger",
        "conditions",
        "actions",
        "text",
    ]
    const inArray = !(nonArrayNodes.includes(node.nodeName) || (node.attributes && node.attributes["id"]))
    
    // Add to parent object
    if (inArray) {
        if (!parentNodeObject[nodeName]) {
            parentNodeObject[nodeName] = []
        } else if (!Array.isArray(parentNodeObject[nodeName])) {
            parentNodeObject[nodeName] = [parentNodeObject[nodeName]]
        }
        parentNodeObject[nodeName].push(nodeObject)
    } else {
        parentNodeObject[nodeName] = nodeObject
    }
}

function parseQuestXML(questManager, xmlObj) {
    const result = {}

    xmlObj.querySelectorAll("adventures").forEach(adventures => {
        parseXMLNode(adventures, result)
    })

    for (let [key] of Object.entries(result)) {
        if (!key.includes("ADS")) {continue}
        adventures = result[key]

        for (let [key] of Object.entries(adventures)) {
            if (!key.includes("ADV")) {continue}
            adventure = adventures[key]

            for (let [key] of Object.entries(adventure)) {
                if (!key.includes("QUE")) {continue}
                quest = adventure[key]
                quest.status = questManager.QUEST_STATES.UNAVAILABLE
            }
        }
    }

   return result
}

function parseZoneNameXML(xmlObj)
{
    const result = {}

    xmlObj.querySelectorAll("location").forEach(location => {
        parseXMLNode(location, result)
    })

   return result;
}

function parseTemplateXML(questManager, xmlObj) {
    const result = {}

    xmlObj.querySelectorAll("things").forEach(thing => {
        parseXMLNode(thing, result)
    })

   return result
}