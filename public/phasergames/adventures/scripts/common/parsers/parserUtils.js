function parseZoneXML(xmlObj)
{
    const result = {}

    xmlObj.querySelectorAll("map").forEach(map => {
        parseXMLNode(map, result)
    })

    let tiles = result.map[0].tiles[0];
    result.mappedTiles = new Map();

    for (let [key, value] of Object.entries(tiles)) {
        value.id = key;
        result.mappedTiles.set(key, value);
    }

    console.log(result);

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
    } else if (nodeObject.name && (typeof nodeObject.name === 'string' || nodeObject.name instanceof String)) {
        nodeName = nodeObject.name
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