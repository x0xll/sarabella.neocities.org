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
        this.load.image('pageRef', './images/page_ref.png');
        
        // Load all images and put all entries in a single array
        this.allEntries = []
        this.allBooks = [langData.book1, langData.book2, langData.book3, langData.book4, langData.book5, langData.book6, langData.book7]
        this.allBooks.forEach(book => {
            book.pages.forEach(entry => {
                console.log(entry)
                this.load.image(entry.name, entry.image);
                this.allEntries.push(entry)
            });
        });
    }

    create (data)
    {
        const game = this
        this.data = data

        // Book select
        function selectBook(book, page = 0) {
            game.book = book
            game.currentBook = book
            pageSelectBG.setVisible(true)
            pageSelectFrame.setVisible(true)
            game.bookSelected.setVisible(true)

            book1Mini.setInteractive(new Phaser.Geom.Rectangle(53, 80, 50, 30), Phaser.Geom.Rectangle.Contains);
            book2Mini.setInteractive(new Phaser.Geom.Rectangle(53, 130, 50, 30), Phaser.Geom.Rectangle.Contains);
            book3Mini.setInteractive(new Phaser.Geom.Rectangle(53, 184, 50, 30), Phaser.Geom.Rectangle.Contains);
            book4Mini.setInteractive(new Phaser.Geom.Rectangle(53, 236, 50, 30), Phaser.Geom.Rectangle.Contains);
            book5Mini.setInteractive(new Phaser.Geom.Rectangle(53, 286, 50, 30), Phaser.Geom.Rectangle.Contains);
            book6Mini.setInteractive(new Phaser.Geom.Rectangle(53, 338, 50, 30), Phaser.Geom.Rectangle.Contains);
            book7Mini.setInteractive(new Phaser.Geom.Rectangle(53, 392, 50, 30), Phaser.Geom.Rectangle.Contains);

            for (let index = 0; index < 10 + page*10; index++) {
                if (index+ page*10 in book.pages) {
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
                }
            }
        }

        function hoverBook(book) {
            game.bookSelect.setVisible(true)

            switch (book) {
                case langData.book1:
                    game.bookSelect.setPosition(73, 106)
                    break;
    
                case langData.book2:
                    game.bookSelect.setPosition(73, 156)
                    break;
    
                case langData.book3:
                    game.bookSelect.setPosition(73, 211)
                    break;
    
                case langData.book4:
                    game.bookSelect.setPosition(73, 264)
                    break;
    
                case langData.book5:
                    game.bookSelect.setPosition(73, 314)
                    break;
    
                case langData.book6:
                    game.bookSelect.setPosition(73, 366)
                    break;
    
                case langData.book7:
                    game.bookSelect.setPosition(73, 418)
                    break;
            
                default:
                    break;
            }
        }

        function unHoverBook() {
            game.bookSelect.setVisible(false)
        }

        let book1Mini = game.add.graphics()
            book1Mini.on('pointerover', function (pointer) { 
                hoverBook(langData.book1)
            });
            book1Mini.on('pointerout', function (pointer) { 
                unHoverBook(langData.book1)
            });
            book1Mini.on('pointerdown', function (pointer) { 
                selectBook(langData.book1)
            });
            
        let book2Mini = game.add.graphics()
            book2Mini.on('pointerover', function (pointer) { 
                hoverBook(langData.book2)
            });
            book2Mini.on('pointerout', function (pointer) { 
                unHoverBook(langData.book2)
            });
            book2Mini.on('pointerdown', function (pointer) { 
                selectBook(langData.book2)
            });

        let book3Mini = game.add.graphics()
            book3Mini.on('pointerover', function (pointer) { 
                hoverBook(langData.book3)
            });
            book3Mini.on('pointerout', function (pointer) { 
                unHoverBook(langData.book3)
            });
            book3Mini.on('pointerdown', function (pointer) { 
                selectBook(langData.book3)
            });

        let book4Mini = game.add.graphics()
            book4Mini.on('pointerover', function (pointer) { 
                hoverBook(langData.book4)
            });
            book4Mini.on('pointerout', function (pointer) { 
                unHoverBook(langData.book4)
            });
            book4Mini.on('pointerdown', function (pointer) { 
                selectBook(langData.book4)
            });

        let book5Mini = game.add.graphics()
            book5Mini.on('pointerover', function (pointer) { 
                hoverBook(langData.book5)
            });
            book5Mini.on('pointerout', function (pointer) { 
                unHoverBook(langData.book5)
            });
            book5Mini.on('pointerdown', function (pointer) { 
                selectBook(langData.book5)
            });

        let book6Mini = game.add.graphics()
            book6Mini.on('pointerover', function (pointer) { 
                hoverBook(langData.book6)
            });
            book6Mini.on('pointerout', function (pointer) { 
                unHoverBook(langData.book6)
            });
            book6Mini.on('pointerdown', function (pointer) { 
                selectBook(langData.book6)
            });

        let book7Mini = game.add.graphics()
            book7Mini.on('pointerover', function (pointer) { 
                hoverBook(langData.book7)
            });
            book7Mini.on('pointerout', function (pointer) { 
                unHoverBook(langData.book7)
            });
            book7Mini.on('pointerdown', function (pointer) { 
                selectBook(langData.book7)
            });

        
        // Page select
        let pageSelectBG = this.add.image(444, 234, 'pageSelectBG')//.setVisible(false)
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
        let titleConfig = {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#9c6826',
        }
        let pageSelectFrame = this.add.image(444, 234, 'pageSelectFrame').setVisible(false)
        this.bookSelected = this.add.image(0, 0, 'pageSelected').setVisible(false)
        this.bookSelect = this.add.image(0, 0, 'pageSelected').setVisible(false)
        
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

        selectBook(data.book)
    }

    update () {
        const game = this

        switch (this.currentBook) {
            case langData.book1:
                this.bookSelected.setPosition(73, 106)
                break;

            case langData.book2:
                this.bookSelected.setPosition(73, 156)
                break;

            case langData.book3:
                this.bookSelected.setPosition(73, 211)
                break;

            case langData.book4:
                this.bookSelected.setPosition(73, 264)
                break;

            case langData.book5:
                this.bookSelected.setPosition(73, 314)
                break;

            case langData.book6:
                this.bookSelected.setPosition(73, 366)
                break;

            case langData.book7:
                this.bookSelected.setPosition(73, 418)
                break;
        
            default:
                break;
        }
    }
}