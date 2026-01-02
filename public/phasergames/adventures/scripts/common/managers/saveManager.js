/* Handles the backend aspect of the saving system
*  Save/Load events
*/

const GAME_DATA_TYPE = {
    time: "time",
    quest: "quest",
    entities: "entities",
    inventory: "inventory"
}

// TODO: Uncomment stuffs when save refactor PR is merged
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
        //saveData(DATA_TYPES.game, data, GAME_ID.Adventures);
        console.log("Adventure Data Saved: ");
        console.log(this.#saveData);
    }

    loadGameData() {
        //this.#saveData = loadData(DATA_TYPES.game, GAME_ID.Adventures);
        console.log("Adventure Data Loaded: ");
        console.log(this.#saveData);
    }

    getGameData(dataType) {
        if (this.#saveData[dataType] === undefined) {
            return {};
        }

        //return this.#saveData[dataType];
    }

    setGameData(dataType, data) {
        this.#saveData[dataType] = data;
        this.saveGameData();
    }

}