// state.js — the whole game state in one small object: which scene is
// up, which differences are found, the score, the combo, the timer,
// the hints, and the screen the player is looking at.
import {
  COMBO_BONUS_CAP,
  HINTS_PER_LEVEL,
  POINTS_PER_COMBO_STEP,
  POINTS_PER_FIND,
  POINTS_PER_HINT,
  POINTS_PER_SECOND_LEFT,
  SCENE_META,
  WRONG_CLICK_TIME_PENALTY,
} from './config.js';
import { SCENES } from './scenes.js';

export const SCREENS = {
  START: 'start',
  PLAY: 'play',
  LEVEL_CLEAR: 'levelclear',
  TIME_UP: 'timeout',
  VICTORY: 'victory',
};

export class GameState {
  constructor() {
    this.resetAll();
  }

  resetAll() {
    this.screen = SCREENS.START;
    this.sceneIndex = 0;
    this.score = 0;
    this.totalFound = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.timeLeft = SCENES[0].timeLimit;
    this.found = new Set();
    this.hintTarget = null; // diff id currently highlighted by a hint
    this.hintUntil = 0;
    this.wrongFlashes = []; // {x, y, age} in game coordinates
    this.shakeUntil = 0;
    this.lastTickSecond = -1;
    this.levelBonus = 0;
    this.message = '';
    this.messageUntil = 0;
  }

  get scene() {
    return SCENES[this.sceneIndex];
  }

  get meta() {
    return SCENE_META[this.sceneIndex];
  }

  startScene(index, preFound = 0) {
    this.sceneIndex = index;
    this.screen = SCREENS.PLAY;
    this.timeLeft = this.scene.timeLimit;
    this.found = new Set();
    this.combo = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.hintTarget = null;
    this.wrongFlashes = [];
    this.levelBonus = 0;
    this.message = '';
    // Staging hook for screenshots: start with some differences already
    // found, rendered by the game's own code.
    for (let i = 0; i < preFound && i < this.scene.diffs.length; i++) {
      this.found.add(this.scene.diffs[i].id);
      this.totalFound++;
    }
    if (preFound > 0) this.score += preFound * POINTS_PER_FIND;
  }

  startGame() {
    this.score = 0;
    this.totalFound = 0;
    this.bestCombo = 0;
    this.startScene(0);
  }

  foundCount() {
    return this.found.size;
  }

  remainingCount() {
    return this.scene.diffs.length - this.found.size;
  }

  isLevelDone() {
    return this.found.size === this.scene.diffs.length;
  }

  // Returns the diff that was found, or null for a wrong click.
  registerClick(diff) {
    if (!diff) {
      this.combo = 0;
      this.timeLeft = Math.max(0, this.timeLeft - WRONG_CLICK_TIME_PENALTY);
      this.shakeUntil = performance.now() + 220;
      return null;
    }
    this.found.add(diff.id);
    this.combo++;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    this.totalFound++;
    const gained = POINTS_PER_FIND + Math.min(this.combo - 1, COMBO_BONUS_CAP) * POINTS_PER_COMBO_STEP;
    this.score += gained;
    if (this.isLevelDone()) {
      this.levelBonus = Math.round(this.timeLeft) * POINTS_PER_SECOND_LEFT;
      this.score += this.levelBonus;
      this.screen = this.sceneIndex + 1 >= SCENES.length ? SCREENS.VICTORY : SCREENS.LEVEL_CLEAR;
    }
    return { diff, gained };
  }

  useHint(now) {
    if (this.hintsLeft <= 0 || this.screen !== SCREENS.PLAY) return null;
    const unfound = this.scene.diffs.filter((d) => !this.found.has(d.id));
    if (unfound.length === 0) return null;
    this.hintsLeft--;
    this.score = Math.max(0, this.score + POINTS_PER_HINT);
    // Any unfound difference may be the hint's target, so repeated
    // hints do not always point at the same corner of the picture.
    const target = unfound[Math.floor(Math.random() * unfound.length)];
    this.hintTarget = target.id;
    this.hintUntil = now + 3000;
    return target;
  }

  nextScene() {
    this.startScene(this.sceneIndex + 1);
  }

  flashMessage(text, now, ms = 1600) {
    this.message = text;
    this.messageUntil = now + ms;
  }

  tick(dt, now) {
    if (this.screen !== SCREENS.PLAY) return;
    this.timeLeft -= dt;
    const whole = Math.ceil(this.timeLeft);
    if (whole <= 10 && whole !== this.lastTickSecond && whole > 0) {
      this.lastTickSecond = whole;
      return 'tick';
    }
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.screen = SCREENS.TIME_UP;
      return 'timeout';
    }
    return null;
  }
}
