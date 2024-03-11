import Phaser from "phaser";

export default class GameBackground extends Phaser.Scene {
  preload() {}
  create() {
    this.add.line(400, 300, 0, 0, 0, 600, 0xffffff, 1).setLineWidth(2.5, 2.5);
    this.add.circle(400, 300, 50).setStrokeStyle(4, 0xffffff, 1);
  }
}
