async function loadXML(url) {
    try {
        const response = await fetch(url);
        const xmlString = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        
        console.log("Loaded: " + url);

        return xmlDoc;
    } catch (e) {
        console.error('Error loading XML: ', e);
    }
}

function urlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}