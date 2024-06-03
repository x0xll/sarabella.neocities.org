# Bella Sara Spectacular Jumping Game

This is a fan recreation of the [Bella Sara Spectacular Jumping Game](https://bellasara.wiki.gg/wiki/Spectacular_Jumping_Game) intended for archival purposes since the original is no longer available.

This recreation is intended to eventually include at least the first and second levels of the game.


## Set Up

To start, you will first need to download the code from this repository. This can be done using git or by downloading the .zip folder directly in the browser.

Since JavaScript has been used here in place of Flash, Flash is not required to play this recreation. However, since modern browsers place a few limitations on files opened directly in the browser, this game does need to be running from a server to work.

The following are a few ways to set up a server locally (on your own computer):

- If you have [VSCode](https://code.visualstudio.com/) installed, install the Live Server extension in VSCode, open this project in VSCode and then press 'Go Live' in the bottom right to open the game in the browser.

- If you have python installed (it should be preinstalled on Macs), navigate to the project folder and run `python -m SimpleHTTPServer 8080` (or `python -m http.server 8080`	for python version 3).

- Some other options are also listed [here](https://blog.ourcade.co/posts/2020/5-local-web-server-get-started-phaser-3/).


After starting a server locally, you can usually access it from http://localhost:8080/.


## Credits and References

All the original textures, animations, sounds and the gameplay itself were from the Spectacular Jumping Game on Bella Sara and belong to the Bella Sara Company, LLC.

- Numerous screen recordings and screenshots of the game have been taken from the following and have been used / referenced whilst remaking the game:
  - [The wiki page](https://bellasara.wiki.gg/wiki/Spectacular_Jumping_Game) describes the basic gameplay
  - [This stream](https://youtu.be/j8liTODSD_k?t=2607) contains screen recorded gameplay of the first two levels
  - [This video](https://youtu.be/tdnRv3Jla1w?t=645) contains screen recorded gameplay of the first level and has a clear view of the entire screen
  - The game music was taken from [this video](https://www.youtube.com/watch?v=TK6FrbjAzlo)
  - [PachirisuLover1994](https://www.youtube.com/@PachirisuLover1994) has videos of gameplay from all four levels, though the screen quality is very poor
    - [Level one](https://www.youtube.com/watch?v=YyZIdGfFxrA)
    - [Level two](https://www.youtube.com/watch?v=BeETxy_tUG4)
    - [Level three](https://www.youtube.com/watch?v=ozi1CnsD-ok)
    - [Level four](https://www.youtube.com/watch?v=mE0f_equ0HI)
- Other tools used:
  - The [Phaser](https://phaser.io/) game framework has been used to keep most of the coding pretty simple.
  - The [Leshy Sprite Sheet Tool](https://www.leshylabs.com/apps/sstool/) and [Codeshack Sprite Sheet Generator](https://codeshack.io/images-sprite-sheet-generator/) have been used to generate the texture atlas files and sprite sheets.