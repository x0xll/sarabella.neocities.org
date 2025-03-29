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
    var grounds = xmlObj.querySelectorAll("ground");
    var skins = xmlObj.querySelectorAll("skin");
    xmlObj.querySelectorAll("tile").forEach(tile =>{
        if (tileDatas[tile.attributes[0].value] != undefined)
            console.error("Tried setting multiple time the same tile datas: " + tile.attributes[0].value);
        else
        {
            var data = {};

            for (var i = 0; i < tile.attributes.length; i++)
            {
                switch(tile.attributes[i].name)
                {
                    default:
                        break;
                    case "id":
                        data.id = tile.attributes[i].value;
                        break;
                    
                    // TODO : Need to handle the fact some tiles can have multiples skins, multiple grounds, and sometimes both at the same time
                    // We can probably split the values by "," for each skins/grounds and save in an array
                    // But how do we use it afterwards in-game? Do we choose one randomly? Do we put all of them one on top of each other?
                    // Something else?
                    case "skins":
                        skins.forEach(skin =>{
                            if (skin.attributes[0].value == tile.attributes[i].value)
                            {
                                // This is our visual, let's take the id
                                data.visual = skin.attributes[2].value;
                                return;
                            }
                        });
                        break;
                    case "grounds":
                        grounds.forEach(ground =>{
                            if (ground.attributes[0].value == tile.attributes[i].value)
                            {
                                // This is our visual, let's take the id
                                data.visual = ground.attributes[2].value;
                                return;
                            }
                        });
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
    
            // TODO : get grid kid for scale
    
            if (data.visual === undefined)
                data.visual = data.id;

            tileDatas[data.id] = data;
        }   
    });
    result.push(tileDatas);
    //console.log(tileDatas);

    return result;
}