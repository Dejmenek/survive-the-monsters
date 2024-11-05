import Phaser from "../node_modules/phaser";
import Bootloader from "./scenes/bootloader.js";
import Splash from "./scenes/splash.js";
import Game from "./scenes/game.js";
import GameOver from "./scenes/gameOver.js";

const config = {
  type: Phaser.AUTO,
  width: 840,
  height: 650,
  physics: {
    default: "matter",
    matter: {
      debug: false, // Optional, for visual debugging
    },
  },
  parent: "game-container",
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Bootloader, Splash, Game, GameOver],
};

const game = new Phaser.Game(config);
