export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.init(x, y);
  }

  init(x, y) {
    this.sprite = this.scene.matter.add.sprite(0, 0, "player", 0);

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const { width: w, height: h } = this.sprite;
    const mainBody = Bodies.rectangle(0, 0, w * 0.6, h, {
      chamfer: { radius: 10 },
    });
    this.sensors = {
      top: Bodies.rectangle(0, -h * 0.5, w * 0.5, 2, { isSensor: true }),
      bottom: Bodies.rectangle(0, h * 0.5, w * 0.5, 2, { isSensor: true }),
      left: Bodies.rectangle(-w * 0.35, 0, 2, h * 0.7, { isSensor: true }),
      right: Bodies.rectangle(w * 0.35, 0, 2, h * 0.7, { isSensor: true }),
    };
    const compoundBody = Body.create({
      parts: [
        mainBody,
        this.sensors.top,
        this.sensors.bottom,
        this.sensors.left,
        this.sensors.right,
      ],
      frictionStatic: 0,
      frictionAir: 0.02,
      friction: 0.1,
      render: { sprite: { xOffset: 0.5, yOffset: 0.5 } },
    });
    this.sprite.setExistingBody(compoundBody).setPosition(x, y).setIgnoreGravity(true).setOrigin(0.4, 0.6);
  }
}
