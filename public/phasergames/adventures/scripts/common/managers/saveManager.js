/* Handles the backend aspect of the saving system
*  Save/Load events
*/

const GAME_DATA_TYPE = {
    time: "time",
    quest: "quest",
    entities: "entities",
    inventory: "inventory",
    tree: "tree"
}

class SaveManager
{
    #saveData = {};

    constructor(phaserScene) {
        this.phaserScene = phaserScene;
        if (phaserScene.sharedData.saving === undefined) {
            phaserScene.sharedData.saving = this;
            this.loadGameData();
        }
    }

    saveGameData() {
        this.setGameData(GAME_DATA_TYPE.time, this.phaserScene.time.now);
        saveData(DATA_TYPES.game, this.#saveData, GAME_ID.Adventures);
    }

    loadGameData() {
        this.#saveData = loadData(DATA_TYPES.game, GAME_ID.Adventures);

        if (!this.#saveData) {
            this.#saveData = {}
        }
    }

    getGameData(dataType) {
        if (this.#saveData[dataType] === undefined) {
            return undefined;
        }

        return this.#saveData[dataType];
    }

    setGameData(dataType, data) {
        this.#saveData[dataType] = data;
    }
}