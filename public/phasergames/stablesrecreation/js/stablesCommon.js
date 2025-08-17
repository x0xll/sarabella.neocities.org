class StablesManager {
    /** The phaserScene for the current stable type */ #game
    /** An object containing all of the sounds for the scene */ #gameSounds


    constructor(phaserScene) {
        this.#game = phaserScene;
    }


    /* ---------- VARIABLES ---------- */
    #bar = 13

    hoverTextSettingsMain = { 
        font: 'bold 16px Arial', 
        align: 'center',
        color: '#ffffff',
        wordWrap: { width: 150 } 
    }

    hoverTextSettingsMainSmall = { 
        font: 'bold 15px Arial', 
        align: 'center',
        color: '#ffffff',
        wordWrap: { width: 125 } ,
        lineSpacing: -2
    }

    hoverTextSettingsMainLarge = { 
        font: 'bold 16px Arial', 
        align: 'center',
        color: '#ffffff',
        wordWrap: { width: 170 } ,
        lineSpacing: -2
    }

    #hoverTextSettingsOneLine = {
        font: 'bold 11px Arial', 
        align: 'center',
        color: '#ffffff',
    }

    #hoverTextSettingsSmall = {
        font: 'bold 12px Arial', 
        align: 'center',
        color: '#ffffff',
        wordWrap: {width: 100},
        lineSpacing: -2
    }

    #hoverTextSettingsBig = {
        font: 'bold 12px Arial', 
        align: 'center',
        color: '#ffffff',
        wordWrap: {width: 200},
        lineSpacing: -2
    }

    #hoverTextSettingsMedium = {
        font: 'bold 12px Arial', 
        align: 'center',
        color: '#ffffff',
        wordWrap: {width: 150},
        lineSpacing: -2
    }


    /* ---------- PRELOAD ---------- */
    /**
     * Displays the loading bar for the game. File names are shown if debug mode is on
     */
    preloadDisplayLoadBar() {
        this.#game.add.image(444, 261, 'card_back');  
        this.#game.add.graphics().fillStyle(0x000000).fillRect(386, 334, 116, 12);
        // Show loading bar progress
        const loadingBar = this.#game.add.graphics();
        this.#game.load.on('progress', function (value) {
            loadingBar.clear();
            loadingBar.fillStyle(0x35a3d5, 1).fillRect(389, 337, 100 * value, 6);
        });  
        // Display file names whilst loading
        const progressText = this.#game.add.text(344, 133, '', { fontFamily: 'Arial', fontSize: 12, color: '#ffffff', align: 'center' });
        this.#game.load.on('fileprogress', function (file) {
            if (urlParameters.get('debug')) {
                progressText.text = file.src;
            }
        });
    }

    preloadAudio(additionalSounds) {
        const path = './sounds/'
        this.#gameSounds = {
            'backgroundMusic': `${path}stable_soundtrack.mp3`,
            'appleMunch': `${path}apple_munch.mp3`,
            'brushSound': `${path}brush_sound.mp3`,
            'brushSoundSmall': `${path}brush_sound_small.mp3`,
            'hover1': `${path}hover1.mp3`,
            'hover2': `${path}hover2.mp3`,
            'pickup': `${path}pickup.mp3`,
            'inspirationHover': `${path}inspiration_hover.mp3`,
            'inspirationSound': `${path}inspiration.mp3`,
            'inspirationCloseSound': `${path}inspiration_close.mp3`,
            'oatsEat': `${path}oats_eat.mp3`,
            'rearSound': `${path}rear.mp3`
        }
        // Add additional sounds
        Object.assign(this.#gameSounds, additionalSounds)

        // Load Each Sound
        Object.keys(this.#gameSounds).forEach(key => {
            this.#game.load.audio(key, [this.#gameSounds[key]]);
        });
    }


    /* ---------- CREATE ---------- */
    createScene() {
        //  If you disable topOnly it will fire events for all objects the pointer is over, regardless of place on the display list
        this.#game.input.topOnly = true;

        // Add music, sounds and bg
        Object.keys(this.#gameSounds).forEach(key => {
            this.#game[key] = this.#game.sound.add(key);
        });
        this.#game.playMusic = true;
        this.#game.backgroundMusic.loop = true; 
        this.#game.backgroundMusic.play();

        this.#game.add.image(444, 260, 'stable_bg');

        // Variables
        this.#game.HAND = {
            empty: 'empty',
            shovel: 'shovel',
            fork: 'fork',
            forkFilled: 'fork_filled',
            brush: 'brush',
            brushSmall: 'brush_small',
            hoofpick: 'hoofpick',
            apple: 'apple',
            grainScoop: 'grain_scoop'
        }
        this.#game.handCurrent = this.#game.HAND.empty;
        this.#game.waterFilled = false;
        this.#game.foodFilled = false;
        this.#game.horseFullLevel = [0, 0]
        this.#game.brushLevel = 0
        this.#game.extraCleanLevel = 0
        this.#game.soothed = false
        this.#game.horseBusy = false
        this.#game.HORSE_STATES = {
            busy: 'busy',
            idle: 'idle',
            drink: 'drink',
            rear: 'rear',
            eatingFood: 'eat_food',
            eatingApple: 'eat_apple'
        }
        this.#game.horseAnimationQueue = []
        this.#game.statBoxBusy = false
        this.#game.statBoxQueue = []
        this.#game.awardsLink = '/flash/awards/awards.html' // TODO: Add real link once awards page is added
    }

    createHorseHitbox(x, y, width, height, hoofpickAction = () => {}, headOffsetX = -75, headOffsetY = 0) {
        const game = this.#game
        if (urlParameters.get('debug')) {
            game.add.graphics().fillStyle(0x000000).fillRect(x, y, width, height).setAlpha(.5);
            game.add.graphics().fillStyle(0x000000).fillRect(x+headOffsetX, y+headOffsetY, 150, 150).setAlpha(.5);
        }
        const horseInteractive = game.add.graphics().setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);
        game.headInteractive = game.add.graphics().setInteractive(new Phaser.Geom.Rectangle(x+headOffsetX, y+headOffsetY, 150, 150), Phaser.Geom.Rectangle.Contains);
        // interact with horse
        horseInteractive.on('pointerdown', function (pointer) {
            if (game.handCurrent === game.HAND.brush) {
                game.cursor.play('brush_use')
                game.brushSound.play();
                game.stablesManager.horseBrushed();
            }
            else if (game.handCurrent === game.HAND.brushSmall) {
                game.cursor.play('brush_use_small')
                game.brushSoundSmall.play();
                game.stablesManager.horseBrushed()
            }
            else if (game.handCurrent === game.HAND.hoofpick) {
                hoofpickAction()
            }
        });
        game.headInteractive.on('pointerdown', function (pointer) {
            if (game.handCurrent === game.HAND.apple) {
                // TODO: make smaller head hitbox for this bit
                game.handCurrent = game.HAND.empty;
                game.stablesManager.addToQueue(game.horseAnimationQueue, game.HORSE_STATES.eatingApple)
            }
        })
    }

    createHorse(x, y, angle, scale = 1) {
            const game = this.#game
            game.horse = game.add.spine(x, y, 'horse-json', 'horse-atlas').setAngle(angle).setScale(scale);
            game.horse.animationState.setAnimation(0, "idle", false)
            game.horseDirty = game.add.spine(x, y, 'horse_dirty-json', 'horse_dirty-atlas').setAngle(angle).setScale(scale);
            game.horseDirty.animationState.setAnimation(0, "idle", false)
            game.horseOverlay = game.add.spine(x, y, 'horse_overlay-json', 'horse_overlay-atlas').setAngle(angle).setScale(scale);
            game.horseOverlay.animationState.setAnimation(0, "idle", false)
            
            this.#addConstantAnimation()
            game.horse.animationState.addListener({
                // start: (entry) => console.log(`Started animation ${entry.animation.name}`),
                // interrupt: (entry) => console.log(`Interrupted animation ${entry.animation.name}`),
                // end: (entry) => console.log(`Ended animation ${entry.animation.name}`),
                // dispose: (entry) => console.log(`Disposed animation ${entry.animation.name}`),
                complete: function endAnimation(entry) { 
                    if (horseData.type === 'water') {
                        switch (entry.animation.name) {
                            case 'eat_food':
                                game.horseFullLevel[0] += 1
                                if (game.horseFullLevel[0] === 1) {
                                    game.stablesManager.updateBar(game.hungerBar, 3.5)
                                    game.stablesManager.updateBar(game.happinessBar, 1.05)
                                    game.stablesManager.addToQueue(game.statBoxQueue, localeData.txtFullHorse)
                                }
                                break;
                        
                            default:
                                break;
                        }
                    } else {
                        switch (entry.animation.name) {
                            case 'eat_food':
                                game.horseFullLevel[0] += 1
                                if (game.horseFullLevel[0] === 1) {
                                    game.stablesManager.updateBar(game.hungerBar, 2)
                                    game.stablesManager.updateBar(game.happinessBar, 1.05)
                                    if (game.horseFullLevel[1] >= 1) {
                                        game.stablesManager.addToQueue(game.statBoxQueue, localeData.txtFullHorse)
                                    }
                                }
                                break;
                            case 'drink':
                                game.horseFullLevel[1] += 1
                                if (game.horseFullLevel[1] === 1) {
                                    game.stablesManager.updateBar(game.hungerBar, 1.5)
                                    if (game.horseFullLevel[0] >= 1) {
                                        game.stablesManager.addToQueue(game.statBoxQueue, localeData.txtFullHorse)
                                    }
                                }
                                break;
                        
                            default:
                                break;
                        }
                    }
                    if (game.horseAnimationQueue.length === 0) {
                        let horseIdleAnimations = []
                        if (horseData.type === 'water') {
                            horseIdleAnimations = ['ear_twitch', 'flank_twitch', 'head_shake', 'head_turn', 'paw_ground', 'shift_weight', 'tail_swish']
                        } else {
                            horseIdleAnimations = ['ear_twitch', 'flank_twitch', 'head_shake', 'head_turn', 'nod', 'paw_ground', 'shift_weight', 'tail_swish']
                        }
                        let animation = horseIdleAnimations[Math.floor(Math.random()*horseIdleAnimations.length)]
                        
                        const delay = game.stablesManager.randomIntFromInterval(3, 5)
                        game.horse.animationState.addAnimation(0, animation, false, delay);
                        game.horseDirty.animationState.addAnimation(0, animation, false, delay);
                        game.horseOverlay.animationState.addAnimation(0, animation, false, delay);
                    }
                    // allow next animation to play
                    game.horseBusy = false
                }
                // event: (entry, event) => console.log(`Custom event for ${entry.animation.name}: ${event.data.name}`)          
             })

             if (horseData.type === 'water') {game.horse.animationState.addListener({
                start: function startAnimation(entry){                    
                    if (entry.animation.name === 'shift_weight' || entry.animation.name === 'paw_ground') {
                        game.splash1Sound.play()
                    }
                }          
            }
        )}
    }

    /**
     * Creates text box to display horse status messages
     * @param {*} x position of stat box
     * @param {*} y position of stat box
     */
    createStatBox(x, y) {
        this.#game.statBox = this.#game.add.image(x, y, 'stat_box').setAlpha(0)
        this.#game.statBoxText = this.#game.add.text(x, y, 'Static Text Object', this.hoverTextSettingsMain).setAlpha(0);
        this.#game.statBoxText.setOrigin(.5, .5)
    }

    /**
     * Creates text box for "Go to Bella Sara World" link
     * @param {*} x position of stat box
     * @param {*} y position of stat box
     * @param {*} scaleX scale of stat box
     * @param {*} scaleY scale of stat box
     */
    createBeSaWorldLink(x, y, scaleX, scaleY, settings) {
        switch (settings) {
            case "Small":
                settings = this.#hoverTextSettingsSmall
                break;
        
            default:
                settings = this.hoverTextSettingsMain
                break;
        }
        const gotoWorldBg = this.#game.add.image(x, y, 'goworld_box').setAlpha(0.01).setOrigin(.5).setInteractive().setScale(scaleX, scaleY);
        const gotoWorldTxt = this.#game.add.text(x, y, 'Static Text Object', settings).setAlpha(0).setOrigin(.5, .5);
        gotoWorldTxt.text = localeData.txtToWorld;
        gotoWorldBg.on('pointerover', function (pointer) {
                gotoWorldBg.setAlpha(1);
                gotoWorldTxt.setAlpha(1);
            });
        gotoWorldBg.on('pointerout', function (pointer)  { 
                gotoWorldBg.setAlpha(0.01);
                gotoWorldTxt.setAlpha(0);
            });
        gotoWorldBg.on('pointerdown', function (pointer) {
                window.location.href = '/flash/worldmap/worldmap_new.html'
            });
    }

    /** Creates the UI elements  */
    createUI(helpTexts) {
        const game = this.#game
        this.#game.add.image(444, 260, 'stable_fg');
        this.#createInspirationalMessage()

        // Horse name
        game.horseNameText =game.add.text(444, 478, 'Static Text Object', { fontFamily: 'Arial', fontSize: 12, color: '#ffffff', align: 'center' });
        game.horseNameText.text = localeData[horseName + "Name"];
        game.horseNameText.setOrigin(.5, .5)

        // Stat bars
        game.hungerBar = this.#createStatBar(1.5, 353, 'hunger_scale', localeData.txtStatHunger, 0xfabad0, 0x983657, 0x5f2041, 0xff6699, "#fa91b9")
        game.cleanlinessBar = this.#createStatBar(1, 446, 'cleanliness_scale', localeData.txtStatClean, 0xb2f3b1, 0x1d7429, 0x123625, 0x2fce30, "#33cc00")
        game.happinessBar = this.#createStatBar(1.75, 542, 'happiness_scale', localeData.txtStatHappy, 0xb4e2fb, 0x004673, 0x002353, 0x0099ff, "#00ccff")

        // Buttons
        this.#createHelpButton(helpTexts)
        this.#createMusicButton()

        // Cursor
        game.cursor = game.add.sprite(0, 0, 'brush_small', 'hold').setVisible(false);
    }

    /** Adds the visuals, text and sounds for displaying the inspirational message */
    #createInspirationalMessage() {
        this.#game.playInspiration = true
        this.#game.canPlayInspiration = false

        this.#game.inspiration = this.#game.add.image(430, 150, 'inspiration').setScale(.93).setVisible(false);
        this.#game.inspirationMessage = this.#game.add.text(444, 133, 'Static Text Object', { 
            fontFamily: 'Arial', 
            fontSize: 55, 
            color: '#ffffff', 
            align: 'center' ,
            wordWrap: { width: 800 } 
        }).setVisible(false);
        this.#game.inspirationMessage.text = localeData[horseName + "Quote"];
        this.#game.inspirationMessage.setOrigin(0.5)
        this.#game.inspirationMessage.setShadow(2, 2, '#000000', 7, true, true)
    }

    #createStatBar(startLevel, x, image, statName, shineColor, shadeColor, color1, color2, color3) {
        const game = this.#game
        const pos = x - 32 + (startLevel*this.#bar/2)
        const width = 1 + startLevel*this.#bar
        game.add.rectangle(x, 505, 66, 2, color1);

        const newBar = {
            x: x,
            leftShine: game.add.rectangle(pos - width/2 - 1, 510, 3, 10, shineColor),
            rightShade: game.add.rectangle(pos + width/2 + 1, 510, 3, 10, shadeColor),
            topShine: game.add.rectangle(pos, 506, width, 3, shineColor),
            bottomShade: game.add.rectangle(pos, 514, width, 2, shadeColor),
            progress: game.add.rectangle(pos, 510, width, 7, color2),
            level: startLevel
        }

        game.add.image(x-2, 509, image);
        const text = game.add.text(x-2, 498, 'Static Text Object', { 
            fontFamily: 'Arial', 
            fontSize: 11.5, 
            align: 'center'
        });
        text.text = statName;
        text.setColor(color3);
        text.setOrigin(0.5)

        return newBar
    }

    #createHelpButton(helpTexts) {
        const game = this.#game
        game.helpPopups = [];
        game.helpButton =game.add.sprite(444, 261, 'help_button', 'idle').setInteractive(this.#game.input.makePixelPerfect(150));
        helpTexts.forEach(helptext => {
            switch (helptext[3]) {
                case "OneLine":
                    helptext[3] = this.#hoverTextSettingsOneLine
                    break;
                case "Big":
                    helptext[3] = this.#hoverTextSettingsBig
                    break;
                case "Small":
                    helptext[3] = this.#hoverTextSettingsSmall
                    break;
                case "Med":
                    helptext[3] = this.#hoverTextSettingsMedium
                    break;
            }
            this.#showLocalizedHelpTexts(helptext[0], helptext[1], helptext[2], helptext[3]);
        });
       game.helpButton.on('pointerover', function (pointer) { 
            this.setFrame('help') 
            game.helpPopups.forEach(helpTxt => {
                helpTxt.setAlpha(1);
            });
        });
       game.helpButton.on('pointerout', function (pointer) { 
            this.setFrame('idle') 
            game.helpPopups.forEach(helpTxt => {
                helpTxt.setAlpha(0);
            });
        });
    }

    #createMusicButton() {
        const game = this.#game
        game.musicButton =game.add.sprite(867, 498, 'music_button', 'music_on').setInteractive({ pixelPerfect: true });
        game.musicButton.on('pointerdown', function (pointer)
        {
            if (game.playMusic) {
                game.backgroundMusic.stop()
                game.musicButton.setFrame('music_off_hover')
            }
            else {
                game.backgroundMusic.play()
                game.musicButton.setFrame('music_on_hover')
            }
            game.playMusic = !game.playMusic
        });
        game.musicButton.on('pointerover', function (pointer) { game.musicButton.setFrame(`music_${game.playMusic ? 'on' : 'off'}_hover`) });
        game.musicButton.on('pointerout', function (pointer) { game.musicButton.setFrame(`music_${game.playMusic ? 'on' : 'off'}`) });
    }

    // /* ---------- UPDATE ---------- */
    updateCursor({
        shovelXOffset = -18, shovelYOffset = 35,
        forkXOffset = -20, forkYOffset = 45,
        brushXOffset = -5, brushYOffset = 20, 
        brushSmallXOffset = -8, brushSmallYOffset = 8,
        hoofpickXOffset = 0, hoofpickYOffset = 0
    }) {
        const game = this.#game
        const pointer = game.input.activePointer;

        // Display held items under cursor
        if (game.handCurrent === game.HAND.shovel) {
            game.cursor.setPosition(pointer.worldX+shovelXOffset, pointer.worldY+shovelYOffset);
            if (!game.cursor.visible) {
                game.cursor.setVisible(true).play('shovel_pickup');
            }
        }
        else if (game.handCurrent === game.HAND.fork) {
            game.cursor.setPosition(pointer.worldX+forkXOffset, pointer.worldY+forkYOffset)
            if (!game.cursor.visible) {
                game.cursor.setVisible(true).play('fork_pickup');
            }
            else if (game.cursor.anims.getName() === 'fork_fill') {
                game.cursor.play('fork_place')
            }
        }
        else if (game.handCurrent === game.HAND.forkFilled) {
            game.cursor.setPosition(pointer.worldX+forkXOffset, pointer.worldY+forkYOffset)
            if (game.cursor.anims.getName() === 'fork_pickup' || game.cursor.anims.getName() === 'fork_place') {
                game.cursor.play('fork_fill')
            }
        }
        else if (game.handCurrent === game.HAND.grainScoop) {
            game.cursor.setPosition(pointer.worldX, pointer.worldY)
            if (!game.cursor.visible) {
                game.cursor.setAlpha(0).setVisible(true).setTexture('grain_scoop')
                game.time.delayedCall(630, function () {game.cursor.setAlpha(.5)});
                game.time.delayedCall(670, function () {game.cursor.setAlpha(.7)});
                game.time.delayedCall(710, function () {game.cursor.setAlpha(.9)});
                game.time.delayedCall(750, function () {game.cursor.setAlpha(1)});
            }
        }
        else if (game.handCurrent === game.HAND.brush) {
            this.#updateGameCursor(game.HAND.brush, 'hold', brushXOffset, brushYOffset)
        }
        else if (game.handCurrent === game.HAND.brushSmall) {
            this.#updateGameCursor(game.HAND.brushSmall, 'hold', brushSmallXOffset, brushSmallYOffset)
        }
        else if (game.handCurrent === game.HAND.hoofpick) {
            this.#updateGameCursor(game.HAND.hoofpick, 'hold', hoofpickXOffset, hoofpickYOffset)
        }
        else if (game.handCurrent === game.HAND.apple) {
            game.cursor.setVisible(true).setPosition(pointer.worldX, pointer.worldY).setTexture('apple');
            game.headInteractive.setInteractive()
        }
        else {
            game.cursor.setVisible(false);
            game.headInteractive.disableInteractive()
        }
    }
    /**
     * Updates and moves the cursor
     * @param {*} sprite The cursor sprite
     * @param {*} frame The frame of the cursor sprite
     * @param {*} xOffset X offset from pointer position
     * @param {*} yOffset Y offset from pointer position
     */
    #updateGameCursor(sprite, frame, xOffset, yOffset) {
            const game = this.#game
            const pointer = game.input.activePointer;
            game.cursor.setPosition(pointer.worldX+xOffset, pointer.worldY+yOffset);
            if (!game.cursor.visible) {
                game.cursor.setTexture(sprite).setFrame(frame)
                game.cursor.setAlpha(0).setVisible(true)
                game.time.delayedCall(250, function () {game.cursor.setAlpha(1)});
            }
    }

    updateInspirationalMessage() {
        const game = this.#game
        if (game.playInspiration) {
            game.playInspiration = false
            game.canPlayInspiration = false

            if (localizedQuote)
                game.inspirationMessage.text = localeData[horseName + "Quote"];
            else
                game.inspirationMessage.text = englishData[horseName + "Quote"];

            game.inspiration.setVisible(true).setAlpha(0)
            game.inspirationMessage.setVisible(true).setAlpha(0)
            game.time.delayedCall(40, function () {game.inspiration.setAlpha(.1); game.inspirationMessage.setAlpha(0.1)});
            game.time.delayedCall(80, function () {game.inspiration.setAlpha(.2); game.inspirationMessage.setAlpha(0.2)});
            game.time.delayedCall(120, function () {game.inspiration.setAlpha(.3); game.inspirationMessage.setAlpha(0.3)});
            game.time.delayedCall(160, function () {game.inspiration.setAlpha(.4); game.inspirationMessage.setAlpha(0.4)});
            game.time.delayedCall(200, function () {game.inspiration.setAlpha(.5); game.inspirationMessage.setAlpha(0.5)});
            game.time.delayedCall(240, function () {game.inspiration.setAlpha(.6); game.inspirationMessage.setAlpha(0.6)});
            game.time.delayedCall(280, function () {game.inspiration.setAlpha(.7); game.inspirationMessage.setAlpha(0.7)});
            game.time.delayedCall(320, function () {game.inspiration.setAlpha(.8); game.inspirationMessage.setAlpha(0.8)});
            game.time.delayedCall(360, function () {game.inspiration.setAlpha(.9); game.inspirationMessage.setAlpha(0.9)});
            game.time.delayedCall(400, function () {game.inspiration.setAlpha(1); game.inspirationMessage.setAlpha(1)});
            game.time.delayedCall(2960, function () {game.inspiration.setAlpha(.9); game.inspirationMessage.setAlpha(0.9); game.inspirationCloseSound.play()});
            game.time.delayedCall(3000, function () {game.inspiration.setAlpha(.8); game.inspirationMessage.setAlpha(0.8)});
            game.time.delayedCall(3040, function () {game.inspiration.setAlpha(.7); game.inspirationMessage.setAlpha(0.7)});
            game.time.delayedCall(3080, function () {game.inspiration.setAlpha(.6); game.inspirationMessage.setAlpha(0.6)});
            game.time.delayedCall(3120, function () {game.inspiration.setAlpha(.5); game.inspirationMessage.setAlpha(0.5)});
            game.time.delayedCall(3160, function () {game.inspiration.setAlpha(.4); game.inspirationMessage.setAlpha(0.4)});
            game.time.delayedCall(3200, function () {game.inspiration.setAlpha(.3); game.inspirationMessage.setAlpha(0.3)});
            game.time.delayedCall(3240, function () {game.inspiration.setAlpha(.2); game.inspirationMessage.setAlpha(0.2)});
            game.time.delayedCall(3280, function () {game.inspiration.setAlpha(.1); game.inspirationMessage.setAlpha(0.1)});
            game.time.delayedCall(3320, function () {
                game.inspiration.setAlpha(0); 
                game.inspirationMessage.setAlpha(0); 
                game.canPlayInspiration = true;
            });
        }
    }

    updateStatbox() {
        const game=this.#game
        if (game.statBoxQueue.length > 0 && !game.statBoxBusy) {
            game.statBoxBusy = true
            game.statBox.setAlpha(1)
            game.statBoxText.setAlpha(1)
            game.statBoxText.text = game.statBoxQueue.shift()
            game.time.delayedCall(2000, function () {
                game.statBoxBusy = false
                if (game.statBoxQueue.length === 0) {
                    game.time.delayedCall(1280, function () {
                        game.statBox.setAlpha(0)
                        game.statBoxText.setAlpha(0)
                    })
                }
            });
        }
    }


    // /* ---------- HELPER FUNCTIONS ---------- */
    /**
     * Updates the horse stats, increments the count of how many times the horse has been brushed
     * and makes the horse rear when clean
     */
    horseBrushed() {
        if (this.#game.brushLevel < 2) {
            this.#game.brushLevel += 1;
            this.updateBar(this.#game.cleanlinessBar, 1/3)
            this.updateBar(this.#game.happinessBar, 1/6)
            this.#game.horseDirty.skeleton.color.a = 0.25 * (4 - this.#game.brushLevel)
        }
        else if (this.#game.brushLevel === 2) {
            this.#game.brushLevel += 1;
            if (horseData.type === 'air') {
                this.addToQueue(this.#game.statBoxQueue, localeData.txtReadyToBeOiled)
            } else {
                this.addToQueue(this.#game.statBoxQueue, localeData.txtBrushClean)
            }
            this.checkClean()
            this.updateBar(this.#game.cleanlinessBar, 1/3)
            this.updateBar(this.#game.happinessBar, 1/6)
            this.#game.horseDirty.setAlpha(0)
        }
    }
    checkClean() {
        if (this.#game.brushLevel === 3 && this.#game.additionalCleanCondition()) {
            this.addToQueue(this.#game.horseAnimationQueue, this.#game.HORSE_STATES.rear)
        }
    }
    
    /**
     * 
     * @param {*} xPos 
     * @param {*} yPos 
     * @param {*} localeTxtKey 
     * @param {*} settings 
     */
    #showLocalizedHelpTexts(xPos, yPos, localeTxtKey, settings) {
        const helpTxt = this.#game.add.text(xPos, yPos, 'Static Text Object', settings).setAlpha(0);
        helpTxt.text = localeTxtKey;
        helpTxt.setOrigin(0.5)
        this.#game.helpPopups.push(helpTxt);
    }

    /**
     * Adds additional progress to the provided stat bar.
     * @param {*} progressBar The bar to update
     * @param {number} progressAdd The amount of progress to add (1 = 1 mini bar = 1/5 of full bar)
     */
    updateBar(progressBar, progressAdd) {
        progressBar.level += progressAdd

        progressBar.progress.setDisplaySize(progressBar.level*this.#bar, progressBar.progress.height)
        progressBar.progress.setPosition(progressBar.x - 33 + (progressBar.level*this.#bar/2), progressBar.progress.y)
        
        progressBar.topShine.setDisplaySize(progressBar.level*this.#bar, progressBar.topShine.height)
        progressBar.topShine.setPosition(progressBar.x - 33 + (progressBar.level*this.#bar/2), progressBar.topShine.y)
        
        progressBar.bottomShade.setDisplaySize(progressBar.level*this.#bar, progressBar.bottomShade.height)
        progressBar.bottomShade.setPosition(progressBar.x - 33 + (progressBar.level*this.#bar/2), progressBar.bottomShade.y)
        
        progressBar.rightShade.setPosition(progressBar.x - 32 + progressBar.level*this.#bar, progressBar.rightShade.y)
    }

    /**
     * Generates a random integer between two values
     * @param {number} min The minimum number that could be returned
     * @param {number} max The maximum number that could be returned
     * @returns 
     */
    randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    /**
     * Starts the horse's constant animation (e.g. constant sparkles or aura) if it exists
     */
    #addConstantAnimation() {
        for (let index = 0; index < this.#game.horseOverlay.skeleton.data.animations.length; index++) {
            if (this.#game.horse.skeleton.data.animations[index].name === "constant") {
                this.#game.horse.animationState.addAnimation(1, "constant", true)
            }
            if (this.#game.horseOverlay.skeleton.data.animations[index].name === "constant") {
                this.#game.horseOverlay.animationState.addAnimation(1, "constant", true)
            }
        }
    }

    horsePlayAnimation(animation) {
        this.#game.horse.animationState.setAnimation(0, animation, false);
        this.#game.horseDirty.animationState.setAnimation(0, animation, false);
        this.#game.horseOverlay.animationState.setAnimation(0, animation, false);
    }
    

    /**
     * 
     * @param {*} queueArray The array of queued items
     * @param {*} newItem The new item to add to the queue
     */
    addToQueue(queueArray, newItem) {
        if (queueArray.indexOf(newItem) === -1) {
            queueArray.push(newItem)
        }
    }

    /**
     * Adds an animation for the given sprite.
     * @param {*} sprite The sprite to add the animation to
     * @param {string} animationName The name of the animation
     * @param {array} frames An array of animation frames
     * @param {number} frameRate The framerate to use. Default is 24 fps
     */
    addSpriteAnims(sprite, animationName, frames, frameRate = 24) {
        this.#game.anims.create({
            key: animationName,
            frames: game.anims.generateFrameNumbers(sprite.texture.key, { frames: frames }),
            frameRate: frameRate
        });
    }

    /**
     * Displays the 'hover' frame of a sprite and plays the hover sound if the hand is empty
     * @param {sprite} sprite The sprite to change
     * @param {audio} hoverSound The sound to play on hover
     * @param {*} spriteText The text to show on hover
     */
    pointerover(sprite, hoverSound, spriteText = null) {
        if (this.#game.handCurrent === this.#game.HAND.empty) {
            sprite.setFrame('hover')
            hoverSound.play();
            if (spriteText !== null) {
                spriteText.setAlpha(1)
            }
        }
    }
    /**
     * Displays the 'idle' frame of a sprite if the hand is empty
     * @param {sprite} sprite The sprite to change
     * @param {*} spriteText The hover text to hide
     */
    pointerout(sprite, spriteText = null) {
        if (this.#game.handCurrent === this.#game.HAND.empty) {
            sprite.setFrame('idle')
            if (spriteText !== null) {
                spriteText.setAlpha(0)
            }
        }
    }
    /**
     * 
     * @param {*} sprite The sprite being interacted with
     * @param {*} hand The HAND option that corresponds with holding the current sprite object
     * @param {*} pickup The name of the pickup animation to be played when picking up the sprite object
     * @param {*} place The name of the place animation to be played when placing down the sprite object
     * @param {*} condition Additional conditions to pick up the sprite object
     */
    pointerdown(sprite, hand, pickup, place, condition = true) {
        if (this.#game.handCurrent === this.#game.HAND.empty && condition) {
            this.#game.handCurrent = hand;
            sprite.play(pickup)
            this.#game.pickup.play();
        }
        else if (this.#game.handCurrent === hand) {
            this.#game.handCurrent = this.#game.HAND.empty;
            sprite.play(place)
        }
    }
}