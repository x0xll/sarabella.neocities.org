const DIALOGUE_PANEL_IMG = "Dialogue_Panel";
const DIALOGUE_AVATAR_MASK = "Dialogue_Avatar_Mask";
const DIALOGUE_CONTINUE_BTN = "Dialogue_Continue_Btn";
const DIALOGUE_HUMANS_THUMBNAILS = "humansthumbnails";

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

    phaserScene.dialogueBox = 
    {
        panelImg: panel,
        charaName: charaName,
        charaPortrait: charaPortrait,
        normalText : normalText,
        continueBtn : continueBtn,
        continueTxt : continueTxt
    };
}

function showDialogue(phaserScene, character, text, choices)
{
    if (phaserScene.dialogueBox === undefined)
        instantiateDialogueUI(phaserScene);

    phaserScene.dialogueBox.open = true;
    phaserScene.dialogueBox.panelImg.setAlpha(1);

    // TODO :Need to get the localized name, character is also supposed to help with finding the chara avatar
    phaserScene.dialogueBox.charaName.setAlpha(1);
    phaserScene.dialogueBox.charaName.text = character.name;
    phaserScene.dialogueBox.charaPortrait.setAlpha(1);
    phaserScene.dialogueBox.charaPortrait.setFrame(character.id);

    phaserScene.dialogueBox.normalText.setAlpha(1);
    phaserScene.dialogueBox.normalText.text = text; // TODO : Handle with localization 

    phaserScene.dialogueBox.continueBtn.setAlpha(1);
    phaserScene.dialogueBox.continueTxt.setAlpha(1);

    // TODO : get the chara img
    // TODO : get the dialogue text
    // TODO : get the dialogue choices
}

function hideDialogue(phaserScene)
{
    phaserScene.dialogueBox.open = false;
    phaserScene.dialogueBox.panelImg.setAlpha(0);
    phaserScene.dialogueBox.charaName.setAlpha(0);
    phaserScene.dialogueBox.charaPortrait.setAlpha(0);
    phaserScene.dialogueBox.normalText.setAlpha(0);
    phaserScene.dialogueBox.continueBtn.setAlpha(0);
    phaserScene.dialogueBox.continueTxt.setAlpha(0);
}

function pickChoice(phaserScene, choiceID)
{

}

function nextDialogue(phaserScene)
{
    // TEMP
    hideDialogue(phaserScene);
}