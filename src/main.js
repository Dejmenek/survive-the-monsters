import Phaser from "phaser";
import Bootloader from "./scenes/bootloader";
import Splash from "./scenes/splash";
import Game from "./scenes/game";

const config = {
  type: Phaser.AUTO,
  width: 840,
  height: 650,
  physics: {
    default: "matter",
    matter: {
      debug: true, // Optional, for visual debugging
    },
  },
  parent: "game-container",
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Bootloader, Splash, Game],
};

const game = new Phaser.Game(config);
