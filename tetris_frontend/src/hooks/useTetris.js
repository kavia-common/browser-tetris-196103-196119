import React from 'react';
import {
  HARD_DROP_POINTS_PER_CELL,
  LINE_CLEAR_SCORES,
  LINES_PER_LEVEL,
  SOFT_DROP_POINTS_PER_CELL,
  START_LEVEL,
  getDropIntervalMs,
} from '../game/constants';
import { make7Bag } from '../game/random';
import {
  canPlace,
  clearLines,
  createEmptyBoard,
  makeActivePiece,
  matrixToCells,
  mergePiece,
  tryMove,
  tryRotate,
  getGhostCells,
} from '../game/logic';

function refillQueue(queue, rng) {
  const out = queue.slice();
  while (out.length < 7) {
    out.push(...make7Bag(rng));
  }
  return out;
}

function takeNext(queue, rng) {
  const filled = refillQueue(queue, rng);
  return { next: filled[0], rest: filled.slice(1) };
}

const initialState = () => {
  const rng = Math.random;
  const queue = refillQueue([], rng);
  const { next, rest } = takeNext(queue, rng);
  const active = makeActivePiece(next);
  return {
    rng,
    board: createEmptyBoard(),
    active,
    nextQueue: refillQueue(rest, rng),
    hold: null,
    canHold: true,

    score: 0,
    level: START_LEVEL,
    lines: 0,

    paused: true,
    gameOver: false,
  };
};

