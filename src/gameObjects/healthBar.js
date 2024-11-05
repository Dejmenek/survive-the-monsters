export default class HealthBar {
  constructor(scene, x, y, segments) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.segments = segments;
    this.healthSegments = [];

    this.createHealthBar();
    this.createHealthSegments();
  }

  createHealthBar() {
    this.healthBar = this.scene.add.container(this.x, this.y);
  }

  setPosition(x, y) {
    this.healthBar.setPosition(x, y);
  }

  createHealthSegments() {
    for (let i = 0; i < this.segments; i++) {
      const offsetX = (i - (this.segments - 1) / 2) * 22;
      const segment = this.createHealthSegment(offsetX, 0xff0000);
      this.healthSegments.push(segment);
      this.healthBar.add(segment);
    }
  }

  createHealthSegment(offsetX, color) {
    const segment = this.scene.add.graphics();
    segment.fillStyle(color, 1);
    segment.fillRect(offsetX, 0, 20, 6);
    return segment;
  }

  updateHealthBar() {
    const segment = this.healthSegments.pop();
    segment.destroy();
  }

  removeHealthBar() {
    this.healthSegments.forEach(segment => segment.destroy());
    this.healthSegments = [];
  }
}
