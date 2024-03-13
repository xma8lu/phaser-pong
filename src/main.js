import Phaser from "phaser";
import TitleScreen from "./scenes/TitleScreen";
import Game from "./scenes/Game";
import GameBackground from "./scenes/GameBackground";
import * as SceneKeys from "./consts/SceneKeys";
import GameOver from "./scenes/GameOver";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
};

const game = new Phaser.Game(config);

game.scene.add(SceneKeys.TitleScreen, TitleScreen);
game.scene.add(SceneKeys.Game, Game);
game.scene.add(SceneKeys.GameBackground, GameBackground);
game.scene.add(SceneKeys.GameOver, GameOver);

game.scene.start(SceneKeys.TitleScreen);
//game.scene.start("titlescreen");
//game.scene.start(SceneKeys.Game);
