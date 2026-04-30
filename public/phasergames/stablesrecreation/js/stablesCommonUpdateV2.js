class StablesManager {
    /** The phaserScene for the current stable type */ #game
    /** An object containing all of the sounds for the scene */ #gameSounds


    constructor(phaserScene) {
        this.#game = phaserScene;
    }


    /* ---------- VARIABLES ---------- */
    #bar = 13

    #font = 'Arial'
    hoverTextSettingsMain = { 
        font: `bold 16px ${this.#font}`, 
        align: 'center',
        color: '#ffffff',
        wordWrap: { width: 150,
        useAdvancedWrap: true } 
    }

    hoverTextSettingsMainSmall = { 
        font: `bold 15px ${this.#font}`, 
        align: 'center',
        color: '#ffffff',
        wordWrap: { width: 125,
        useAdvancedWrap: true } ,
        lineSpacing: -2
    }

    hoverTextSettingsMainLarge = { 
        font: `bold 16px ${this.#font}`, 
        align: 'center',
        color: '#ffffff',
        wordWrap: { width: 170,
        useAdvancedWrap: true } ,
        lineSpacing: -2
    }

    #hoverTextSettingsOneLine = {
        font: `bold 11px ${this.#font}`, 
        align: 'center',
        color: '#ffffff',
    }

    #hoverTextSettingsSmall = {
        font: `bold 12px ${this.#font}`, 
        align: 'center',
        color: '#ffffff',
        wordWrap: {width: 100,
        useAdvancedWrap: true},
        lineSpacing: -2
    }

    #hoverTextSettingsBig = {
        font: `bold 12px ${this.#font}`, 
        align: 'center',
        color: '#ffffff',
        wordWrap: {width: 200,
        useAdvancedWrap: true},
        lineSpacing: -2
    }

    #hoverTextSettingsMedium = {
        font: `bold 12px ${this.#font}`, 
        align: 'center',
        color: '#ffffff',
        wordWrap: {width: 150,
        useAdvancedWrap: true},
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
        const progressText = this.#game.add.text(344, 133, '', { fontFamily: this.#font, fontSize: 12, color: '#ffffff', align: 'center' });
        this.#game.load.on('fileprogress', function (file) {
            if (urlParameters.get('debug')) {
                progressText.text = file.src;
            }
        });
    }

    preloadHorse(horseType) {
        this.#game.load.spineAtlas("horse-atlas", `./images/horses/${horseName}/skeleton.atlas`);
        this.#game.load.spineJson("horse-json", `./images/horses/${horseName}/skeleton.json`);
        if (isDressup) {
            this.#game.load.spineAtlas("horsePicAtlas", `./images/horses/${horseName}/picture/skeleton.atlas`);
            this.#game.load.spineJson("horsePicJson", `./images/horses/${horseName}/picture/skeleton.json`);
        } else {
            this.#game.load.spineAtlas("horse_overlay-atlas", `./images/horses/${horseName}/skeleton_overlay.atlas`);
            this.#game.load.spineJson("horse_overlay-json", `./images/horses/${horseName}/skeleton_overlay.json`);

            this.#game.load.image('horse_image', `./images/horses/${horseName}/card_image.jpg`);
        }

        if (horseName === "skeleton") {
            this.#game.load.spineAtlas("horse_dirty-atlas", `./images/landStable/skeleton_dirty/dirt_skeleton.atlas`);
            this.#game.load.spineJson("horse_dirty-json", `./images/landStable/skeleton_dirty/dirt_skeleton.json`);
        }
        else if (horseName === 'wavebreaker' || horseName === 'tiffi') {
            this.#game.load.spineAtlas("horse_dirty-atlas", `./images/waterStable/hippocampus_dirty/dirt_skeleton.atlas`);
            this.#game.load.spineJson("horse_dirty-json", `./images/waterStable/hippocampus_dirty/dirt_skeleton.json`);
        } 
         else {
            this.#game.load.spineAtlas("horse_dirty-atlas", `./images/${horseType}Stable/horse_dirty/dirt_skeleton.atlas`);
            this.#game.load.spineJson("horse_dirty-json", `./images/${horseType}Stable/horse_dirty/dirt_skeleton.json`);
        }
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
        if (this.#game.data.playMusic !== undefined) {
            this.#game.playMusic = this.#game.data.playMusic
            this.#game.backgroundMusic = this.#game.data.backgroundMusic
        } else {
            this.#game.playMusic = true;
            this.#game.backgroundMusic = this.#game.sound.add('backgroundMusic');
            this.#game.backgroundMusic.loop = true; 
            this.#game.backgroundMusic.play();
        }

        this.#game.add.image(444, 260, 'stable_bg');
        this.#game.switchQuote = null;
        this.#game.familyTreeOpen = true;

        // Variables
        this.#game.HAND = {
            empty: 'empty',
            emptyAlt: 'emptyAlt',
            shovel: 'shovel',
            fork: 'fork',
            forkFilled: 'fork_filled',
            brush: 'brush',
            brushSmall: 'brush_small',
            hoofpick: 'hoofpick',
            apple: 'apple',
            grainScoop: 'grain_scoop',
            bottle: 'bottle'
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
            eatingApple: 'eat_apple',
            drinkbottle: 'drink_bottle'
        }
        this.#game.horseAnimationQueue = []
        this.#game.statBoxBusy = false
        this.#game.statBoxQueue = []
        this.#game.awardsLink = '/flash/awards/awards.html' // TODO: Add real link once awards page is added

        if (isDressup) {
            for (let [key, value] of Object.entries(dressupLocaleData)) {
                localeData[key] = value
            }
        }
    }

    createFoalInspiration(posX, posY, scale, magnifierX = 52, magnifierY = 96) {
        const game = this.#game
        game.familyTreeOpen = false
        for (let index = 0; index < family.ids.length; index++) {
            let type = family.data[index].type
            family.data[index].quote = quoteData[family.data[index].type][family.ids[index] + "Quote"]
        }
        this.#placeFamilyTreeUI(posX, posY, scale, magnifierX, magnifierY)

        this.#game.parentImage = this.#game.add.image(0, 0, family.ids[0])
        this.#addQuotesInteraction(this.#game.parentImage, family.data[0].quote)

        this.#game.childImages = []
        this.#game.childImages.push(this.#game.add.image(0, 0, 'horse_image'))
        this.#addQuotesInteraction(this.#game.childImages[0], null)

        for (let index = 1; index < family.ids.length; index++) {
            this.#game.childImages.push(this.#game.add.image(0, 0, family.ids[index]))
            this.#addQuotesInteraction(this.#game.childImages[index], family.data[index].quote)
        }

        this.placeFoalImages(posX, posY, scale)
        
    }

    #placeFamilyTreeUI(posX, posY, scale, magnifierX, magnifierY) {
        const game = this.#game
        const helper = this
        game.familyTree = game.add.image(444, 261, 'family_tree').setScale(1.5).setAlpha(0);
        const familyXButton = this.addHitbox(536, 105, 50, 50)
            familyXButton.on('pointerover', function (pointer){
                game.inspirationHover.play()
            });
            familyXButton.on('pointerdown', function (pointer) { 
                game.familyTree.setAlpha(0).setDepth(0)
                helper.placeFoalImages(posX, posY, scale)
                game.canPlayInspiration = false
                game.familyTreeOpen = false
                game.handCurrent = game.HAND.empty
            })

        game.magnifier = game.add.image(magnifierX, magnifierY, 'magnifier').setScale(.15).setInteractive();
            game.magnifier.on('pointerdown', function (pointer) { 
                if (game.handCurrent === game.HAND.empty) {
                    game.familyTree.setAlpha(1).setDepth(2)
                    helper.placeFoalImages(460, 200, .45, 2)
                    game.canPlayInspiration = true
                    game.familyTreeOpen = true
                    game.handCurrent = game.HAND.emptyAlt
                }
            })

    }
    placeFoalImages(posX, posY, scale, depth = 0) {
        const game = this.#game

        this.#game.parentImage.setPosition(posX, posY).setScale(scale).setDepth(depth)
        this.#placeSiblingImages(this.#game.childImages[0], 1, scale, depth)
        if (family.ids.length > 1)
            this.#placeSiblingImages(this.#game.childImages[1], 0, scale, depth)
        if (family.ids.length > 2)
            this.#placeSiblingImages(this.#game.childImages[2], 2, scale, depth)

    }
    #placeSiblingImages(image, locationIndex, scale, depth) {
        const game = this.#game
        const separation = 30 * scale
        image.setPosition(
            game.parentImage.x - ((game.parentImage.displayWidth) + separation) + ((game.parentImage.displayWidth + separation) * locationIndex), 
            game.parentImage.y + (game.parentImage.displayHeight) + separation
        ).setScale(scale).setDepth(depth)
    }
    #addQuotesInteraction(image, quote) {
        image.setInteractive();
        const game = this.#game
        // TODO: add hover highlight
        image.on('pointerover', function (pointer){
            if (game.canPlayInspiration) {
                // game.frame.setFrame('hover');
                game.inspirationHover.play()
            }
        });
        // image.on('pointerout', function (pointer) { game.frame.setFrame('idle') });
        image.on('pointerdown', function (pointer) { 
            if (game.canPlayInspiration) {
                game.playInspiration = true 
                game.switchQuote = quote
                game.inspirationSound.play()
            }
        })
    }

    createHorseHitbox(x, y, width, height, hoofpickAction = () => {}, headOffsetX = -75, headOffsetY = 0) {
        const game = this.#game
        const horseInteractive = this.addHitbox(x, y, width, height)
        game.headInteractive = this.addHitbox(x+headOffsetX, y+headOffsetY, 150, 150)
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
                game.handCurrent = game.HAND.empty;
                game.stablesManager.addToQueue(game.horseAnimationQueue, game.HORSE_STATES.eatingApple)
            }
            else if (game.handCurrent === game.HAND.bottle) {
                game.handCurrent = game.HAND.empty;
                game.stablesManager.addToQueue(game.horseAnimationQueue, game.HORSE_STATES.eatingFood)
            }
        })
    }

    createHorse(x, y, angle, scale = 1) {
            angle = isDressup ? 0 : angle;
            const game = this.#game

            game.horse = game.add.spine(x, y, 'horse-json', 'horse-atlas').setAngle(angle).setScale(scale).setDepth(1);
            game.horse.animationState.setAnimation(0, "idle", false)
            game.horseDirty = game.add.spine(x, y, 'horse_dirty-json', 'horse_dirty-atlas').setAngle(angle).setScale(scale).setDepth(1);
            game.horseDirty.animationState.setAnimation(0, "idle", false)
            if (isDressup) {
                game.horseOverlay = game.add.spine(x, y, 'horse-json', 'horse-atlas').setAngle(angle).setScale(scale).setDepth(1);
            } else {
                game.horseOverlay = game.add.spine(x, y, 'horse_overlay-json', 'horse_overlay-atlas').setAngle(angle).setScale(scale).setDepth(1);
            }
            game.horseOverlay.animationState.setAnimation(0, "idle", false)
            
            this.#addConstantAnimation()
            game.horse.animationState.addListener({
                // start: (entry) => console.log(`Started animation ${entry.animation.name}`),
                // interrupt: (entry) => console.log(`Interrupted animation ${entry.animation.name}`),
                // end: (entry) => console.log(`Ended animation ${entry.animation.name}`),
                // dispose: (entry) => console.log(`Disposed animation ${entry.animation.name}`),
                complete: function endAnimation(entry) { 
                    if(entry.animation.name !== 'constant') {
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
                }
                // event: (entry, event) => console.log(`Custom event for ${entry.animation.name}: ${event.data.name}`)          
             })

             if (horseData.type === 'water') {game.horse.animationState.addListener({
                start: function startAnimation(entry){                    
                    if (entry.animation.name === 'shift_weight' || entry.animation.name === 'paw_ground') {
                        game.splash1Sound.play()
                    }
                }          
            })}

            if (isDressup) {
                game.data.resetHorseSprite(game.horse, game.horseOverlay, game.horsePic)
            }
    }

    /**
     * Creates text box to display horse status messages
     * @param {*} x position of stat box
     * @param {*} y position of stat box
     */
    createStatBox(x, y) {
        this.#game.statBox = this.#game.add.image(x, y, 'stat_box').setAlpha(0).setDepth(1)
        this.#game.statBoxText = this.#game.add.text(x, y, 'Static Text Object', this.hoverTextSettingsMain).setAlpha(0).setDepth(1);
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
        const gotoWorldBg = this.#game.add.image(x, y, 'goworld_box').setAlpha(0.01).setOrigin(.5).setInteractive().setScale(scaleX, scaleY).setDepth(1);
        const gotoWorldTxt = this.#game.add.text(x, y, 'Static Text Object', settings).setAlpha(0).setOrigin(.5, .5).setDepth(1);
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
        this.#game.add.image(444, 260, 'stable_fg').setDepth(1);
        this.#createInspirationalMessage()

        // Horse name
        game.horseNameText =game.add.text(444, 478, 'Static Text Object', { fontFamily: this.#font, fontSize: 12, color: '#ffffff', align: 'center' }).setDepth(1);
        game.horseNameText.text = isDressup ? horseData.name : localeData[horseName + "Name"];
        game.horseNameText.setOrigin(.5, .5)

        // Stat bars
        game.hungerBar = this.#createStatBar(1.5, 353, 'hunger_scale', localeData.txtStatHunger, 0xfabad0, 0x983657, 0x5f2041, 0xff6699, "#fa91b9")
        game.cleanlinessBar = this.#createStatBar(1, 446, 'cleanliness_scale', localeData.txtStatClean, 0xb2f3b1, 0x1d7429, 0x123625, 0x2fce30, "#33cc00")
        game.happinessBar = this.#createStatBar(1.75, 542, 'happiness_scale', localeData.txtStatHappy, 0xb4e2fb, 0x004673, 0x002353, 0x0099ff, "#00ccff")

        // Buttons
        this.#createHelpButton(helpTexts)
        this.#createMusicButton()
        if (isDressup) { this.#createDressupButtons() }

        // Cursor
        game.cursor = game.add.sprite(0, 0, 'brush_small', 'hold').setVisible(false).setDepth(4);
    }

    /** Adds the visuals, text and sounds for displaying the inspirational message */
    #createInspirationalMessage() {
        this.#game.playInspiration = !isDressup || (isDressup && /\S/.test(horseData.message))
        this.#game.canPlayInspiration = false

        this.#game.inspiration = this.#game.add.image(430, 150, 'inspiration').setScale(.93).setVisible(false).setDepth(2);
        this.#game.inspirationMessage = this.#game.add.text(444, 133, 'Static Text Object', { 
            fontFamily: this.#font, 
            fontSize: 55, 
            color: '#ffffff', 
            align: 'center' ,
            wordWrap: { width: 800 } 
        }).setVisible(false).setDepth(2);
        this.#game.inspirationMessage.text = isDressup ? horseData.message : localeData[horseName + "Quote"];
        this.#game.inspirationMessage.setOrigin(0.5)
        this.#game.inspirationMessage.setShadow(2, 2, '#000000', 7, true, true)
    }

    #createStatBar(startLevel, x, image, statName, shineColor, shadeColor, color1, color2, color3) {
        const game = this.#game
        const pos = x - 32 + (startLevel*this.#bar/2)
        const width = 1 + startLevel*this.#bar
        game.add.rectangle(x, 505, 66, 2, color1).setDepth(5);

        const newBar = {
            x: x,
            leftShine: game.add.rectangle(pos - width/2 - 1, 510, 3, 10, shineColor).setDepth(1),
            rightShade: game.add.rectangle(pos + width/2 + 1, 510, 3, 10, shadeColor).setDepth(1),
            topShine: game.add.rectangle(pos, 506, width, 3, shineColor).setDepth(1),
            bottomShade: game.add.rectangle(pos, 514, width, 2, shadeColor).setDepth(1),
            progress: game.add.rectangle(pos, 510, width, 7, color2).setDepth(1),
            level: startLevel
        }

        game.add.image(x-2, 509, image).setDepth(1);
        const text = game.add.text(x-2, 498, 'Static Text Object', { 
            fontFamily: this.#font, 
            fontSize: 11.5, 
            align: 'center'
        });
        text.text = statName;
        text.setColor(color3);
        text.setOrigin(0.5).setDepth(1)

        return newBar
    }

    #createHelpButton(helpTexts) {
        const game = this.#game
        game.helpPopups = [];
        game.helpButton =game.add.sprite(444, 261, 'help_button', 'idle').setDepth(3);
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
        let helpHitbox = this.addHitbox(0, 469, 50, 50);
        helpHitbox.on('pointerover', function (pointer) { 
            game.helpButton.setFrame('help') 
            game.helpPopups.forEach(helpTxt => {
                helpTxt.setAlpha(1);
            });
            });
        helpHitbox.on('pointerout', function (pointer) { 
            game.helpButton.setFrame('idle') 
            game.helpPopups.forEach(helpTxt => {
                helpTxt.setAlpha(0);
            });
        });
    }

    #createMusicButton() {
        const game = this.#game
        game.musicButton =game.add.sprite(867, 498, 'music_button', game.playMusic ? 'music_on' : 'music_off').setDepth(1).setInteractive({ pixelPerfect: true });
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

    #createDressupButtons() {
        const game = this.#game
        const playButton = game.add.text(150, 465, localeData.txtDressupBack, {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#ffffff',
            align: 'center',
            fixedWidth: 100,
            backgroundColor: COLOR_PRIMARY_HEX
        }).setPadding(6).setOrigin(0.5).setDepth(5);
            playButton.setInteractive({ useHandCursor: true });
            playButton.on('pointerover', () => {
                playButton.setBackgroundColor(COLOR_SECONDARY_HEX);
            });
            playButton.on('pointerout', () => {
                playButton.setBackgroundColor(COLOR_PRIMARY_HEX);
            });
            playButton.on('pointerdown', () => {
                game.scene.start('dressupStable', {horseData: horseData, backgroundMusic: game.backgroundMusic, playMusic: game.playMusic});
            })
        // Copy Button
        const copyButton = game.add.text(150, 500, localeData.txtDressupCopy, {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#ffffff',
            align: 'center',
            fixedWidth: 100,
            backgroundColor: COLOR_PRIMARY_HEX
        }).setPadding(6).setOrigin(0.5).setDepth(5);
            copyButton.setInteractive({ useHandCursor: true });
            copyButton.on('pointerover', () => {
                copyButton.setBackgroundColor(COLOR_SECONDARY_HEX);
            });
            copyButton.on('pointerout', () => {
                copyButton.setBackgroundColor(COLOR_PRIMARY_HEX);
            });
            copyButton.on('pointerdown', () => {
                game.data.copy()
            })
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
            game.cursor.setPosition(pointer.worldX+shovelXOffset, pointer.worldY+shovelYOffset).setAngle(0).setScale(1);;
            if (!game.cursor.visible) {
                game.cursor.setVisible(true).play('shovel_pickup');
            }
        }
        else if (game.handCurrent === game.HAND.fork) {
            game.cursor.setPosition(pointer.worldX+forkXOffset, pointer.worldY+forkYOffset).setAngle(0).setScale(1);
            if (!game.cursor.visible) {
                game.cursor.setVisible(true).play('fork_pickup');
            }
            else if (game.cursor.anims.getName() === 'fork_fill') {
                game.cursor.play('fork_place')
            }
        }
        else if (game.handCurrent === game.HAND.forkFilled) {
            game.cursor.setPosition(pointer.worldX+forkXOffset, pointer.worldY+forkYOffset).setAngle(0).setScale(1);
            if (game.cursor.anims.getName() === 'fork_pickup' || game.cursor.anims.getName() === 'fork_place') {
                game.cursor.play('fork_fill')
            }
        }
        else if (game.handCurrent === game.HAND.grainScoop) {
            game.cursor.setPosition(pointer.worldX, pointer.worldY).setAngle(0).setScale(1);
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
            game.cursor.setVisible(true).setPosition(pointer.worldX, pointer.worldY).setTexture('apple').setAngle(0).setScale(1);
            game.headInteractive.setInteractive()
        }
        else if (game.handCurrent === game.HAND.bottle) {
            game.cursor.setVisible(true).setPosition(pointer.worldX, pointer.worldY).setTexture('bottle').setAngle(90).setScale(-.75, .75);
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
            game.cursor.setPosition(pointer.worldX+xOffset, pointer.worldY+yOffset).setAngle(0).setScale(1);
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

            if (!isDressup){
                if (localizedQuote && game.switchQuote === null)
                    game.inspirationMessage.text = localeData[horseName + "Quote"];
                else if (game.switchQuote === null)
                    game.inspirationMessage.text = englishData[horseName + "Quote"];
                else
                    game.inspirationMessage.text = game.switchQuote;
            }
            
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
                game.canPlayInspiration = game.familyTreeOpen;
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
            if (horseData.type === 'air' || horseData.type === 'foalAir') {
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
        helpTxt.setOrigin(0.5).setDepth(3)
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
            if (this.#game.horseOverlay.skeleton.data.animations[index].name === "constant") {
                this.#game.horseOverlay.animationState.addAnimation(1, "constant", true)
            }
        }
        for (let index = 0; index < this.#game.horse.skeleton.data.animations.length; index++) {
            if (this.#game.horse.skeleton.data.animations[index].name === "constant") {
                this.#game.horse.animationState.addAnimation(1, "constant", true)
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
     * Adds an animation for the given sprite.
     * @param {*} image The sprite to add the animation to
     * @param {string} animationName The name of the animation
     * @param {array} frames An array of animation frames
     * @param {number} frameRate The framerate to use. Default is 24 fps
     */
    addImageAnims(image, animationName, frames, frameRate = 24) {
        this.#game.anims.create({
            key: animationName,
            frames: game.anims.generateFrameNumbers(image, { frames: frames }),
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

    addHitbox (x, y, width, height) {
        if (urlParameters.get('debug')) {
            this.#game.add.graphics().fillStyle(0x000000).fillRect(x, y, width, height).setAlpha(.5);
        }
        return this.#game.add.graphics().setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);
    }
}