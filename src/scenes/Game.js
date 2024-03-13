import Phaser from "phaser";
import WebFontFile from "./webFontFile";

import * as Colors from "~/consts/Colors";

import { GameBackground, GameOver } from "../consts/SceneKeys";
import * as audioKeys from "../consts/audioKeys";

const GameState = {
  Running: "running",
  PlayerWon: "player-won",
  ComputerWon: "computer-won",
};

export default class Game extends Phaser.Scene {
  init() {
    this.GameState = GameState.Running;
    this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0);

    this.leftScore = 0;
    this.rightScore = 0;

    this.paused = false;
  }
  preload() {
    const fonts = new WebFontFile(this.load, "Press Start 2P");
    this.load.addFile(fonts);
    this.load.audio(audioKeys.pongBeep, "assets/ping_pong_8bit_beeep.ogg");
    this.load.audio(audioKeys.pongPlop, "assets/ping_pong_8bit_plop.ogg");
  }
  create() {
    this.scene.run(GameBackground);
    this.scene.sendToBack(GameBackground);

    this.physics.world.setBounds(-100, 0, 1000, 600);

    this.ball = this.add.circle(400, 300, 10, Colors.White, 1);
    this.physics.add.existing(this.ball);
    this.ball.body.setCircle(10);
    this.ball.body.setBounce(1, 1);
    this.ball.body.setMaxSpeed(500);
    this.ball.body.setCollideWorldBounds(true, 1, 1);

    this.ball.body.onWorldBounds = true;

    this.time.delayedCall(800, () => {
      this.resetBall();
    });

    this.paddleLeft = this.add.rectangle(30, 300, 30, 100, Colors.White);
    this.physics.add.existing(this.paddleLeft, true);

    this.physics.add.collider(
      this.paddleLeft,
      this.ball,
      this.handlePaddleBallCollision,
      undefined,
      this
    );

    this.paddleRight = this.add.rectangle(770, 300, 30, 100, Colors.White);
    this.physics.add.existing(this.paddleRight, true);

    this.physics.add.collider(
      this.paddleRight,
      this.ball,
      this.handlePaddleBallCollision,
      undefined,
      this
    );

    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.world.on("worldbounds", this.handleBallWorldCollision, this);

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

  handlePaddleBallCollision(paddle, ball) {
    this.sound.play(audioKeys.pongBeep);
    const v = this.ball.body.velocity;
    v.x *= 1.05;
    v.y *= 1.05;

    this.ball.body.setVelocity(v.x, v.y);
  }

  update() {
    if (this.paused || this.GameState !== GameState.Running) {
      return;
    }
    this.processPlayerInput();

    this.updateOpp();

    this.checkScore();
  }

  handleBallWorldCollision(body, up, down, left, right) {
    if (left || right) {
      return;
    }
    this.sound.play(audioKeys.pongPlop);
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
    const computerSpeed = 4;
    if (diff < 0) {
      this.paddleRightVelocity.y = -computerSpeed;
      if (this.paddleRightVelocity.y < -10) {
        this.paddleRightVelocity.y = -10;
      }
    } else if (diff > 0) {
      this.paddleRightVelocity.y = computerSpeed;
      if (this.paddleRightVelocity.y > 10) {
        this.paddleRightVelocity.y = 10;
      }
    }
    this.paddleRight.y += this.paddleRightVelocity.y;
    this.paddleRight.body.updateFromGameObject();
  }

  checkScore() {
    const x = this.ball.x;
    const leftbound = -30;
    const rightbound = 830;

    if (x >= leftbound && x <= rightbound) {
      return;
    }

    if (this.ball.x < leftbound) {
      this.incrementRightScore();
    } else if (this.ball.x > rightbound) {
      this.incrementLeftScore();
    }
    const maxScore = 7;

    if (this.leftScore >= maxScore) {
      this.GameState = GameState.PlayerWon;
    } else if (this.rightScore >= maxScore) {
      this.GameState = GameState.ComputerWon;
    }
    if (this.GameState === GameState.Running) {
      this.resetBall();
    } else {
      this.ball.active = false;
      this.physics.world.remove(this.ball.body);
      this.scene.stop(GameBackground);

      this.scene.start(GameOver, {
        leftScore: this.leftScore,
        rightScore: this.rightScore,
      });
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
    const vec = this.physics.velocityFromAngle(angle, 300);

    this.ball.body.setVelocity(vec.x, vec.y);
  }
}
