const UTILS_LOCA_PATH_LANG_VALUE = 'LANG_CHOSEN';

function setupRuffle()
{
    window.RufflePlayer = {
        config: {
            autoplay: "on",
            unmuteOverlay: "hidden",
        }
    };
}

function checkLocalizedFiles(locaPath)
{
    loadLanguagePref(false); 
    var locale = getCurrentLanguageCode();
    locaPath = locaPath.replace(UTILS_LOCA_PATH_LANG_VALUE, locale);
    if (!isLocalizedFileExisting(locaPath))
        locale = "en";
    return locale;
}

function loadSWF(swfPath, height, width, locale, flashvars = '', transparentBackground = true)
{
    var swfParent = document.getElementsByClassName('swf')[0];
    var swfPlayer = document.createElement('embed');
    swfPlayer.height = height;
    swfPlayer.width = width;
    swfPlayer.pluginspage = 'http://www.macromedia.com/go/getflashplayer';
    swfPlayer.src = swfPath;
    swfPlayer.type = 'application/x-shockwave-flash';
    swfPlayer.setAttribute("flashvars", `locale=${locale}&lang=${locale}&language=${locale}${flashvars}`);
    if (transparentBackground)
        swfPlayer.setAttribute("wmode", `transparent`);
    swfPlayer.setAttribute("allowscriptaccess", "always");
    swfParent.appendChild(swfPlayer);
}