# Fan Recreation of Bella Sara Stable Game

This is a fan recreation of the [Bella Sara horse stable game](https://bellasara.wiki.gg/wiki/Magical_Horses) intended for archival purposes since the original is no longer available.


## Set Up

To start, you will first need to download the code from this repository. This can be done using git or by downloading the .zip folder directly in the browser.

Since JavaScript has been used here in place of Flash, Flash is not required to play this recreation. However, since modern browsers place a few limitations on files opened directly in the browser, this game does need to be running from a server to work.

The following are a few ways to set up a server locally (on your own computer):

- If you have [VSCode](https://code.visualstudio.com/) installed, install the Live Server extension in VSCode, open this project in VSCode and then press 'Go Live' in the bottom right to open the game in the browser.

- If you have python installed (it should be preinstalled on Macs), navigate to the project folder and run `python -m SimpleHTTPServer 8080` (or `python -m http.server 8080`	for python version 3).

- A dockerfile is also provided, so if you install [Docker](https://www.docker.com/get-started/), you can run the game locally by running the following after navigating to the project folder:
  ```
  docker build -t dockersite .
  docker run -dit --name dockersite-container -p 8080:80 dockersite
  ```

- Some other options are also listed [here](https://blog.ourcade.co/posts/2020/5-local-web-server-get-started-phaser-3/).


After starting a server locally, you can usually access it from http://localhost:8080/.



## Credits and References

All the original textures, animations, sounds and the gameplay itself were taken from the horse care game on Bella Sara and belong to the Bella Sara Company, LLC.

- Screen recordings and screenshots of the game have been taken from the following and have been edited / cleaned up to remake the assets for the game:
  - The [Bella Sara Wiki](https://bellasara.wiki.gg/wiki/Bella_Sara_Wiki) has many  different screenshots of the stable and different horses.
  - The game soundtrack was found [here](https://www.youtube.com/watch?v=KwJBx4gI1uw&list=PLE_maQWjY0W55azSzRqAEwgmo-8Nl2jfn&index=9).
  - [This video](https://www.youtube.com/watch?v=uaQ2FjKgHKQ&t=627s) shows care of some different horses and has music off (i.e. clearer sounds).
  - [This video](https://www.youtube.com/watch?v=DVlLQOMo2Ow) shows most of the animations (played all animations available in menu for classic horses) and shows the whole screen.
  - [This video](https://www.youtube.com/watch?v=nw-J5skHzrE) has clear sounds from the foal version, many of which are the same, and no music.
- Other tools used:
  - The [Phaser](https://phaser.io/) game framework has been used to keep most of the coding pretty simple.
  - The [Leshy Sprite Sheet Tool](https://www.leshylabs.com/apps/sstool/) and [Codeshack Sprite Sheet Generator](https://codeshack.io/images-sprite-sheet-generator/) have been used to generate the texture atlas files and sprite sheets.
  - [Spine Animations](https://blog.ourcade.co/posts/2020/phaser-3-parcel-typescript-spine/) are used for the horse

## Progress
- [ ] basic gameplay
  - [x] fill water
  - [x] remove dirty straw
  - [x] add new straw
  - [x] brush
  - [ ] small brush *(still need textures for this one)*
  - [x] hoofpick
  - [x] give food
  - [x] apple
  - [x] music on/off
  - [x] progress bars for hunger, cleanliness and happiness
  - [ ] click card for positive message
  - [ ] click horseshoe for good luck
  - [ ] glow to show which objects can be interacted with
- [ ] animations
  - [ ] Idle animations should be chosen randomly and start after a random delay. (*[onCompleteEvent](https://labs.phaser.io/view.html?src=src\animation\on%20complete%20event.js) could be used to queue the next animation, and random numbers could be used to pick an animation and start it after a [random delay](https://labs.phaser.io/view.html?src=src\animation\random%20delay.js)?*)
  - *Horse animations should be made to work with the body in parts (using [spine](http://esotericsoftware.com/) animations?) to make adding multiple horses easier and to hopefully use less file space*
    - [ ] eat
    - [ ] drink *(this has a partial version already)*
    - [ ] rear *(this has a partial version already)*
    - [ ] paw with foreleg
    - [ ] raise head
    - [ ] raise head slow
    - [ ] shift in place
    - [ ] ear twitch
    - [ ] breath
    - [ ] sway
    - [ ] tail swish
  - [ ] item use animations
    - [ ] shovel
    - [ ] pitchfork
    - [ ] hoofpick
    - [ ] brush
    - [ ] small brush
    - [ ] grain scoop
    - [ ] water trough *(this has a partial version already)*
- [ ] textures
  - [ ] horse *(again, should be made to work as parts rather than as a single image - this might also make it easier to add different horses without needing to reanimate each one)*
    - [ ] cleanliness stages (see if this can be overlaid on top of horse as a texture)
    - [ ] eye (with blink frames)
    - [ ] peter
    - [ ] ...?
- [ ] sounds
  - [x] background music
  - [x] pour water
  - [x] pick up grain
  - [x] pour grain
  - [x] feed apple
  - [x] use shovel
  - [x] pick up straw
  - [x] place straw
  - [x] brush
  - [x] use hoofpick
  - [ ] rear / neigh
  - [ ] pawing
  - [ ] hooves shifting