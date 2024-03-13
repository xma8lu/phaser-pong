import Phaser from "phaser";
import WebFontFile from "./webFontFile";
import { TitleScreen } from "../consts/SceneKeys";
import { PS2P } from "../consts/Fonts";
export default class GameOver extends Phaser.Scene {
  preload() {
    const fonts = new WebFontFile(this.load, "Press Start 2P");
    this.load.addFile(fonts);
  }
  create(data) {
    let titleText = "Game Over";
    if (data.leftScore > data.rightScore) {
      titleText = "You Win!";
    }

    this.add
      .text(400, 300, titleText, {
        fontFamily: PS2P,
        fontSize: 38,
      })
      .setOrigin(0.5);

    this.add
      .text(400, 400, "Press Space to Continue", {
        fontFamily: PS2P,
      })
      .setOrigin(0.5);
    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start(TitleScreen);
    });
  }
}
