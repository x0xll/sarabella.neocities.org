const COLORS = ['blue', 'orange', 'yellow', 'green']
const SPECIAL = ['rainbow_row', 'rainbow_col', 'area_special']

const GRID_SIZE = 10
const CELL_SIZE = 43
const START_GRID_POS = [380, 440]

const LEVELS = []
LEVELS[1] = [
    [COLORS[1], COLORS[1], COLORS[1], COLORS[2], COLORS[0], COLORS[0], COLORS[0], COLORS[2], COLORS[2], COLORS[2]],
    [COLORS[0], COLORS[1], COLORS[1], COLORS[2], COLORS[2], COLORS[2], COLORS[0], COLORS[0], COLORS[2], COLORS[2]],
    [COLORS[0], COLORS[0], COLORS[0], COLORS[2], COLORS[0], COLORS[2], COLORS[1], COLORS[0], COLORS[3], COLORS[3]],
    [COLORS[0], COLORS[2], COLORS[2], COLORS[0], COLORS[0], COLORS[0], COLORS[1], COLORS[1], COLORS[3], COLORS[3]],
    [COLORS[0], COLORS[2], COLORS[2], COLORS[3], COLORS[0], COLORS[2], COLORS[1], COLORS[1], COLORS[1], COLORS[3]],
    [COLORS[3], COLORS[2], COLORS[0], COLORS[3], COLORS[3], COLORS[3], COLORS[2], COLORS[2], COLORS[2], COLORS[3]],
    [COLORS[3], COLORS[3], COLORS[0], COLORS[3], COLORS[3], COLORS[1], COLORS[2], COLORS[2], COLORS[1], COLORS[1]],
    [COLORS[3], COLORS[3], COLORS[0], COLORS[0], COLORS[1], COLORS[1], COLORS[2], COLORS[0], COLORS[1], COLORS[1]],
    [COLORS[1], COLORS[1], COLORS[0], COLORS[2], COLORS[1], COLORS[1], COLORS[0], COLORS[0], COLORS[0], COLORS[1]],
    [COLORS[1], COLORS[1], COLORS[1], COLORS[2], COLORS[2], COLORS[2], SPECIAL[2], COLORS[0], COLORS[3], COLORS[3]]
]
LEVELS[2] = [
    [COLORS[2], COLORS[2], COLORS[2], COLORS[0], COLORS[1], COLORS[1], COLORS[1], COLORS[1], COLORS[1], COLORS[0]],
    [COLORS[2], COLORS[0], COLORS[2], COLORS[0], COLORS[0], COLORS[0], COLORS[1], COLORS[3], COLORS[3], COLORS[0]],
    [COLORS[3], SPECIAL[1], COLORS[3], COLORS[0], COLORS[2], COLORS[2], COLORS[0], COLORS[3], COLORS[0], COLORS[0]],
    [COLORS[3], COLORS[0], COLORS[0], COLORS[1], COLORS[1], COLORS[2], COLORS[2], COLORS[3], COLORS[2], COLORS[3]],
    [COLORS[3], COLORS[0], COLORS[2], COLORS[1], COLORS[1], COLORS[1], COLORS[3], COLORS[2], COLORS[2], COLORS[2]],
    [COLORS[3], COLORS[2], COLORS[2], COLORS[3], COLORS[0], COLORS[1], COLORS[3], COLORS[2], COLORS[2], COLORS[0]],
    [COLORS[0], COLORS[2], COLORS[2], COLORS[1], COLORS[3], COLORS[3], COLORS[3], COLORS[1], COLORS[1], COLORS[0]],
    [COLORS[0], COLORS[0], COLORS[0], COLORS[1], COLORS[1], COLORS[1], COLORS[3], COLORS[1], COLORS[1], COLORS[0]],
    [COLORS[0], COLORS[0], COLORS[1], COLORS[1], COLORS[2], COLORS[2], COLORS[1], COLORS[0], COLORS[2], COLORS[0]],
    [COLORS[1], COLORS[1], COLORS[0], COLORS[0], COLORS[0], COLORS[2], COLORS[2], COLORS[0], COLORS[0], COLORS[1]]
]
// this was the practice mode one from the French video
LEVELS[3] = [
    [COLORS[2], COLORS[1], COLORS[1], COLORS[1], COLORS[1], COLORS[2], COLORS[2], COLORS[2], COLORS[2], COLORS[3]],
    [COLORS[2], COLORS[2], COLORS[2], COLORS[1], COLORS[1], COLORS[0], COLORS[2], COLORS[0], COLORS[2], COLORS[3]],
    [COLORS[2], COLORS[3], COLORS[3], COLORS[0], COLORS[0], COLORS[0], COLORS[0], COLORS[2], COLORS[3], COLORS[3]],
    [COLORS[1], COLORS[3], SPECIAL[1], COLORS[3], COLORS[2], COLORS[0], COLORS[2], COLORS[2], COLORS[1], COLORS[3]],
    [COLORS[1], COLORS[1], COLORS[1], COLORS[2], COLORS[0], COLORS[2], COLORS[2], COLORS[1], COLORS[1], COLORS[1]],
    [COLORS[1], COLORS[0], COLORS[2], COLORS[2], COLORS[0], COLORS[0], COLORS[2], COLORS[3], COLORS[3], COLORS[1]],
    [COLORS[3], COLORS[0], COLORS[0], COLORS[2], COLORS[0], COLORS[0], COLORS[3], COLORS[3], COLORS[3], COLORS[0]],
    [COLORS[0], COLORS[0], COLORS[2], COLORS[2], COLORS[0], COLORS[1], COLORS[3], COLORS[2], COLORS[0], COLORS[0]],
    [COLORS[2], COLORS[2], COLORS[1], COLORS[0], COLORS[1], COLORS[1], COLORS[2], COLORS[2], COLORS[0], COLORS[0]],
    [COLORS[2], COLORS[2], COLORS[2], COLORS[0], COLORS[1], COLORS[1], COLORS[2], COLORS[2], COLORS[3], COLORS[3]]
]

