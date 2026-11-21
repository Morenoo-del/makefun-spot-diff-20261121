// Shared constants for Double Take! — one place for every number the
// other modules agree on: the canvas size, the panel geometry, the
// scoring rules and the per-scene time limits.
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 800;

export const PANEL_WIDTH = 560;
export const PANEL_HEIGHT = 500;
export const PANEL_TOP = 118;
export const LEFT_PANEL_X = 40;
export const RIGHT_PANEL_X = 680;
export const PANEL_GAP_LABEL = 'RIGHT';

export const POINTS_PER_FIND = 100;
export const POINTS_PER_COMBO_STEP = 25;
export const POINTS_PER_HINT = -25;
export const POINTS_PER_SECOND_LEFT = 10;
export const WRONG_CLICK_TIME_PENALTY = 5;
export const HINTS_PER_LEVEL = 3;
export const HINT_REVEAL_MS = 3000;
// Below this many seconds the timer bar turns red and ticks audibly.
export const TIMER_URGENT_SECONDS = 20;
// The combo bonus stops growing past this streak, so one long streak
// cannot swamp the score from actually finishing scenes.
export const COMBO_BONUS_CAP = 6;

export const SCENE_META = [
  { name: 'Lighthouse Cove', tagline: 'A sunny morning by the sea', timeLimit: 120, diffs: 5 },
  { name: 'Night Market', tagline: 'Lanterns, stalls and one sleepy cat', timeLimit: 150, diffs: 7 },
  { name: 'Wizard’s Study', tagline: 'Potions, books and a watchful owl', timeLimit: 180, diffs: 10 },
];

// Difference hit radius in panel pixels. Generous on purpose: a click
// near a difference should count, a click far from one should not.
export const DIFF_HIT_RADIUS = 34;
export const DIFF_MARKER_RADIUS = 26;
