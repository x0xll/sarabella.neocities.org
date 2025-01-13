class LevelTwo extends Phaser.Scene 
{

    score = 0
    horse
    canterSpeed = 350
    gallopSpeed = 500
    skidSpeed = 300
    runHeight = 280
    horseMovements = {
        backwards: 'backwards',
        cantering: 'cantering',
        galloping: 'galloping',
        jumping: 'jumping',
        skidding: 'skidding'
    }
    horseMovement = this.horseMovements.cantering
    skidLoop = 0
    levelEnd = 31628
    levelTime = 50
    jumpCtrl
    jumpButton
    runCtrl
    runButton

    constructor ()
    {
        super({ key: 'LevelTwo' });
    }

    preload ()
    {
        this.load.image('scoreBoard', './images/scoreBoard.png');
        this.load.image('info', './images/info.png');
        this.load.image('infoButton', './images/infoButton.png');
        this.load.image('mountains', './images/mountains.png');
        this.load.image('path', './images/path.png');
        this.load.atlas('horse', './images/horse.png', './images/horse.json');
        this.load.atlas('jumps', './images/jumps.png', './images/jumps.json');
        this.load.atlas('gems', './images/gems.png', './images/gems.json');
        this.load.atlas('horseshoe', './images/horseshoe.png', './images/horseshoe.json');
        this.load.atlas('backgroundObjects', './images/backgroundObjects.png', './images/backgroundObjects.json');
        this.load.image('endGate', './images/endGate.png');

        this.clock = this.plugins.get('rexclockplugin').add(this, config);

        // Level reference
        this.load.image('Level2', './images/LevelScreens/Level2.png');
    }

    create (data)
    { 
        this.data = data
        this.score = 0
        this.horseshoes = 0
        this.timeEnd = false // Should become true on game end

        // Inputs
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.addPointer(1);


        // BG
        this.add.image(444, 234, 'mountains').setScrollFactor(0)        
        for (let index = 0; index < this.levelEnd / 468; index++) {            
            this.add.image(444 + (index * 888), 234, 'path')
        }
        // Level Reference
        this.add.image(0, 0, 'Level2').setOrigin(0, 0).setAlpha(.6) 


        // Display
        this.add.image(444, 30, 'scoreBoard').setScrollFactor(0) 
        // Horseshoe Display
        this.horseshoeText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 30, color: '#ffffff', align: 'center' }).setScrollFactor(0);
        this.horseshoeText.text = this.horseshoes + " x ";
        this.horseshoeText.setPosition(320-this.horseshoeText.width/2, 35-this.horseshoeText.height/2);
        // Score Display
        this.scoreNameText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 10, color: '#ffffff', align: 'center' }).setScrollFactor(0);
        this.scoreNameText.text = langData.score;
        this.scoreNameText.setPosition(445-this.scoreNameText.width/2, 18-this.scoreNameText.height/2);

        this.scoreText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 30, color: '#ffffff', align: 'center' }).setScrollFactor(0);
        this.scoreText.text = this.score;
        this.scoreText.setPosition(445-this.scoreText.width/2, 40-this.scoreText.height/2);
        // Clock
        this.clock.start();
        // Display
        this.clockNameText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 10, color: '#ffffff', align: 'center' }).setScrollFactor(0);
        this.clockNameText.text = langData.time;
        this.clockNameText.setPosition(570-this.clockNameText.width/2, 18-this.clockNameText.height/2);
        this.timerText = this.add.text(443, 234, 'Static Text Object', { fontFamily: 'Arial', fontSize: 30, color: '#ffffff', align: 'center' }).setScrollFactor(0)//.setVisible(false);
        this.timerText.text = "0:00";
        this.timerText.setPosition(575-this.timerText.width/2, 40-this.timerText.height/2);


        // Background Elements
        this.add.sprite(165, 285, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(95, 285, 'backgroundObjects', 'startGateBack')
        this.add.sprite(535, 285, 'backgroundObjects', 'bush')
        this.add.sprite(1100, 285, 'backgroundObjects', 'bush')
        this.add.sprite(1885, 285, 'backgroundObjects', 'bush').setScale(.4, .8)
        this.add.sprite(2306, 285, 'backgroundObjects', 'bush')
        this.add.sprite(2290, 325, 'backgroundObjects', 'bridge2Back')

        // Horse
        this.horse = this.physics.add.sprite(-100, this.runHeight, 'horse', 'canter0000')
        if (!this.anims.exists('canter')) {
            this.anims.create({
                key: 'canter',
                frames: this.anims.generateFrameNumbers('horse', { frames: [
                    'canter0000', 'canter0001', 'canter0002', 'canter0003', 'canter0004', 'canter0005', 'canter0006', 'canter0007', 'canter0008', 'canter0009', 'canter0010', 'canter0011'
                ] }),
                frameRate: 20,
                repeat: -1
            });
            this.anims.create({
                key: 'gallop',
                frames: this.anims.generateFrameNumbers('horse', { frames: [
                    'gallop0000', 'gallop0001', 'gallop0002', 'gallop0003', 'gallop0004', 'gallop0005', 'gallop0006'
                ] }),
                frameRate: 20,
                repeat: -1
            });
            this.anims.create({
                key: 'jump',
                frames: this.anims.generateFrameNumbers('horse', { frames: [
                    'jump0000', 'jump0001', 'jump0002', 'jump0003', 'jump0004', 'jump0005', 'jump0006', 'jump0007', 'jump0008', 'jump0009', 'jump0010', 'land0000'
                ] }),
                frameRate: 16
            });
            this.anims.create({
                key: 'slideStart',
                frames: this.anims.generateFrameNumbers('horse', { frames: [
                    'slide0000', 'slide0001'
                ] }),
                frameRate: 20
            });
            this.anims.create({
                key: 'slide',
                frames: this.anims.generateFrameNumbers('horse', { frames: [
                    'slide0002', 'slide0003', 'slide0004', 'slide0005', 'slide0006'
                ] }),
                frameRate: 20,
                repeat: -1
            });
            this.anims.create({
                key: 'slideEnd',
                frames: this.anims.generateFrameNumbers('horse', { frames: [
                    'slide0007', 'slide0008', 'slide0009'
                ] }),
                frameRate: 20
            });
        }
        this.horseMovement = this.horseMovements.cantering
        this.horse.setVelocityX(this.canterSpeed);
        this.horse.body.setSize(150, 105, false).setOffset(70, 95);
        this.horse.play('canter')


        // Camera
        this.cameras.main.startFollow(this.horse, false, 1, 0, -275, 45).setBounds(0, 0, this.levelEnd, 468);


        // Start and End Gates
        this.endGate = this.physics.add.image(this.levelEnd - 83, 270, 'endGate').setOrigin(0, .5)
        this.endGate.body.setOffset(70, 0);


        // Horseshoe
        this.horseshoe = this.physics.add.sprite(20300, 220, 'horseshoe', '1')
        if (!this.anims.exists('horseshoe')) {
            this.anims.create({
                key: 'horseshoe',
                frames: this.anims.generateFrameNumbers('horseshoe', { frames: [
                    '1', '2'
                ] }),
                frameRate: 10,
                repeat: -1
            });
        }
        this.horseshoe.play('horseshoe')


        // Gems
        this.gemsArray = [
            this.physics.add.sprite(525, 345, 'gems', 'gemBlue5'),
            this.physics.add.sprite(838, 210, 'gems', 'gemYellow15'),
            this.physics.add.sprite(1065, 210, 'gems', 'gemBlue20'),
            this.physics.add.sprite(1495, 335, 'gems', 'gemPink10'),
            this.physics.add.sprite(1585, 320, 'gems', 'gemPink55'),
            this.physics.add.sprite(1913, 345, 'gems', 'gemBlue5'),
            this.physics.add.sprite(2285, 210, 'gems', 'gemPink40'),
            this.physics.add.sprite(2825, 310, 'gems', 'gemYellow15'),
            this.physics.add.sprite(2925, 210, 'gems', 'gemBlue65'),
            this.physics.add.sprite(3425, 295, 'gems', 'gemYellow30'),
            this.physics.add.sprite(3565, 245, 'gems', 'gemPink25'),
            this.physics.add.sprite(3940, 245, 'gems', 'gemPink10'),
            this.physics.add.sprite(4045, 200, 'gems', 'gemPink10'),
            this.physics.add.sprite(4155, 245, 'gems', 'gemPink10'),
            this.physics.add.sprite(4560, 330, 'gems', 'gemBlue5'),
            this.physics.add.sprite(5135, 310, 'gems', 'gemYellow75'),
            this.physics.add.sprite(5430, 200, 'gems', 'gemBlue50'),
            this.physics.add.sprite(5985, 275, 'gems', 'gemYellow15'),
            this.physics.add.sprite(6130, 275, 'gems', 'gemYellow15'),
            this.physics.add.sprite(6060, 205, 'gems', 'gemYellow15'),
            this.physics.add.sprite(6060, 345, 'gems', 'gemYellow15'),
            this.physics.add.sprite(6060, 275, 'gems', 'gemPink55'),
            this.physics.add.sprite(6685, 345, 'gems', 'gemBlue65'),
            this.physics.add.sprite(7590, 345, 'gems', 'gemPink10'),
            this.physics.add.sprite(7675, 345, 'gems', 'gemPink10'),
            this.physics.add.sprite(7760, 345, 'gems', 'gemPink10'),
            this.physics.add.sprite(8254, 295, 'gems', 'gemPink55'),
            this.physics.add.sprite(8740, 215, 'gems', 'gemBlue20'),
            this.physics.add.sprite(9155, 315, 'gems', 'gemPink70'),
            this.physics.add.sprite(9475, 250, 'gems', 'gemPink10'),
            this.physics.add.sprite(9870, 250, 'gems', 'gemPink10'),
            this.physics.add.sprite(10120, 250, 'gems', 'gemPink10'),
            this.physics.add.sprite(10390, 305, 'gems', 'gemBlue5'),
            this.physics.add.sprite(10935, 265, 'gems', 'gemBlue35'),
            this.physics.add.sprite(11265, 265, 'gems', 'gemYellow45'),
            this.physics.add.sprite(11670, 270, 'gems', 'gemBlue35'),
            this.physics.add.sprite(11805, 230, 'gems', 'gemBlue35'),
            this.physics.add.sprite(11940, 270, 'gems', 'gemBlue35'),
            this.physics.add.sprite(12310, 230, 'gems', 'gemBlue5'),
            this.physics.add.sprite(12495, 370, 'gems', 'gemBlue20'),
            this.physics.add.sprite(13155, 360, 'gems', 'gemPink40'),
            this.physics.add.sprite(13575, 340, 'gems', 'gemPink70'),
            this.physics.add.sprite(13375, 225, 'gems', 'gemBlue20'),
            this.physics.add.sprite(13575, 225, 'gems', 'gemBlue20'),
            this.physics.add.sprite(13770, 225, 'gems', 'gemBlue20'),
            this.physics.add.sprite(31628, 225, 'gems', 'gemPink10'),
        ]
        
        this.gems = this.physics.add.group({immovable: true});
        this.gems.addMultiple(this.gemsArray);


        // Jumps
        this.jumpsArray = [
            this.physics.add.sprite(1105, 365, 'jumps', 'stump'),
            this.physics.add.sprite(2910, 365, 'jumps', 'wall'),
            this.physics.add.sprite(4040, 365, 'jumps', 'waterTrough'),
            this.physics.add.sprite(7210, 365, 'jumps', 'waterTrough'),
            this.physics.add.sprite(8125, 365, 'jumps', 'wallGreen'),
            this.physics.add.sprite(8745, 365, 'jumps', 'hedge'),
            this.physics.add.sprite(12295, 365, 'jumps', 'hedge'), // TODO : Update visual
            this.physics.add.sprite(13670, 365, 'jumps', 'wall'),
            this.physics.add.sprite(14835, 365, 'jumps', 'wall'),
            this.physics.add.sprite(18415, 365, 'jumps', 'wall'),
            this.physics.add.sprite(20300, 365, 'jumps', 'woodenFence'),
            this.physics.add.sprite(21205, 365, 'jumps', 'hayBale'),
            this.physics.add.sprite(23010, 365, 'jumps', 'stump'),
            this.physics.add.sprite(24805, 365, 'jumps', 'hedge'), // TODO : Update visual
            this.physics.add.sprite(25925, 365, 'jumps', 'woodenFence'),
            this.physics.add.sprite(26710, 365, 'jumps', 'log'),
            this.physics.add.sprite(28525, 365, 'jumps', 'wall'),
            this.physics.add.sprite(29661, 365, 'jumps', 'hayBale')
        ]

        this.jumpsArray.forEach(jump => {
            switch (jump.frame.name) {
                case 'blueFence':
                    jump.body.setSize(5, 50, false).setOffset(20, 60);
                    break;
                case 'hayBale':
                    jump.body.setSize(5, 40, false).setOffset(15, 25);
                    break;
                case 'hedge':
                    jump.body.setSize(5, 40, false).setOffset(30, 30);
                    break;
                case 'log':
                    jump.body.setSize(5, 40, false).setOffset(10, 20);
                    break;
                case 'stump':
                    jump.body.setSize(5, 40, false).setOffset(30, 20);
                    break;
                case 'wall':
                case 'wallGreen':
                    jump.body.setSize(5, 50, false).setOffset(10, 60);
                    break;
                case 'waterTrough':
                    jump.body.setSize(5, 40, false).setOffset(10, 20);
                    break;
                case 'woodenFence':
                    jump.body.setSize(5, 50, false).setOffset(20, 50);
                    break;
            
                default:
                    console.log("Unknown jump type: " + jump.frame.name)
                    break;
            }
        });

        this.jumps = this.physics.add.group({immovable: true});
        this.jumps.addMultiple(this.jumpsArray);

        
        // Foreground Objects
        this.add.sprite(46, 285, 'backgroundObjects', 'startGateFront')
        this.add.sprite(185, 430, 'backgroundObjects', 'bush').setScale(.9, .85)
        this.add.sprite(605, 430, 'backgroundObjects', 'rock')
        this.add.sprite(1160, 440, 'backgroundObjects', 'bush').setScale(.8, .70)
        this.add.sprite(2290, 390, 'backgroundObjects', 'bridge2Front')
        this.add.sprite(2490, 440, 'backgroundObjects', 'bush').setScale(.4, .8)

        this.infoScreen = this.add.image(443, 234, 'info').setScrollFactor(0).setVisible(false)
        this.infoButton = this.add.image(443, 304, 'infoButton').setScrollFactor(0).setVisible(false)
            this.infoButton.on('pointerdown', function (pointer)
            {
                nextScreen = true
            });
        

        // Extra settings for debug mode
        if (this.physics.config.debug) {
            // Start at specified x
            this.horse.x = 50
            // Keep horse still unless buttons are pressed
            this.canterSpeed = 0
            this.horse.setVelocityX(this.canterSpeed);
            // Speed up movement
            this.gallopSpeed = this.gallopSpeed 

            // Display object coordinates in debug mode
            this.gemsArray.forEach(gem => {
                this.gemText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 10, color: '#ffffff', align: 'center' });
                this.gemText.text = "x: " + gem.x + "\ny: " + gem.y;
                this.gemText.setPosition(gem.x-this.gemText.width/2, gem.y-40);
            });
            this.jumpsArray.forEach(jump => {
                this.jumpText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 10, color: '#ffffff', align: 'center' });
                this.jumpText.text = "x: " + jump.x + "\ny: " + jump.y;
                this.jumpText.setPosition(jump.x-this.jumpText.width/2, jump.y-40);
            });
        }


        // UI
        const UI = this.add.image(443, 234, 'UI').setScrollFactor(0)
        // Music button
        const musicButton = this.add.sprite(871, 453, 'music_button', 'music_on').setInteractive({ pixelPerfect: true }).setScale(0.7).setScrollFactor(0).setFrame(`music_${data.playMusic ? 'on' : 'off'}`);
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
            musicButton.on('pointerover', function (pointer) { this.setFrame(`music_${data.playMusic ? 'on' : 'off'}_hover`);});
            musicButton.on('pointerout', function (pointer) { this.setFrame(`music_${data.playMusic ? 'on' : 'off'}`) });
    }

    update ()
    {
        function millisToMinutesAndSeconds(millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
          }

        this.timerText.text = millisToMinutesAndSeconds(this.clock.now)

        // combining Button and Touch inputs
        if (this.spaceBar.isDown || (this.input.pointer1.isDown && this.input.pointer1.x < 443) || (this.input.pointer2.isDown && this.input.pointer2.x < 443)) {
            this.jumpCtrl = true
        } else {
            this.jumpCtrl = false
        }
        
        if (this.cursors.right.isDown || (this.input.pointer1.isDown && this.input.pointer1.x >= 443) || (this.input.pointer2.isDown && this.input.pointer2.x >= 443)) {
            this.runCtrl = true
        } else {
            this.runCtrl = false
        }

        // Horse movement
        // Controls
        if (this.jumpCtrl && this.horseMovement !== this.horseMovements.skidding) {
            // Horse jump if spacebar is pressed
            this.horseMovement = this.horseMovements.jumping
        }
        else if (this.runCtrl && this.horseMovement !== this.horseMovements.skidding && this.horseMovement !== this.horseMovements.jumping) {
            // Horse gallop when right arrow key is down and horse is not jumping or sliding
            this.horseMovement = this.horseMovements.galloping
        }
        else if (this.physics.config.debug && this.cursors.left.isDown && this.horseMovement !== this.horseMovements.skidding && this.horseMovement !== this.horseMovements.jumping) {
            // Allow backwards movement in debug mode when left arrow key is down and horse is not jumping or sliding
            this.horseMovement = this.horseMovements.backwards
        }
        else if (!this.runCtrl && this.horseMovement !== this.horseMovements.skidding && this.horseMovement !== this.horseMovements.jumping) {
            // Horse canter if right arrow key is not down and horse is not jumping or sliding
            this.horseMovement = this.horseMovements.cantering
        }
        // Animation
        if (this.horseMovement === this.horseMovements.skidding) {
            this.data.runningSound.stop()
            // Start slide animation
            if (!this.horse.frame.name.includes('slide')) {
                this.horse.play('slideStart')
                this.skidLoop = 0
                this.horse.setVelocityX(this.skidSpeed);
                this.horse.body.setSize(150, 105, false).setOffset(70, 95);
            }
            // Loop sliding animation
            else if ((this.horse.frame.name === 'slide0001' || this.horse.frame.name === 'slide0006') && this.skidLoop < 3) {
                // console.log('Frame: ' + this.horse.frame.name + ' Loop: ' + this.skidLoop)
                this.horse.play('slide')
                this.skidLoop += 1
            }
            // End slide animation
            else if (this.horse.frame.name === 'slide0006' && this.skidLoop >= 3) {
                this.horse.play('slideEnd')
            }
            // Return to running after done sliding
            else if (this.horse.frame.name === 'slide0009') {
                this.horseMovement = this.horseMovements.cantering
            }
        }
        else if (this.horseMovement === this.horseMovements.jumping) {
            this.data.runningSound.stop()
            // Play jump animation
            if (!this.horse.frame.name.includes('jump')) {
                this.horse.play('jump')
            }
            // Adjust horse hitbox position whilst jumping
            switch (this.horse.frame.name) {
                case 'jump0001':
                    this.horse.body.setSize(150, 105, false).setOffset(90, 70);
                    break;
                case 'jump0002':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 35);
                    break;
                case 'jump0003':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 25);
                    break;
                case 'jump0004':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 20);
                    break;
                case 'jump0005':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 20);
                    break;
                case 'jump0006':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 20);
                    break;
                case 'jump0007':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 20);
                    break;
                case 'jump0008':
                    this.horse.body.setSize(150, 105, false).setOffset(115, 25);
                    break;
                case 'jump0009':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 35);
                    break;
                case 'jump0010':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 55);
                    break;
                    
                case 'land0000':
                    this.horse.body.setSize(150, 105, false).setOffset(90, 85);
                    this.horseMovement = this.horseMovements.cantering
                    break;
            
                default:
                    this.horse.body.setSize(150, 105, false).setOffset(70, 95);
                    this.horseMovement = this.horseMovements.cantering
                    break;
            }
            // Adjust speed
            if (this.runCtrl && this.horseMovement !== this.horseMovements.skidding) {
                // Horse gallop speed when right arrow key is down
                this.horse.setVelocityX(this.gallopSpeed);
            }
            else if (this.physics.config.debug && this.cursors.left.isDown && this.horseMovement !== this.horseMovements.skidding) {
                // Backwards movement in debug mode when left arrow key is down
                this.horse.setVelocityX(-this.gallopSpeed);
            }
            else if (!this.runCtrl && this.horseMovement !== this.horseMovements.skidding) {
                // Horse canter speed if right arrow key is not down
                this.horse.setVelocityX(this.canterSpeed);
            }
        }
        else if (this.horseMovement === this.horseMovements.galloping) {
            if (!this.horse.frame.name.includes('gallop')) {
                this.horse.setVelocityX(this.gallopSpeed);
                this.horse.body.setSize(150, 105, false).setOffset(70, 95);
                this.horse.play('gallop')
                this.data.runningSound.play()
            }
        }
        else if (this.horseMovement === this.horseMovements.backwards) {
            if (!this.horse.frame.name.includes('gallop')) {
                this.horse.setVelocityX(-this.gallopSpeed);
                this.horse.body.setSize(150, 105, false).setOffset(70, 95);
                this.horse.play('gallop')
                this.data.runningSound.play()
            }
        }
        else if (this.horseMovement === this.horseMovements.cantering) {
            this.data.runningSound.stop()
            if (!this.horse.frame.name.includes('canter')) {
                this.horse.setVelocityX(this.canterSpeed);
                this.horse.body.setSize(150, 105, false).setOffset(70, 95);
                this.horse.play('canter')
            }
        }

        // Gems
        this.gems.getChildren().forEach(gem => {
            this.physics.overlap(
                this.horse,
                gem,
                function() {
                    if (gem.visible) {
                        gem.setVisible(false)
                        let points = 0
                        switch (gem.frame.name) {
                            case "gemBlue5":
                                points += 5
                                break;
                            case "gemPink10":
                                points += 10
                                break;
                            case "gemYellow15":
                                points += 15
                                break;
                            case "gemBlue20":
                                points += 20
                                break;
                            case "gemPink25":
                                points += 25
                                break;
                            case "gemYellow30":
                                points += 30
                                break;
                            case "gemBlue35":
                                points += 35
                                break;
                            case "gemPink40":
                                points += 40
                                break;
                            case "gemYellow45":
                                points += 45
                                break;
                            case "gemBlue50":
                                points += 50
                                break;
                            case "gemPink55":
                                points += 55
                                break;
                            case "gemYellow60":
                                points += 60
                                break;
                            case "gemBlue65":
                                points += 65
                                break;
                            case "gemPink70":
                                points += 70
                                break;
                            case "gemYellow75":
                                points += 75
                                break;
                        
                            default:
                                console.log("Unknown gem: " + gem.frame.name)
                                break;
                        }
                        this.score += points
                        this.scoreText.text = this.score
                        this.scoreText.setPosition(445-this.scoreText.width/2, 40-this.scoreText.height/2);
                    }
                },
                null,
                this);
        });

        // Horseshoe
        this.physics.overlap(
            this.horse,
            this.horseshoe,
            function() {
                    if (this.horseshoe.visible) {
                        this.horseshoe.setVisible(false)
                        this.horseshoes += 1
                        this.horseshoeText.text = this.horseshoes + " x ";
                        this.horseshoeText.setPosition(320-this.horseshoeText.width/2, 35-this.horseshoeText.height/2);
                    }
            },
            null,
            this);

        // Jumps
        this.physics.overlap(
            this.horse,
            this.jumps,
            function() {
                    this.horseMovement = this.horseMovements.skidding
            },
            null,
            this);

        // End gate
        this.physics.overlap(
            this.horse,
            [this.endGate],
            function() {
                    if (!this.timeEnd) {
                        this.timeEnd = true
                        this.clock.pause()
                        let timeBonus = (this.levelTime * 100) -  Math.ceil(this.clock.now / 10)
                        if (timeBonus < 0) {
                            timeBonus = 0
                        }
                        let finalScore = this.score + timeBonus

                        this.infoScreen.setVisible(true)
                        this.infoButton.setVisible(true).setInteractive()

                        let levelText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 30, color: '#ffffff', align: 'center' }).setScrollFactor(0);
                        let buttonText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 15, color: '#ffffff', align: 'center' }).setScrollFactor(0);

                        if (timeBonus > 0) {
                            levelText.text = langData.succeed_title;
                            buttonText.text = langData.succeed_level_select;
                        }
                        else {
                            levelText.text = langData.fail_title;
                            buttonText.text = langData.fail_level_select;
                        }

                        levelText.setPosition(443-levelText.width/2, 150-levelText.height/2);
                        buttonText.setPosition(443-buttonText.width/2, 304-buttonText.height/2);

                        let endTimeText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 15, color: '#ffffff', align: 'center' }).setScrollFactor(0);
                        endTimeText.text = langData.time_bonus + " = " + timeBonus + " " + langData.points;
                        endTimeText.setPosition(443-endTimeText.width/2, 185-endTimeText.height/2);

                        let endGemText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 15, color: '#ffffff', align: 'center' }).setScrollFactor(0);
                        endGemText.text = langData.gem_bonus + " = " + this.score + " " + langData.points;
                        endGemText.setPosition(443-endGemText.width/2, 215-endGemText.height/2);

                        let endLevelText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 15, color: '#ffffff', align: 'center' }).setScrollFactor(0);
                        endLevelText.text = langData.level_score + " = " + finalScore + " " + langData.points;
                        endLevelText.setPosition(443-endLevelText.width/2, 245-endLevelText.height/2);

                        let endHorseshoeText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 15, color: '#ffffff', align: 'center' }).setScrollFactor(0);
                        this.add.sprite(433, 267, 'horseshoe', 'icon').setScale(.5).setScrollFactor(0)
                        endHorseshoeText.text = " = " + this.horseshoes;
                        endHorseshoeText.setPosition(456-endHorseshoeText.width/2, 270-endHorseshoeText.height/2);
                    }
            },
            null,
            this);

            if (nextScreen) {
                nextScreen = false
                this.data.runningSound.stop()
                this.scene.start('StartScreen', {backgroundMusic: this.data.backgroundMusic, runningSound: this.data.runningSound, playMusic: this.data.playMusic});
                this.scene.stop('LevelOne')
            }
    }
}