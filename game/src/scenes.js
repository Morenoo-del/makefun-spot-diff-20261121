// scenes.js — the three original scenes of Double Take!, drawn entirely
// in code on canvas. Each scene is drawn twice: once plain (left panel)
// and once with its differences applied (right panel). A difference is
// a small, deliberate change — a missing gull, a recoloured sail —
// drawn by the same code, switched by the `variant` set.
//
// Panel space is 560 x 500 for every scene. Each scene exports:
//   draw(ctx, variant)  — paints the scene; variant is a Set of diff ids
//   diffs               — [{ id, x, y, label }] in panel coordinates
//   name, tagline, timeLimit

// --- small drawing helpers shared by the scenes -------------------------
function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function star(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = (i * Math.PI) / 5 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(ang) * rad;
    const py = y + Math.sin(ang) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.beginPath();
  ctx.arc(x, y, 16 * s, 0, Math.PI * 2);
  ctx.arc(x + 18 * s, y - 6 * s, 20 * s, 0, Math.PI * 2);
  ctx.arc(x + 38 * s, y, 15 * s, 0, Math.PI * 2);
  ctx.fill();
}

function gull(ctx, x, y, s, color = '#3a3f4a') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12 * s, y);
  ctx.quadraticCurveTo(x - 5 * s, y - 8 * s, x, y);
  ctx.quadraticCurveTo(x + 5 * s, y - 8 * s, x + 12 * s, y);
  ctx.stroke();
}

function flower(ctx, x, y, petal, center = '#ffdf6b') {
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5;
    circle(ctx, x + Math.cos(a) * 6, y + Math.sin(a) * 6, 5, petal);
  }
  circle(ctx, x, y, 4.5, center);
  line(ctx, x, y + 5, x, y + 18, '#2e7d32', 2.5);
}

// --- Scene 1: Lighthouse Cove (5 differences, 120 seconds) --------------
const coveDiffs = [
  { id: 'sun-rays', x: 85, y: 75, label: 'the sun lost its rays' },
  { id: 'gull-missing', x: 250, y: 95, label: 'a seagull flew away' },
  { id: 'window-lit', x: 400, y: 168, label: 'the lamp-room window went dark' },
  { id: 'sail-color', x: 150, y: 330, label: 'the boat sail changed colour' },
  { id: 'flower-color', x: 300, y: 470, label: 'a flower changed colour' },
];

