const COLORS = ['blue', 'orange', 'yellow', 'green'] // TODO : add special ones

const GRID_SIZE = 10
const CELL_SIZE = [48, 43]
const START_GRID_POS = [380, 440]

const SCORES = [2, 4, 9, 16, 25, 36, 49, 64, 81, // Up to 10 citrus
                100, 121, 144, 169, 196, 225, 256, 289, 324, 361, // Up to 20 citrus
                400, 441, 484, 529, 576, 625, 676, 729, 784, 841] // Up to 30 citrus

var grid = []
var score = 0
var scoreTxt;
var levelTitleKey = "level"
var levelIndex = 1
var levelInitialized = false

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

        // Citrustacks
        this.load.image('blue', './images/blue.png')
        this.load.image('orange', './images/orange.png')
        this.load.image('yellow', './images/yellow.png')
        this.load.image('green', './images/green.png')
        
        this.load.spineAtlas("citrustack_atlas", `./images/skeleton.atlas`);
        this.load.spineJson("citrustack_json", `./images/skeleton.json`);

        // Audios
        this.load.audio('meep', ['./sounds/citrustack_sound.mp3']);
    }

    create (data)
    { 
        const game = this

        // Sounds
        this.meepSound = this.sound.add('meep');

        // UI - background
        this.add.image(350, 0, 'background').setOrigin(0, 0)

        // Grid - we start from bottom left
        for (var row = 0; row < GRID_SIZE; row++)
        {
            grid[row] = []

            for (var column = 0; column < GRID_SIZE; column++)
                {
                    const posX = START_GRID_POS[0] + (row * CELL_SIZE[0])
                    const posY = START_GRID_POS[1] - (column * CELL_SIZE[1])
                    const color = Math.floor(Math.random() * COLORS.length)

                    // TODO : Make the arrival animation
                    const tile = this.add.spine(posX, posY, 'citrustack_json', 'citrustack_atlas')
                    tile.hitbox = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(posX-20, posY-35, 40, 40), Phaser.Geom.Rectangle.Contains)
                    // this.add.graphics().fillStyle(0x000000).fillRect(posX-20, posY-35, 40, 40).setAlpha(.5);

                    // , COLORS[color]
                    setColor(tile, COLORS[color])
                        // Colors are set as skins and can be blue, green, orange, yellow and rainbow
                        // All colors also include a <color>_glow variant for the glowing version of the sprite
                        // Spine file also includes two animations: gradient (for the rainbow color shift) 
                        // and sway for the side to side movement
                        tile.animationState.setAnimation(1, "gradient", true)

                    tile.row = row
                    tile.column = column
                    tile.color = COLORS[color]
                    tile.movingLeft = false
                    tile.movingRight = false
                    tile.movingDown = false
                    tile.hitbox.on('pointerdown', () => 
                    {
                        var group = checkTileGroup(tile.row, tile.column, tile.color)
                        console.log(group)

                        // Not enough tiles of the same color around input
                        if (group.length <= 1)
                            return;

                        removeTiles(group)
                        increaseScore(group.length)
                        gravityTiles()
                    })
                    // TODO : Hover animation
                    tile.hitbox.on('pointerover', () => 
                        {
                            this.meepSound.play()
                            tile.animationState.setAnimation(0, 'sway', false)
                        })

                    grid[row][column] = tile
                }
        }

        levelInitialized = true

        function checkTileGroup(row, column, color, neighbours = [])
        {
            // We are out of the grid
            if (row < 0 || column < 0 || row >= GRID_SIZE || column >= GRID_SIZE)
                return []

            // No tile present (failsafe if the player somehow goes too fast)
            if (grid[row][column] == null)
                return []

            // We already visited this tile
            if (neighbours.some(t => t.row === row && t.column === column))
                return []

            // Wrong color
            if (grid[row][column].color != color)
                return []

            // We add to the visited cells
            neighbours.push({row, column})

            return [
                { row, column },
                ...checkTileGroup(row - 1, column, color, neighbours), // Up
                ...checkTileGroup(row + 1, column, color, neighbours), // Down
                ...checkTileGroup(row, column - 1, color, neighbours), // Left
                ...checkTileGroup(row, column + 1, color, neighbours), // Right
              ];
        }

        function removeTiles(tiles)
        {
            // TODO : Remove animation -> go toward the input tile in order of closesness and fade into transparency

            tiles.forEach(({ row, column }) => {
                grid[row][column].destroy();
                grid[row][column] = null;
              });
        }

        function increaseScore(tileAmount)
        {
            // TODO : have the score appear at different size + particles
            score += SCORES[tileAmount - 2]

            scoreTxt.setText(score)
        }

        function gravityTiles()
        {
            // TODO : Make the tiles without any below fall and have a slight anim curve when arriving
            // Make them go towards the side too if they are falling
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
        scoreTxt = this.add.text(167, 185, score, {fontSize: '32px', color: '#000000', align: 'center'})

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
    }

    update ()
    {
        // Check if level is over

        // Check if citrustacks need to fall
        if (!levelInitialized)
            return;

    }
}