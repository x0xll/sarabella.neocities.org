/* Handles the backend aspect of the saving system
*  Save/Load events
*/

// TODO: Uncomment stuffs when save refactor PR is merged
class SaveManager
{
    GAME_DATA_TYPE = {
        quest: "quest",
        // TODO: setup the elements we need to save here
    }

    #saveData = {};

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
            return "";
        }

        //return this.#saveData[dataType];
    }

    setGameData(dataType, data) {
        this.#saveData[dataType] = data;
        this.saveGameData();
    }

}