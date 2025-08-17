const HOME_LINK = {
    href: "/index.html",
    il8n: "footer_home_linktxt"
}

const WIKI_IL8N = "footer_wiki_linktxt";
const WEBARCHIVE_IL8N = "footer_webarchive_linktxt";

function generateFooter(data)
{
    let footer = document.getElementById('footer');

    for(let i = 0; i < data.length; i++)
    {
        let link = document.createElement('a');
        link.href = data[i].href;
        link.dataset.il8n = data[i].il8n;
        link.classList = "global-lowernav-link";
        footer.appendChild(link);

        if (i + 1 != data.length)
            footer.innerHTML += " | ";
    }
}
