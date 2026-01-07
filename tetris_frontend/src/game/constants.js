export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

/**
 * DAS/ARR are intentionally omitted to keep controls simple/lightweight.
 * All timings are based on a fixed game tick.
 */
export const START_LEVEL = 1;

export const LINES_PER_LEVEL = 10;

/**
 * Scoring (classic guideline-ish):
 * Single: 100, Double: 300, Triple: 500, Tetris: 800 multiplied by level.
 */
export const LINE_CLEAR_SCORES = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

export const SOFT_DROP_POINTS_PER_CELL = 1;
export const HARD_DROP_POINTS_PER_CELL = 2;

/**
 * Drop speed in ms per row tick, based on level (simple curve).
 * Clamped so higher levels remain playable.
 */
export function getDropIntervalMs(level) {
  const base = 800; // ms at level 1
  const min = 80;
  const factor = 0.86;
  const interval = Math.round(base * Math.pow(factor, Math.max(0, level - 1)));
  return Math.max(min, interval);
}
