const HOME_LINK = {
    href: "/index.html",
    il8n: "footer_home_linktxt"
}

const WIKI_IL8N = "footer_wiki_linktxt";
const WEBARCHIVE_IL8N = "footer_webarchive_linktxt";
const GITHUB_IL8N = "footer_github_linktxt";

const SEPARATOR = " | ";

/**
 * Generates the footer links
 * @param {*} customLinks1 An array of {href, il8n} objects for custom links. These links will appear right after the home link
 * @param {*} wikiLink The href for the wiki link
 * @param {*} webarchiveLink The href for the web archive link
 * @param {*} githubLink The href for the github link
 * @param {*} customLinks2 An array of {href, il8n} objects for custom links. These links will appear at the end of the list
 */
/** */
function generateFooter({customLinks1=[], wikiLink, webarchiveLink, githubLink, customLinks2=[]}) {

    let footer = document.getElementById('footer');
    
    footer.appendChild(instantiateLink(HOME_LINK.href, HOME_LINK.il8n));

    links = customLinks1.concat([
        {href: wikiLink, il8n: WIKI_IL8N}, 
        {href: webarchiveLink, il8n: WEBARCHIVE_IL8N}, 
        {href: githubLink, il8n:GITHUB_IL8N}
        ],
        customLinks2)
        
    for(let i = 0; i < links.length; i++){
        if (links[i].href !== undefined) {
            footer.innerHTML += SEPARATOR;
            footer.appendChild(instantiateLink(links[i].href, links[i].il8n));
        }
    }
    
    /**
     * Creates a 'a' tag element for the footer and returns it
     * @param href the link to add
     * @param il8n the localization key
     * @returns 'a' element
     */
    function instantiateLink(href, il8n)
    {
        let link = document.createElement('a');
        link.href = href;
        link.dataset.il8n = il8n;
        link.classList = "global-lowernav-link";
        return link;
    }
}