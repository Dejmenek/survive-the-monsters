export default class Bootloader extends Phaser.Scene {
  constructor() {
    super({ key: "bootloader" });
  }

  preload() {
    this.createBars();
    this.setLoadEvents();
    this.loadImages();
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

  loadImages() {
    this.load.image("target", require("../../../public/assets/images/player/gun-pointer.png"));
  }

  loadSprites() {
    this.load.spritesheet(
      "player",
      require("../../../public/assets/images/player/rifle/idle/survivor-idle_rifle_0.png"),
      {
        frameWidth: 94,
        frameHeight: 62,
      }
    );
    this.load.spritesheet("bullet", require("../../../public/assets/images/player/bullet.png"), {
      frameWidth: 37,
      frameHeight: 21,
    });
    this.load.spritesheet(
      "zombie",
      require("../../../public/assets/images/zombie/skeleton-idle_0.png"),
      {
        frameWidth: 67,
        frameHeight: 62,
      }
    );
  }

  loadAudios() {
    this.load.audio("splash", require("url:../../../public/assets/sounds/menuTheme.mp3"));
    this.load.audio("shot", require("url:../../../public/assets/sounds/sniper_rifle_single_shot.mp3"));
  }

  loadMaps() {
    this.load.image("menuBackground", require("url:../../../public/assets/images/maps/menuBackground.jpg"));
    this.load.image("gameBackground", require("url:../../../public/assets/images/maps/gameBackground.png"));
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
