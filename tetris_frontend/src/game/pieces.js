const TYPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

export const PIECE_TYPES = TYPES;

export const PIECE_COLORS = {
  I: '#2563EB', // primary blue
  J: '#1D4ED8',
  L: '#F59E0B', // amber
  O: '#FBBF24',
  S: '#22C55E',
  T: '#8B5CF6',
  Z: '#EF4444', // error red
};

/**
 * 4x4 spawn matrices for each tetromino.
 * 1 indicates block present.
 */
const SPAWN = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  L: [
    [0, 0, 1, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  S: [
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  T: [
    [0, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  Z: [
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
};

// PUBLIC_INTERFACE
export function getPieceSpawnMatrix(type) {
  /** Returns the 4x4 spawn matrix for a given piece type. */
  return SPAWN[type].map((r) => r.slice());
}

// PUBLIC_INTERFACE
export function rotateMatrixCW(m) {
  /** Rotates a square matrix clockwise. */
  const n = m.length;
  const out = Array.from({ length: n }, () => Array(n).fill(0));
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      out[x][n - 1 - y] = m[y][x];
    }
  }
  return out;
}

// PUBLIC_INTERFACE
export function rotateMatrixCCW(m) {
  /** Rotates a square matrix counter-clockwise. */
  const n = m.length;
  const out = Array.from({ length: n }, () => Array(n).fill(0));
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      out[n - 1 - x][y] = m[y][x];
    }
  }
  return out;
}

/**
 * SRS kick tables.
 * Rotations use states 0,1,2,3 and transitions are encoded by from->to.
 * For J,L,S,T,Z: use standard table.
 * For I: special table.
 * For O: no kicks needed (rotation is symmetrical for our purposes).
 */
const JLSTZ_KICKS = {
  '0>1': [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
  '1>0': [[0,0], [1,0], [1,-1], [0,2], [1,2]],
  '1>2': [[0,0], [1,0], [1,-1], [0,2], [1,2]],
  '2>1': [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
  '2>3': [[0,0], [1,0], [1,1], [0,-2], [1,-2]],
  '3>2': [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]],
  '3>0': [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]],
  '0>3': [[0,0], [1,0], [1,1], [0,-2], [1,-2]],
};

const I_KICKS = {
  '0>1': [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
  '1>0': [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
  '1>2': [[0,0], [-1,0], [2,0], [-1,2], [2,-1]],
  '2>1': [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
  '2>3': [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
  '3>2': [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
  '3>0': [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
  '0>3': [[0,0], [-1,0], [2,0], [-1,2], [2,-1]],
};

// PUBLIC_INTERFACE
export function getKickOffsets(type, fromRot, toRot) {
  /** Returns list of (dx,dy) kick offsets for SRS rotation attempt. */
  if (type === 'O') return [[0, 0]];
  const key = `${fromRot}>${toRot}`;
  if (type === 'I') return I_KICKS[key] ?? [[0, 0]];
  return JLSTZ_KICKS[key] ?? [[0, 0]];
}
