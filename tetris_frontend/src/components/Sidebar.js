import React from 'react';
import NextQueue from './NextQueue';
import HoldPanel from './HoldPanel';

// PUBLIC_INTERFACE
function Sidebar({
  score,
  level,
  lines,
  nextQueue,
  hold,
  canHold,
  activePieceType,
  onPause,
  onReset,
  onStart,
  isPaused,
  isGameOver,
}) {
  /** Sidebar with score/level/lines, next and hold panels, and buttons. */
  return (
    <>
      <div className="statGrid" aria-label="Score statistics">
        <div className="stat">
          <span className="statLabel">Score</span>
          <div className="statValue">{score}</div>
        </div>
        <div className="stat">
          <span className="statLabel">Level</span>
          <div className="statValue">{level}</div>
        </div>
        <div className="stat">
          <span className="statLabel">Lines</span>
          <div className="statValue">{lines}</div>
        </div>
        <div className="stat">
          <span className="statLabel">Piece</span>
          <div className="statValue">{activePieceType ?? '-'}</div>
        </div>
      </div>

      <div className="miniPanels">
        <HoldPanel hold={hold} canHold={canHold} />
        <NextQueue nextQueue={nextQueue} />
      </div>

      <div className="actions" aria-label="Game actions">
        <button className="btn btnPrimary" type="button" onClick={onPause} disabled={isGameOver}>
          {isPaused ? 'Resume (P)' : 'Pause (P)'}
        </button>
        <button className="btn btnDanger" type="button" onClick={onReset}>
          Reset
        </button>
        <button className="btn" type="button" onClick={onStart} disabled={!isPaused || isGameOver}>
          Start
        </button>
      </div>
    </>
  );
}

export default Sidebar;
