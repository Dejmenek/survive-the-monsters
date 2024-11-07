export default class Splash extends Phaser.Scene {
  constructor() {
    super({ key: "splash" });
  }

  create() {
    this.add.image(0, 0, "menuBackground").setOrigin(0, 0);
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.centerWidth = this.width / 2;
    this.centerHeight = this.height / 2;

    this.showTitle();
    this.showInstructions();

    this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
    this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
    this.playMusic();
  }

  startGame() {
    if (this.theme) this.theme.stop();
    this.scene.start("game");
    this.scene.stop();
  }

  playMusic(theme = "splash") {
    this.theme = this.sound.add(theme);
    this.theme.stop();
    this.theme.play({
      mute: false,
      volume: 0.3,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });
  }

  showTitle() {
    this.add.text(this.centerWidth, 250, "Survive the monsters").setOrigin(0.5);
  }

  showInstructions() {
    this.add.text(this.centerWidth, 430, "WASD: move").setOrigin(0.5);
    this.add.text(this.centerWidth, 460, "Left mouse: shoot").setOrigin(0.5);
    this.add.text(this.centerWidth, 490, "Move mouse: aim").setOrigin(0.5);
    this.add.text(this.centerWidth, 520, "By Dejmenek").setOrigin(0.5);
    this.space = this.add
      .text(this.centerWidth, 570, "Press SPACE to start")
      .setOrigin(0.5);
  }
}
