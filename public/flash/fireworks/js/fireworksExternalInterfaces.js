function RedirectToFireworksShow(showDatas)
{
    console.log(showDatas);

    window.location.href = `/flash/fireworks/fireworks.html?show=${showDatas}`;
}

function RedirectOnShowQuit()
{
    window.location.href = "/";
}

function RedirectToFireworksGame()
{
    window.location.href = `/flash/fireworks/fireworks.html`;
}