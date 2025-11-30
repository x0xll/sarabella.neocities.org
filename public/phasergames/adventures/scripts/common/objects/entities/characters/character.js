class Character extends Entity {
    constructor(zoneScene, entityID, startX, startY) {
        super(zoneScene, entityID, startX, startY);

        this.assetPath = `${this.assetPath}/Characters`
        this.load();
    }
}