import Phaser from "phaser";
import WebFontFile from "./webFontFile";

import { Game } from "../consts/SceneKeys";
import * as audioKeys from "../consts/audioKeys";

export default class TitleScreen extends Phaser.Scene {
  preload() {
    const fonts = new WebFontFile(this.load, "Press Start 2P");
    this.load.addFile(fonts);
    this.load.audio(audioKeys.pongBeep, "assets/ping_pong_8bit_beeep.ogg");
    this.load.audio(audioKeys.pongPlop, "assets/ping_pong_8bit_plop.ogg");
  }
  create() {
    const title = this.add.text(400, 300, "Old School Tennis", {
      fontSize: 40,
      fontFamily: '"Press Start 2P"',
    });
    title.setOrigin(0.5, 0.5);

    this.add
      .text(400, 400, "Press Space to Start", {
        fontFamily: '"Press Start 2P"',
      })
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.sound.play(audioKeys.pongBeep);
      this.scene.start(Game);
    });
  }
}
