class uiDialogue extends uiManagerBase
{
    DIALOGUE_PANEL_IMG = "Dialogue_Panel";
    DIALOGUE_AVATAR_MASK = "Dialogue_Avatar_Mask";
    DIALOGUE_CONTINUE_BTN = "Dialogue_Continue_Btn";
    DIALOGUE_HUMANS_THUMBNAILS = "humansthumbnails";
    DIALOGUE_HORSES_THUMBNAILS = "horsesthumbnails";
    DIALOGUE_MAGICFRIENDS_THUMBNAILS = "magicfriendsthumbnails";

    CHARA_NAME_TEXT_SETTINGS = 
    {
        font: "bold 25px Arial",
        color: "white",
        stroke: "#D1A844",
        strokeThickness: 5
    }

    DIALOGUE_TEXT_BLACK_SETTINGS = 
    {
        font: "18px Arial",
        color: "#792AA8",
        wordWrap: { width: 650 }
    }

    DIALOGUE_TEXT_PURPLE_SETTINGS = 
    {
        font: "18px Arial",
        color: "black",
        wordWrap: { width: 650 }
    }

    constructor(phaserScene)
    {
        super(phaserScene);
    }

    load()
    {
        // Background panel
        this.phaserScene.load.image(this.DIALOGUE_PANEL_IMG, "./assets/extracted/UI/Dialogue/Panel.png");

        // Avatar mask
        //phaserScene.load.image(DIALOGUE_AVATAR_MASK, "./assets/extracted/UI/Dialogue/PortraitMask.png");

        // Avatars
        this.phaserScene.load.atlas(this.DIALOGUE_HUMANS_THUMBNAILS, './assets/extracted/Characters/humansthumbnail.png', './assets/extracted/Characters/humansthumbnail.json');
        this.phaserScene.load.atlas(this.DIALOGUE_HORSES_THUMBNAILS, './assets/extracted/Characters/horsesthumbnails.png', './assets/extracted/Characters/horsesthumbnails.json');
        this.phaserScene.load.atlas(this.DIALOGUE_MAGICFRIENDS_THUMBNAILS, './assets/extracted/Characters/magicfriendsthumbnails.png', './assets/extracted/Characters/magicfriendsthumbnails.json');

        // Continue button
        // TODO : Find / Recreate the correct button
        this.phaserScene.load.image(this.DIALOGUE_CONTINUE_BTN, "./assets/extracted/UI/Common/CloseButton.png");

        // TODO : get the scroll bar
    }

    initialize()
    {
        var panel = this.phaserScene.add.image(10, 270, this.DIALOGUE_PANEL_IMG)
                        .setOrigin(0)
                        .setScrollFactor(0);
     
        // Character name
        var charaName = this.phaserScene.add.text(83, 281, 'Character Name', this.CHARA_NAME_TEXT_SETTINGS)
                            .setOrigin(0)
                            .setScrollFactor(0);

        // Character Avatar
        var charaPortrait = this.phaserScene.add.image(22.5, 255, this.DIALOGUE_HUMANS_THUMBNAILS, "C001")
                                .setOrigin(0)
                                .setScrollFactor(0);
        // TODO : Character avatar mask

        // Normal text
        var normalText = this.phaserScene.add.text(105, 325, 'Dialogue Text goes here...', this.DIALOGUE_TEXT_BLACK_SETTINGS)
                            .setOrigin(0)
                            .setScrollFactor(0);

        // Continue button
        var continueBtn = this.phaserScene.add.image(105, 400, this.DIALOGUE_CONTINUE_BTN)
                            .setOrigin(0)
                            .setScrollFactor(0)
                            .setInteractive();

        continueBtn.on('pointerover', (pointer) => 
        { 

        });
        continueBtn.on('pointerout', (pointer) => 
        { 

        });

        continueBtn.on('pointerup', (pointer) => 
        { 
            this.hide();
            checkIfCanDoQuestAction(this.phaserScene);
        });

        var continueTxt = this.phaserScene.add.text(155, 412, 'Continue', this.DIALOGUE_TEXT_BLACK_SETTINGS)
                            .setOrigin(0)
                            .setScrollFactor(0)
                            .setDepth(100);

        // Choice text
        // TODO

        this.phaserScene.sharedData.dialogue.ui.elements = 
        {
            panelImg: panel,
            charaName: charaName,
            charaPortrait: charaPortrait,
            normalText : normalText,
            continueBtn : continueBtn,
            continueTxt : continueTxt
        };

        super.initialize();
    }


    // TODO: Handle if dialogue has no character to display
    show(phaserScene, characterid, text, choices)
    {
        // TODO get character name from id
        const character = {name: characterid, id: characterid}

        if (phaserScene.sharedData.dialogue.ui.elements === undefined)
            this.initialize();

        if (phaserScene.sharedData.global.uiOpen)
            return;

        this.phaserScene.sharedData.global.uiOpen = true;
        this.phaserScene.sharedData.dialogue.ui.open = true;
        this.phaserScene.sharedData.dialogue.ui.elements.panelImg.setAlpha(1);

        // TODO :Need to get the localized name
        this.phaserScene.sharedData.dialogue.ui.elements.charaName.setAlpha(1);
        this.phaserScene.sharedData.dialogue.ui.elements.charaName.text = character.name;
        this.phaserScene.sharedData.dialogue.ui.elements.charaPortrait.setAlpha(1);
        this.phaserScene.sharedData.dialogue.ui.elements.charaPortrait.setTexture(
            (character.id.indexOf('C') > -1 ? this.DIALOGUE_HUMANS_THUMBNAILS 
             : (character.id.indexOf('M') > -1) ? this.DIALOGUE_MAGICFRIENDS_THUMBNAILS 
             : this.DIALOGUE_HORSES_THUMBNAILS));
        this.phaserScene.sharedData.dialogue.ui.elements.charaPortrait.setFrame(character.id);

        this.phaserScene.sharedData.dialogue.ui.elements.normalText.setAlpha(1);
        this.phaserScene.sharedData.dialogue.ui.elements.normalText.setText(this.formatQuestText(text)); // TODO : Handle with localization 

        this.phaserScene.sharedData.dialogue.ui.elements.continueBtn.setAlpha(1);
        this.phaserScene.sharedData.dialogue.ui.elements.continueTxt.setAlpha(1);

        // TODO : get the dialogue choices
    }

    hide()
    {
        super.hide();

        this.phaserScene.sharedData.dialogue.ui.open = false;
        this.phaserScene.sharedData.dialogue.ui.elements.panelImg.setAlpha(0);
        this.phaserScene.sharedData.dialogue.ui.elements.charaName.setAlpha(0);
        this.phaserScene.sharedData.dialogue.ui.elements.charaPortrait.setAlpha(0);
        this.phaserScene.sharedData.dialogue.ui.elements.normalText.setAlpha(0);
        this.phaserScene.sharedData.dialogue.ui.elements.continueBtn.setAlpha(0);
        this.phaserScene.sharedData.dialogue.ui.elements.continueTxt.setAlpha(0);
    }

    formatQuestText(text)
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
}