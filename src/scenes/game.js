import Player from "../gameObjects/player";
import Zombie from "../gameObjects/zombie";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
    this.player = null;
    this.zombies = null;
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

    this.zombies = [];
    this.addPlayer();
    this.startZombieSpawn();
  }

  update() {
    this.zombies.forEach((zombie) => {
      zombie.update(this.player.sprite.x, this.player.sprite.y);
    });
  }

  addPlayer() {
    this.player = new Player(this, this.centerWidth, this.centerHeight);
  }

  startZombieSpawn() {
    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 5000),
      callback: this.spawnZombie,
      callbackScope: this,
      loop: true,
    });
  }

  spawnZombie() {
    const minDistance = 50;
    let spawnPosition = this.getRandomPosition();

    while (
      Phaser.Math.Distance.Between(
        spawnPosition.x,
        spawnPosition.y,
        this.player.sprite.x,
        this.player.sprite.y
      ) < minDistance
    ) {
      spawnPosition = this.getRandomPosition();
    }

    this.addZombie(spawnPosition.x, spawnPosition.y);
  }

  addZombie(x, y) {
    const zombie = new Zombie(this, x, y);
    console.log("Zombie added at position:", x, y);
    this.zombies.push(zombie);
  }

  getRandomPosition() {
    const x = Phaser.Math.Between(0, this.cameras.main.width);
    const y = Phaser.Math.Between(0, this.cameras.main.height);

    return { x, y };
  }
}
