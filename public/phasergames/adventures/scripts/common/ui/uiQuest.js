class uiQuest extends uiManagerBase
{
    QUEST_PANEL_IMG = "quest_bgpanel"

    THIN_TEXT_BLACK_SETTINGS = 
    {
        font: "12px Arial",
        color: "black",
        wordWrap: { width: 650 }
    }

    BOLD_TEXT_BLACK_SETTINGS = 
    {
        font: "24px Arial bold",
        color: "black",
        wordWrap: { width: 250 }
    }

    SMALL_BOLD_TEXT_BLACK_SETTINGS = 
    {
        font: "20px Arial bold",
        color: "black",
        wordWrap: { width: 250 }
    }

    BIG_THIN_TEXT_BLACK_SETTINGS = 
    {
        font: "18px Arial",
        color: "black",
        wordWrap: { width: 650 }
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

        // Close btn
        this.phaserScene.load.image("closebtn", "./assets/extracted/UI/Quest/closebtn.png")
    }

    create()
    {
        this.phaserScene.sharedData.hud.ui.journalButton.on('pointerup', function (pointer){
            this.phaserScene.sharedData.quest.ui.manager.show();
        }, this);
    }

    initialize()
    {
        var panel = this.phaserScene.add.image(35, -20, this.QUEST_PANEL_IMG)
                            .setOrigin(0)
                            .setScrollFactor(0);

        // Left page
        // TODO: scrollview with quests

        // Right page
        var currentQuestTitle = this.phaserScene.add.text(430, 140, 'Quest Title', this.BOLD_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0);

        // TODO: Link to loca
        var lookforTxt = this.phaserScene.add.text(520, 200, 'Look for:', this.THIN_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0);

        var lookforDescTxt = this.phaserScene.add.text(540, 220, 'Thing to look for', this.THIN_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0);

        // TODO: Link to loca
        var locationTxt = this.phaserScene.add.text(520, 250, 'Location:', this.THIN_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0);

        var locationDescTxt = this.phaserScene.add.text(540, 270, 'Place to go to', this.THIN_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0);
            
        // TODO: Link to loca
        var goalTxt = this.phaserScene.add.text(435, 310, 'Goal:', this.THIN_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0);

        var goalDescTxt = this.phaserScene.add.text(455, 330, 'Goal to do', this.THIN_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0);

        var questIcon = this.phaserScene.add.image(455, 222.5, "closebtn")
                            .setOrigin(0)
                            .setScrollFactor(0);

        var closeBtn = this.phaserScene.add.image(687, 112, "closebtn")
                        .setOrigin(0)
                        .setScrollFactor(0)
                        .setInteractive();

        
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

        this.phaserScene.sharedData.quest.ui.elements =
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

            this.phaserScene.sharedData.quest.ui.elements.panelImg.setAlpha(1);
            this.phaserScene.sharedData.quest.ui.elements.closeBtn.setAlpha(1);

            this.updateQuestList();

            this.turnOnEvents()
    }

    hide()
    {
        super.hide();

        this.phaserScene.sharedData.quest.ui.open = false;
        this.phaserScene.sharedData.quest.ui.elements.panelImg.setAlpha(0);
        this.phaserScene.sharedData.quest.ui.elements.closeBtn.setAlpha(0);
        this.phaserScene.sharedData.quest.ui.elements.questTitle.setAlpha(0);
        this.phaserScene.sharedData.quest.ui.elements.lookforTxt.setAlpha(0);
        this.phaserScene.sharedData.quest.ui.elements.lookforDescTxt.setAlpha(0);
        this.phaserScene.sharedData.quest.ui.elements.locationTxt.setAlpha(0);
        this.phaserScene.sharedData.quest.ui.elements.locationDescTxt.setAlpha(0);
        this.phaserScene.sharedData.quest.ui.elements.goalTxt.setAlpha(0);
        this.phaserScene.sharedData.quest.ui.elements.goalDescTxt.setAlpha(0);
        this.phaserScene.sharedData.quest.ui.elements.questIcon.setAlpha(0);

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

        let startPos = [130, 100];
        let offset = 70;

        for (let i = 0; i < this.phaserScene.sharedData.quest.logic.activeQuests.length; i++)
        {
            let questID = this.phaserScene.sharedData.quest.logic.activeQuests[i];
            let questData = this.phaserScene.sharedData.questManager.getQuestPerID(questID);
            let adventure = this.phaserScene.sharedData.questManager.getAdventurePerID(questID);

            if (questData.visible !== undefined && questData.visible === "False") continue;

            if (this.shownQuests.length === 1)
            {
                this.selectCurrentQuestForDetails(questID);
            }

            //this.phaserScene.add.graphics().fillStyle(0x000000).fillRect(startPos[0], startPos[1] + (offset * i) - 5, 250, 50).setAlpha(.5).setScrollFactor(0);
            let slotBtn = this.phaserScene.add.graphics().setInteractive(
                new Phaser.Geom.Rectangle(startPos[0], startPos[1] + (offset * i) - 5, 250, 50), Phaser.Geom.Rectangle.Contains);
            slotBtn.on("pointerdown", () => 
            {
                this.selectCurrentQuestForDetails(questID);
            })

            let titleTxt = this.phaserScene.add.text(startPos[0], startPos[1] + (offset * i), adventure.description.text, this.SMALL_BOLD_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0);
            let descTxt = this.phaserScene.add.text(startPos[0], startPos[1] + (offset * i) + 20, questData.description.text, this.BIG_THIN_TEXT_BLACK_SETTINGS)
                        .setOrigin(0)
                        .setScrollFactor(0);
            
            this.shownQuests[questID] =
            {
                btn: slotBtn,
                title: titleTxt,
                desc: descTxt
            }
            shownQuestsCount++;
        }
    }

    selectCurrentQuestForDetails(questID)
    {
        let adventure = this.phaserScene.sharedData.questManager.getAdventurePerID(questID);
        let quest = this.phaserScene.sharedData.questManager.getQuestPerID(questID);

        this.phaserScene.sharedData.quest.ui.elements.questTitle.setAlpha(1);
        this.phaserScene.sharedData.quest.ui.elements.lookforTxt.setAlpha(1);
        this.phaserScene.sharedData.quest.ui.elements.lookforDescTxt.setAlpha(1);
        this.phaserScene.sharedData.quest.ui.elements.locationTxt.setAlpha(1);
        this.phaserScene.sharedData.quest.ui.elements.locationDescTxt.setAlpha(1);
        this.phaserScene.sharedData.quest.ui.elements.goalTxt.setAlpha(1);
        this.phaserScene.sharedData.quest.ui.elements.goalDescTxt.setAlpha(1);
        this.phaserScene.sharedData.quest.ui.elements.questIcon.setAlpha(1);

        this.phaserScene.sharedData.quest.ui.elements.questTitle.setText(adventure.description.text);


        if (quest.line[0].trigger === undefined)
        {
            this.phaserScene.sharedData.quest.ui.elements.lookforDescTxt.setText("");
            this.phaserScene.sharedData.quest.ui.elements.locationDescTxt.setText("");
            this.phaserScene.sharedData.quest.ui.elements.questIcon.setAlpha(0);
        }
        else
        {
            if (quest.line[0].trigger.object[0].identifier !== undefined)
            {
                let identifier = quest.line[0].trigger.object[0].identifier;
                this.phaserScene.sharedData.quest.ui.elements.lookforDescTxt.setText(this.phaserScene.sharedData.templateManager.getTemplateValue(`${identifier}Template`, "name"));
                this.phaserScene.sharedData.quest.ui.elements.questIcon.setAlpha(1);
                //this.phaserScene.sharedData.quest.ui.elements.questIcon.setTexture(identifier);
            }
            else
            {
                this.phaserScene.sharedData.quest.ui.elements.lookforDescTxt.setText("");
                this.phaserScene.sharedData.quest.ui.elements.questIcon.setAlpha(0);
            }

            if (quest.line[0].trigger.object[0].zone !== undefined)
            {
                this.phaserScene.sharedData.quest.ui.elements.locationDescTxt.setText(quest.line[0].trigger.object[0].zone);
            }
            else
            {
                this.phaserScene.sharedData.quest.ui.elements.locationDescTxt.setText("");
            }
        }
        

        this.phaserScene.sharedData.quest.ui.elements.goalDescTxt.setText(quest.description.text);
    }

    turnOnEvents()
    {
        this.phaserScene.sharedData.quest.ui.elements.closeBtn.on('pointerup', (pointer) => { this.hide(); });
    }
    turnOffEvents()
    {
        this.phaserScene.sharedData.quest.ui.elements.closeBtn.off('pointerup');
    }
}