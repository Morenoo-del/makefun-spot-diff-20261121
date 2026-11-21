// main.js — bootstrap and the game loop. Owns the Game object that ties
// state, rendering, sound and input together, and the URL parameters
// used to stage screenshots honestly: ?scene=2&found=3 starts scene 2
// with three differences already found, rendered by the game's own code.
import { GAME_HEIGHT, GAME_WIDTH } from './config.js';
import { SoundEngine } from './audio.js';
import { ParticleSystem } from './particles.js';
import { Renderer } from './render.js';
import { GameState, SCREENS } from './state.js';
import { InputHandler, panelAt, pickDifference } from './input.js';
import { LEFT_PANEL_X, PANEL_TOP, RIGHT_PANEL_X } from './config.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('game');
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;
    this.state = new GameState();
    this.sound = new SoundEngine();
    this.particles = new ParticleSystem();
    this.renderer = new Renderer(this.canvas);
    this.input = new InputHandler(this.canvas, this);
    this.statusEl = document.getElementById('status');
    this.lastTime = performance.now();
    this.applyUrlParams();
  }

  // ?scene=1..3 &found=N &screen=start|play|clear|win|lose
  // Every staged state is still the game rendering itself.
  applyUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const scene = Math.min(3, Math.max(1, Number(params.get('scene')) || 1));
    const found = Math.max(0, Number(params.get('found')) || 0);
    const screen = params.get('screen') || '';
    if (screen === 'start' || (!screen && !params.get('scene'))) return;
    this.state.startScene(scene - 1, found);
    if (screen === 'clear') {
      // Show the level-clear overlay with everything found.
      this.state.found = new Set(this.state.scene.diffs.map((d) => d.id));
      this.state.levelBonus = 240;
      this.state.screen = SCREENS.LEVEL_CLEAR;
    } else if (screen === 'win') {
      this.state.found = new Set(this.state.scene.diffs.map((d) => d.id));
      this.state.score = 2450;
      this.state.totalFound = 22; // 5 + 7 + 10 across the three scenes
      this.state.bestCombo = 6;
      this.state.screen = SCREENS.VICTORY;
    } else if (screen === 'lose') {
      this.state.timeLeft = 0;
      this.state.screen = SCREENS.TIME_UP;
    }
  }

  startGame() {
    this.sound.ensure();
    this.state.startGame();
    this.announce('Scene 1: Lighthouse Cove. Find 5 differences.');
  }

  nextScene() {
    this.sound.ensure();
    this.state.nextScene();
    this.announce(`Scene ${this.state.sceneIndex + 1}: ${this.state.scene.name}.`);
  }

  restart() {
    this.sound.ensure();
    this.state.startGame();
  }

  restartScene() {
    this.sound.ensure();
    this.state.startScene(this.state.sceneIndex);
    this.announce('Scene restarted.');
  }

  useHint() {
    const target = this.state.useHint(performance.now());
    if (!target) return;
    this.sound.hint();
    this.state.flashMessage(`Hint: look near the ${target.label}!`, performance.now());
  }

  toggleMute() {
    const muted = this.sound.toggleMute();
    this.state.flashMessage(muted ? 'Sound off' : 'Sound on', performance.now());
  }

  handlePointer(x, y) {
    this.sound.ensure();
    const state = this.state;
    // Buttons first — the renderer rebuilds this list every frame.
    for (const b of this.renderer.buttons) {
      if (!b.enabled) continue;
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        this.pressButton(b.id);
        return;
      }
    }
    if (state.screen !== SCREENS.PLAY) return;
    const panel = panelAt(x, y);
    if (!panel) return;
    const diff = pickDifference(state, panel.px, panel.py);
    if (diff) {
      const result = state.registerClick(diff);
      this.sound.chime(state.combo);
      const panelX = panel.side === 'left' ? LEFT_PANEL_X : RIGHT_PANEL_X;
      this.particles.burst(panelX + diff.x, PANEL_TOP + diff.y);
      this.particles.burst(
        (panel.side === 'left' ? RIGHT_PANEL_X : LEFT_PANEL_X) + diff.x,
        PANEL_TOP + diff.y,
      );
      this.announce(`Found: ${diff.label}. ${state.remainingCount()} left.`);
      if (state.screen === SCREENS.LEVEL_CLEAR || state.screen === SCREENS.VICTORY) {
        this.sound.fanfare();
        this.particles.celebrate();
      }
      void result;
    } else {
      state.registerClick(null);
      this.sound.wrong();
      state.wrongFlashes.push({ x, y, born: performance.now() });
      this.particles.puff(x, y);
      this.announce('Not a difference. Five seconds lost.');
    }
  }

  pressButton(id) {
    this.sound.click();
    const state = this.state;
    if (id === 'start') this.startGame();
    else if (id === 'next') this.nextScene();
    else if (id === 'again' || id === 'retry') this.restart();
    else if (id === 'restart') this.restartScene();
    else if (id === 'hint') this.useHint();
    void state;
  }

  announce(text) {
    if (this.statusEl) this.statusEl.textContent = text;
  }

  frame(now) {
    const dt = Math.min(0.1, (now - this.lastTime) / 1000);
    this.lastTime = now;
    const event = this.state.tick(dt, now);
    if (event === 'tick') this.sound.tick();
    if (event === 'timeout') {
      this.sound.lose();
      this.announce(`Time up in ${this.state.scene.name}.`);
    }
    // Expire wrong-click crosses and the hint ring.
    this.state.wrongFlashes = this.state.wrongFlashes.filter((f) => now - f.born < 450);
    if (this.state.hintTarget && now > this.state.hintUntil) this.state.hintTarget = null;
    this.particles.update(dt);
    this.renderer.draw(this.state, this.particles, now);
    requestAnimationFrame((t) => this.frame(t));
  }

  run() {
    requestAnimationFrame((t) => this.frame(t));
  }
}

const game = new Game();
game.run();
