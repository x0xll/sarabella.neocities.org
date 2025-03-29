function parseZoneXML(xmlObj)
{
    var zoneDatas = [];

    xmlObj.querySelectorAll("levelRow").forEach(row => {
        var rowCells = row.textContent.split(",");
        zoneDatas.push(rowCells);
    });

    return zoneDatas;
}