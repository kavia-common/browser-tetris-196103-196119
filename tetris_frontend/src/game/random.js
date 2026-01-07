import { PIECE_TYPES } from './pieces';

// PUBLIC_INTERFACE
export function make7Bag(rng = Math.random) {
  /** Returns a new shuffled array containing each tetromino exactly once. */
  const bag = PIECE_TYPES.slice();
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}
