export default class Bootloader extends Phaser.Scene {
  constructor() {
    super({ key: "bootloader" });
  }

  preload() {
    this.createBars();
    this.setLoadEvents();
    this.loadSprites();
    this.loadAudios();
    this.loadMaps();
  }

  setLoadEvents() {
    this.load.on(
      "progress",
      function (value) {
        this.progressBar.clear();
        this.progressBar.fillStyle(0x4a0404, 1);
        this.progressBar.fillRect(
          this.cameras.main.width / 4,
          this.cameras.main.height / 2 - 16,
          (this.cameras.main.width / 2) * value,
          16
        );
      },
      this
    );

    this.load.on(
      "complete",
      () => {
        this.scene.start("splash");
      },
      this
    );
  }

  loadSprites() {
    this.load.spritesheet(
      "player",
      "assets/images/player/rifle/idle/survivor-idle_rifle_0.png",
      {
        frameWidth: 94,
        frameHeight: 62,
      }
    );
    this.load.spritesheet(
      "zombie",
      "assets/images/zombie/skeleton-idle_0.png",
      {
        frameWidth: 67,
        frameHeight: 62,
      }
    );
  }

  loadAudios() {
    this.load.audio("splash", "assets/sounds/menuTheme.mp3");
  }

  loadMaps() {
    this.load.image("menuBackground", "assets/images/maps/menuBackground.jpg");
    this.load.image("gameBackground", "assets/images/maps/gameBackground.png");
  }

  createBars() {
    this.loadBar = this.add.graphics();
    this.loadBar.fillStyle(0x808080, 1);
    this.loadBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }
}
