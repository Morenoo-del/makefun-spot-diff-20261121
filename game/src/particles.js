// Particles — the little bursts and expanding rings that make a found
// difference feel good. Everything is drawn in canvas, no images.
export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.rings = [];
  }

  // A star burst plus an expanding ring at (x, y) in game coordinates.
  burst(x, y, color = '#ffd166') {
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 60 + Math.random() * 160;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        life: 0.55 + Math.random() * 0.35,
        age: 0,
        size: 3 + Math.random() * 4,
        color: i % 3 === 0 ? '#ffffff' : color,
      });
    }
    this.rings.push({ x, y, age: 0, life: 0.5, maxR: 46, color });
  }

  // A golden shower across the whole play area for a cleared level.
  celebrate() {
    const colors = ['#ffd166', '#2fa8a0', '#ff8fb3', '#7ee081', '#ffffff'];
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: 40 + Math.random() * 1200,
        y: 120 + Math.random() * 80,
        vx: (Math.random() - 0.5) * 60,
        vy: 40 + Math.random() * 120,
        life: 0.9 + Math.random() * 0.6,
        age: 0,
        size: 3 + Math.random() * 4,
        color: colors[i % colors.length],
      });
    }
  }

  // A small red puff where a wrong click landed.
  puff(x, y) {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 30 + Math.random() * 60;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.35,
        age: 0,
        size: 3 + Math.random() * 3,
        color: '#ff6b6b',
      });
    }
  }

  update(dt) {
    for (const p of this.particles) {
      p.age += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 260 * dt;
      p.vx *= 0.98;
    }
    this.particles = this.particles.filter((p) => p.age < p.life);
    for (const r of this.rings) r.age += dt;
    this.rings = this.rings.filter((r) => r.age < r.life);
  }

  draw(ctx) {
    for (const r of this.rings) {
      const t = r.age / r.life;
      ctx.save();
      ctx.globalAlpha = 1 - t;
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 4 * (1 - t) + 1;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 8 + t * r.maxR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    for (const p of this.particles) {
      const t = p.age / p.life;
      ctx.save();
      ctx.globalAlpha = 1 - t;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 - t * 0.5), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  clear() {
    this.particles = [];
    this.rings = [];
  }
}
