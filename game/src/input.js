// input.js — mouse and keyboard input, translated from screen pixels
// into the game's 1280 x 800 space, then into clicks on panels,
// buttons, and the keys H (hint), R (restart) and Enter (start / next).
import {
  DIFF_HIT_RADIUS,
  GAME_HEIGHT,
  GAME_WIDTH,
  LEFT_PANEL_X,
  PANEL_HEIGHT,
  PANEL_TOP,
  PANEL_WIDTH,
  RIGHT_PANEL_X,
} from './config.js';
import { SCREENS } from './state.js';

export class InputHandler {
  constructor(canvas, game) {
    this.canvas = canvas;
    this.game = game;
    canvas.addEventListener('pointerdown', (e) => this.onPointer(e));
    window.addEventListener('keydown', (e) => this.onKey(e));
  }

  // The canvas fills the window, so a click maps by scale.
  toGameCoords(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * GAME_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * GAME_HEIGHT,
    };
  }

  onPointer(event) {
    const { x, y } = this.toGameCoords(event);
    this.game.handlePointer(x, y);
  }

  onKey(event) {
    const key = event.key.toLowerCase();
    const state = this.game.state;
    if (key === 'enter' || key === ' ') {
      event.preventDefault();
      if (state.screen === SCREENS.START) this.game.startGame();
      else if (state.screen === SCREENS.LEVEL_CLEAR) this.game.nextScene();
      else if (state.screen === SCREENS.VICTORY || state.screen === SCREENS.TIME_UP) this.game.restart();
      return;
    }
    // N advances from a cleared level, R retries a failed one — the
    // same keys the buttons offer, for players who never touch a mouse.
    if (key === 'n' && state.screen === SCREENS.LEVEL_CLEAR) {
      this.game.nextScene();
      return;
    }
    if (key === 'r' && (state.screen === SCREENS.TIME_UP || state.screen === SCREENS.VICTORY)) {
      this.game.restart();
      return;
    }
    if (state.screen !== SCREENS.PLAY) return;
    if (key === 'h') this.game.useHint();
    if (key === 'r') this.game.restartScene();
    if (key === 'm') this.game.toggleMute();
  }
}

// Find the unfound difference nearest to a panel click, if any.
export function pickDifference(state, panelX, panelY) {
  let best = null;
  let bestDist = DIFF_HIT_RADIUS;
  for (const diff of state.scene.diffs) {
    if (state.found.has(diff.id)) continue;
    const dx = panelX - diff.x;
    const dy = panelY - diff.y;
    const dist = Math.hypot(dx, dy);
    if (dist < bestDist) {
      bestDist = dist;
      best = diff;
    }
  }
  return best;
}

// Which panel (if either) a game-space point falls in, and the point
// translated into that panel's local coordinates.
export function panelAt(x, y) {
  if (y < PANEL_TOP || y > PANEL_TOP + PANEL_HEIGHT) return null;
  if (x >= LEFT_PANEL_X && x <= LEFT_PANEL_X + PANEL_WIDTH) {
    return { side: 'left', px: x - LEFT_PANEL_X, py: y - PANEL_TOP };
  }
  if (x >= RIGHT_PANEL_X && x <= RIGHT_PANEL_X + PANEL_WIDTH) {
    return { side: 'right', px: x - RIGHT_PANEL_X, py: y - PANEL_TOP };
  }
  return null;
}

export { GAME_HEIGHT, GAME_WIDTH };
