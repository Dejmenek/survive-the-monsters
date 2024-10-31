import Player from "../gameObjects/player";
import Zombie from "../gameObjects/zombie";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
    this.player = null;
    this.zombie = null;
  }

  init(data) {
    this.name = data.name;
    this.number = data.number;
  }

  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.add.image(0, 0, "gameBackground").setOrigin(0, 0);
    this.centerWidth = this.width / 2;
    this.centerHeight = this.height / 2;

    this.addPlayer();
    this.addZombie();
  }

  addPlayer() {
    this.player = new Player(this, this.centerWidth, this.centerHeight);
  }

  addZombie() {
    this.zombie = new Zombie(this, 200, 120);
  }
}
