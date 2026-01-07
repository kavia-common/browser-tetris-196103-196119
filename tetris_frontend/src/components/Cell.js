import React from 'react';
import { PIECE_COLORS } from '../game/pieces';

// PUBLIC_INTERFACE
function Cell({ value, ghost }) {
  /** Single board cell. `value` is a piece type (e.g., 'T') or null; `ghost` outlines landing position. */
  const filled = value != null;
  const color = filled ? PIECE_COLORS[value] : undefined;

  const className = [
    'cell',
    filled ? 'cellFilled' : '',
    ghost ? 'cellGhost' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={className}
      style={color ? { '--cellColor': color } : undefined}
      aria-hidden="true"
    />
  );
}

export default Cell;
