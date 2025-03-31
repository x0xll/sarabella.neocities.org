class TimeManager
{
    // TODO: Refactor the heck outta this

    constructor(phaserScene)
    {
        this.phaserScene = phaserScene;
        this.phaserScene.load.plugin('rexclockplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexclockplugin.min.js', true);
        this.startAt = 0
        this.isDay = true
        this.nightLength = 120000 // should be 120000
        this.dayLength = 180000 // should be 180000
    }

    /**
     * Starts the clock
     */
    startClock() {
        this.clock = this.phaserScene.plugins.get('rexclockplugin').add(this.phaserScene, config);
        this.clock.start(this.startAt);
    }

    /**
     * Changes the tint of a given sprite. Is used to render day and night cycle
     * @param {*} sprite 
     * @param {*} r 
     * @param {*} g 
     * @param {*} b 
     * @param {*} shade 
     * @param {*} a 
     */
    changeTint(sprite, r, g, b, shade, a) {
        let layers = ['Main', 'Overlay', 'Underlay', 'Underlay2']
        layers.forEach(part => {
            
            var slot = sprite.findSlot(`${part}`)
            slot.color.r = r
            slot.color.g = g
            slot.color.b = b
            slot.color.a = a
            
            if (shade !== 0) {
                slot.darkColor = {r: r-shade, g: g-shade, b: b-shade, a: 1}
            } else {
                slot.darkColor = null
            }
        });
    }

    setTile(tile, cellValue) {
        let gameTime = this.isDay ? 'day' : 'night'
        const skeletonData = tile.skeleton.data;
        const skin = new spine.Skin("custom");
        if (skeletonData.findSkin(cellValue) !== null){
            skin.addSkin(skeletonData.findSkin(cellValue));
        }
        else if (skeletonData.findSkin(cellValue + '/' + gameTime) !== null){
            skin.addSkin(skeletonData.findSkin(cellValue + '/' + gameTime));
        }   
        tile.skeleton.setSkin(skin);
        tile.skeleton.setToSetupPose();
    }

    /**
     * Updates tile sprites
     */
    updateSprites() {
        // Column
        for (var y = 0; y < Object.keys(this.phaserScene.tiles[y]).length; y++)
            {
                // Row
                for (var x = 0; x < Object.keys(this.phaserScene.tiles[y][x]).length; x++)
                {
                    let tile = this.phaserScene.tiles[y][x]
                    var cellValue = this.phaserScene.tiles[y][x].data.id;
                    this.setTile(tile, cellValue)
                    this.setTile(tile.dupe, cellValue)
                }
            }
    }

    /**
     * Updates sprites to render day/night
     */
    renderDayNight() {
        this.updateSprites()
        if (this.isDay) {
            this.phaserScene.backgrounds.forEach(background => {
                background.clearTint()
            });
            for (var y = 0; y < Object.keys(this.phaserScene.tiles).length; y++)
                {
                    // Row
                    for (var x = 0; x < Object.keys(this.phaserScene.tiles[y]).length; x++)
                    {
                        this.changeTint(this.phaserScene.tiles[y][x].dupe.skeleton, 0, 0.2, 0.4, 0, 0)
                    }
                }
        } else {
            this.phaserScene.backgrounds.forEach(background => {
                background.setTint('0x003366') // , '0x121287'
            });
            for (var y = 0; y < Object.keys(this.phaserScene.tiles).length; y++)
                {
                    // Row
                    for (var x = 0; x < Object.keys(this.phaserScene.tiles[y]).length; x++)
                    {
                        this.changeTint(this.phaserScene.tiles[y][x].dupe.skeleton, 0, 0.2, 0.4, 0, .75)
                    }
                }
        }
    }

    updateTime() {
        if (this.clock.now >= this.dayLength + this.nightLength) {
            this.clock.seek(0)
            this.isDay = true
            this.renderDayNight()
        } else if (this.clock.now >= this.dayLength) {
            this.isDay = false
            this.renderDayNight()
        }
    }
}