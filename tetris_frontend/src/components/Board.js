import React from 'react';
import Cell from './Cell';
import Overlay from './Overlay';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../game/constants';

// PUBLIC_INTERFACE
function Board({ board, ghostCells, paused, gameOver, onStart, onReset }) {
  /** Renders the main playfield board, plus pause/game-over overlays. */
  const ghostSet = React.useMemo(() => {
    const set = new Set();
    for (const g of ghostCells) set.add(`${g.x},${g.y}`);
    return set;
  }, [ghostCells]);

  return (
    <div className="boardWrap">
      <div className="board" role="grid" aria-label="Tetris board">
        {Array.from({ length: BOARD_HEIGHT }).map((_, y) =>
          Array.from({ length: BOARD_WIDTH }).map((__, x) => {
            const value = board[y][x];
            const isGhost = value == null && ghostSet.has(`${x},${y}`);
            return (
              <Cell
                key={`${x}-${y}`}
                value={value}
                ghost={isGhost}
              />
            );
          })
        )}

        {(paused || gameOver) && (
          <Overlay
            title={gameOver ? 'Game Over' : 'Paused'}
            text={
              gameOver
                ? 'Press Enter to restart, or use the Reset button.'
                : 'Press P to resume. You can also reset the game anytime.'
            }
            primaryActionLabel={gameOver ? 'Restart' : 'Resume'}
            secondaryActionLabel="Reset"
            onPrimary={gameOver ? onReset : onStart}
            onSecondary={onReset}
            showPrimary={!gameOver}
          />
        )}
      </div>
    </div>
  );
}

export default Board;
