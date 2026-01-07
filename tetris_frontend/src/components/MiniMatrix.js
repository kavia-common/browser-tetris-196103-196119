import React from 'react';
import { getPieceSpawnMatrix, PIECE_COLORS } from '../game/pieces';

// PUBLIC_INTERFACE
function MiniMatrix({ type }) {
  /** 4x4 mini preview for a given tetromino type. */
  const matrix = getPieceSpawnMatrix(type);
  const color = PIECE_COLORS[type];

  return (
    <div className="miniBoard" aria-label={`Piece preview ${type}`}>
      {matrix.flatMap((row, y) =>
        row.map((v, x) => (
          <div
            key={`${x}-${y}`}
            className={['miniCell', v ? 'miniCellFilled' : ''].filter(Boolean).join(' ')}
            style={v ? { '--cellColor': color } : undefined}
            aria-hidden="true"
          />
        ))
      )}
    </div>
  );
}

export default MiniMatrix;
