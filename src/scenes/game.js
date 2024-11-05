import Player from "../gameObjects/player";
import Zombie from "../gameObjects/zombie";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
    this.player = null;
    this.zombies = null;
    this.bullets = null;
    this.score = 0;
    this.timer = 0;
    this.timerRunning = false;
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

    this.timerText = this.add
      .text(10, 10, "Time: 0", {
        fontSize: "32px",
        fill: "#000",
        fontStyle: "Bold",
      })
      .setDepth(20);

    this.scoreText = this.add
      .text(10, 50, "Score: 0", {
        fontSize: "32px",
        fill: "#000",
        fontStyle: "Bold",
      })
      .setDepth(20);
    this.startTimer();

    this.zombies = [];
    this.bullets = [];
    this.loadAudios();
    this.addPlayer();
    this.startZombieSpawn();
    this.addCollisions();
  }

  update() {
    if (this.timerRunning) {
      this.timerText.setText(`Time: ${this.timer}`);
    }
    this.zombies.forEach((zombie) => {
      zombie.update(this.player.sprite.x, this.player.sprite.y);
    });
  }

  startTimer() {
    this.timerRunning = true;
    this.timer = 0;
    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  stopTimer() {
    this.timerRunning = false;
    this.time.removeAllEvents();
  }

  updateTimer() {
    if (this.timerRunning) {
      this.timer += 1;
    }
  }

  incrementScore() {
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  addPlayer() {
    this.player = new Player(this, this.centerWidth, this.centerHeight);
  }

  addCollisions() {
    this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
      if (
        (bodyA.label == "zombie" && bodyB.label == "player") ||
        (bodyA.label == "player" && bodyB.label == "zombie")
      ) {
        this.gameOver();
      }

      if (bodyA.label === "zombie" && bodyB.label === "bullet") {
        this.playerHitsZombie(bodyA);
        this.destroyBullet(bodyB);
      }

      if (bodyA.label === "bullet" && bodyB.label === "zombie") {
        this.playerHitsZombie(bodyB);
        this.destroyBullet(bodyA);
      }
    });
  }

  destroyBullet(bulletBody) {
    const bulletInstance = bulletBody.gameObject.getData("instance");
    bulletInstance.destroy();
    this.removeBullet(bulletInstance);
  }

  playerHitsZombie(zombieBody) {
    const zombieInstance = zombieBody.gameObject.getData("instance");
    zombieInstance.takeDamage();

    if (zombieInstance.health <= 0) this.incrementScore();
  }

  removeZombie(zombie) {
    const index = this.zombies.indexOf(zombie);
    if (index > -1) {
      this.zombies.splice(index, 1);
    }
  }

  removeBullet(bullet) {
    const index = this.bullets.indexOf(bullet);
    if (index > -1) {
      this.bullets.splice(index, 1);
    }
  }

  gameOver() {
    this.stopTimer();
    this.score = 0;
    this.scene.stop();
    this.matter.pause();
    this.zombies.slice().forEach((zombie) => zombie.destroy());
    this.bullets.slice().forEach((bullet) => bullet.destroy());
    this.scene.start("gameOver");
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
    this.zombies.push(zombie);
  }

  getRandomPosition() {
    const x = Phaser.Math.Between(0, this.cameras.main.width);
    const y = Phaser.Math.Between(0, this.cameras.main.height);

    return { x, y };
  }

  loadAudios() {
    this.audios = {
      shot: this.sound.add("shot", { volume: 0.4, loop: false, detune: 0 }),
    };
  }

  playAudio(key) {
    this.audios[key].play();
  }
}
