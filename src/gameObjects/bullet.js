import { BULLET_CATEGORY, ZOMBIE_CATEGORY } from "../collisionCategories";

export default class Bullet {
  constructor(scene) {
    this.scene = scene;
    this.speed = 1;
    this.born = 0;
    this.direction = 0;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.scene.events.on("update", this.update, this);
  }

  create(x, y) {
    this.sprite = this.scene.matter.add.sprite(x, y, "bullet", 0);
    this.sprite.setCollisionGroup(BULLET_CATEGORY);
    this.sprite.setCollidesWith([ZOMBIE_CATEGORY]);
    this.sprite.setData("instance", this);

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const { width: w, height: h } = this.sprite;
    const mainBody = Bodies.rectangle(0, 0, w * 0.6, h, {
      chamfer: { radius: 10 },
      label: "bullet",
    });

    const compoundBody = Body.create({
      parts: [mainBody],
      frictionStatic: 0,
      frictionAir: 0.02,
      friction: 0.1,
      render: { sprite: { xOffset: 0.5, yOffset: 0.5 } },
    });

    this.sprite
      .setExistingBody(compoundBody)
      .setPosition(x, y)
      .setOrigin(0.5, 0.5)
      .setIgnoreGravity(true);
  }

  fire(shooter, target) {
    const offsetDistance = 30;

    const spawnX = shooter.x + Math.cos(shooter.rotation) * offsetDistance;
    const spawnY = shooter.y + Math.sin(shooter.rotation) * offsetDistance;
    this.create(spawnX, spawnY);
    this.direction = Phaser.Math.Angle.Between(
      shooter.x,
      shooter.y,
      target.x,
      target.y
    );

    this.xSpeed = this.speed * Math.cos(this.direction);
    this.ySpeed = this.speed * Math.sin(this.direction);

    this.sprite.setRotation(this.direction);
    this.born = 0;
  }

  update(time, delta) {
    if (!this.sprite) return;
    this.sprite.x += this.xSpeed * delta;
    this.sprite.y += this.ySpeed * delta;
    this.born += delta;

    if (this.born > 1200) {
      this.destroy();
    }
  }

  destroy() {
    this.scene.events.off("update", this.update, this);
    this.scene.removeBullet(this);
    this.sprite.destroy();
    this.sprite = null;
  }
}
