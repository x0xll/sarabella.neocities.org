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
            var data = 
            {
                visual: {},
                visualIds: []
            };

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
                    case "skins":
                    case "grounds":
                        var splitted = tile.attributes[i].value.split(",");

                        // We get the tile visual informations
                        var refs = (tile.attributes[i].name === "skins") ? skins : grounds;

                        splitted.forEach(value => {
                            refs.forEach(ref =>{
                                if (ref.attributes[0].value == value)
                                {
                                    // This is our visual, let's take the id
                                    if (data.visual[ref.attributes[2].value !== undefined])
                                    {
                                        console.error("Tile " + tile.attributes[0].value + " has too many instances of " + value);
                                        return;
                                    }

                                    data.visualIds.push(ref.attributes[2].value);

                                    var imgDatas = {};

                                    var isSkins = tile.attributes[i].name === "skins";
                                    imgDatas.visualType = (isSkins) ? "skins" : "grounds";

                                    for (var j = 0; j < ref.attributes.length; j++)
                                    {
                                        switch(ref.attributes[j].name)
                                        {
                                            default:
                                                break;
                                            case "x":
                                                imgDatas.xOffset = ref.attributes[j].value;
                                                break;
                                            case "y":
                                                imgDatas.yOffset = ref.attributes[j].value;
                                                break;
                                            case "depthOffset":
                                                imgDatas.depthOffset = ref.attributes[j].value;
                                                break;
                                            case "scaleY":
                                                imgDatas.scaleY = ref.attributes[j].value;
                                                break;
                                            case "scaleX":
                                                imgDatas.scaleX = ref.attributes[j].value;
                                                break;
                                        }

                                    }

                                    data.visual[ref.attributes[2].value] = imgDatas;
                                    return;
                                }
                            });
                        })
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

            if (data.visual === undefined)
                data.visual = data.id;

            tileDatas[data.id] = data;
        }   
    });
    result.push(tileDatas);
    //console.log(tileDatas);

    return result;
}