function drawCove(ctx, variant) {
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#7ec8f7');
  sky.addColorStop(1, '#dff3ff');
  rect(ctx, 0, 0, 560, 300, sky);
  // Sun — rays vanish in the right panel
  circle(ctx, 85, 75, 34, '#ffd94a');
  circle(ctx, 85, 75, 26, '#ffea8a');
  if (!variant.has('sun-rays')) {
    ctx.strokeStyle = '#ffd94a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      line(ctx, 85 + Math.cos(a) * 40, 75 + Math.sin(a) * 40,
        85 + Math.cos(a) * 52, 75 + Math.sin(a) * 52, '#ffd94a', 4);
    }
  }
  cloud(ctx, 200, 60, 1);
  cloud(ctx, 380, 45, 0.8);
  cloud(ctx, 470, 100, 0.6);
  // Sea
  const sea = ctx.createLinearGradient(0, 300, 0, 500);
  sea.addColorStop(0, '#3d9bd6');
  sea.addColorStop(1, '#1f6fb2');
  rect(ctx, 0, 300, 560, 200, sea);
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 2;
  for (const [wx, wy, wl] of [[60, 330, 70], [300, 355, 90], [430, 335, 60], [180, 395, 80]]) {
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.quadraticCurveTo(wx + wl / 2, wy - 5, wx + wl, wy);
    ctx.stroke();
  }
  // Far cliffs
  poly(ctx, [[0, 300], [90, 250], [150, 300]], '#7d9b76');
  poly(ctx, [[470, 300], [520, 260], [560, 300]], '#7d9b76');
  // Lighthouse on its rock (right side)
  poly(ctx, [[350, 430], [450, 430], [435, 380], [365, 380]], '#8d7d6b');
  // Tower with red stripes
  poly(ctx, [[378, 380], [422, 380], [416, 190], [384, 190]], '#f5f0e6');
  rect(ctx, 380, 330, 40, 22, '#d94f3d');
  rect(ctx, 382, 262, 36, 22, '#d94f3d');
  // Lamp room — its window is lit in one panel, dark in the other
  rect(ctx, 380, 152, 40, 40, '#2f3a45');
  circle(ctx, 400, 168, 11, variant.has('window-lit') ? '#33414f' : '#ffe27a');
  rect(ctx, 374, 146, 52, 8, '#2f3a45');
  poly(ctx, [[374, 146], [426, 146], [400, 122]], '#d94f3d');
  // Light beam sweeping left
  ctx.save();
  ctx.globalAlpha = 0.25;
  poly(ctx, [[384, 168], [384, 178], [180, 205], [180, 140]], '#fff6b0');
  ctx.restore();
  // Boat with a sail that changes colour
  poly(ctx, [[120, 360], [185, 360], [172, 372], [132, 372]], '#6b4a2f');
  line(ctx, 152, 360, 152, 300, '#4a3220', 3);
  poly(ctx, [[154, 305], [154, 355], [196, 355]], variant.has('sail-color') ? '#2fa8a0' : '#e05244');
  poly(ctx, [[150, 312], [150, 355], [122, 355]], '#f5f0e6');
  // Rocks and beach
  poly(ctx, [[60, 430], [120, 410], [150, 430]], '#9a938a');
  poly(ctx, [[505, 445], [545, 425], [560, 445]], '#9a938a');
  const sand = ctx.createLinearGradient(0, 430, 0, 500);
  sand.addColorStop(0, '#f2ddab');
  sand.addColorStop(1, '#e3c98d');
  poly(ctx, [[0, 445], [150, 430], [420, 430], [560, 445], [560, 500], [0, 500]], sand);
  // Grass tufts and flowers on the beach
  line(ctx, 60, 452, 52, 438, '#2e7d32', 2.5);
  line(ctx, 60, 452, 60, 436, '#2e7d32', 2.5);
  line(ctx, 60, 452, 68, 438, '#2e7d32', 2.5);
  flower(ctx, 60, 462, '#b388eb');
  flower(ctx, 300, 470, variant.has('flower-color') ? '#e05244' : '#ffd94a');
  flower(ctx, 500, 462, '#ff8fb3');
  // Seagulls — the middle one is gone in the right panel
  gull(ctx, 180, 120, 1);
  if (!variant.has('gull-missing')) gull(ctx, 250, 95, 0.9);
  gull(ctx, 320, 130, 1.1);
}

export const sceneCove = {
  name: 'Lighthouse Cove',
  tagline: 'A sunny morning by the sea',
  timeLimit: 120,
  draw: drawCove,
  diffs: coveDiffs,
};

// --- Scene 2: Night Market (7 differences, 150 seconds) ----------------
const marketDiffs = [
  { id: 'moon-crater', x: 470, y: 70, label: 'the moon gained a crater' },
  { id: 'star-missing', x: 150, y: 50, label: 'a star went out' },
  { id: 'lantern-color', x: 300, y: 170, label: 'a lantern changed colour' },
  { id: 'cat-tail', x: 430, y: 398, label: 'the cat’s tail moved' },
  { id: 'crate-extra', x: 90, y: 418, label: 'an extra crate appeared' },
  { id: 'flag-color', x: 260, y: 205, label: 'a bunting flag changed colour' },
  { id: 'bulb-out', x: 280, y: 112, label: 'a string-light bulb went dark' },
];

function stall(ctx, x, y, w, awningA, awningB, goods) {
  // Wooden counter and posts
  rect(ctx, x, y + 110, w, 70, '#7a5230');
  rect(ctx, x + 4, y + 110, w - 8, 10, '#96683f');
  line(ctx, x + 8, y + 40, x + 8, y + 110, '#5d3d22', 5);
  line(ctx, x + w - 8, y + 40, x + w - 8, y + 110, '#5d3d22', 5);
  // Striped awning
  for (let i = 0; i < 6; i++) {
    rect(ctx, x + (i * w) / 6, y, w / 6, 42, i % 2 === 0 ? awningA : awningB);
  }
  poly(ctx, [[x, y + 42], [x + w, y + 42], [x + w - 6, y + 52], [x + 6, y + 52]], '#00000022');
  // Goods on the counter
  goods(ctx, x, y + 110);
}

