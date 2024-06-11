// Code from: http://www.carknee.com/archive/2007/01/02/flash-file-swf-loader-control.aspx

function loadFlashDoc(fPath, fWidth, fHeight, fVars, bgColor, op)
{
    loadFlash(fPath,fWidth,fHeight,fVars,bgColor,op,"body");
}

function loadFlash(fPath, fWidth, fHeight, fVars, bgColor, op, styleId)
{
    document.write('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"');
    document.write(' width="' + fWidth + '" height="' + fHeight + '" id="' +  styleId + '"> ');
    document.write(' <param name="movie" value="' + fPath + '" /> ');
    document.write(' <param name="quality" value="high" /> ');
    document.write(' <param name="wmode" value="' + op + '" /> ');
    document.write(' <param name="bgcolor" value="#' + bgColor + '" /> ');
    document.write(' <param name="flashvars" value="' + fVars + '" /> ');
    document.write('</object>');
}