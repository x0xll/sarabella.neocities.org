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

    DIALOGUE_TEXT_BLACK_SETTINGS_BBCODE = 
    {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#792AA8",
        wrap: {
            mode: 'word',
            width: 600
        }
    }

    DIALOGUE_TEXT_PURPLE_SETTINGS = 
    {
        font: "18px Arial",
        color: "black",
        wordWrap: { width: 650 }
    }

    constructor(phaserScene)
    {
        super(phaserScene, "dialogue");

        this.phaserScene.load.plugin('rexbbcodetextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js', true);

        super.load()
        this.phaserScene.sharedData[this.key].ui.manager = this;
    }

    load()
    {
        // Background panel
        this.phaserScene.load.image(this.DIALOGUE_PANEL_IMG, "./assets/extracted/UI/Dialogue/Panel.png");

        // Avatar mask
        this.phaserScene.load.image(this.DIALOGUE_AVATAR_MASK, "./assets/extracted/UI/Dialogue/PortraitMask.png");

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

        // Character avatar mask
        const x = 10
        const y = 270
        var charaPortraitMask = this.phaserScene.add.image(x, y, this.DIALOGUE_AVATAR_MASK)
                                .setOrigin(0)
                                .setScrollFactor(0);

        // Character Avatar
        var charaPortrait = this.phaserScene.add.image(x-2, y, this.DIALOGUE_HUMANS_THUMBNAILS, "C001")
                                .setOrigin(0)
                                .setScrollFactor(0);
        const mask = new Phaser.Display.Masks.BitmapMask(this.phaserScene, charaPortraitMask);
        charaPortrait.setMask(mask);

        // Normal text
        var normalText = this.phaserScene.add.rexBBCodeText(105, 325, 'Dialogue Text goes here...', this.DIALOGUE_TEXT_BLACK_SETTINGS_BBCODE)
                            .setOrigin(0)
                            .setScrollFactor(0);

        // Normal images text
        var normalImgText = this.phaserScene.add.rexBBCodeText(155, 325, 'Dialogue Text goes here...', this.DIALOGUE_TEXT_BLACK_SETTINGS_BBCODE)
                            .setOrigin(0)
                            .setScrollFactor(0);

        // Side Image
        var sideImg = this.phaserScene.add.image(105, 330, "dialogue_sideimgtxt")
                            .setOrigin(0)
                            .setScrollFactor(0)
                            .setInteractive();

        // Continue button
        var continueBtn = this.phaserScene.add.image(105, 480, this.DIALOGUE_CONTINUE_BTN)
                            .setOrigin(0)
                            .setScrollFactor(0)
                            .setInteractive();

        var continueTxt = this.phaserScene.add.text(continueBtn.x+50, continueBtn.y+12, 'Continue', this.DIALOGUE_TEXT_BLACK_SETTINGS)
                            .setOrigin(0)
                            .setScrollFactor(0)
                            .setDepth(100);

        // Choice text
        // TODO

        // Image icons

        this.phaserScene.sharedData.dialogue.ui.elements = 
        {
            panelImg: panel,
            charaName: charaName,
            charaPortraitMask: charaPortraitMask,
            charaPortrait: charaPortrait,
            normalText : normalText,
            continueBtn : continueBtn,
            continueTxt : continueTxt,
            normalImgText : normalImgText,
            sideImg : sideImg
        };

        super.initialize();
    }

    // TODO: Handle if dialogue has no character to display
    show(questID, characterid, text, choices, image)
    {
        // Lazy loading UI
        this.phaserScene.load.once('complete', () => {
            let test = super.show()
            if (!test) return

            // TODO check if this actually works
            if (Array.isArray(text) && text.length === 1) {
                text = text[0]
            } else if (Array.isArray(text)) {
                let rand = randomIntFromInterval(0, text.length - 1)
                text = text[rand]
            }

            // Character portrait
            const character = {
                name: this.phaserScene.sharedData.templateManager.getTemplateValue(`${characterid}Template`, "name"), 
                id: characterid
            }
            this.phaserScene.sharedData.dialogue.ui.elements.charaName.text = character.name;
            this.phaserScene.sharedData.dialogue.ui.elements.charaPortrait.setTexture(
                (character.id.indexOf('C') > -1 ? this.DIALOGUE_HUMANS_THUMBNAILS 
                : (character.id.indexOf('M') > -1) ? this.DIALOGUE_MAGICFRIENDS_THUMBNAILS 
                : this.DIALOGUE_HORSES_THUMBNAILS));
            this.phaserScene.sharedData.dialogue.ui.elements.charaPortrait.setFrame(character.id);

            let textElement = this.phaserScene.sharedData.dialogue.ui.elements.normalText
            if (image !== undefined)
            {
                textElement = this.phaserScene.sharedData.dialogue.ui.elements.normalImgText
                
                this.lastImage = image
                this.phaserScene.load.once('complete', () => {
                        this.phaserScene.sharedData.dialogue.ui.elements.sideImg.setTexture(`Dialogue${this.lastImage}`);
                        this.phaserScene.sharedData.dialogue.ui.elements.sideImg.setAlpha(this.phaserScene.sharedData.dialogue.ui.elements.charaPortrait.alpha);
                    }, this);
                this.phaserScene.load.image(`Dialogue${image}`, `./assets/extracted/UI/Dialogue/Images/${image}.png`);
                this.phaserScene.load.start();
            }
            textElement.setText(this.formatQuestText(text));

            // TODO : get the dialogue choices

            this.turnOnEvents(questID)

            // Set UI item position
            textElement.setY(this.phaserScene.sharedData.dialogue.ui.elements.continueBtn.y - textElement.height - 20)
            this.phaserScene.sharedData.dialogue.ui.elements.sideImg.setY(textElement.y+5) // +5
            this.phaserScene.sharedData.dialogue.ui.elements.charaName.setY(textElement.y-44)
            this.phaserScene.sharedData.dialogue.ui.elements.charaPortrait.setY(textElement.y-55)
            this.phaserScene.sharedData.dialogue.ui.elements.charaPortraitMask.setY(textElement.y-55)
            this.phaserScene.sharedData.dialogue.ui.elements.panelImg.setY(textElement.y-55)

            // Set UI items visible
            this.phaserScene.sharedData.dialogue.ui.elements.panelImg.setAlpha(1);
            textElement.setAlpha(1);
            this.phaserScene.sharedData.dialogue.ui.elements.charaName.setAlpha(1);
            this.phaserScene.sharedData.dialogue.ui.elements.charaPortrait.setAlpha(1);
            this.phaserScene.sharedData.dialogue.ui.elements.charaPortraitMask.setAlpha(1);
            this.phaserScene.sharedData.dialogue.ui.elements.continueBtn.setAlpha(1);
            this.phaserScene.sharedData.dialogue.ui.elements.continueTxt.setAlpha(1);
        }, this, true);
        this.load();
        this.phaserScene.load.start();
    }

    hide()
    {
        super.hide();

        this.phaserScene.sharedData.dialogue.ui.elements.panelImg.setAlpha(0);
        this.phaserScene.sharedData.dialogue.ui.elements.charaName.setAlpha(0);
        this.phaserScene.sharedData.dialogue.ui.elements.charaPortrait.setAlpha(0);
        this.phaserScene.sharedData.dialogue.ui.elements.charaPortraitMask.setAlpha(0);
        this.phaserScene.sharedData.dialogue.ui.elements.normalText.setAlpha(0);
        this.phaserScene.sharedData.dialogue.ui.elements.continueBtn.setAlpha(0);
        this.phaserScene.sharedData.dialogue.ui.elements.continueTxt.setAlpha(0);
        this.phaserScene.sharedData.dialogue.ui.elements.normalImgText.setAlpha(0);
        this.phaserScene.sharedData.dialogue.ui.elements.sideImg.setAlpha(0);

    }


    // ------- UI EVENTS -------
    turnOnEvents(questID)
    {
        this.phaserScene.sharedData.dialogue.ui.elements.continueBtn.on('pointerover', (pointer) => { });
        this.phaserScene.sharedData.dialogue.ui.elements.continueBtn.on('pointerout', (pointer) => { });
        this.phaserScene.sharedData.dialogue.ui.elements.continueBtn.on('pointerup', this.#continueOption, {questID: questID, UI: this});
        this.phaserScene.sharedData.keyboard.space.on("up", this.#continueOption, {questID: questID, UI: this});
        this.phaserScene.sharedData.keyboard.enter.on("up", this.#continueOption, {questID: questID, UI: this});
    }

    turnOffEvents()
    {
        this.phaserScene.sharedData.dialogue.ui.elements.continueBtn.off('pointerover');
        this.phaserScene.sharedData.dialogue.ui.elements.continueBtn.off('pointerout');
        this.phaserScene.sharedData.dialogue.ui.elements.continueBtn.off("pointerup", this.#continueOption)
        this.phaserScene.sharedData.keyboard.space.off("up", this.#continueOption);
        this.phaserScene.sharedData.keyboard.enter.off("up", this.#continueOption);
    }
    
    #continueOption() { 
        this.UI.hide();
        this.UI.phaserScene.sharedData.lastChoice = "continue"

        let questData = this.UI.phaserScene.sharedData.questManager.getQuestPerID(this.questID);
        this.UI.phaserScene.sharedData.questManager.doQuestAction(this.questID, questData.currentLine, questData.currentAction)
    }
    // ------- END UI EVENTS -------

    formatQuestText(text)
    {
        if (text.indexOf("<b>") > 0) text = text.replaceAll("<b>", "[b]");
        if (text.indexOf("</b>") > 0) text = text.replaceAll("</b>", "[/b]");
        if (text.indexOf("<i>") > 0) text = text.replaceAll("<i>", "[i]");
        if (text.indexOf("</i>") > 0) text = text.replaceAll("</i>", "[/i]");

        // TODO: make more general, this is for testing
        if (text.indexOf("<font size='12' color='grey'>") > 0) text = text.replaceAll("<font size='12' color='grey'>", "[size=12][color=grey]");
        if (text.indexOf("</font>") > 0) text = text.replaceAll("</font>", "[/color][/size]");

        return text;
    }
}