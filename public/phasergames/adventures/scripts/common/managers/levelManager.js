/* Used to handle the calcul of the level based on the experience
*/

class LevelManager
{
    #MAX_LEVEL = 13
    #BASE_EXPERIENCE = 40
    #EXPERIENCE_LEVEL_RATIO = 1.868
    #LEVEL_EXPERIENCE = [] 

    constructor(phaserScene)
    {
        this.phaserScene = phaserScene;
        this.phaserScene.sharedData.magicTree.logic =  {
            experience: 0,
            level: 0,
            manager: this
        }
        this.#initializeLevelData();
        this.#loadExperience();
    }

    addExperience(amount)
    {
        this.phaserScene.sharedData.magicTree.logic.experience += amount;
        this.#calculateLevel();
        this.#saveExperience();
    }

    #saveExperience()
    {
        let data = {
            experience: this.phaserScene.sharedData.magicTree.logic.experience,
        }
        this.phaserScene.sharedData.saving.setGameData(GAME_DATA_TYPE.tree, data)
    }

    #loadExperience()
    {
        let data = this.phaserScene.sharedData.saving.getGameData(GAME_DATA_TYPE.tree);
        if (!data.experience) {
            return;
        }
        
        this.phaserScene.sharedData.magicTree.logic.experience = data.experience;

        this.#calculateLevel();
    }

    #initializeLevelData()
    {
        for (let i = 0; i < this.#MAX_LEVEL; i++)
        {
            let minExperienceValue = this.#BASE_EXPERIENCE * Math.pow(this.#EXPERIENCE_LEVEL_RATIO, i);
            this.#LEVEL_EXPERIENCE.push(minExperienceValue);
        }
    }

    #calculateLevel()
    {
        for (let i = 0; i < this.#MAX_LEVEL; i++) {
            if (this.phaserScene.sharedData.magicTree.logic.experience < this.#LEVEL_EXPERIENCE[i])
            {
                let oldLevel = this.phaserScene.sharedData.magicTree.logic.level;
                this.phaserScene.sharedData.magicTree.logic.level = i;
                if (oldLevel != i && this.phaserScene.sharedData.hud != null)
                {
                    this.phaserScene.sharedData.hud.ui.manager.updateLevel();
                }
                return;
            }
        }

        let oldLevel = this.phaserScene.sharedData.magicTree.logic.level;
        this.phaserScene.sharedData.magicTree.logic.level = this.#MAX_LEVEL - 1;
        if (oldLevel != this.phaserScene.sharedData.magicTree.logic.level && 
            this.phaserScene.sharedData.hud != null)
        {
            this.phaserScene.sharedData.hud.ui.manager.updateLevel();
        }
    }

    debugAddLevel(amount = 1)
    {
        if (this.phaserScene.sharedData.magicTree.logic.level + amount > this.#MAX_LEVEL)
        {
            amount = this.#MAX_LEVEL - this.phaserScene.sharedData.magicTree.logic.level - 1;
        }

        let minimumExperience = this.#LEVEL_EXPERIENCE[this.phaserScene.sharedData.magicTree.logic.level + amount];

        this.addExperience(minimumExperience - this.phaserScene.sharedData.magicTree.logic.experience);
    }
}

try{
    module.exports = {
        LevelManager
    }
}
catch(e) {

}