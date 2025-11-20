const DIALOGUE_PANEL_IMG = "Dialogue_Panel";
const DIALOGUE_AVATAR_MASK = "Dialogue_Avatar_Mask";
const DIALOGUE_CONTINUE_BTN = "Dialogue_Continue_Btn";
const DIALOGUE_HUMANS_THUMBNAILS = "humansthumbnails";
const DIALOGUE_HORSES_THUMBNAILS = "horsesthumbnails";

const CHARA_NAME_TEXT_SETTINGS = 
{
    font: "bold 25px Arial",
    color: "white",
    stroke: "#D1A844",
    strokeThickness: 5
}

const DIALOGUE_TEXT_BLACK_SETTINGS = 
{
    font: "18px Arial",
    color: "#792AA8",
    wordWrap: { width: 650 }
}

const DIALOGUE_TEXT_PURPLE_SETTINGS = 
{
    font: "18px Arial",
    color: "black",
    wordWrap: { width: 650 }
}

function loadDialogueUI(phaserScene)
{
    // Background panel
    phaserScene.load.image(DIALOGUE_PANEL_IMG, "./assets/extracted/UI/Dialogue/Panel.png");

    // Avatar mask
    //phaserScene.load.image(DIALOGUE_AVATAR_MASK, "./assets/extracted/UI/Dialogue/PortraitMask.png");

    // Avatars
    phaserScene.load.atlas(DIALOGUE_HUMANS_THUMBNAILS, './assets/extracted/Characters/humansthumbnail.png', './assets/extracted/Characters/humansthumbnail.json');
    phaserScene.load.atlas(DIALOGUE_HORSES_THUMBNAILS, './assets/extracted/Characters/horsesthumbnail.png', './assets/extracted/Characters/horsesthumbnail.json');

    // Continue button
    // TODO : Find / Recreate the correct button
    phaserScene.load.image(DIALOGUE_CONTINUE_BTN, "./assets/extracted/UI/Common/CloseButton.png");

    // TODO : get the scroll bar
}

function instantiateDialogueUI(phaserScene)
{
    var panel = phaserScene.add.image(10, 270, DIALOGUE_PANEL_IMG)
                    .setOrigin(0)
                    .setScrollFactor(0)
                    .setDepth(100);

    
    // Character name
    var charaName = phaserScene.add.text(83, 281, 'Character Name', CHARA_NAME_TEXT_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setDepth(100);

    // Character Avatar
    var charaPortrait = phaserScene.add.image(22.5, 255, DIALOGUE_HUMANS_THUMBNAILS, "C001")
                            .setOrigin(0)
                            .setScrollFactor(0)
                            .setDepth(100);
    // TODO : Character avatar mask

    // Normal text
    var normalText = phaserScene.add.text(105, 325, 'Dialogue Text goes here...', DIALOGUE_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setDepth(100);

    // Continue button
    var continueBtn = phaserScene.add.image(105, 400, DIALOGUE_CONTINUE_BTN)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setDepth(100)
                        .setInteractive();

    continueBtn.on('pointerover', function (pointer) 
    { 

    });
    continueBtn.on('pointerout', function (pointer) 
    { 

    });

    continueBtn.on('pointerup', function (pointer) 
    { 
        nextDialogue(phaserScene);
    });

    var continueTxt = phaserScene.add.text(155, 412, 'Continue', DIALOGUE_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setDepth(100);

    // Choice text
    // TODO

    phaserScene.ui = 
    {
        panelImg: panel,
        charaName: charaName,
        charaPortrait: charaPortrait,
        normalText : normalText,
        continueBtn : continueBtn,
        continueTxt : continueTxt
    };

    hideDialogue(phaserScene);
}

function showDialogue(phaserScene, character, text, choices)
{
    if (phaserScene.ui === undefined)
        instantiateDialogueUI(phaserScene);

    phaserScene.ui.open = true;
    phaserScene.ui.panelImg.setAlpha(1);

    // TODO :Need to get the localized name
    phaserScene.ui.charaName.setAlpha(1);
    phaserScene.ui.charaName.text = character.name;
    phaserScene.ui.charaPortrait.setAlpha(1);
    phaserScene.ui.charaPortrait.setTexture((character.id.indexOf('C') > -1 ? DIALOGUE_HUMANS_THUMBNAILS : DIALOGUE_HORSES_THUMBNAILS));
    phaserScene.ui.charaPortrait.setFrame(character.id);

    phaserScene.ui.normalText.setAlpha(1);
    phaserScene.ui.normalText.setText(formatQuestText(text)); // TODO : Handle with localization 

    phaserScene.ui.continueBtn.setAlpha(1);
    phaserScene.ui.continueTxt.setAlpha(1);

    // TODO : get the dialogue choices
}

function hideDialogue(phaserScene)
{
    phaserScene.ui.open = false;
    phaserScene.ui.panelImg.setAlpha(0);
    phaserScene.ui.charaName.setAlpha(0);
    phaserScene.ui.charaPortrait.setAlpha(0);
    phaserScene.ui.normalText.setAlpha(0);
    phaserScene.ui.continueBtn.setAlpha(0);
    phaserScene.ui.continueTxt.setAlpha(0);
}

function pickChoice(phaserScene, choiceID)
{

}

function nextDialogue(phaserScene)
{
    hideDialogue(phaserScene);
    checkIfCanDoQuestAction(phaserScene);
}

//------- DIALOGUE UTILS -------
function formatQuestText(text)
{
    // TODO: Handle formatting correctly for the bold/italic/font size/color change in the middle of the text
    // Potential solution: https://www.html5gamedevs.com/topic/37309-rexbbcodetext-rextagtext/
    if (text.indexOf("b&gt;") > 0)
    {
        // Bold
        text = text.replaceAll("/b&gt;", "");
        text = text.replaceAll("b&gt;", "");
    }

    if (text.indexOf("i&gt;") > 0)
    {
        // Italic
        text = text.replaceAll("/i&gt;", "");
        text = text.replaceAll("i&gt;", "");
    }

    if (text.indexOf("&lt;") > 0)
    {
        text = text.replaceAll("&lt;", "");
    }

    if (text.indexOf("font size='12' color='grey'") > 0)
    {
        // TODO: Temporary to have clean text while testing other elements
        text = text.replaceAll("font size='12' color='grey'&gt;", "");
        text = text.replaceAll("/font&gt;", "");
    }

    return text;
}

//------- END DIALOGUE UTILS -------