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

    constructor(phaserScene)
    {
        super(phaserScene);
    }

    load()
    {
        // Background panel
        this.phaserScene.load.image(this.QUEST_PANEL_IMG, "./assets/extracted/UI/Quest/Journal_Panel.png");

        // Close btn
        this.phaserScene.load.image("closebtn", "./assets/extracted/UI/Quest/closebtn.png")
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

        closeBtn.on('pointerup', (pointer) => 
        { 
            this.hide();
        });

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
            questIcon: questIcon
            // Left page
        }

        super.initialize();
    }

    show()
    {
        if (this.phaserScene.sharedData.quest.ui.elements === undefined)
            this.initialize();

        if (this.phaserScene.sharedData.quest.ui.open)
        {
            this.hide();
            return;
        }

        if (this.phaserScene.sharedData.global.uiOpen)
            return;

        this.phaserScene.sharedData.quest.ui.open = true;
        this.phaserScene.sharedData.quest.ui.elements.panelImg.setAlpha(1);
        this.phaserScene.sharedData.quest.ui.elements.closeBtn.setAlpha(1);

        if (this.phaserScene.sharedData.quest.logic.activeQuests !== undefined && this.phaserScene.sharedData.quest.logic.activeQuests.length > 0)
        {
            // We default on the first quest, if it isn't possible to show it (ie: waiting state + no trigger)
            // Then we try the next one until we either have one or nothing
            let firstQuest = this.phaserScene.sharedData.quest.logic.activeQuests[0];
            let isShowable = false;
            for (let i = 0; i < this.phaserScene.sharedData.quest.logic.activeQuests.length; i++)
            {
                firstQuest = this.phaserScene.sharedData.quest.logic.activeQuests[i];
                isShowable = this.selectCurrentQuestForDetails(firstQuest.fileID, firstQuest.adventureID, firstQuest.questID);
                if (isShowable)
                    break;
            }
        }

        super.show();
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
    }

    selectCurrentQuestForDetails(globalID, adventureID, questID)
    {
        let quest = getQuestPerID(this.phaserScene, globalID, adventureID, questID);

        if (quest.target.id === undefined && quest.status == QUEST_STATES.WAITING) return false;

        if (quest === undefined) return false;

        this.phaserScene.sharedData.quest.ui.elements.questTitle.setAlpha(1);
        this.phaserScene.sharedData.quest.ui.elements.lookforTxt.setAlpha(1);
        this.phaserScene.sharedData.quest.ui.elements.lookforDescTxt.setAlpha(1);
        this.phaserScene.sharedData.quest.ui.elements.locationTxt.setAlpha(1);
        this.phaserScene.sharedData.quest.ui.elements.locationDescTxt.setAlpha(1);
        this.phaserScene.sharedData.quest.ui.elements.goalTxt.setAlpha(1);
        this.phaserScene.sharedData.quest.ui.elements.goalDescTxt.setAlpha(1);
        this.phaserScene.sharedData.quest.ui.elements.questIcon.setAlpha(1);

        this.phaserScene.sharedData.quest.ui.elements.questTitle.setText(getAdventurePerID(this.phaserScene, globalID, adventureID).description);
        this.phaserScene.sharedData.quest.ui.elements.lookforDescTxt.setText(""); // TODO: find where we get
        this.phaserScene.sharedData.quest.ui.elements.locationDescTxt.setText(""); // TODO: find where we get
        this.phaserScene.sharedData.quest.ui.elements.goalDescTxt.setText(quest.description);
        //this.phaserScene.sharedData.quest.ui.elements.questIcon.setTexture(); // TODO: find where we get
        return true;
    }
}