function lockAndSpawn(state) {
  const activeCells = matrixToCells(state.active.matrix, state.active.x, state.active.y, state.active.type);
  const merged = mergePiece(state.board, activeCells);
  const cleared = clearLines(merged);

  const clearedCount = cleared.clearedCount;
  const gained = (LINE_CLEAR_SCORES[clearedCount] ?? 0) * state.level;

  const newLines = state.lines + clearedCount;
  const newLevel = START_LEVEL + Math.floor(newLines / LINES_PER_LEVEL);

  const { next, rest } = takeNext(state.nextQueue, state.rng);
  const newActive = makeActivePiece(next);

  const over = !canPlace(cleared.board, newActive);

  return {
    ...state,
    board: cleared.board,
    active: newActive,
    nextQueue: refillQueue(rest, state.rng),
    canHold: true,
    score: state.score + gained,
    lines: newLines,
    level: newLevel,
    gameOver: over,
    paused: over ? true : state.paused,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return state.gameOver ? state : { ...state, paused: false };
    case 'TOGGLE_PAUSE':
      if (state.gameOver) return state;
      return { ...state, paused: !state.paused };
    case 'RESET':
      return initialState();

    case 'MOVE': {
      if (state.paused || state.gameOver) return state;
      const moved = tryMove(state.board, state.active, action.dx, action.dy);
      return moved === state.active ? state : { ...state, active: moved };
    }

    case 'ROTATE': {
      if (state.paused || state.gameOver) return state;
      const rotated = tryRotate(state.board, state.active, action.dir);
      return rotated === state.active ? state : { ...state, active: rotated };
    }

    case 'SOFT_DROP': {
      if (state.paused || state.gameOver) return state;
      const moved = tryMove(state.board, state.active, 0, 1);
      if (moved === state.active) {
        return lockAndSpawn(state);
      }
      return { ...state, active: moved, score: state.score + SOFT_DROP_POINTS_PER_CELL };
    }

    case 'TICK': {
      if (state.paused || state.gameOver) return state;
      const moved = tryMove(state.board, state.active, 0, 1);
      if (moved === state.active) {
        return lockAndSpawn(state);
      }
      return { ...state, active: moved };
    }

    case 'HARD_DROP': {
      if (state.paused || state.gameOver) return state;
      let current = state.active;
      let dropped = 0;
      while (true) {
        const next = tryMove(state.board, current, 0, 1);
        if (next === current) break;
        current = next;
        dropped += 1;
      }
      const temp = { ...state, active: current, score: state.score + dropped * HARD_DROP_POINTS_PER_CELL };
      return lockAndSpawn(temp);
    }

    case 'HOLD': {
      if (state.paused || state.gameOver) return state;
      if (!state.canHold) return state;

      // If no hold yet, move current to hold and spawn next from queue.
      if (state.hold == null) {
        const { next, rest } = takeNext(state.nextQueue, state.rng);
        const newActive = makeActivePiece(next);
        const over = !canPlace(state.board, newActive);
        return {
          ...state,
          hold: state.active.type,
          active: newActive,
          nextQueue: refillQueue(rest, state.rng),
          canHold: false,
          gameOver: over,
          paused: over ? true : state.paused,
        };
      }

      // Swap hold with current.
      const swappedType = state.hold;
      const newActive = makeActivePiece(swappedType);
      const over = !canPlace(state.board, newActive);
      return {
        ...state,
        hold: state.active.type,
        active: newActive,
        canHold: false,
        gameOver: over,
        paused: over ? true : state.paused,
      };
    }

    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function useTetris() {
  /** Main Tetris hook providing state and actions; includes consistent tick loop and keyboard controls. */
  const [state, dispatch] = React.useReducer(reducer, undefined, initialState);

  // Game loop with consistent tick timing using setTimeout (avoids drift issues with setInterval).
  const intervalMs = React.useMemo(() => getDropIntervalMs(state.level), [state.level]);

  React.useEffect(() => {
    if (state.paused || state.gameOver) return;

    let cancelled = false;
    const startedAt = performance.now();

    const timer = window.setTimeout(() => {
      if (cancelled) return;
      // basic compensation: if the tab was inactive, we still apply only one tick per timeout.
      dispatch({ type: 'TICK', startedAt });
    }, intervalMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [state.paused, state.gameOver, intervalMs, state.level]);

  // Keyboard controls
  React.useEffect(() => {
    const onKeyDown = (e) => {
      // prevent page scroll for arrows/space
      const blockKeys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '];
      if (blockKeys.includes(e.key)) e.preventDefault();

      if (e.key === 'p' || e.key === 'P') {
        dispatch({ type: 'TOGGLE_PAUSE' });
        return;
      }
      if (e.key === 'Enter') {
        if (state.gameOver) dispatch({ type: 'RESET' });
        else dispatch({ type: 'START' });
        return;
      }

      if (state.paused || state.gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          dispatch({ type: 'MOVE', dx: -1, dy: 0 });
          break;
        case 'ArrowRight':
          dispatch({ type: 'MOVE', dx: 1, dy: 0 });
          break;
        case 'ArrowDown':
          dispatch({ type: 'SOFT_DROP' });
          break;
        case 'ArrowUp':
          dispatch({ type: 'ROTATE', dir: 'CW' });
          break;
        case 'z':
        case 'Z':
          dispatch({ type: 'ROTATE', dir: 'CCW' });
          break;
        case 'x':
        case 'X':
          dispatch({ type: 'ROTATE', dir: 'CW' });
          break;
        case ' ':
          dispatch({ type: 'HARD_DROP' });
          break;
        case 'c':
        case 'C':
          dispatch({ type: 'HOLD' });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.paused, state.gameOver]);

  // Build a rendered board including active piece (but not merged) for display.
  const board = React.useMemo(() => {
    const out = state.board.map((r) => r.slice());
    const activeCells = matrixToCells(state.active.matrix, state.active.x, state.active.y, state.active.type);
    for (const c of activeCells) {
      if (c.y >= 0 && c.y < out.length && c.x >= 0 && c.x < out[0].length) {
        out[c.y][c.x] = c.type;
      }
    }
    return out;
  }, [state.board, state.active]);

  const ghostCells = React.useMemo(() => {
    if (state.paused || state.gameOver) return [];
    return getGhostCells(state.board, state.active);
  }, [state.board, state.active, state.paused, state.gameOver]);

  // PUBLIC_INTERFACE
  const start = React.useCallback(() => dispatch({ type: 'START' }), []);
  // PUBLIC_INTERFACE
  const reset = React.useCallback(() => dispatch({ type: 'RESET' }), []);
  // PUBLIC_INTERFACE
  const togglePause = React.useCallback(() => dispatch({ type: 'TOGGLE_PAUSE' }), []);

  return {
    board,
    ghostCells,
    isPaused: state.paused,
    isGameOver: state.gameOver,
    score: state.score,
    level: state.level,
    lines: state.lines,
    nextQueue: state.nextQueue,
    hold: state.hold,
    canHold: state.canHold,
    activePieceType: state.active.type,

    start,
    reset,
    togglePause,
  };
}
