export default class Zombie {
  constructor(scene, x, y) {
    this.scene = scene;
    this.speed = 1;
    this.init(x, y);
  }

  init(x, y) {
    this.sprite = this.scene.matter.add.sprite(0, 0, "zombie", 0);

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const { width: w, height: h } = this.sprite;
    const mainBody = Bodies.rectangle(0, 0, w * 0.75, h * 0.75, {
      chamfer: { radius: 10 },
    });
    this.sensors = {
      top: Bodies.rectangle(0, -h * 0.35, w * 0.6, 2, { isSensor: true }),
      bottom: Bodies.rectangle(0, h * 0.35, w * 0.6, 2, { isSensor: true }),
      left: Bodies.rectangle(-w * 0.35, 0, 2, h * 0.6, { isSensor: true }),
      right: Bodies.rectangle(w * 0.4, 0, 2, h * 0.6, { isSensor: true }),
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
    this.sprite
      .setExistingBody(compoundBody)
      .setPosition(x, y)
      .setIgnoreGravity(true)
      .setOrigin(0.5, 0.55);
  }

  update(playerX, playerY) {
    const directionX = playerX - this.sprite.x;
    const directionY = playerY - this.sprite.y;

    const magnitude = Math.sqrt(
      directionX * directionX + directionY * directionY
    );
    const normalizedX = directionX / magnitude;
    const normalizedY = directionY / magnitude;

    this.sprite.setVelocity(normalizedX * this.speed, normalizedY * this.speed);

    const angle = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      playerX,
      playerY
    );
    
    this.sprite.setRotation(angle);

    const minX = this.sprite.width / 2;
    const maxX = this.scene.cameras.main.width - this.sprite.width / 2;
    const minY = this.sprite.height / 2;
    const maxY = this.scene.cameras.main.height - this.sprite.height / 2;

    this.sprite.x = Phaser.Math.Clamp(this.sprite.x, minX, maxX);
    this.sprite.y = Phaser.Math.Clamp(this.sprite.y, minY, maxY);
  }
}
