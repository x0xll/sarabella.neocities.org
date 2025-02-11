class Bellapedia extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'Bellapedia' });
    }

    preload ()
    {
        this.load.image('bookSelect', './images/book_selection.jpg');
        this.load.image('bookSelectOverlay', './images/book_selection_overlay.png');
        this.load.atlas('arrow', './images/arrow.png', './images/arrow.json');
        this.load.image('pageSelectBG', './images/page_select_bg.png');
    }

    create ()
    {
        const game = this

        // Intro screen
        this.add.image(444, 234, 'bookSelect')
        let selectOverlay = this.add.image(444, 234, 'bookSelectOverlay')

        let introHeader = this.add.text(184, 97, langData.title, {
            fontFamily: 'Arial',
            fontSize: '26px',
            color: '#000000'
        }).setPadding(6);

        let intro = this.add.text(184, 155, langData.intro, {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#000000',
            wordWrap: { width: 560 },
            lineSpacing: 5
        }).setPadding(6);

        
        let arrow = this.add.sprite(789, 388, 'arrow', 'idle').setInteractive({ pixelPerfect: true, useHandCursor: true })
            arrow.on('pointerover', function (pointer) { arrow.setFrame('hover') });
            arrow.on('pointerout', function (pointer) { arrow.setFrame('idle') });
            arrow.on('pointerdown', function (pointer) { 
                selectOverlay.setVisible(false)
                arrow.setVisible(false)
                introHeader.setVisible(false)
                intro.setVisible(false)
                game.books[0].setInteractive(new Phaser.Geom.Rectangle(45, 100, 110, 330), Phaser.Geom.Rectangle.Contains);
                game.books[1].setInteractive(new Phaser.Geom.Rectangle(155, 100, 110, 330), Phaser.Geom.Rectangle.Contains);
                game.books[2].setInteractive(new Phaser.Geom.Rectangle(270, 100, 110, 330), Phaser.Geom.Rectangle.Contains);
                game.books[3].setInteractive(new Phaser.Geom.Rectangle(385, 100, 110, 330), Phaser.Geom.Rectangle.Contains);
                game.books[4].setInteractive(new Phaser.Geom.Rectangle(500, 100, 110, 330), Phaser.Geom.Rectangle.Contains);
                game.books[5].setInteractive(new Phaser.Geom.Rectangle(612, 100, 110, 330), Phaser.Geom.Rectangle.Contains);
                game.books[6].setInteractive(new Phaser.Geom.Rectangle(725, 100, 110, 330), Phaser.Geom.Rectangle.Contains);
            });

        // Book select
        function selectBook(book, page = 0) {
            game.book = book
            game.currentBook = book
            game.scene.start("BellapediaOpen", {book: book});
        }

        this.books = [game.add.graphics(), game.add.graphics(), game.add.graphics(), 
            game.add.graphics(), game.add.graphics(), game.add.graphics(), game.add.graphics()]
        for (let index = 0; index < this.books.length; index++) {
            this.books[index].on('pointerdown', function (pointer) { 
                selectBook(index)
            }); 
        }
    }
}