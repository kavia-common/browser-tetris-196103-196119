import React from 'react';
import Board from '../components/Board';
import Sidebar from '../components/Sidebar';
import ControlsHelp from '../components/ControlsHelp';
import { useTetris } from '../hooks/useTetris';

// PUBLIC_INTERFACE
function Game() {
  /** Main game screen: board + sidebar + help + footer actions. */
  const {
    board,
    ghostCells,
    isPaused,
    isGameOver,
    score,
    level,
    lines,
    nextQueue,
    hold,
    canHold,
    activePieceType,
    start,
    reset,
    togglePause,
  } = useTetris();

  const statusLabel = isGameOver ? 'Game over' : (isPaused ? 'Paused' : 'Playing');

  return (
    <div className="shell">
      <div className="header">
        <div>
          <h1 className="title">Browser Tetris</h1>
          <p className="subtitle">Arrow keys to move, <strong>Space</strong> to hard drop, <strong>C</strong> to hold, <strong>P</strong> to pause.</p>
        </div>
        <span className="badge" aria-label={`Game status: ${statusLabel}`}>
          <span className="badgeDot" />
          {statusLabel}
        </span>
      </div>

      <div className="main">
        <div className="card boardCard">
          <Board
            board={board}
            ghostCells={ghostCells}
            paused={isPaused}
            gameOver={isGameOver}
            onStart={start}
            onReset={reset}
          />
        </div>

        <div className="card sidebar">
          <Sidebar
            score={score}
            level={level}
            lines={lines}
            nextQueue={nextQueue}
            hold={hold}
            canHold={canHold}
            activePieceType={activePieceType}
            onPause={togglePause}
            onReset={reset}
            onStart={start}
            isPaused={isPaused}
            isGameOver={isGameOver}
          />
          <ControlsHelp />
        </div>
      </div>

      <div className="footer">
        <div>Built with React • No backend required</div>
        <a href="#reset" onClick={(e) => { e.preventDefault(); reset(); }}>
          Reset game
        </a>
      </div>
    </div>
  );
}

export default Game;
