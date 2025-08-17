const HOME_LINK = {
    href: "/index.html",
    il8n: "footer_home_linktxt"
}

const WIKI_IL8N = "footer_wiki_linktxt";
const WEBARCHIVE_IL8N = "footer_webarchive_linktxt";
const GITHUB_IL8N = "footer_github_linktxt";

const SEPARATOR = " | ";

/**
 * Generate a footer with only the wiki, webarchive and github links possible
 * @param wikiLink the link to the BeSa wiki.gg page for this game
 * @param webarchiveLink the link to the webArchive page for this game
 * @param githubLink the link to the github folder for this game in the BeSa neocities repo, main branch
 */
function generateFooterSimplified({wikiLink, webarchiveLink, githubLink} = {})
{
    generateFooterCustomized(undefined, {wikiLink: wikiLink, webarchiveLink:webarchiveLink, githubLink:githubLink});
}

/**
 * Generate a footer with custom links as well as the wiki, webarchive and github links
 * @param customLinks a list of objects {href, il8n} with the data for each custom links to add
 * @param wikiLink the link to the BeSa wiki.gg page for this game
 * @param webarchiveLink the link to the webArchive page for this game
 * @param githubLink the link to the github folder for this game in the BeSa neocities repo, main branch
 */
function generateFooterCustomized(customLinks, {wikiLink, webarchiveLink, githubLink} = {})
{
    let footer = document.getElementById('footer');

    footer.appendChild(instantiateLink(HOME_LINK.href, HOME_LINK.il8n));
    if ((customLinks !== undefined && customLinks.length > 0) || wikiLink !== undefined || webarchiveLink !== undefined || githubLink !== undefined)
        footer.innerHTML += SEPARATOR;

    if (customLinks !== undefined)
    {
        for(let i = 0; i < customLinks.length; i++)
        {
            footer.appendChild(instantiateLink(customLinks[i].href, customLinks[i].il8n));

            if (i + 1 != customLinks.length || wikiLink !== undefined || webarchiveLink !== undefined || githubLink !== undefined)
                footer.innerHTML += SEPARATOR;
        }
    }

    if (wikiLink !== undefined)
    {
        footer.appendChild(instantiateLink(wikiLink, WIKI_IL8N));
        if (webarchiveLink !== undefined || githubLink !== undefined)
            footer.innerHTML += SEPARATOR;
    }
    if (webarchiveLink !== undefined)
    {
        footer.appendChild(instantiateLink(webarchiveLink, WEBARCHIVE_IL8N));
        if (githubLink !== undefined)
            footer.innerHTML += SEPARATOR;
    }
    if (githubLink !== undefined)
        footer.appendChild(instantiateLink(githubLink, GITHUB_IL8N));

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