const movementAllowance = 0.1

var grid = []
var score = 0
var scoreTxt;
var levelTitleKey = "level"
var levelInitialized = false

var citrustacksGoingDown = []
let citrustacksSliding = []
let checkSlide = false
let gameData = null

class Level extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'Level' });
    }

    preload ()
    {
        // UI
        this.load.image('foreground', './images/foreground.png') 
        this.load.image('background', './images/background.png') 
        this.load.atlas('music_button', './images/music.png', './images/music.json');
        this.load.image('menu_button', './images/purple_button.png')
        this.load.image('popup_end', './images/level_end.png')

        // Citrustacks
        this.load.spineAtlas("citrustack_atlas", `./images/skeleton.atlas`);
        this.load.spineJson("citrustack_json", `./images/skeleton.json`);

        // Audios
        this.load.audio('meep', ['./sounds/citrustack_sound.mp3']);
    }

    create (data)
    { 
        const game = this
        gameData = data

        // Sounds
        this.meepSound = this.sound.add('meep');

        // UI - background
        this.add.image(350, 0, 'background').setOrigin(0, 0)

        // Grid - we start from bottom left
        this.physics.world.setBounds(START_GRID_POS[0]-30, START_GRID_POS[1]-GRID_SIZE*CELL_SIZE, GRID_SIZE*CELL_SIZE+10, GRID_SIZE*CELL_SIZE+5);
        const tileGroup = this.physics.add.group({
            bounceX: 0,
            bounceY: 0,
            collideWorldBounds: true
        });
        
        for (var column = 0; column < GRID_SIZE; column++)
        {
            grid[column] = []

            for (var row = 0; row < GRID_SIZE; row++)
                {
                    const posX = START_GRID_POS[0] + (column * CELL_SIZE)
                    const posY = START_GRID_POS[1] - (row * CELL_SIZE)
                    let color = COLORS[Math.floor(Math.random() * COLORS.length)]
                    if (data.currentLevel > 0) {
                        color = LEVELS[data.currentLevel][GRID_SIZE-row-1][column]
                    }

                    // TODO : Make the arrival animation
                    const tile = this.add.spine(posX, posY, 'citrustack_json', 'citrustack_atlas')
                    tile.hitbox = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(posX-20, posY-35, 40, 40), Phaser.Geom.Rectangle.Contains)
                    tileGroup.add(tile)
                    tile.body.setSize(43,43).setOffset(-21,-38)

                    setColor(tile, color)
                        // Colors are set as skins and can be blue, green, orange, yellow, rainbow_row, rainbow_col and area_special
                        // All colors also include a <color>_glow variant for the glowing version of the sprite
                        // Spine file also includes two animations: gradient (for the rainbow color shift) 
                        // and sway for the side to side movement
                        tile.animationState.setAnimation(1, "gradient", true)

                    tile.row = row
                    tile.column = column
                    tile.color = color
                    tile.hitbox.on('pointerdown', () => 
                    {
                        var group = checkTileGroup(tile.column, tile.row, tile.color)

                        // Not enough tiles of the same color around input
                        if (group.length <= 1)
                            return;

                        removeTiles(group)
                        increaseScore(group.length)
                        //gravityTiles()
                    })
                    // TODO : Hover animation
                    tile.hitbox.on('pointerover', () => 
                        {

                            var group = checkTileGroup(tile.column, tile.row, tile.color)

                            if (group.length <= 1) return;

                            this.meepSound.play()
                            setColor(tile, color + "_glow")
                            tile.animationState.setAnimation(0, 'sway', false)

                            group.forEach(({ column, row }) => {
                                grid[column][row].animationState.setAnimation(0, 'sway', false)
                                setColor(grid[column][row], grid[column][row].color + "_glow")
                              });
                        })

                    tile.hitbox.on('pointerout', () =>
                    {
                        var group = checkTileGroup(tile.column, tile.row, tile.color)

                        if (group.length <= 1) return;

                        setColor(tile, color)

                        group.forEach(({ column, row }) => {
                            setColor(grid[column][row], grid[column][row].color)
                          });
                    })

                    grid[column][row] = tile
                }
        }

        levelInitialized = true

        function checkTileGroup(column, row, color, neighbours = [])
        {
            if (color === 'rainbow_col') {
                let tiles = []
                for (let index = 0; index < grid[column].length; index++) {
                    if (grid[column][index] !== null) {tiles.push({column: column, row: index})}
                }
                return tiles
            }

            if (color === 'rainbow_row') {
                let tiles = []
                for (let index = 0; index < grid.length; index++) {
                    if (grid[index][row] !== null) {tiles.push({column: index, row: row})}
                }
                return tiles
            }

            if (color === 'area_special'){
                let tiles = []
                tiles.push({column: column, row: row})
                if (grid[column+1][row] !== null && column < GRID_SIZE) {tiles.push({column: column+1, row: row})}
                if (grid[column+1][row+1] !== null && column < GRID_SIZE && row < GRID_SIZE) {tiles.push({column: column+1, row: row+1})}
                if (grid[column+1][row-1] !== null && column < GRID_SIZE && row > 0) {tiles.push({column: column+1, row: row-1})}
                if (grid[column][row+1] !== null && row < GRID_SIZE) {tiles.push({column: column, row: row+1})}
                if (grid[column][row-1] !== null && row > 0) {tiles.push({column: column, row: row-1})}
                if (grid[column-1][row] !== null && column > 0) {tiles.push({column: column-1, row: row})}
                if (grid[column-1][row+1] !== null && column > 0 && row < GRID_SIZE) {tiles.push({column: column-1, row: row+1})}
                if (grid[column-1][row-1] !== null && column > 0 && row > 0) {tiles.push({column: column-1, row: row-1})}
                return tiles
            }

            // We are out of the grid
            if (column < 0 || row < 0 || column >= GRID_SIZE || row >= GRID_SIZE)
                return []

            // No tile present (failsafe if the player somehow goes too fast)
            if (grid[column][row] == null)
                return []

            // We already visited this tile
            if (neighbours.some(t => t.column === column && t.row === row))
                return []

            // Wrong color
            if (grid[column][row].color != color)
                return []

            // We add to the visited cells
            neighbours.push({column, row})

            return [
                { column, row },
                ...checkTileGroup(column - 1, row, color, neighbours), // Up
                ...checkTileGroup(column + 1, row, color, neighbours), // Down
                ...checkTileGroup(column, row - 1, color, neighbours), // Left
                ...checkTileGroup(column, row + 1, color, neighbours), // Right
              ];
        }

        function removeTiles(tiles)
        {
            // TODO : Remove animation -> go toward the input tile in order of closesness and fade into transparency

            tiles.forEach(({ column, row }) => {
                grid[column][row].hitbox.destroy();
                grid[column][row].destroy();
                grid[column][row] = null;
              });

            checkSlide = true
        }

        this.checkIfLost = checkIfLost;

        function checkIfLost()
        {
            let emptyGrid = true;

            for (let x = 0; x < GRID_SIZE; x++)
            {
                for(let y = 0; y < GRID_SIZE; y++)
                {
                    if (grid[x][y] != null)
                    {
                        emptyGrid = false; 

                        if (citrustacksGoingDown.length > 0) return;

                        if (checkSlide) return;

                        let group = checkTileGroup(x, y, grid[x][y].color)
                        if (group.length > 1) return;
                    }
                }
            }

            if (!emptyGrid)
                showEndPopup(false);
        }

        this.showEndPopup = showEndPopup;

        function showEndPopup(won)
        {
            game.add.image(575, 234, "popup_end").setOrigin(.5);
            game.add.text(420, 102, (won) ? `${langData.end_level}` : `${langData.end_lost}`, {fontFamily: 'Arial', fontSize: '25px', color: '#716038', align: 'left', fontStyle: 'italic'}).setOrigin(0);
            game.add.text(420, 150, (won) ? `${langData.end_congrats}` :`${langData.end_lostmessage}`, {fontFamily: 'Arial', fontSize: '18px', color: '#716038', align: 'left'}).setOrigin(0);

            game.add.text(575, 330, `${langData.score} ${score}`, {fontFamily: 'Arial', fontSize: '24px', color: '#000000', align: 'center', fontStyle: 'italic'}).setOrigin(.5);

            // Restart
            const restartBtn = game.add.image(575, 382, "menu_button").setOrigin(.5).setInteractive({ pixelPerfect: true })
            const restartBtnTxt = game.add.text(575, 
                386, (won) ? `${langData.btn_continue}` :`${langData.btn_restart}`, menuSmallTextStyle).setOrigin(.5)

            restartBtn.on('pointerover', () => { onBtnOver(restartBtnTxt); });
            restartBtn.on('pointerout', () => { onBtnOut(restartBtnTxt); });
            restartBtn.on('pointerdown', () =>
            {
                score = 0

                if (won && gameData.currentLevel < 3)
                    gameData.currentLevel++

                game.scene.start('Level', {backgroundMusic: gameData.backgroundMusic, currentLevel: gameData.currentLevel, playMusic: gameData.playMusic});
            })
        }

        function increaseScore(tileAmount)
        {
            // TODO : have the score appear at different size + particles
            let count = 0
            for (let index = 1; index < tileAmount; index++) {
                count = 2*(index-1) + 1 + count
            }
            score += count

            scoreTxt.setText(score)
        }

    
        /**
         * Sets the skin for the sprite to display the current features
         * @param {*} skeleton the horse skeleton to set the skin of
         */
        function setColor(skeleton, color){
            const skeletonData = skeleton.skeleton.data;
            const skin = new spine.Skin("custom");
                skin.addSkin(skeletonData.findSkin(color));
            skeleton.skeleton.setSkin(skin);
            skeleton.skeleton.setToSetupPose();
        }

        // UI - foreground + texts
        this.add.image(0, 0, 'foreground').setOrigin(0, 0)

        let menuSmallTextStyle =  {fontFamily: 'Arial', fontSize: '18px', color: '#000000', align: 'center'}
        let menuBigTextStyle =  {fontFamily: 'Arial', fontSize: '32px', color: '#000000', align: 'center'}

        scoreTxt = this.add.text(177, 196, score, menuBigTextStyle).setOrigin(.5)
        this.add.text(177, 425, `${langData.level} ${data.currentLevel}`, menuSmallTextStyle).setOrigin(.5)

        // Help
        const helpBtn = this.add.image(178, 290, "menu_button").setOrigin(.5).setInteractive({ pixelPerfect: true })
        const helpBtnTxt = this.add.text(180, 294, `${langData.btn_help}`, menuSmallTextStyle).setOrigin(.5)

        helpBtn.on('pointerover', () => { onBtnOver(helpBtnTxt); });
        helpBtn.on('pointerout', () => { onBtnOut(helpBtnTxt); });
        helpBtn.on('pointerdown', () => 
        { 
            // TODO : Show help menu
        });

        // Quit
        const quitBtn = this.add.image(178, 338, "menu_button").setOrigin(.5).setInteractive({ pixelPerfect: true })
        const quitBtnTxt = this.add.text(180, 342, `${langData.btn_quit}`, menuSmallTextStyle).setOrigin(.5)

        quitBtn.on('pointerover', () => { onBtnOver(quitBtnTxt); });
        quitBtn.on('pointerout', () => { onBtnOut(quitBtnTxt); });
        quitBtn.on('pointerdown', () =>
        {
            this.scene.start('StartScreen', {backgroundMusic: this.backgroundMusic, runningSound: this.runningSound, playMusic: this.playMusic})
        })

        // Music
        const musicButton = this.add.sprite(795, 451, 'music_button', 'music_on').setInteractive({ pixelPerfect: true }).setScale(0.7);
        musicButton.on('pointerdown', function (pointer)
        {
            if (data.playMusic) {
                data.backgroundMusic.stop()
                this.setFrame('music_off_hover')
            }
            else {
                data.backgroundMusic.play()
                this.setFrame('music_on_hover')
            }
            data.playMusic = !data.playMusic
        });
        musicButton.on('pointerover', function (pointer) { this.setFrame(`music_${data.playMusic ? 'on' : 'off'}_hover`)});
        musicButton.on('pointerout', function (pointer) { this.setFrame(`music_${data.playMusic ? 'on' : 'off'}`) });

        // Button over / out
        function onBtnOver(btnTxt)
        {
            // TODO : handle particles
            btnTxt.setColor("#ffffff")
        }

        function onBtnOut(btnTxt)
        {
            // TODO : handle particles
            btnTxt.setColor("#000000")
        }
    }

    update ()
    {
        function gravityTiles()
        {
            // TODO : Make the tiles without any below fall and have a slight anim curve when arriving
            // Make them go towards the side too if they are falling
            for (let x = 0; x < GRID_SIZE; x++)
            {
                for (let y = 0; y < GRID_SIZE; y++)
                {
                    if (grid[x][y] == null) continue;

                    // Check if they can fall
                    if (y != 0)
                    {
                        if (grid[x][y - 1] == null)
                        {
                            let fallingDatas = 
                            {
                                obj: grid[x][y],
                                col: x,
                                row: y
                            }

                            citrustacksGoingDown.push(fallingDatas)
                        }
                    }
                }
            }
        }

        function checkSlideTiles() {
            if (citrustacksGoingDown.length === 0) {
                checkSlide = false
                let firstChunkStart = -1
                let firstChunkEnd = -1
                let firstChunkCount = 0
                for (let index = 0; index < grid.length; index++) {
                    const column = grid[index];
                    let isNull = true
                    column.forEach(tile => {
                        isNull = tile === null && isNull
                        if (tile !== null) {firstChunkCount++}
                    });
                    if (firstChunkStart === -1 && isNull === false) {firstChunkStart = index}
                    if (firstChunkStart !== -1 && isNull === true) {firstChunkEnd = index-1; break}
                }
    
                
                let lastChunkStart = -1
                let lastChunkEnd = -1
                let lastChunkCount = 0
                for (let index = grid.length - 1; index > 0; index--) {
                    const column = grid[index];
                    let isNull = true
                    column.forEach(tile => {
                        isNull = tile === null && isNull
                        if (tile !== null) {lastChunkCount++}
                    });
                    if (lastChunkEnd === -1 && isNull === false) {lastChunkEnd = index}
                    if (lastChunkEnd !== -1 && isNull === true) {lastChunkStart = index+1; break}
                }
    
                if (firstChunkStart !== lastChunkStart && firstChunkStart !== -1 && firstChunkEnd !== -1 && firstChunkEnd < GRID_SIZE && lastChunkStart !== -1 && lastChunkEnd >= 0) {
                    if (firstChunkCount <= lastChunkCount) {
                        slideTiles(firstChunkStart, firstChunkEnd+1, true)
                        checkSlide = true
                    } else if (firstChunkCount > lastChunkCount){
                        slideTiles(lastChunkStart-1, lastChunkEnd, false)
                        checkSlide = true
                    }
                }
            }
        }

        // Check if citrustacks need to fall
        if (!levelInitialized)
            return;

        
        // Check if level is over
        let notNullCount = 0
        for (let column = 0; column < grid.length; column++) {
            grid[column].forEach(tile => {
                if (tile !== null) {notNullCount++}
            });
        }
        if (notNullCount === 0) {
            // Level should end
            this.showEndPopup(true);
        }

        // TODO : Improve movement to be more fluid

        // Move the citrustacks going down first
        for (let i = citrustacksGoingDown.length - 1; i >= 0; i--)
        {
            grid[citrustacksGoingDown[i].col][citrustacksGoingDown[i].row - 1] = citrustacksGoingDown[i].obj
            citrustacksGoingDown[i].obj.row = citrustacksGoingDown[i].row - 1
            citrustacksGoingDown[i].obj.hitbox.setPosition(citrustacksGoingDown[i].obj.hitbox.x, citrustacksGoingDown[i].obj.hitbox.y + CELL_SIZE)
            grid[citrustacksGoingDown[i].col][citrustacksGoingDown[i].row] = null
            citrustacksGoingDown.pop(citrustacksGoingDown[i])
        }

        // TODO : Move to the sides
        // citrustacksSliding should be the set of columns to be moved, plus one empty column in the direction of movement
        // startColumn should be the grid index of the first column
        // endColumn should be the grid index of the last column
        // moveToRight should be true if the left-most chunk moves right and false if the right-most chunk moves left
        function slideTiles(startColumn, endColumn, moveToRight) {
            const citrustacksSliding = []
            for (let index = startColumn; index <= endColumn; index++) {
                citrustacksSliding.push(grid[index]);
            }

            if (citrustacksSliding.length) {
                const newGrid = []
                for (let i = 0; i < citrustacksSliding.length; i++) {
    
                    // Copy the columns that aren't moving
                    for (let index = 0; index < grid.length; index++) {
                        if (index === startColumn) {
                            index = endColumn
                        } else {
                            newGrid[index] = grid[index]
                        }
                    }
    
                    // TODO : Move to the right
                    if (moveToRight) {
                        for (let index = 0; index < citrustacksSliding.length; index++) {
                            // first newGrid column moved should be null
                            if (index === 0) {
                                newGrid[startColumn] = citrustacksSliding[citrustacksSliding.length - 1]
                            } else {
                                newGrid[startColumn + index] = citrustacksSliding[index - 1]
                            }
                        }
                    } 
                    // TODO : Move to the left
                    else {
                        for (let index = 0; index < citrustacksSliding.length; index++) {
                            // first newGrid column moved should be null
                            if (index === citrustacksSliding.length-1) {
                                newGrid[startColumn + index] = citrustacksSliding[0]
                            } else {
                                newGrid[startColumn + index] = citrustacksSliding[index + 1]
                            }
                        }
                    }
                }
                grid = newGrid
                for (let index = startColumn; index <= endColumn; index++) {
                    grid[index].forEach(tile => {
                        if (tile !== null) {
                            tile.hitbox.setPosition(tile.hitbox.x + (moveToRight ? +CELL_SIZE: -CELL_SIZE), tile.hitbox.y)
                            tile.column = tile.column + (moveToRight ? +1: -1)
                        }
                    });
                }
            }
        }

        // Check if citrustack should be moving or not, and then move or stop it as needed
        grid.forEach(column => {
            column.forEach(tile => {
                if (tile !== null) {
                    const targetX = START_GRID_POS[0] + (tile.column * CELL_SIZE)
                    const targetY = START_GRID_POS[1] - (tile.row * CELL_SIZE)
                    
                    // Check x position
                    if (tile !== null && targetX - movementAllowance <= tile.x && tile.x <= targetX + movementAllowance) {
                        tile.body.setVelocityX(0)
                        tile.setPosition(targetX, tile.y)
                    } else {
                        this.physics.moveTo(tile, targetX, tile.y, 100, 400);
                    }

                    // Check y position
                    if (tile !== null && targetY - movementAllowance <= tile.y && tile.y <= targetY + movementAllowance) {
                        tile.body.setVelocityY(0)
                        tile.setPosition(tile.x, targetY)
                    } else {
                        if (targetY >= tile.y + (0.1*CELL_SIZE)) {
                            this.physics.moveTo(tile, tile.x, tile.y+CELL_SIZE, 100, 200);
                        } else if (targetY <= tile.y - (0.1*CELL_SIZE)) {
                            this.physics.moveTo(tile, tile.x, tile.y-CELL_SIZE, 100, 200);
                        } else {
                            this.physics.moveTo(tile, tile.x, targetY, 100, 400);
                        }
                    }
                }
            });
        });

        gravityTiles()
        if (checkSlide) {checkSlideTiles()}
        this.checkIfLost();
    }
}