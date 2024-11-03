export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "gameOver" });
  }

  init(data) {
    this.name = data.name;
    this.number = data.number;
    this.next = data.next;
  }

  create() {
    this.add.image(0, 0, "menuBackground").setOrigin(0, 0);
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.centerWidth = this.width / 2;
    this.centerHeight = this.height / 2;
    this.introLayer = this.add.layer();

    this.text = [
      "GAME OVER",
      "You fought bravely, but the horde was too strong.",
      "Your journey ends here.",
      "Press SPACE to restart",
    ];

    this.showMessages();

    this.input.keyboard.on("keydown-SPACE", () => this.restartGame(), this);
    this.input.keyboard.on("keydown-ENTER", () => this.restartGame(), this);
  }

  restartGame() {
    this.scene.stop();
    this.scene.start("splash");
  }

  showMessages() {
    this.text.forEach((line, i) => {
      this.time.delayedCall(
        (i + 1) * 1000,
        () => this.showLine(line, (i + 1) * 60),
        null,
        this
      );
    });
  }

  showLine(text, y) {
    let line = this.introLayer.add(
      this.add
        .text(this.centerWidth, y, text)
        .setOrigin(0.5)
        .setAlpha(0)
    );
    this.tweens.add({
      targets: line,
      duration: 2000,
      alpha: 1,
    });
  }
}
