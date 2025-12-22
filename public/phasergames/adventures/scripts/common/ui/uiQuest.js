class uiQuest extends uiManagerBase
{
    QUEST_PANEL_IMG = "quest_bgpanel"
    QUEST_MASK_IMG = "quest_mask_bgpanel"

    THIN_TEXT_BLACK_SETTINGS = 
    {
        font: "12px Arial",
        color: "black",
        wordWrap: { width: 250 }
    }

    BOLD_TEXT_BLACK_SETTINGS = 
    {
        font: "700 16px Arial",
        color: "black",
        wordWrap: { width: 250 }
    }

    MEDIUM_BOLD_TEXT_BLACK_SETTINGS = 
    {
        font: "700 14px Arial",
        color: "black",
        wordWrap: { width: 250 }
    }

    SMALL_BOLD_TEXT_BLACK_SETTINGS = 
    {
        font: "700 14px Arial",
        color: "black",
        wordWrap: { width: 250 }
    }


    constructor(phaserScene)
    {
        super(phaserScene, "quest");

        this.load()
        this.phaserScene.sharedData[this.key].ui.manager = this;
        
        this.shownQuests = {};
    }

    load()
    {
        super.load()
        // Background panel
        this.phaserScene.load.image(this.QUEST_PANEL_IMG, "./assets/extracted/UI/Quest/Journal_Panel.png");
        // Background panel
        this.phaserScene.load.image(this.QUEST_MASK_IMG, "./assets/extracted/UI/Quest/mask.png");

        // Close btn
        this.phaserScene.load.atlas("closeBtn", `${ROOT_ASSETS_PATH}UI/Common/closeBtn.png`, `${ROOT_ASSETS_PATH}UI/Common/closeBtn.json`);
    }

    create()
    {
        this.phaserScene.sharedData.hud.ui.journalButton.on('pointerup', function (pointer){
            this.phaserScene.sharedData[this.key].ui.manager.show();
        }, this);
    }

    initialize()
    {
        var panel = this.phaserScene.add.image(35, -20, this.QUEST_PANEL_IMG)
                            .setOrigin(0)
                            .setScrollFactor(0);

        // Right page
        var currentQuestTitle = this.phaserScene.add.text(430, 140, 'Quest Title', this.BOLD_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0);

        // TODO: Link to loca
        var lookforTxt = this.phaserScene.add.text(520, 200, this.phaserScene.sharedData.ui.localization.items[0].journalGiver[0].text, this.SMALL_BOLD_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0);

        var lookforDescTxt = this.phaserScene.add.text(540, 220, 'Thing to look for', this.THIN_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0);

        // TODO: Link to loca
        var locationTxt = this.phaserScene.add.text(520, 250, this.phaserScene.sharedData.ui.localization.items[0].journalLocation[0].text, this.SMALL_BOLD_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0);

        var locationDescTxt = this.phaserScene.add.text(540, 270, 'Place to go to', this.THIN_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0);
            
        // TODO: Link to loca
        var goalTxt = this.phaserScene.add.text(435, 310, this.phaserScene.sharedData.ui.localization.items[0].journalGoal[0].text, this.SMALL_BOLD_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0);

        var goalDescTxt = this.phaserScene.add.text(455, 330, 'Goal to do', this.THIN_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0);

        var questMask = this.phaserScene.add.image(432, 196, this.QUEST_MASK_IMG)
                            .setOrigin(0)
                            .setScrollFactor(0);
        var questIcon = this.phaserScene.add.image(430, 190, "closeBtn", "up")
                            .setOrigin(0)
                            .setScrollFactor(0);
        const mask = new Phaser.Display.Masks.BitmapMask(this.phaserScene, questMask);
        questIcon.setMask(mask);

        var closeBtn = this.phaserScene.add.sprite(687, 112, "closeBtn", "up")
                        .setOrigin(0)
                        .setScale(0.8)
                        .setScrollFactor(0)
                        .setInteractive({ useHandCursor: true });

        
        // Left page
        //this.phaserScene.add.graphics().fillStyle(0x000000).fillRect(115, 150, 260, 300).setAlpha(.5).setScrollFactor(0);
        const scrollMask = new Phaser.Display.Masks.GeometryMask(this.phaserScene, this.phaserScene.make.graphics().fillRect(115, 150, 280, 300)
                        .setScrollFactor(0))
        //this.phaserScene.add.graphics().fillStyle(0x000000).fillRect(380, 150, 20, 300).setAlpha(.5).setScrollFactor(0);
        const scrollZone = this.phaserScene.add.zone(380, 150, 20, 300)
                        .setScrollFactor(0)
                        .setOrigin(0)
                        .setInteractive()
        const scrollBar = this.phaserScene.add.sprite(515, 191, this.SCROLL, "scroll")
                        .setScrollFactor(0)
                        .setOrigin(0);
        const scrollUp = this.phaserScene.add.sprite(scrollZone.x, scrollZone.y-21, this.SCROLL, "arrowScroll_1")
                        .setScrollFactor(0)
                        .setOrigin(0);
        const scrollDown = this.phaserScene.add.sprite(scrollZone.x, scrollZone.y + scrollZone.height + 20, this.SCROLL, "arrowScroll_1")
                        .setScrollFactor(0)
                        .setOrigin(1, 0)
                        .setAngle(180);

        this.phaserScene.sharedData[this.key].ui.elements =
        {
            open: false,
            panelImg: panel,
            closeBtn: closeBtn,
            // Right page
            questTitle: currentQuestTitle,
            lookforTxt: lookforTxt,
            lookforDescTxt: lookforDescTxt,
            locationTxt: locationTxt,
            locationDescTxt: locationDescTxt,
            goalTxt: goalTxt,
            goalDescTxt: goalDescTxt,
            questMask: questMask,
            questIcon: questIcon,
            // Left page
            scrollMask: scrollMask,
            scrollZone: scrollZone,
            scrollBar: scrollBar,
            scrollUp: scrollUp,
            scrollDown: scrollDown
        }

        super.initialize();
    }

    show()
    {
            let test = super.show()
            if (!test) return

            this.phaserScene.sharedData[this.key].ui.elements.panelImg.setAlpha(1);
            this.phaserScene.sharedData[this.key].ui.elements.closeBtn.setAlpha(1).setFrame("up");

            this.updateQuestList();

            this.turnOnEvents()
    }

    hide()
    {
        super.hide();

        this.phaserScene.sharedData[this.key].ui.open = false;
        this.phaserScene.sharedData[this.key].ui.elements.panelImg.setAlpha(0);
        this.phaserScene.sharedData[this.key].ui.elements.closeBtn.setAlpha(0);
        this.phaserScene.sharedData[this.key].ui.elements.questTitle.setAlpha(0);
        this.phaserScene.sharedData[this.key].ui.elements.lookforTxt.setAlpha(0);
        this.phaserScene.sharedData[this.key].ui.elements.lookforDescTxt.setAlpha(0);
        this.phaserScene.sharedData[this.key].ui.elements.locationTxt.setAlpha(0);
        this.phaserScene.sharedData[this.key].ui.elements.locationDescTxt.setAlpha(0);
        this.phaserScene.sharedData[this.key].ui.elements.goalTxt.setAlpha(0);
        this.phaserScene.sharedData[this.key].ui.elements.goalDescTxt.setAlpha(0);
        this.phaserScene.sharedData[this.key].ui.elements.questIcon.setAlpha(0);
        this.phaserScene.sharedData[this.key].ui.elements.questMask.setAlpha(0);

        for (let key in this.shownQuests) {
            let quest = this.shownQuests[key];

            for (let subKey in quest) {
                quest[subKey].destroy();
            }
        }

        this.shownQuests = {};
    }

    updateQuestList()
    {
        let shownQuestsCount = 0
        this.shownQuests = {};

        let startPos = [130, 140];
        let offset = 40;

        for (let i = 0; i < this.phaserScene.sharedData[this.key].logic.activeQuests.length; i++)
        {
            let questID = this.phaserScene.sharedData[this.key].logic.activeQuests[i];
            let questData = this.phaserScene.sharedData[this.key].manager.getQuestPerID(questID);
            let adventure = this.phaserScene.sharedData[this.key].manager.getAdventurePerID(questID);

            if (questData.visible !== undefined && questData.visible === "False") continue;

            shownQuestsCount++;
            //this.phaserScene.add.graphics().fillStyle(0x000000).fillRect(startPos[0], startPos[1] + (offset * this.shownQuests.length - 1) - 5, 250, 50).setAlpha(.5).setScrollFactor(0);
            let slotBtn = this.phaserScene.add.graphics().setInteractive(
                new Phaser.Geom.Rectangle(startPos[0], startPos[1] + (offset * shownQuestsCount) - 5, 250, 50), Phaser.Geom.Rectangle.Contains);
            slotBtn.on("pointerdown", () => 
            {
                this.selectCurrentQuestForDetails(questID);
            })

            let titleTxt = this.phaserScene.add.text(startPos[0], startPos[1] + (offset * shownQuestsCount), adventure.description.text, this.MEDIUM_BOLD_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0);
            let descTxt = this.phaserScene.add.text(startPos[0], startPos[1] + (offset * shownQuestsCount) + 20, questData.description.text, this.THIN_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0);
            
            this.shownQuests[questID] =
            {
                btn: slotBtn,
                title: titleTxt,
                desc: descTxt
            }

            if (shownQuestsCount === 1)
            {
                this.selectCurrentQuestForDetails(questID);
            }
        }
    }

    selectCurrentQuestForDetails(questID)
    {
        let adventure = this.phaserScene.sharedData[this.key].manager.getAdventurePerID(questID);
        let quest = this.phaserScene.sharedData[this.key].manager.getQuestPerID(questID);

        this.phaserScene.sharedData[this.key].ui.elements.questTitle.setAlpha(1);
        this.phaserScene.sharedData[this.key].ui.elements.lookforTxt.setAlpha(1);
        this.phaserScene.sharedData[this.key].ui.elements.lookforDescTxt.setAlpha(1);
        this.phaserScene.sharedData[this.key].ui.elements.locationTxt.setAlpha(1);
        this.phaserScene.sharedData[this.key].ui.elements.locationDescTxt.setAlpha(1);
        this.phaserScene.sharedData[this.key].ui.elements.goalTxt.setAlpha(1);
        this.phaserScene.sharedData[this.key].ui.elements.goalDescTxt.setAlpha(1);
        this.phaserScene.sharedData[this.key].ui.elements.questIcon.setAlpha(1);
        this.phaserScene.sharedData[this.key].ui.elements.questMask.setAlpha(1);

        this.phaserScene.sharedData[this.key].ui.elements.questTitle.setText(adventure.description.text);


        if (quest.line[0].trigger === undefined)
        {
            this.phaserScene.sharedData[this.key].ui.elements.lookforDescTxt.setText("");
            this.phaserScene.sharedData[this.key].ui.elements.locationDescTxt.setText("");
            this.phaserScene.sharedData[this.key].ui.elements.questIcon.setAlpha(0);
        }
        else
        {
            if (quest.line[0].trigger.object[0].identifier !== undefined)
            {
                let identifier = quest.line[0].trigger.object[0].identifier;
                this.phaserScene.sharedData[this.key].ui.elements.lookforDescTxt.setText(this.phaserScene.sharedData.template.manager.getTemplateValue(`${identifier}Template`, "name"));
                this.phaserScene.sharedData[this.key].ui.elements.questIcon.setAlpha(1);

                let thumbnailFolderName = this.phaserScene.sharedData.template.manager.getTemplateValue(`${identifier}Template`, ["Thumbnail", "fileName", "text"])
                thumbnailFolderName = thumbnailFolderName.split("/")
                thumbnailFolderName = thumbnailFolderName[thumbnailFolderName.length - 1].replace(".swf", "")
                let thumbnail = this.phaserScene.sharedData.template.manager.getTemplateValue(`${identifier}Template`, ["Thumbnail", "className", "text"]);

                this.phaserScene.sharedData[this.key].ui.elements.questIcon.setTexture(thumbnailFolderName);
                this.phaserScene.sharedData[this.key].ui.elements.questIcon.setFrame(thumbnail);
                if (thumbnailFolderName === "specialthumbnail" || thumbnail === "BSA") {
                    this.phaserScene.sharedData[this.key].ui.elements.questIcon.setPosition(430, 185);
                } else {
                    this.phaserScene.sharedData[this.key].ui.elements.questIcon.setPosition(420, 185);
                }
            }
            else
            {
                this.phaserScene.sharedData[this.key].ui.elements.lookforDescTxt.setText("");
                this.phaserScene.sharedData[this.key].ui.elements.questIcon.setAlpha(0);
            }

            if (quest.line[0].trigger.object[0].zone !== undefined)
            {
                this.phaserScene.sharedData[this.key].ui.elements.locationDescTxt.setText(quest.line[0].trigger.object[0].zone);
            }
            else if (quest.line[0].trigger.object[0].identifier !== undefined)
            {
                let identifier = quest.line[0].trigger.object[0].identifier;
                const locationData = this.phaserScene.sharedData.template.manager.getEntityZones(`${identifier}Template`)
                if (locationData[0]) {
                    this.phaserScene.sharedData[this.key].ui.elements.locationDescTxt.setText(this.phaserScene.sharedData.zone.manager.getZoneName(locationData[0]));
                }
                else
                {
                    this.phaserScene.sharedData[this.key].ui.elements.locationDescTxt.setText("");
                }
            }
            else
            {
                this.phaserScene.sharedData[this.key].ui.elements.locationDescTxt.setText("");
            }
        }
        

        this.phaserScene.sharedData[this.key].ui.elements.goalDescTxt.setText(quest.description.text);
    }

    turnOnEvents()
    {
        this.phaserScene.sharedData[this.key].ui.elements.closeBtn.on('pointerup', (pointer) => { this.hide(); });
        this.phaserScene.sharedData[this.key].ui.elements.closeBtn.on('pointerdown', (pointer) =>  { this.phaserScene.sharedData[this.key].ui.elements.closeBtn.setFrame("down") });
        this.phaserScene.sharedData[this.key].ui.elements.closeBtn.on('pointerover', (pointer) =>  { this.phaserScene.sharedData[this.key].ui.elements.closeBtn.setFrame("over") });
        this.phaserScene.sharedData[this.key].ui.elements.closeBtn.on('pointerout', (pointer) =>  { this.phaserScene.sharedData[this.key].ui.elements.closeBtn.setFrame("up") });
    }
    turnOffEvents()
    {
        this.phaserScene.sharedData[this.key].ui.elements.closeBtn.off('pointerup');
        this.phaserScene.sharedData[this.key].ui.elements.closeBtn.off('pointerdown');
        this.phaserScene.sharedData[this.key].ui.elements.closeBtn.off('pointerover');
        this.phaserScene.sharedData[this.key].ui.elements.closeBtn.off('pointerout');
    }
}