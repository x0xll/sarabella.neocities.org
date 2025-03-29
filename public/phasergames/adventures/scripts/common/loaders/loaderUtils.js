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