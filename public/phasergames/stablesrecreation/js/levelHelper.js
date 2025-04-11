class LevelHelper {
    
    horseMovements = {
        backwards: 'backwards',
        cantering: 'cantering',
        galloping: 'galloping',
        jumping: 'jumping',
        skidding: 'skidding'
    }

    gemsScoreTxtStyle = {
        font: "normal 20px ArkonaRegular",
        color: "white",
        stroke: "#5f78c5",
        strokeThickness: 1.5
    }

    displayTxtStyle = {
            font: "normal 32px ArkonaRegular",
            color: "white",
            stroke: "rgba(110, 195, 221, 20)",
            strokeThickness: 3,
            align: "center"
        }
  
    score = 0
    canterSpeed = 350
    gallopSpeed = 500
    skidSpeed = 300
    runHeight = 290
    skidLoop = 0
    maxTimeScoreTxtAppear = 50
    scoreTxtAlphaAnimation = .15

    constructor (phaserScene, levelNumber, addRef) {
        this.phaserScene = phaserScene
        this.levelNumber = levelNumber
        this.addRef = addRef

        // Preload Scene
        phaserScene.load.image('scoreBoard', './images/scoreBoard.png');
        phaserScene.load.image('info', './images/info.png');
        phaserScene.load.image('infoButton', './images/infoButton.png');
        phaserScene.load.image('mountains', './images/mountains.png');
        phaserScene.load.image('path', './images/path.png');
        phaserScene.load.atlas('jumps', './images/jumps.png', './images/jumps.json');
        phaserScene.load.atlas('gems', './images/gems.png', './images/gems.json');
        phaserScene.load.atlas('horseshoe', './images/horseshoe.png', './images/horseshoe.json');
        phaserScene.load.atlas('backgroundObjects', './images/backgroundObjects.png', './images/backgroundObjects.json');
        phaserScene.load.image('endGate', './images/endGate.png');

        phaserScene.clock = phaserScene.plugins.get('rexclockplugin').add(phaserScene, config);
        if (this.addRef) {
            phaserScene.load.image(`Level${levelNumber}`, `./images/Level Screens/Level${levelNumber}.png`);
        }
    }


    // ====== BEGIN MAIN FUNCTIONS ====== //
        /**
         * Main function to call at the start of scene create.
         * This function creates the inputs and level background.
         */
        startCreate() {
            this.score = 0
            this.phaserScene.horseshoes = 0
            this.phaserScene.timeEnd = false // Should become true on game end

            this.createInputs()
            this.createLevelBackground()
        }

        /**
         * Main function to call in the middle of scene create (between the background elements and the horsehoe).
         * This function creates the horse, camera, start gate and end gate.
         */
        createHorseAndGates() {
            this.createHorse()
            this.createGates()
        }
        
        /**
        * Main function to call at end of scene create.
        * This function creates the midground animations and groups, debug mode and the UI/HUD
        */
        endCreate() {
            this.createMidgroundAnimationsAndGroups()
            this.createDebugMode()
            this.createDisplays()
            this.createUI()
        }

        levelUpdate() {
            this.phaserScene.timerText.text = this.millisToMinutesAndSeconds(this.phaserScene.clock.now)
    
            this.defineInputs()
            this.updateHorseMovement()
            this.updateHorseSpriteAndSpeed(this.levelNumber)
    
            this.checkJumpCollision()
            this.checkGemCollision()
            this.checkHorseshoeCollision()
            this.checkEndGateCollision()
        }
    // ====== END MAIN FUNCTIONS ====== //


    // ====== BEGIN CREATE FUNCTIONS ====== //
        createInputs() {
            this.phaserScene.cursors = this.phaserScene.input.keyboard.createCursorKeys();
            this.phaserScene.spaceBar = this.phaserScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            this.phaserScene.input.addPointer(1);
        }

        createLevelBackground() {
            this.phaserScene.add.image(444, 234, 'mountains').setScrollFactor(0)        
            for (let index = 0; index < this.phaserScene.levelEnd / 468; index++) {            
                this.phaserScene.add.image(444 + (index * 888), 234, 'path')
            }
            // Level Reference
            if (this.addRef) {
                this.phaserScene.add.image(0, 0, `Level${this.levelNumber}`).setOrigin(0, 0).setAlpha(.6) 
            }
        }

        createHorse(){
            this.phaserScene.horse = this.phaserScene.physics.add.sprite(-100, this.runHeight, `horse${this.levelNumber}`, 'canter0000')
            if (!this.phaserScene.anims.exists(`canter${this.levelNumber}`)) {
                this.phaserScene.anims.create({
                    key: `canter${this.levelNumber}`,
                    frames: this.phaserScene.anims.generateFrameNumbers(`horse${this.levelNumber}`, { frames: [
                        'canter0000', 'canter0001', 'canter0002', 'canter0003', 'canter0004', 'canter0005', 'canter0006', 'canter0007', 'canter0008', 'canter0009', 'canter0010', 'canter0011'
                    ] }),
                    frameRate: 20,
                    repeat: -1
                });
                this.phaserScene.anims.create({
                    key: `gallop${this.levelNumber}`,
                    frames: this.phaserScene.anims.generateFrameNumbers(`horse${this.levelNumber}`, { frames: [
                        'gallop0000', 'gallop0001', 'gallop0002', 'gallop0003', 'gallop0004', 'gallop0005', 'gallop0006'
                    ] }),
                    frameRate: 20,
                    repeat: -1
                });
                this.phaserScene.anims.create({
                    key: `jump${this.levelNumber}`,
                    frames: this.phaserScene.anims.generateFrameNumbers(`horse${this.levelNumber}`, { frames: [
                        'jump0000', 'jump0001', 'jump0002', 'jump0003', 'jump0004', 'jump0005', 'jump0006', 'jump0007', 'jump0008', 'jump0009', 'jump0010', 'land0000'
                    ] }),
                    frameRate: 16
                });
                this.phaserScene.anims.create({
                    key: `slideStart${this.levelNumber}`,
                    frames: this.phaserScene.anims.generateFrameNumbers(`horse${this.levelNumber}`, { frames: [
                        'slide0000', 'slide0001'
                    ] }),
                    frameRate: 20
                });
                this.phaserScene.anims.create({
                    key: `slide${this.levelNumber}`,
                    frames: this.phaserScene.anims.generateFrameNumbers(`horse${this.levelNumber}`, { frames: [
                        'slide0002', 'slide0003', 'slide0004', 'slide0005', 'slide0006'
                    ] }),
                    frameRate: 20,
                    repeat: -1
                });
                this.phaserScene.anims.create({
                    key: `slideEnd${this.levelNumber}`,
                    frames: this.phaserScene.anims.generateFrameNumbers(`horse${this.levelNumber}`, { frames: [
                        'slide0007', 'slide0008', 'slide0009'
                    ] }),
                    frameRate: 20
                });
            }
            this.phaserScene.horseMovement = this.horseMovements.cantering
            this.phaserScene.horse.setVelocityX(this.canterSpeed);
            this.phaserScene.horse.body.setSize(150, 105, false).setOffset(70, 95);
            this.phaserScene.horse.play(`canter${this.levelNumber}`)

            // Camera
            this.phaserScene.cameras.main.startFollow(this.phaserScene.horse, false, 1, 0, -275, 45).setBounds(0, 0, this.phaserScene.levelEnd, 468);
        }

        createGates() {
            this.phaserScene.endGate = this.phaserScene.physics.add.image(this.phaserScene.levelEnd - 83, 270, 'endGate').setOrigin(0, .5)
            this.phaserScene.endGate.body.setOffset(70, 0);
            this.phaserScene.add.sprite(this.phaserScene.levelEnd, 0, 'backgroundObjects', 'rainbow').setOrigin(1, 0)
        }

        createMidgroundAnimationsAndGroups() {
            // Horseshoe
            if (!this.phaserScene.anims.exists('horseshoe')) {
                this.phaserScene.anims.create({
                    key: 'horseshoe',
                    frames: this.phaserScene.anims.generateFrameNumbers('horseshoe', { frames: [
                        '1', '2'
                    ] }),
                    frameRate: 10,
                    repeat: -1
                });
            }
            this.phaserScene.horseshoe.play('horseshoe')

            // Gems
            this.phaserScene.gems = this.phaserScene.physics.add.group({immovable: true});
            this.phaserScene.gems.addMultiple(this.phaserScene.gemsArray);
            this.phaserScene.gemsScoreTxt = [];

            // Jumps
            this.alignJumps()
            this.phaserScene.jumps = this.phaserScene.physics.add.group({immovable: true});
            this.phaserScene.jumps.addMultiple(this.phaserScene.jumpsArray);
        }
    
        alignJumps() {
            this.phaserScene.jumpsArray.forEach(jump => {
                let x = 0
                let y = 0
                switch (jump.frame.name) {
                    case 'blueFence':
                        x = 20
                        y = 60
                        break;
                    case 'hayBale':
                        x = 15
                        y = 25
                        break;
                    case 'hedge':
                        x = 30
                        y = 30
                        break;
                    case 'hedgeSmall':
                        x = 20
                        y = 35
                        break;
                    case 'log':
                        x = 10
                        y = 20
                        break;
                    case 'stump':
                        x = 30
                        y = 20
                        break;
                    case 'wall':
                    case 'wallGreen':
                        x = 10
                        y = 60
                        break;
                    case 'waterTrough':
                        x = 10
                        y = 20
                        break;
                    case 'woodenFence':
                        x = 20
                        y = 50
                        break;
                
                    default:
                        console.log("Unknown jump type: " + jump.frame.name)
                        break;
                }
                if (jump.y + y >= 400) {
                    y = 400 - jump.y 
                } else if (jump.y + y <= 375) {
                    y = 375 - jump.y 
                }
                jump.body.setSize(5, 40, false).setOffset(x, y);
            });
        }

        createDebugMode() {
            // Extra settings for debug mode
            if (this.phaserScene.physics.config.debug) {
                // Start at specified x
                this.phaserScene.horse.x = this.phaserScene.debugStartX
                // Keep horse still unless buttons are pressed
                this.canterSpeed = 0
                this.phaserScene.horse.setVelocityX(this.canterSpeed);
                // Speed up movement
                this.gallopSpeed = this.gallopSpeed 

                // Display object coordinates in debug mode
                this.phaserScene.gemsArray.forEach(gem => {
                    this.phaserScene.gemText = this.phaserScene.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 10, color: '#ffffff', align: 'center' });
                    this.phaserScene.gemText.text = "x: " + gem.x + "\ny: " + gem.y;
                    this.phaserScene.gemText.setPosition(gem.x-this.phaserScene.gemText.width/2, gem.y-40);
                });
                this.phaserScene.jumpsArray.forEach(jump => {
                    this.phaserScene.jumpText = this.phaserScene.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 10, color: '#ffffff', align: 'center' });
                    this.phaserScene.jumpText.text = "x: " + jump.x + "\ny: " + jump.y;
                    this.phaserScene.jumpText.setPosition(jump.x-this.phaserScene.jumpText.width/2, jump.y-40);
                });
            }
        }

        createDisplays() {
            // Display
            this.phaserScene.add.image(444, 30, 'scoreBoard').setScrollFactor(0) 
            // Horseshoe Display
            this.phaserScene.horseshoeText = this.phaserScene.add.text(0, 0, 'Static Text Object', this.displayTxtStyle).setScrollFactor(0);
            this.phaserScene.horseshoeText.text = this.phaserScene.horseshoes + " x ";
            this.phaserScene.horseshoeText.setPosition(320-this.phaserScene.horseshoeText.width/2, 31-this.phaserScene.horseshoeText.height/2);
            // Score Display
            this.phaserScene.scoreNameText = this.phaserScene.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 10, color: '#ffffff', align: 'center' }).setScrollFactor(0);
            this.phaserScene.scoreNameText.text = langData.score;
            this.phaserScene.scoreNameText.setPosition(445-this.phaserScene.scoreNameText.width/2, 18-this.phaserScene.scoreNameText.height/2);

            this.phaserScene.scoreText = this.phaserScene.add.text(0, 0, 'Static Text Object', this.displayTxtStyle).setScrollFactor(0);
            this.phaserScene.scoreText.text = this.score;
            this.phaserScene.scoreText.setPosition(445-this.phaserScene.scoreText.width/2, 36-this.phaserScene.scoreText.height/2);
            // Clock and Clock Display
            this.phaserScene.clock.start();
            this.phaserScene.clockNameText = this.phaserScene.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 10, color: '#ffffff', align: 'center' }).setScrollFactor(0);
            this.phaserScene.clockNameText.text = langData.time;
            this.phaserScene.clockNameText.setPosition(570-this.phaserScene.clockNameText.width/2, 18-this.phaserScene.clockNameText.height/2);
            this.phaserScene.timerText = this.phaserScene.add.text(443, 234, 'Static Text Object', this.displayTxtStyle).setScrollFactor(0)//.setVisible(false);
            this.phaserScene.timerText.text = "0:00";
            this.phaserScene.timerText.setPosition(575-this.phaserScene.timerText.width/2, 36-this.phaserScene.timerText.height/2);
        }

        createUI() {
            let data = this.phaserScene.data
            // UI
            this.phaserScene.add.image(443, 234, 'UI').setScrollFactor(0)
            // Music button
            const musicButton = this.phaserScene.add.sprite(871, 453, 'music_button', 'music_on').setInteractive({ pixelPerfect: true }).setScale(0.7).setScrollFactor(0).setFrame(`music_${data.playMusic ? 'on' : 'off'}`);
                musicButton.on('pointerdown', function (pointer)
                {
                    if (data.playMusic) {
                        data.backgroundMusic.stop()
                        this.phaserScene.setFrame('music_off_hover')
                    }
                    else {
                        data.backgroundMusic.play()
                        this.phaserScene.setFrame('music_on_hover')
                    }
                    data.playMusic = !data.playMusic
                });
                musicButton.on('pointerover', function (pointer) { this.phaserScene.setFrame(`music_${data.playMusic ? 'on' : 'off'}_hover`);});
                musicButton.on('pointerout', function (pointer) { this.phaserScene.setFrame(`music_${data.playMusic ? 'on' : 'off'}`) });
            
                // Level end info
            this.phaserScene.infoScreen = this.phaserScene.add.image(443, 234, 'info').setScrollFactor(0).setVisible(false)
            this.phaserScene.infoButton = this.phaserScene.add.image(443, 304, 'infoButton').setScrollFactor(0).setVisible(false)
                this.phaserScene.infoButton.on('pointerdown', function (pointer)
                {
                    nextScreen = true
                });
        }
    // ====== END CREATE FUNCTIONS ====== //


    // ====== BEGIN UPDATE FUNCTIONS ====== //
        /**
         * Defines the inputs for both keyboard and touch inputs
         */
        defineInputs() {
            // Combine Button and Touch inputs
            if (this.phaserScene.spaceBar.isDown || (this.phaserScene.input.pointer1.isDown && this.phaserScene.input.pointer1.x < 443) || (this.phaserScene.input.pointer2.isDown && this.phaserScene.input.pointer2.x < 443)) {
                this.jumpCtrl = true
            } else {
                this.jumpCtrl = false
            }
            
            if (this.phaserScene.cursors.right.isDown || (this.phaserScene.input.pointer1.isDown && this.phaserScene.input.pointer1.x >= 443) || (this.phaserScene.input.pointer2.isDown && this.phaserScene.input.pointer2.x >= 443)) {
                this.runCtrl = true
            } else {
                this.runCtrl = false
            }
        }

        updateHorseMovement() {
            // Controls
            if (this.jumpCtrl && this.phaserScene.horseMovement !== this.horseMovements.skidding) {
                // Horse jump if spacebar is pressed
                this.phaserScene.horseMovement = this.horseMovements.jumping
            }
            else if (this.runCtrl && this.phaserScene.horseMovement !== this.horseMovements.skidding && this.phaserScene.horseMovement !== this.horseMovements.jumping) {
                // Horse gallop when right arrow key is down and horse is not jumping or sliding
                this.phaserScene.horseMovement = this.horseMovements.galloping
            }
            else if (this.phaserScene.physics.config.debug && this.phaserScene.cursors.left.isDown && this.phaserScene.horseMovement !== this.horseMovements.skidding && this.phaserScene.horseMovement !== this.horseMovements.jumping) {
                // Allow backwards movement in debug mode when left arrow key is down and horse is not jumping or sliding
                this.phaserScene.horseMovement = this.horseMovements.backwards
            }
            else if (!this.runCtrl && this.phaserScene.horseMovement !== this.horseMovements.skidding && this.phaserScene.horseMovement !== this.horseMovements.jumping) {
                // Horse canter if right arrow key is not down and horse is not jumping or sliding
                this.phaserScene.horseMovement = this.horseMovements.cantering
            }
        }

        updateHorseSpriteAndSpeed() {
            if (this.phaserScene.horseMovement === this.horseMovements.skidding) {
                this.phaserScene.data.runningSound.stop()
                this.phaserScene.data.canterSound.stop()
                // Start slide animation
                if (!this.phaserScene.horse.frame.name.includes('slide')) {
                    this.phaserScene.horse.play(`slideStart${this.levelNumber}`)
                    this.phaserScene.data.buttslideSound.play()
                    this.skidLoop = 0
                    this.phaserScene.horse.setVelocityX(this.skidSpeed);
                    this.phaserScene.horse.body.setSize(150, 105, false).setOffset(70, 95);
                }
                // Loop sliding animation
                else if ((this.phaserScene.horse.frame.name === 'slide0001' || this.phaserScene.horse.frame.name === 'slide0006') && this.skidLoop < 3) {
                    // console.log('Frame: ' + this.phaserScene.horse.frame.name + ' Loop: ' + this.skidLoop)
                    this.phaserScene.horse.play(`slide${this.levelNumber}`)
                    this.skidLoop += 1
                }
                // End slide animation
                else if (this.phaserScene.horse.frame.name === 'slide0006' && this.skidLoop >= 3) {
                    this.phaserScene.horse.play(`slideEnd${this.levelNumber}`)
                }
                // Return to running after done sliding
                else if (this.phaserScene.horse.frame.name === 'slide0009') {
                    this.phaserScene.horseMovement = this.horseMovements.cantering
                }
            }
            else if (this.phaserScene.horseMovement === this.horseMovements.jumping) {
                this.phaserScene.data.runningSound.stop()
                this.phaserScene.data.canterSound.stop()
                this.phaserScene.data.buttslideSound.stop()
                // Play jump animation
                if (!this.phaserScene.horse.frame.name.includes('jump')) {
                    this.phaserScene.horse.play(`jump${this.levelNumber}`)
                }
                // Adjust horse hitbox position whilst jumping
                switch (this.phaserScene.horse.frame.name) {
                    case 'jump0001':
                        this.phaserScene.horse.body.setSize(150, 105, false).setOffset(90, 70);
                        break;
                    case 'jump0002':
                        this.phaserScene.horse.body.setSize(150, 105, false).setOffset(110, 35);
                        break;
                    case 'jump0003':
                        this.phaserScene.horse.body.setSize(150, 105, false).setOffset(110, 25);
                        break;
                    case 'jump0004':
                        this.phaserScene.horse.body.setSize(150, 105, false).setOffset(110, 20);
                        break;
                    case 'jump0005':
                        this.phaserScene.horse.body.setSize(150, 105, false).setOffset(110, 20);
                        break;
                    case 'jump0006':
                        this.phaserScene.horse.body.setSize(150, 105, false).setOffset(110, 20);
                        break;
                    case 'jump0007':
                        this.phaserScene.horse.body.setSize(150, 105, false).setOffset(110, 20);
                        break;
                    case 'jump0008':
                        this.phaserScene.horse.body.setSize(150, 105, false).setOffset(115, 25);
                        break;
                    case 'jump0009':
                        this.phaserScene.horse.body.setSize(150, 105, false).setOffset(110, 35);
                        break;
                    case 'jump0010':
                        this.phaserScene.horse.body.setSize(150, 105, false).setOffset(110, 55);
                        break;
                        
                    case 'land0000':
                        this.phaserScene.horse.body.setSize(150, 105, false).setOffset(90, 85);
                        this.phaserScene.horseMovement = this.horseMovements.cantering
                        break;
                
                    default:
                        this.phaserScene.horse.body.setSize(150, 105, false).setOffset(70, 95);
                        this.phaserScene.horseMovement = this.horseMovements.cantering
                        break;
                }
                // Adjust speed
                if (this.runCtrl && this.phaserScene.horseMovement !== this.horseMovements.skidding) {
                    // Horse gallop speed when right arrow key is down
                    this.phaserScene.horse.setVelocityX(this.gallopSpeed);
                }
                else if (this.phaserScene.physics.config.debug && this.phaserScene.cursors.left.isDown && this.phaserScene.horseMovement !== this.horseMovements.skidding) {
                    // Backwards movement in debug mode when left arrow key is down
                    this.phaserScene.horse.setVelocityX(-this.gallopSpeed);
                }
                else if (!this.runCtrl && this.phaserScene.horseMovement !== this.horseMovements.skidding) {
                    // Horse canter speed if right arrow key is not down
                    this.phaserScene.horse.setVelocityX(this.canterSpeed);
                }
            }
            else if (this.phaserScene.horseMovement === this.horseMovements.galloping) {
                if (!this.phaserScene.horse.frame.name.includes('gallop')) {
                    this.phaserScene.data.canterSound.stop()
                    this.phaserScene.data.buttslideSound.stop()
                    this.phaserScene.horse.setVelocityX(this.gallopSpeed);
                    this.phaserScene.horse.body.setSize(150, 105, false).setOffset(70, 95);
                    this.phaserScene.horse.play(`gallop${this.levelNumber}`)
                    this.phaserScene.data.runningSound.play()
                }
            }
            else if (this.phaserScene.horseMovement === this.horseMovements.backwards) {
                if (!this.phaserScene.horse.frame.name.includes('gallop')) {
                    this.phaserScene.data.canterSound.stop()
                    this.phaserScene.data.buttslideSound.stop()
                    this.phaserScene.horse.setVelocityX(-this.gallopSpeed);
                    this.phaserScene.horse.body.setSize(150, 105, false).setOffset(70, 95);
                    this.phaserScene.horse.play(`gallop${this.levelNumber}`)
                    this.phaserScene.data.runningSound.play()
                }
            }
            else if (this.phaserScene.horseMovement === this.horseMovements.cantering) {
                this.phaserScene.data.runningSound.stop()
                this.phaserScene.data.buttslideSound.stop()
                if (!this.phaserScene.horse.frame.name.includes('canter')) {
                    this.phaserScene.horse.setVelocityX(this.canterSpeed);
                    this.phaserScene.horse.body.setSize(150, 105, false).setOffset(70, 95);
                    this.phaserScene.horse.play(`canter${this.levelNumber}`)
                    this.phaserScene.data.canterSound.play()
                }
            }
        }

        checkJumpCollision() {
            let scene = this.phaserScene
            // Jumps
            scene.physics.overlap(
                scene.horse,
                scene.jumps,
                function() {
                        scene.horseMovement = scene.levelHelper.horseMovements.skidding
                },
                null,
                scene);
        }

        checkGemCollision() {
            let scene = this.phaserScene
            let helper = this
            // Gems
            scene.gems.getChildren().forEach(gem => {
                scene.physics.overlap(
                    scene.horse,
                    gem,
                    function() {
                        if (gem.visible) {
                            gem.setVisible(false)
                            let points = 0
                            switch (gem.frame.name) {
                                case "gemBlue5":
                                    points += 5
                                    scene.data.blueGemSound.play()
                                    break;
                                case "gemPink10":
                                    points += 10
                                    scene.data.pinkGemSound.play()
                                    break;
                                case "gemYellow15":
                                    points += 15
                                    scene.data.yellowGemSound.play()
                                    break;
                                case "gemBlue20":
                                    points += 20
                                    scene.data.blueGemSound.play()
                                    break;
                                case "gemPink25":
                                    points += 25
                                    scene.data.pinkGemSound.play()
                                    break;
                                case "gemYellow30":
                                    points += 30
                                    scene.data.yellowGemSound.play()
                                    break;
                                case "gemBlue35":
                                    points += 35
                                    scene.data.blueGemSound.play()
                                    break;
                                case "gemPink40":
                                    points += 40
                                    scene.data.pinkGemSound.play()
                                    break;
                                case "gemYellow45":
                                    points += 45
                                    scene.data.yellowGemSound.play()
                                    break;
                                case "gemBlue50":
                                    points += 50
                                    scene.data.blueGemSound.play()
                                    break;
                                case "gemPink55":
                                    points += 55
                                    scene.data.pinkGemSound.play()
                                    break;
                                case "gemYellow60":
                                    points += 60
                                    scene.data.yellowGemSound.play()
                                    break;
                                case "gemBlue65":
                                    points += 65
                                    scene.data.blueGemSound.play()
                                    break;
                                case "gemPink70":
                                    points += 70
                                    scene.data.pinkGemSound.play()
                                    break;
                                case "gemYellow75":
                                    points += 75
                                    scene.data.yellowGemSound.play()
                                    break;
                            
                                default:
                                    console.log("Unknown gem: " + gem.frame.name)
                                    break;
                            }

                            var gemTxt = scene.add.text(gem.x, gem.y, points, helper.gemsScoreTxtStyle).setOrigin(.5, .5)
                            gemTxt.alpha = 0
                            var gemsTxtDatas = {
                                txt : gemTxt,
                                currenFrameVisible : 0
                            }
                            scene.gemsScoreTxt.push(gemsTxtDatas)

                            helper.score += points
                            scene.scoreText.text = helper.score
                            scene.scoreText.setPosition(445-scene.scoreText.width/2, 36-scene.scoreText.height/2);
                        }
                    },
                    null,
                    scene);
            });

            // Handle gem score text
            for (var i = scene.gemsScoreTxt.length - 1; i >= 0; i--) {
                scene.gemsScoreTxt[i].txt.setPosition(
                    scene.gemsScoreTxt[i].txt.x,
                    scene.gemsScoreTxt[i].txt.y -= .1)

                if (scene.gemsScoreTxt[i].currenFrameVisible >= helper.maxTimeScoreTxtAppear)
                {
                    scene.gemsScoreTxt[i].txt.alpha -= helper.scoreTxtAlphaAnimation

                    if (scene.gemsScoreTxt[i].txt.alpha <= 0)
                    {
                        scene.gemsScoreTxt[i].txt.destroy();
                        scene.gemsScoreTxt.splice(i, 1);           
                    }
                    continue;
                }
                else
                {
                    if (scene.gemsScoreTxt[i].txt.alpha < 1)
                    {
                        scene.gemsScoreTxt[i].txt.alpha += helper.scoreTxtAlphaAnimation
                        continue;
                    }

                    scene.gemsScoreTxt[i].currenFrameVisible++;
                }
            }
        }

        checkHorseshoeCollision() {
            let scene = this.phaserScene
            scene.physics.overlap(
                scene.horse,
                scene.horseshoe,
                function() {
                        if (scene.horseshoe.visible) {
                            scene.horseshoe.setVisible(false)
                            scene.horseshoes += 1
                            scene.horseshoeText.text = scene.horseshoes + " x ";
                            scene.horseshoeText.setPosition(320-scene.horseshoeText.width/2, 35-scene.horseshoeText.height/2);
                            scene.data.horseshoeSound.play()
                            addHorseshoes(1);
                        }
                },
                null,
                scene);
        }

        checkEndGateCollision() {
            let scene = this.phaserScene
            let helper = this
            // End gate
            scene.physics.overlap(
                scene.horse,
                [scene.endGate],
                function() {
                    if (!scene.timeEnd) {
                        scene.timeEnd = true
                        scene.clock.pause()
                        let timeBonus = (scene.levelTime * 100) -  Math.ceil(scene.clock.now / 10)
                        if (timeBonus < 0) {
                            timeBonus = 0
                        }
                        let finalScore = helper.score + timeBonus

                        scene.infoScreen.setVisible(true)
                        scene.infoButton.setVisible(true).setInteractive()

                        let levelText = scene.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 30, color: '#ffffff', align: 'center' }).setScrollFactor(0);
                        let buttonText = scene.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 15, color: '#ffffff', align: 'center' }).setScrollFactor(0);

                        if (timeBonus > 0) {
                            levelText.text = langData.succeed_title;
                            buttonText.text = langData.succeed_level_select;
                            scene.data.levelUnlocked[helper.levelNumber] = scene.canUnlockNext
                            if (scene.canUnlockNext)
                                updateLevelReached(helper.levelNumber + "@SpectacularJumpingGame");
                        }
                        else {
                            levelText.text = langData.fail_title;
                            buttonText.text = langData.fail_level_select;
                        }

                        levelText.setPosition(443-levelText.width/2, 150-levelText.height/2);
                        buttonText.setPosition(443-buttonText.width/2, 304-buttonText.height/2);

                        let endTimeText = scene.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 15, color: '#ffffff', align: 'center' }).setScrollFactor(0);
                        endTimeText.text = langData.time_bonus + " = " + timeBonus + " " + langData.points;
                        endTimeText.setPosition(443-endTimeText.width/2, 185-endTimeText.height/2);

                        let endGemText = scene.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 15, color: '#ffffff', align: 'center' }).setScrollFactor(0);
                        endGemText.text = langData.gem_bonus + " = " + helper.score + " " + langData.points;
                        endGemText.setPosition(443-endGemText.width/2, 215-endGemText.height/2);

                        let endLevelText = scene.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 15, color: '#ffffff', align: 'center' }).setScrollFactor(0);
                        endLevelText.text = langData.level_score + " = " + finalScore + " " + langData.points;
                        endLevelText.setPosition(443-endLevelText.width/2, 245-endLevelText.height/2);

                        let endHorseshoeText = scene.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 15, color: '#ffffff', align: 'center' }).setScrollFactor(0);
                        scene.add.sprite(433, 267, 'horseshoe', 'icon').setScale(.5).setScrollFactor(0)
                        endHorseshoeText.text = " = " + scene.horseshoes;
                        endHorseshoeText.setPosition(456-endHorseshoeText.width/2, 270-endHorseshoeText.height/2);
                    }
                },
                null,
                scene);
        }
    // ====== END UPDATE FUNCTIONS ====== //


    // ====== BEGIN HELPER FUNCTIONS ====== //
        /**
         * Helper function to convert milliseconds to minutes and seconds
         * @param {*} millis 
         * @returns A string displaying the number of minutes and seconds
         */
        millisToMinutesAndSeconds(millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        }

        /**
         * Destroy the level helper
         */
        destroy() {
            this.phaserScene.data.runningSound.stop()
            this.phaserScene.data.canterSound.stop()
            this.phaserScene.data.buttslideSound.stop()
            delete this['id'];
        }
    // ====== END HELPER FUNCTIONS ====== //
}