import Phaser from "phaser";
import WebFontFile from "./webFontFile";

import * as Colors from "~/consts/Colors";

import { GameBackground } from "../consts/SceneKeys";

export default class Game extends Phaser.Scene {
  init() {
    this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0);

    this.leftScore = 0;
    this.rightScore = 0;
  }
  preload() {
    const fonts = new WebFontFile(this.load, "Press Start 2P");
    this.load.addFile(fonts);
  }
  create() {
    this.scene.run(GameBackground);
    this.scene.sendToBack(GameBackground);

    this.physics.world.setBounds(-100, 0, 1000, 600);

    this.ball = this.add.circle(400, 300, 10, Colors.White, 1);
    this.physics.add.existing(this.ball);
    this.ball.body.setCircle(10);
    this.ball.body.setBounce(1, 1);
    this.ball.body.setCollideWorldBounds(true, 1, 1);

    this.time.delayedCall(1000, () => {
      this.resetBall();
    });

    this.paddleLeft = this.add.rectangle(30, 300, 30, 100, Colors.White);
    this.physics.add.existing(this.paddleLeft, true);

    this.physics.add.collider(this.paddleLeft, this.ball);

    this.paddleRight = this.add.rectangle(770, 300, 30, 100, Colors.White);
    this.physics.add.existing(this.paddleRight, true);

    this.physics.add.collider(this.paddleRight, this.ball);

    this.cursors = this.input.keyboard.createCursorKeys();

    const scoreStyle = {
      fontSize: 48,
      fontFamily: '"Press Start 2P"',
    };

    this.leftScoreLabel = this.add
      .text(300, 150, "0", scoreStyle)
      .setOrigin(0.5, 0.5);

    this.rightScoreLabel = this.add
      .text(500, 450, "0", scoreStyle)
      .setOrigin(0.5, 0.5);
  }

  update() {
    this.processPlayerInput();

    this.updateOpp();

    this.checkScore();
  }

  processPlayerInput() {
    const body = this.paddleLeft.body;
    if (this.cursors.up.isDown) {
      this.paddleLeft.y -= 10;
      body.updateFromGameObject();
    } else if (this.cursors.down.isDown) {
      this.paddleLeft.y += 10;
      body.updateFromGameObject();
    }
  }

  updateOpp() {
    const diff = this.ball.y - this.paddleRight.y;
    if (Math.abs(diff) < 10) {
      return;
    }
    const oppSpeed = 4;
    if (diff < 0) {
      this.paddleRightVelocity.y = -oppSpeed;
      if (this.paddleRightVelocity.y < -10) {
        this.paddleRightVelocity.y = -10;
      }
    } else if (diff > 0) {
      this.paddleRightVelocity.y = oppSpeed;
      if (this.paddleRightVelocity.y > 10) {
        this.paddleRightVelocity.y = 10;
      }
    }
    this.paddleRight.y += this.paddleRightVelocity.y;
    this.paddleRight.body.updateFromGameObject();
  }

  checkScore() {
    if (this.ball.x < -30) {
      this.incrementRightScore();
      this.resetBall();
    } else if (this.ball.x > 830) {
      this.incrementLeftScore();
      this.resetBall();
    }
  }

  incrementLeftScore() {
    this.leftScore += 1;
    this.leftScoreLabel.text = this.leftScore;
  }

  incrementRightScore() {
    this.rightScore += 1;
    this.rightScoreLabel.text = this.rightScore;
  }
  resetBall() {
    this.ball.setPosition(400, 300);
    const angle = Phaser.Math.Between(0, 360);
    const vec = this.physics.velocityFromAngle(angle, 200);

    this.ball.body.setVelocity(vec.x, vec.y);
  }
}
