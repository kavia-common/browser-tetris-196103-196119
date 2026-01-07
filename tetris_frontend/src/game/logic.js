import { BOARD_HEIGHT, BOARD_WIDTH } from './constants';
import { getPieceSpawnMatrix, rotateMatrixCW, rotateMatrixCCW, getKickOffsets } from './pieces';

// PUBLIC_INTERFACE
export function createEmptyBoard() {
  /** Creates an empty 20x10 board of nulls. */
  return Array.from({ length: BOARD_HEIGHT }, () => Array.from({ length: BOARD_WIDTH }, () => null));
}

// PUBLIC_INTERFACE
export function matrixToCells(matrix, x0, y0, type) {
  /** Convert 4x4 matrix to list of absolute board cells occupied by the piece. */
  const cells = [];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x]) cells.push({ x: x0 + x, y: y0 + y, type });
    }
  }
  return cells;
}

// PUBLIC_INTERFACE
export function collides(board, cells) {
  /** Returns true if any cell is out of bounds or overlaps existing blocks. */
  for (const c of cells) {
    if (c.x < 0 || c.x >= BOARD_WIDTH) return true;
    if (c.y >= BOARD_HEIGHT) return true;
    if (c.y < 0) continue; // allow spawn above top
    if (board[c.y][c.x] != null) return true;
  }
  return false;
}

// PUBLIC_INTERFACE
export function mergePiece(board, cells) {
  /** Returns a new board with the piece cells merged in. */
  const out = board.map((row) => row.slice());
  for (const c of cells) {
    if (c.y >= 0 && c.y < BOARD_HEIGHT && c.x >= 0 && c.x < BOARD_WIDTH) {
      out[c.y][c.x] = c.type;
    }
  }
  return out;
}

// PUBLIC_INTERFACE
export function clearLines(board) {
  /** Clears completed lines. Returns { board, clearedCount }. */
  const remaining = [];
  let cleared = 0;
  for (const row of board) {
    if (row.every((v) => v != null)) {
      cleared += 1;
    } else {
      remaining.push(row);
    }
  }
  while (remaining.length < BOARD_HEIGHT) {
    remaining.unshift(Array.from({ length: BOARD_WIDTH }, () => null));
  }
  return { board: remaining, clearedCount: cleared };
}

// PUBLIC_INTERFACE
export function getSpawnPosition(type) {
  /** Spawn X/Y for 4x4 piece in a 10-wide board. */
  const x = Math.floor(BOARD_WIDTH / 2) - 2;
  const y = -1; // slightly above top for smoother spawn
  return { x, y };
}

// PUBLIC_INTERFACE
export function makeActivePiece(type) {
  /** Creates a new active piece object at spawn. */
  const { x, y } = getSpawnPosition(type);
  return { type, x, y, rot: 0, matrix: getPieceSpawnMatrix(type) };
}

// PUBLIC_INTERFACE
export function tryMove(board, piece, dx, dy) {
  /** Attempts to move piece by dx/dy. Returns updated piece or same if blocked. */
  const moved = { ...piece, x: piece.x + dx, y: piece.y + dy };
  const cells = matrixToCells(moved.matrix, moved.x, moved.y, moved.type);
  if (collides(board, cells)) return piece;
  return moved;
}

// PUBLIC_INTERFACE
export function tryRotate(board, piece, dir) {
  /** Attempts to rotate with SRS wall kicks. dir: 'CW'|'CCW'. Returns updated piece or same if blocked. */
  if (piece.type === 'O') return piece;

  const fromRot = piece.rot;
  const toRot = (dir === 'CW')
    ? (fromRot + 1) % 4
    : (fromRot + 3) % 4;

  const rotatedMatrix = (dir === 'CW') ? rotateMatrixCW(piece.matrix) : rotateMatrixCCW(piece.matrix);
  const kicks = getKickOffsets(piece.type, fromRot, toRot);

  for (const [dx, dy] of kicks) {
    const candidate = { ...piece, rot: toRot, matrix: rotatedMatrix, x: piece.x + dx, y: piece.y + dy };
    const cells = matrixToCells(candidate.matrix, candidate.x, candidate.y, candidate.type);
    if (!collides(board, cells)) return candidate;
  }

  return piece;
}

// PUBLIC_INTERFACE
export function getGhostCells(board, piece) {
  /** Computes ghost landing cells for current piece. */
  let test = piece;
  while (true) {
    const next = tryMove(board, test, 0, 1);
    if (next === test) break;
    test = next;
  }
  return matrixToCells(test.matrix, test.x, test.y, test.type).map(({ x, y }) => ({ x, y }));
}

// PUBLIC_INTERFACE
export function canPlace(board, piece) {
  /** Returns true if the piece can be placed (no collision at its current position). */
  const cells = matrixToCells(piece.matrix, piece.x, piece.y, piece.type);
  return !collides(board, cells);
}
