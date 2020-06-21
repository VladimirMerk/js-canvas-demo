import F from './functions.js';
const PI2 = Math.PI * 2;
export default class Dot {
  constructor({
    position = { x: 0, y: 0 },
    radius = { min: 6, max: 20 },
    massFactor = 0.002,
    color = 'rgba(250, 30, 10, 0.9)',
    life = -1
  } = {}) {
    this.position = position;
    this.color = color;
    this.velocity = { x: 0, y: 0 };
    this.radius = F.random(radius.min, radius.max);
    this.mass = this.radius * massFactor;
    this.life = life;
  }

  draw(ctx) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.createCircle({ ctx, fill: true });
    this.createCircle({ ctx, fill: false });
  }

  isDead() {
    return this.life === 0;
  }

  wearOut(dt) {
    if (this.life === -1) return;
    this.life -= dt;
    if (this.life < 0) this.life = 0;
  }

  createCircle({ ctx, fill = true }) {
    ctx.fillStyle = ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, PI2);
    ctx.closePath();
    fill ? ctx.fill() : ctx.stroke();
  }
}
