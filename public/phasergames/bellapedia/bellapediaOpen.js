class BellapediaOpen extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'BellapediaOpen' });
    }

    preload ()
    {
        this.load.atlas('arrow', './images/arrow.png', './images/arrow.json');

        this.load.image('pageSelectBG', './images/page_select_bg.png');
        this.load.image('pageSelectFrame', './images/page_select_frame.png');
        this.load.image('pageSelected', './images/page_selected.png');

        this.load.image('entryOpen', './images/page_open.png');
        this.load.image('entryScrollBar', './images/scroll_bar.png');
        this.load.image('entryScroll', './images/scroll.png');

        this.pageSelectBG = this.add.image(444, 234, 'pageSelectBG')
        
        // Load all images and put all entries in a single array
        this.allEntries = []
        langData.books.forEach(book => {
            book.pages.forEach(entry => {
                this.load.image(entry.name, entry.image);
                this.allEntries.push(entry)
            });
        });

        
        this.load.image('pageRef', './images/page_open_ref.png');
    }

    create (data)
    {
        const game = this
        this.data = data
        this.currentPage = 0

        // ---------- Book Select Functions ---------- //
        /**
         * Places the selector indicator over the book list on the side to indicate which book is open
         * or for switching to a different book
         * @param {*} book The book being selected or hovered over
         * @param {*} selector The selector being updated
         */
        function placeBookSelector(book, selector) {
            switch (langData.books[book]) {
                case langData.books[0]:
                    selector.setPosition(73, 106)
                    break;
    
                case langData.books[1]:
                    selector.setPosition(73, 156)
                    break;
    
                case langData.books[2]:
                    selector.setPosition(73, 211)
                    break;
    
                case langData.books[3]:
                    selector.setPosition(73, 264)
                    break;
    
                case langData.books[4]:
                    selector.setPosition(73, 314)
                    break;
    
                case langData.books[5]:
                    selector.setPosition(73, 366)
                    break;
    
                case langData.books[6]:
                    selector.setPosition(73, 418)
                    break;
            
                default:
                    break;
            }
        }

        /**
         * Opens the selected book to the given page. Can be used to switch books or turn the page.
         * @param {*} book The book to open
         * @param {*} page The page to open to
         */
        function selectBook(book, page = 0) {
            game.book = book
            game.currentBook = book
            book = langData.books[book]

            // Indicate the current book as open
            placeBookSelector(game.book, game.bookSelected)

            // Show the entries for the current page
            game.pageSelectFrame.setVisible(true)
            for (let index = 0; index < 10; index++) {
                if (index+ page*10 in book.pages) {
                    entries[index].setInteractive(entries[index].rectangle, Phaser.Geom.Rectangle.Contains);
                    bookImages[index].setTexture(book.pages[index+ page*10].name)
                    bookImages[index].setDisplaySize(52, 52)
                    if (bookImages[index].height < bookImages[index].width) {
                        bookImages[index].setScale(bookImages[index].scaleY, bookImages[index].scaleY)
                    } else {
                        bookImages[index].setScale(bookImages[index].scaleX, bookImages[index].scaleX)
                    }
                    bookImages[index].setVisible(true)
                    entryTitles[index].text = book.pages[index+ page*10].name
                    entryTitles[index].setVisible(true)
                }
                else {
                    bookImages[index].setVisible(false)
                    entryTitles[index].setVisible(false)
                    entries[index].removeInteractive()
                }
            }
            
            // Update the page arrows
            if (book.pages.length > 10 + page*10) {
                bookArrowRight.setVisible(true)
            } else {
                bookArrowRight.setVisible(false)
            }
            if (page > 0) {
                bookArrowLeft.setVisible(true)
            } else {
                bookArrowLeft.setVisible(false)
            }
            entryArrowLeft.setVisible(false)
            entryArrowRight.setVisible(false)

            // Ensure the entry page is closed
            game.entryOpen.setVisible(false)
            game.entryScrollBar.setVisible(false)
            game.entryScroll.setVisible(false)
            game.entryOpenTitle.text = null
            game.entryOpenInfo.text = null
            game.entryImage.setVisible(false)
            scrollZone.removeInteractive()
            scrollUp.removeInteractive()
            scrollDown.removeInteractive()
        }

        function hoverBook(book) {
            game.bookSelect.setVisible(true)
            placeBookSelector(book, game.bookSelect)
        }

        function unHoverBook() {
            game.bookSelect.setVisible(false)
        }

        
        // ---------- Book Open, Entry Select Page ---------- //
        // Entry images
        let bookImages = [
            this.add.image(165, 110, null).setVisible(false),
            this.add.image(165, 175, null).setVisible(false),
            this.add.image(165, 240, null).setVisible(false),
            this.add.image(165, 304, null).setVisible(false),
            this.add.image(165, 369, null).setVisible(false),
            this.add.image(527, 110, null).setVisible(false),
            this.add.image(527, 175, null).setVisible(false),
            this.add.image(527, 240, null).setVisible(false),
            this.add.image(527, 304, null).setVisible(false),
            this.add.image(527, 369, null).setVisible(false)
        ]

        // Main book UI
        this.pageSelectFrame = this.add.image(444, 234, 'pageSelectFrame')
        this.bookSelected = this.add.image(0, 0, 'pageSelected')
        this.bookSelect = this.add.image(0, 0, 'pageSelected').setVisible(false)
        this.bookSelectors = [game.add.graphics(), game.add.graphics(), game.add.graphics(), 
                game.add.graphics(), game.add.graphics(), game.add.graphics(), game.add.graphics()]
            for (let index = 0; index < this.bookSelectors.length; index++) {
                const selector = this.bookSelectors[index];
                selector.on('pointerover', function (pointer) { 
                    hoverBook(index)
                });
                selector.on('pointerout', function (pointer) { 
                    unHoverBook(index)
                });
                selector.on('pointerdown', function (pointer) { 
                    game.currentPage = 0
                    selectBook(index, game.currentPage)
                });
            }
            this.bookSelectors[0].setInteractive(new Phaser.Geom.Rectangle(53, 80, 50, 30), Phaser.Geom.Rectangle.Contains);
            this.bookSelectors[1].setInteractive(new Phaser.Geom.Rectangle(53, 130, 50, 30), Phaser.Geom.Rectangle.Contains);
            this.bookSelectors[2].setInteractive(new Phaser.Geom.Rectangle(53, 184, 50, 30), Phaser.Geom.Rectangle.Contains);
            this.bookSelectors[3].setInteractive(new Phaser.Geom.Rectangle(53, 236, 50, 30), Phaser.Geom.Rectangle.Contains);
            this.bookSelectors[4].setInteractive(new Phaser.Geom.Rectangle(53, 286, 50, 30), Phaser.Geom.Rectangle.Contains);
            this.bookSelectors[5].setInteractive(new Phaser.Geom.Rectangle(53, 338, 50, 30), Phaser.Geom.Rectangle.Contains);
            this.bookSelectors[6].setInteractive(new Phaser.Geom.Rectangle(53, 392, 50, 30), Phaser.Geom.Rectangle.Contains);
        let bookArrowRight = this.add.sprite(775, 440, 'arrow', 'idle').setInteractive({ pixelPerfect: true, useHandCursor: true }).setVisible(false)
            bookArrowRight.on('pointerover', function (pointer) { bookArrowRight.setFrame('hover') });
            bookArrowRight.on('pointerout', function (pointer) { bookArrowRight.setFrame('idle') });
            bookArrowRight.on('pointerdown', function (pointer) { 
                game.currentPage += 1
                selectBook(game.currentBook, game.currentPage)
            });
        let bookArrowLeft = this.add.sprite(113, 440, 'arrow', 'idle').setInteractive({ pixelPerfect: true, useHandCursor: true }).setVisible(false).setFlipX(true)
            bookArrowLeft.on('pointerover', function (pointer) { bookArrowLeft.setFrame('hover') });
            bookArrowLeft.on('pointerout', function (pointer) { bookArrowLeft.setFrame('idle') });
            bookArrowLeft.on('pointerdown', function (pointer) { 
                game.currentPage -= 1
                selectBook(game.currentBook, game.currentPage)
            });
        
        // Entry titles
        let titleConfig = {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#9c6826',
        }
        let entryTitles = [
            this.add.text(200, 110, null, titleConfig).setOrigin(0, 0.5),
            this.add.text(200, 175, null, titleConfig).setOrigin(0, 0.5),
            this.add.text(200, 240, null, titleConfig).setOrigin(0, 0.5),
            this.add.text(200, 304, null, titleConfig).setOrigin(0, 0.5),
            this.add.text(200, 369, null, titleConfig).setOrigin(0, 0.5),
            this.add.text(562, 110, null, titleConfig).setOrigin(0, 0.5),
            this.add.text(562, 175, null, titleConfig).setOrigin(0, 0.5),
            this.add.text(562, 240, null, titleConfig).setOrigin(0, 0.5),
            this.add.text(562, 304, null, titleConfig).setOrigin(0, 0.5),
            this.add.text(562, 369, null, titleConfig).setOrigin(0, 0.5)
        ]
        // Entry hitboxes
        let entry1 = game.add.graphics()
            entry1.rectangle = new Phaser.Geom.Rectangle(130, 80, 300, 60)
        let entry2 = game.add.graphics()
            entry2.rectangle = new Phaser.Geom.Rectangle(130, 145, 300, 60)
        let entry3 = game.add.graphics()
            entry3.rectangle = new Phaser.Geom.Rectangle(130, 210, 300, 60)
        let entry4 = game.add.graphics()
            entry4.rectangle = new Phaser.Geom.Rectangle(130, 274, 300, 60)
        let entry5 = game.add.graphics()
            entry5.rectangle = new Phaser.Geom.Rectangle(130, 339, 300, 60)
        let entry6 = game.add.graphics()
            entry6.rectangle = new Phaser.Geom.Rectangle(492, 80, 300, 60)
        let entry7 = game.add.graphics()
            entry7.rectangle = new Phaser.Geom.Rectangle(492, 145, 300, 60)
        let entry8 = game.add.graphics()
            entry8.rectangle = new Phaser.Geom.Rectangle(492, 210, 300, 60)
        let entry9 = game.add.graphics()
            entry9.rectangle = new Phaser.Geom.Rectangle(492, 274, 300, 60)
        let entry10 = game.add.graphics()
            entry10.rectangle = new Phaser.Geom.Rectangle(492, 339, 300, 60)

        const entries = [entry1, entry2, entry3, entry4, entry5, entry6, entry7, entry8, entry9, entry10]
        for (let index = 0; index < entries.length; index++) {
            const entry = entries[index];
            entry.on('pointerover', function (pointer) { 
                // hoverEntry(index)
            });
            entry.on('pointerout', function (pointer) { 
                // unHoverEntry(index)
            });
            entry.on('pointerdown', function (pointer) { 
                findCurrentEntry(index)
                selectEntry(index)
            });
        }


        // ---------- Entry Page Open ---------- //
        // Entry Selection Functions
        function findCurrentEntry(entry) {
            game.currentEntry = entry + game.currentPage*10
            for (let index = 0; index < game.currentBook; index++) {
                game.currentEntry += langData.books[index].pages.length;
            }
        }
        function selectEntry() {
            game.entryOpen.setVisible(true)
            game.entryOpenTitle.text = game.allEntries[game.currentEntry].name
            game.entryOpenTitle.setFontSize(23)
            while (game.entryOpenTitle.width > 260) {
                game.entryOpenTitle.setFontSize(Number(game.entryOpenTitle.style.fontSize.slice(0, -2))-1)
            }
            game.entryOpenInfo.y = 52
            game.entryOpenInfo.text = game.allEntries[game.currentEntry].info
            game.entryScrollBar.setVisible(game.entryOpenInfo.height > 341)
            game.entryScroll.y = 123
            game.entryScroll.setVisible(game.entryOpenInfo.height > 341)

            game.entryImage.setTexture(game.allEntries[game.currentEntry].name).setDisplaySize(255, 300).setVisible(true)
            if (game.entryImage.scaleY < game.entryImage.scaleX) {
                game.entryImage.setScale(game.entryImage.scaleY, game.entryImage.scaleY).setVisible(true)
            } else {
                game.entryImage.setScale(game.entryImage.scaleX, game.entryImage.scaleX).setVisible(true)
            }

            entryArrowLeft.setVisible(game.currentEntry !== 0)
            entryArrowRight.setVisible(game.currentEntry !== game.allEntries.length - 1)
            if (game.entryOpenInfo.height > 340) {
                scrollZone.setInteractive()
                scrollUp.setInteractive(new Phaser.Geom.Rectangle(810, 85, 29, 23), Phaser.Geom.Rectangle.Contains)
                scrollDown.setInteractive(new Phaser.Geom.Rectangle(810, 332, 29, 23), Phaser.Geom.Rectangle.Contains)
            } else {
                scrollZone.removeInteractive()
                scrollUp.removeInteractive()
                scrollDown.removeInteractive()
            }

            // Hide book elements
            game.pageSelectFrame.setVisible(false)
            bookImages.forEach(image => { image.setVisible(false) });
            entryTitles.forEach(title => { title.setVisible(false) });
            bookArrowLeft.setVisible(false)
            bookArrowRight.setVisible(false)
            entries.forEach(entry => {
                entry.removeInteractive()
            });
        }

        // Entry Selection Elements
        this.entryImage = this.add.image(157, 111, null).setOrigin(0,0)
        this.entryOpen = this.add.image(646, 220, 'entryOpen').setVisible(false)

        let entryTitleConfig = {
            fontFamily: 'Arial',
            fontSize: 23,
            color: '#9c6826'
        }
        let entryInfoTextConfig = {
            fontFamily: 'Arial',
            fontSize: '13px',
            color: '#9c6826',
            lineSpacing: 2.2,
            wordWrap: { width: 325 }
        }
        this.entryOpenTitle = this.add.text(160, 90, null, entryTitleConfig).setOrigin(0, 0.5)
        this.entryOpenInfo = this.add.text(485, 52, null, entryInfoTextConfig)
        // Mask so text only appears in box
        let mask = new Phaser.Display.Masks.GeometryMask(this, this.make.graphics().fillRect(485, 52, 330, 340));
        this.entryOpenInfo.setMask(mask);

        // The scrollbar
        this.entryScrollBar = this.add.image(825, 220, 'entryScrollBar').setVisible(false)
        this.entryScroll = this.add.image(825, 123, 'entryScroll').setVisible(false)
        //  The rectangle they can 'drag' within
        let scrollZone = this.add.zone(810, 123, 29, 197).setOrigin(0);
            scrollZone.on('pointermove', function (pointer) {
                if (pointer.isDown)
                {
                    game.entryScroll.y = pointer.y
                    let moveText = (pointer.y - 123) / 197 * (game.entryOpenInfo.height - 340)

                    let percentage = (pointer.y - 123) / 197 * 100
                    if (percentage < 7) {
                        moveText = 0
                        game.entryScroll.y = 123
                    } else if (percentage > 93) {
                        moveText = game.entryOpenInfo.height - 340
                        game.entryScroll.y = 123 + 197
                    }

                    game.entryOpenInfo.y = 52 - moveText;
                }

            });
        let scrollAmountOnClick = 30
        let scrollUp = game.add.graphics()
            scrollUp.on('pointerdown', function (pointer) {
                if (pointer.isDown)
                {
                    let moveText = game.entryOpenInfo.y + scrollAmountOnClick
                    game.entryScroll.y = 123-((moveText - 52) / (game.entryOpenInfo.height - 340) * 197)

                    if (moveText >= 52) {
                        moveText = 52
                        game.entryScroll.y = 123
                    }

                    game.entryOpenInfo.y =  moveText;
                }

            });
        let scrollDown = game.add.graphics()
            scrollDown.on('pointerdown', function (pointer) {
                if (pointer.isDown)
                {
                    let moveText = game.entryOpenInfo.y - scrollAmountOnClick
                    game.entryScroll.y = 123-((moveText - 52) / (game.entryOpenInfo.height - 340) * 197)

                    if (moveText <= 52 - game.entryOpenInfo.height + 340) {
                        moveText = 52 - game.entryOpenInfo.height + 340
                        game.entryScroll.y = 123 + 197
                    }

                    game.entryOpenInfo.y =  moveText;
                }

            });
        // this.add.graphics().fillStyle(0x000000).fillRect(810, 85, 29, 23).setAlpha(.5);
        // this.add.graphics().fillStyle(0x000000).fillRect(810, 332, 29, 23).setAlpha(.5);

        let entryArrowRight = this.add.sprite(775, 440, 'arrow', 'idle').setInteractive({ pixelPerfect: true, useHandCursor: true }).setVisible(false)
            entryArrowRight.on('pointerover', function (pointer) { entryArrowRight.setFrame('hover') });
            entryArrowRight.on('pointerout', function (pointer) { entryArrowRight.setFrame('idle') });
            entryArrowRight.on('pointerdown', function (pointer) { 
                game.currentEntry += 1
                selectEntry(game.currentEntry)
            });
        let entryArrowLeft = this.add.sprite(113, 440, 'arrow', 'idle').setInteractive({ pixelPerfect: true, useHandCursor: true }).setVisible(false).setFlipX(true)
            entryArrowLeft.on('pointerover', function (pointer) { entryArrowLeft.setFrame('hover') });
            entryArrowLeft.on('pointerout', function (pointer) { entryArrowLeft.setFrame('idle') });
            entryArrowLeft.on('pointerdown', function (pointer) { 
                game.currentEntry -= 1
                selectEntry(game.currentEntry)
            });
        

        // ---------- Show Opened Book ---------- //
        selectBook(data.book, 0)
        // this.add.image(444, 234, 'pageRef').setAlpha(.25)
    }
}