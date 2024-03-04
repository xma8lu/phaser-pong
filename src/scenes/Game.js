import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  preload() {}
  create() {
    const ball = this.add.circle(400, 300, 10, 0xffffff, 1);
    this.physics.add.existing(ball);

    ball.body.setBounce(1, 1);
    ball.body.setCollideWorldBounds(true, 1, 1);
    ball.body.setVelocity(200, 200);

    const paddleLeft = this.add.rectangle(30, 300, 30, 100, 0xffffff);
    this.physics.add.existing(paddleLeft, true);

    this.physics.add.collider(paddleLeft, ball);
  }
}
