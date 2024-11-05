import Bullet from "./bullet";
import { PLAYER_CATEGORY, ZOMBIE_CATEGORY } from "../collisionCategories";

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.playerSpeed = 2;
    this.maxRange = 10;
    this.init(x, y);
    this.addControls();
  }

  init(x, y) {
    this.sprite = this.scene.matter.add.sprite(0, 0, "player", 0);
    this.sprite.setCollisionGroup(PLAYER_CATEGORY);
    this.sprite.setCollidesWith([ZOMBIE_CATEGORY]); 

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const { width: w, height: h } = this.sprite;
    const mainBody = Bodies.rectangle(0, 0, w * 0.6, h, {
      chamfer: { radius: 10 },
      label: "player",
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
      .setIgnoreGravity(true)
      .setPosition(x, y)
      .setOrigin(0.4, 0.6);
    this.reticle = this.scene.add.sprite(x, y, "target").setOrigin(0.5, 0.5);
    this.reticle.setDepth(10);
    this.addEvents();
  }

  addEvents() {
    this.scene.events.on("update", this.update, this);
    this.scene.events.on("shutdown", this.destroy, this);
  }

  destroy() {
    this.scene.events.off("update", this.update, this);
    this.scene.events.off("shutdown", this.destroy, this);

    this.sprite.destroy();
  }

  update() {
    let velocityX = 0;
    let velocityY = 0;

    if (this.D.isDown || this.cursor.right.isDown) {
      velocityX = this.playerSpeed;
    } else if (this.A.isDown || this.cursor.left.isDown) {
      velocityX = -this.playerSpeed;
    }

    if (this.S.isDown || this.cursor.down.isDown) {
      velocityY = this.playerSpeed;
    } else if (this.W.isDown || this.cursor.up.isDown) {
      velocityY = -this.playerSpeed;
    }

    this.sprite.setVelocity(velocityX, velocityY);

    const minX = this.sprite.width / 2;
    const maxX = this.scene.cameras.main.width - this.sprite.width / 2;
    const minY = this.sprite.height / 2;
    const maxY = this.scene.cameras.main.height - this.sprite.height / 2;

    this.sprite.x = Phaser.Math.Clamp(this.sprite.x, minX, maxX);
    this.sprite.y = Phaser.Math.Clamp(this.sprite.y, minY, maxY);

    const pointer = this.scene.input.activePointer;
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      pointer.x,
      pointer.y
    );
    this.sprite.setRotation(angle);

    this.reticle.setPosition(pointer.x, pointer.y);
  }

  addControls() {
    this.cursor = this.scene.input.keyboard.createCursorKeys();
    this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.scene.input.on(
      "pointermove",
      function (pointer) {
        if (this.scene.input.mouse.locked) {
          this.reticle.x += pointer.movementX;
          this.reticle.y += pointer.movementY;
        }
      },
      this
    );
  }
}