function lantern(ctx, x, y, color, lit = true) {
  line(ctx, x, y - 22, x, y - 8, '#3a2a1a', 2);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 13, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.ellipse(x, y, 13, 16, 0, Math.PI * 0.15, Math.PI * 0.85);
  ctx.fill();
  rect(ctx, x - 6, y - 20, 12, 5, '#c9a227');
  rect(ctx, x - 6, y + 14, 12, 5, '#c9a227');
  if (lit) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    circle(ctx, x, y, 26, '#ffdf8a');
    ctx.restore();
  }
}

function drawMarket(ctx, variant) {
  // Night sky
  const sky = ctx.createLinearGradient(0, 0, 0, 500);
  sky.addColorStop(0, '#141b3d');
  sky.addColorStop(0.6, '#2c2a55');
  sky.addColorStop(1, '#4a2f5e');
  rect(ctx, 0, 0, 560, 500, sky);
  // Stars — one goes out in the right panel
  const stars = [[40, 40], [120, 80], [150, 50], [210, 35], [330, 60], [410, 35], [520, 110], [90, 130], [250, 90], [500, 45]];
  for (const [sx, sy] of stars) {
    if (variant.has('star-missing') && sx === 150 && sy === 50) continue;
    star(ctx, sx, sy, 4, '#ffeeb0');
  }
  // Moon — gains a crater in the right panel
  circle(ctx, 470, 70, 30, '#f4ead0');
  circle(ctx, 462, 62, 6, '#ddd0ae');
  circle(ctx, 480, 82, 4, '#ddd0ae');
  if (variant.has('moon-crater')) circle(ctx, 472, 58, 5, '#ddd0ae');
  // String lights sagging across the top
  ctx.strokeStyle = '#1c1420';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 118);
  ctx.quadraticCurveTo(280, 150, 560, 108);
  ctx.stroke();
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const bx = 20 + t * 520;
    const by = 118 + Math.sin(t * Math.PI) * 22 - t * 10;
    const lit = !(variant.has('bulb-out') && i === 4);
    const bulbColors = ['#ff5d5d', '#ffd94a', '#7ee081', '#6bb8ff'];
    line(ctx, bx, by - 8, bx, by, '#1c1420', 2);
    circle(ctx, bx, by + 4, 6, lit ? bulbColors[i % 4] : '#3a3340');
    if (lit) {
      ctx.save();
      ctx.globalAlpha = 0.35;
      circle(ctx, bx, by + 4, 11, bulbColors[i % 4]);
      ctx.restore();
    }
  }
  // Cobblestone ground
  rect(ctx, 0, 420, 560, 80, '#4b3a52');
  ctx.fillStyle = '#5d4a68';
  for (let gy = 0; gy < 3; gy++) {
    for (let gx = 0; gx < 10; gx++) {
      ctx.beginPath();
      ctx.ellipse(30 + gx * 56 + (gy % 2) * 24, 438 + gy * 22, 24, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Bunting flags between the stalls — one changes colour
  const flagColors = ['#ff5d5d', '#ffd94a', '#7ee081', '#6bb8ff', '#ff8fb3'];
  for (let i = 0; i < 7; i++) {
    const fx = 60 + i * 70;
    const fy = 196 + Math.sin((i / 6) * Math.PI) * 14;
    let c = flagColors[i % 5];
    if (variant.has('flag-color') && i === 3) c = '#ffd94a';
    poly(ctx, [[fx - 14, fy], [fx + 14, fy], [fx, fy + 22]], c);
  }
  // Three stalls
  stall(ctx, 40, 240, 140, '#d94f3d', '#f5f0e6', (c, x, y) => {
    circle(c, x + 25, y - 12, 10, '#ff7a3d');
    circle(c, x + 50, y - 12, 10, '#ff9f1c');
    circle(c, x + 75, y - 12, 10, '#e05244');
    circle(c, x + 105, y - 12, 10, '#7ee081');
    rect(c, x + 20, y - 4, 100, 8, '#8a5a2e');
  });
  stall(ctx, 210, 240, 140, '#2fa8a0', '#f5f0e6', (c, x, y) => {
    // Vendor behind the middle stall
    circle(c, x + 70, y - 58, 16, '#f2c89b');
    poly(c, [[x + 48, y - 42], [x + 92, y - 42], [x + 100, y], [x + 40, y]], '#7a4a8a');
    rect(c, x + 30, y - 14, 80, 16, '#c9a227');
    circle(c, x + 45, y - 20, 7, '#b5651d');
    circle(c, x + 65, y - 20, 7, '#8a5a2e');
    circle(c, x + 90, y - 20, 7, '#5d3d22');
  });
  stall(ctx, 380, 240, 140, '#e08a2e', '#f5f0e6', (c, x, y) => {
    rect(c, x + 20, y - 26, 22, 26, '#7ee081');
    rect(c, x + 50, y - 26, 22, 26, '#6bb8ff');
    rect(c, x + 80, y - 26, 22, 26, '#ff8fb3');
    rect(c, x + 35, y - 52, 22, 26, '#ffd94a');
    rect(c, x + 65, y - 52, 22, 26, '#ff5d5d');
  });
  // Hanging lanterns — the middle one changes colour
  lantern(ctx, 120, 190, '#e05244');
  lantern(ctx, 300, 182, variant.has('lantern-color') ? '#e05244' : '#2fa8a0');
  lantern(ctx, 480, 192, '#e05244');
  // Crates by the first stall — an extra one appears in the right panel
  rect(ctx, 55, 430, 46, 34, '#8a5a2e');
  rect(ctx, 105, 430, 46, 34, '#96683f');
  rect(ctx, 78, 398, 46, 32, '#7a5230');
  if (variant.has('crate-extra')) rect(ctx, 128, 398, 46, 32, '#8a5a2e');
  line(ctx, 55, 447, 101, 447, '#5d3d22', 2);
  line(ctx, 105, 447, 151, 447, '#5d3d22', 2);
  // The sleepy cat on a crate — its tail moves
  rect(ctx, 400, 428, 70, 36, '#96683f');
  ctx.fillStyle = '#3d3d5c';
  ctx.beginPath();
  ctx.ellipse(435, 420, 30, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, 462, 408, 11, '#3d3d5c');
  poly(ctx, [[456, 400], [460, 390], [464, 400]], '#3d3d5c');
  poly(ctx, [[464, 400], [468, 390], [472, 400]], '#3d3d5c');
  ctx.strokeStyle = '#3d3d5c';
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (variant.has('cat-tail')) {
    ctx.moveTo(408, 424);
    ctx.lineTo(392, 424);
  } else {
    ctx.moveTo(408, 424);
    ctx.quadraticCurveTo(392, 410, 396, 396);
  }
  ctx.stroke();
  // Cat's closed eye and whiskers
  ctx.strokeStyle = '#f4ead0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(464, 408, 3, Math.PI, Math.PI * 2);
  ctx.stroke();
}

export const sceneMarket = {
  name: 'Night Market',
  tagline: 'Lanterns, stalls and one sleepy cat',
  timeLimit: 150,
  draw: drawMarket,
  diffs: marketDiffs,
};

// --- Scene 3: Wizard's Study (10 differences, 180 seconds) -------------
const studyDiffs = [
  { id: 'book-color', x: 280, y: 112, label: 'a book spine changed colour' },
  { id: 'bottle-missing', x: 390, y: 306, label: 'a potion bottle vanished' },
  { id: 'candle-flame', x: 330, y: 288, label: 'the candle flame shrank' },
  { id: 'owl-eyes', x: 480, y: 288, label: 'the owl closed its eyes' },
  { id: 'rug-stripe', x: 180, y: 448, label: 'a rug stripe changed colour' },
  { id: 'hat-star', x: 482, y: 92, label: 'the star left the wizard hat' },
  { id: 'scroll-state', x: 452, y: 352, label: 'the scroll rolled itself up' },
  { id: 'window-moon', x: 112, y: 112, label: 'the moon left the window' },
  { id: 'potion-bubbles', x: 360, y: 308, label: 'the bubbles left the potion' },
  { id: 'quill-color', x: 502, y: 326, label: 'the quill changed colour' },
];

function bookshelfRow(ctx, x, y, w, colors) {
  const bw = w / colors.length;
  colors.forEach((c, i) => {
    const h = 34 + ((i * 7) % 12);
    rect(ctx, x + i * bw + 1, y + 44 - h, bw - 2, h, c);
    rect(ctx, x + i * bw + 3, y + 44 - h + 5, bw - 6, 2, 'rgba(255,255,255,0.35)');
  });
  rect(ctx, x - 4, y + 44, w + 8, 8, '#5d3d22');
}

function potionBottle(ctx, x, y, liquid, bubbles) {
  ctx.fillStyle = 'rgba(220,235,255,0.75)';
  ctx.beginPath();
  ctx.moveTo(x - 9, y);
  ctx.lineTo(x - 9, y - 22);
  ctx.lineTo(x - 4, y - 28);
  ctx.lineTo(x + 4, y - 28);
  ctx.lineTo(x + 9, y - 22);
  ctx.lineTo(x + 9, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = liquid;
  ctx.fillRect(x - 8, y - 12, 16, 11);
  if (bubbles) {
    circle(ctx, x - 3, y - 6, 2.5, 'rgba(255,255,255,0.85)');
    circle(ctx, x + 4, y - 3, 2, 'rgba(255,255,255,0.85)');
    circle(ctx, x, y - 10, 1.8, 'rgba(255,255,255,0.85)');
  }
  rect(ctx, x - 5, y - 32, 10, 5, '#8a5a2e');
}

function drawStudy(ctx, variant) {
  // Wall and wooden floor
  const wall = ctx.createLinearGradient(0, 0, 0, 400);
  wall.addColorStop(0, '#5b3a5e');
  wall.addColorStop(1, '#3d2a4a');
  rect(ctx, 0, 0, 560, 400, wall);
  rect(ctx, 0, 400, 560, 100, '#6b4a2f');
  ctx.fillStyle = '#5d3d22';
  for (let i = 0; i < 5; i++) rect(ctx, 0, 418 + i * 17, 560, 2, '#5d3d22');
  // Window with the night sky — the moon leaves in the right panel
  rect(ctx, 56, 56, 116, 150, '#3a2a1a');
  rect(ctx, 64, 64, 100, 134, '#141b3d');
  star(ctx, 90, 90, 4, '#ffeeb0');
  star(ctx, 140, 80, 3.5, '#ffeeb0');
  star(ctx, 105, 140, 3, '#ffeeb0');
  star(ctx, 150, 150, 4, '#ffeeb0');
  if (!variant.has('window-moon')) {
    circle(ctx, 112, 112, 18, '#f4ead0');
    circle(ctx, 107, 107, 3.5, '#ddd0ae');
  }
  line(ctx, 114, 64, 114, 198, '#3a2a1a', 6);
  line(ctx, 64, 131, 164, 131, '#3a2a1a', 6);
  // Bookshelf with three rows of books
  rect(ctx, 226, 46, 190, 220, '#4a3220');
  bookshelfRow(ctx, 234, 60, 174, ['#d94f3d', '#2fa8a0', '#e0a52e', '#7a4a8a', '#3d6fb2', '#e05244']);
  bookshelfRow(ctx, 234, 112, 174, [
    '#3d6fb2',
    variant.has('book-color') ? '#2fa8a0' : '#d94f3d',
    '#e0a52e', '#7ee081', '#ff8fb3', '#96683f',
  ]);
  bookshelfRow(ctx, 234, 164, 174, ['#7a4a8a', '#e0a52e', '#2fa8a0', '#d94f3d', '#3d6fb2', '#ff9f1c']);
  // Wizard hat hanging on a hook — its star vanishes in the right panel
  line(ctx, 480, 60, 480, 78, '#c9a227', 3);
  poly(ctx, [[448, 128], [516, 128], [486, 66], [474, 66]], '#5b3a8a');
  ctx.beginPath();
  ctx.ellipse(482, 128, 44, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#5b3a8a';
  ctx.fill();
  rect(ctx, 470, 108, 24, 10, '#ffd94a');
  if (!variant.has('hat-star')) star(ctx, 482, 92, 8, '#ffd94a');
  // Rug on the floor — one stripe changes colour
  ctx.fillStyle = '#8a2f3d';
  ctx.beginPath();
  ctx.ellipse(180, 448, 110, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = variant.has('rug-stripe') ? '#7ee081' : '#ffd94a';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(180, 448, 82, 20, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#f5f0e6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(180, 448, 54, 12, 0, 0, Math.PI * 2);
  ctx.stroke();
  // The cat asleep on the rug
  ctx.fillStyle = '#e08a2e';
  ctx.beginPath();
  ctx.ellipse(180, 440, 26, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, 202, 432, 9, '#e08a2e');
  poly(ctx, [[197, 426], [200, 417], [204, 426]], '#e08a2e');
  // Desk
  rect(ctx, 300, 330, 240, 16, '#7a5230');
  rect(ctx, 310, 346, 14, 60, '#5d3d22');
  rect(ctx, 516, 346, 14, 60, '#5d3d22');
  // Candle — its flame shrinks in the right panel
  rect(ctx, 324, 306, 12, 24, '#f5f0e6');
  ctx.fillStyle = variant.has('candle-flame') ? '#ff9f1c' : '#ffcf3d';
  ctx.beginPath();
  if (variant.has('candle-flame')) {
    ctx.ellipse(330, 296, 4, 7, 0, 0, Math.PI * 2);
  } else {
    ctx.moveTo(330, 276);
    ctx.quadraticCurveTo(338, 290, 330, 300);
    ctx.quadraticCurveTo(322, 290, 330, 276);
  }
  ctx.fill();
  ctx.save();
  ctx.globalAlpha = 0.18;
  circle(ctx, 330, 290, 26, '#ffdf8a');
  ctx.restore();
  // Potion bottles — the middle one vanishes, the first loses its bubbles
  potionBottle(ctx, 360, 330, '#7ee081', !variant.has('potion-bubbles'));
  if (!variant.has('bottle-missing')) potionBottle(ctx, 390, 330, '#ff5d8f', true);
  potionBottle(ctx, 420, 330, '#6bb8ff', true);
  // Scroll — open in one panel, rolled in the other
  if (variant.has('scroll-state')) {
    rect(ctx, 438, 340, 30, 12, '#f2e6c8');
    circle(ctx, 438, 346, 6, '#e3d3a8');
    circle(ctx, 468, 346, 6, '#e3d3a8');
  } else {
    rect(ctx, 436, 338, 34, 16, '#f2e6c8');
    line(ctx, 442, 344, 464, 344, '#3d2a4a', 1.5);
    line(ctx, 442, 349, 458, 349, '#3d2a4a', 1.5);
    circle(ctx, 436, 346, 4, '#c9a227');
    circle(ctx, 470, 346, 4, '#c9a227');
  }
  // Quill in its inkpot — the feather changes colour
  circle(ctx, 500, 340, 7, '#2f2a3a');
  ctx.strokeStyle = variant.has('quill-color') ? '#6bb8ff' : '#f5f0e6';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(502, 338);
  ctx.quadraticCurveTo(512, 318, 508, 306);
  ctx.stroke();
  line(ctx, 502, 338, 508, 306, '#c9a227', 1.5);
  // The owl on its perch — eyes open in one panel, closed in the other
  line(ctx, 480, 330, 480, 306, '#5d3d22', 5);
  line(ctx, 462, 330, 498, 330, '#5d3d22', 5);
  ctx.fillStyle = '#6b4a2f';
  ctx.beginPath();
  ctx.ellipse(480, 288, 20, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, 480, 262, 15, '#6b4a2f');
  poly(ctx, [[468, 250], [472, 240], [476, 250]], '#6b4a2f');
  poly(ctx, [[484, 250], [488, 240], [492, 250]], '#6b4a2f');
  if (variant.has('owl-eyes')) {
    ctx.strokeStyle = '#2f2a3a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(473, 262, 4, Math.PI * 0.1, Math.PI * 0.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(487, 262, 4, Math.PI * 0.1, Math.PI * 0.9);
    ctx.stroke();
  } else {
    circle(ctx, 473, 262, 4.5, '#ffd94a');
    circle(ctx, 487, 262, 4.5, '#ffd94a');
    circle(ctx, 473, 262, 2, '#2f2a3a');
    circle(ctx, 487, 262, 2, '#2f2a3a');
  }
  poly(ctx, [[480, 268], [477, 273], [483, 273]], '#e0a52e');
  ctx.fillStyle = '#8a5a2e';
  ctx.beginPath();
  ctx.ellipse(480, 296, 12, 10, 0, 0, Math.PI * 2);
  ctx.fill();
}

export const sceneStudy = {
  name: 'Wizard’s Study',
  tagline: 'Potions, books and a watchful owl',
  timeLimit: 180,
  draw: drawStudy,
  diffs: studyDiffs,
};

// The scenes in play order: rising difficulty, 5 then 7 then 10.
export const SCENES = [sceneCove, sceneMarket, sceneStudy];
