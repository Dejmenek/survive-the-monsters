import {
  ZOMBIE_CATEGORY,
  PLAYER_CATEGORY,
  BULLET_CATEGORY,
} from "../collisionCategories.js";
import HealthBar from "./healthBar.js";

export default class Zombie {
  constructor(scene, x, y) {
    this.scene = scene;
    this.speed = 1;
    this.health = 3;
    this.init(x, y);
    this.scene.events.on("update", this.update, this);
    this.healthBar = new HealthBar(scene, x, y - 30, this.health);
  }

  init(x, y) {
    this.sprite = this.scene.matter.add.sprite(0, 0, "zombie", 0);
    this.sprite.setData("instance", this);

    this.sprite.setCollisionGroup(ZOMBIE_CATEGORY);
    this.sprite.setCollidesWith([PLAYER_CATEGORY, BULLET_CATEGORY]);

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const { width: w, height: h } = this.sprite;
    const mainBody = Bodies.rectangle(0, 0, w * 0.75, h * 0.75, {
      chamfer: { radius: 10 },
      label: "zombie",
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
      .setIgnoreGravity(true)
      .setOrigin(0.5, 0.55);
  }

  takeDamage() {
    this.health--;
    this.healthBar.updateHealthBar();

    if (this.health <= 0) this.destroy();
  }

  update(playerX, playerY) {
    if (!this.sprite) return;
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

    this.healthBar.setPosition(this.sprite.x, this.sprite.y - 30);
  }

  destroy() {
    this.scene.events.off("update", this.update, this);
    this.scene.removeZombie(this);
    this.sprite.destroy();
    this.healthBar.removeHealthBar();
    this.sprite = null;
  }
}
