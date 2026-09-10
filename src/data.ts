// ============================================================
// DataForge 2026 — Coverage & Extrapolation Demo Data
// ============================================================

export type CellColor = string | null;
export type Grid = CellColor[][];

export interface Demo {
  id: string;
  label: string;
  description: string;
  ruleCovered: string;
  inputGrid: Grid;
  outputGrid: Grid;
}

export interface TestCase {
  inputGrid: Grid;
  correctOutput: Grid;
  wrongOutput: Grid;
  wrongExplanation: string;
  correctExplanation: string;
}

export interface Rule {
  id: string;
  label: string;
  coveredBy: string; // demo id
}

export interface Suite {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  gridSize: number;
  demos: Demo[];
  test: TestCase;
  rules: Rule[];
}

// ── Color Palette ── (warm, editorial)
export const COLORS: Record<string, string> = {
  red: '#e74c3c',
  blue: '#3498db',
  green: '#27ae60',
  yellow: '#f1c40f',
  purple: '#9b59b6',
  gray: '#95a5a6',
  orange: '#e67e22',
  barrier: '#7f8c8d',
  floor: '#bdc3c7',
  empty: 'transparent',
  grid: '#f5f0eb',
};

// ── Helper: create empty grid ──
export function makeGrid(rows: number, cols: number, fill: CellColor = null): Grid {
  return Array.from({ length: rows }, () => Array(cols).fill(fill));
}

// ── Helper: place cell on grid ──
export function placeCell(grid: Grid, r: number, c: number, color: CellColor): Grid {
  const g = grid.map(row => [...row]);
  g[r][c] = color;
  return g;
}

// ── Helper: place multiple cells ──
export function placeCells(grid: Grid, cells: [number, number, CellColor][]): Grid {
  let g = grid.map(row => [...row]);
  for (const [r, c, color] of cells) {
    g[r][c] = color;
  }
  return g;
}

// ── Suite A: The Barrier Collapse ──
// Grid: row 0 = top, row 4 = bottom. Gravity pulls blocks DOWN (row++).
// placeCell(grid, row, col, color)
function buildSuiteA(): Suite {
  const gSize = 5;

  // Demo 1: Block at col 2, top → falls to floor (col 2, bottom)
  // Shows: gravity + floor rule
  const d1Input = placeCell(makeGrid(gSize, gSize), 0, 2, 'red');
  const d1Output = placeCell(makeGrid(gSize, gSize), 4, 2, 'red');

  // Demo 2: Block at col 2, top → barrier at (row 3, col 2) → stops at (row 2, col 2)
  // Shows: barrier collision rule
  const d2Input = placeCells(makeGrid(gSize, gSize), [
    [0, 2, 'red'],
    [3, 2, 'gray'],
  ]);
  const d2Output = placeCells(makeGrid(gSize, gSize), [
    [2, 2, 'red'],
    [3, 2, 'gray'],
  ]);

  // Demo 3: Block at col 1, top → barrier at (row 2, col 1) → stops at (row 1, col 1)
  // Reinforces: barrier rule at different position
  const d3Input = placeCells(makeGrid(gSize, gSize), [
    [0, 1, 'red'],
    [2, 1, 'gray'],
  ]);
  const d3Output = placeCells(makeGrid(gSize, gSize), [
    [1, 1, 'red'],
    [2, 1, 'gray'],
  ]);

  // Test: Block at col 3, top → barrier at (row 1, col 3) → correct: stays at (row 0, col 3)
  // Barrier is right below, block can't move at all
  const testInput = placeCells(makeGrid(gSize, gSize), [
    [0, 3, 'red'],
    [1, 3, 'gray'],
  ]);
  const testCorrect = placeCells(makeGrid(gSize, gSize), [
    [0, 3, 'red'],
    [1, 3, 'gray'],
  ]);
  // Wrong: block falls to floor, ghosts through barrier
  const testWrong = placeCells(makeGrid(gSize, gSize), [
    [4, 3, 'red'],
    [1, 3, 'gray'],
  ]);

  return {
    id: 'barrier',
    name: 'The Barrier Collapse',
    subtitle: 'Gravity + Obstacle Rules',
    icon: '🧱',
    gridSize: gSize,
    demos: [
      {
        id: 'd1',
        label: 'Demo 1',
        description: 'Block falls to floor (gravity + floor)',
        ruleCovered: 'gravity-floor',
        inputGrid: d1Input,
        outputGrid: d1Output,
      },
      {
        id: 'd2',
        label: 'Demo 2',
        description: 'Block stops at barrier (collision)',
        ruleCovered: 'barrier',
        inputGrid: d2Input,
        outputGrid: d2Output,
      },
      {
        id: 'd3',
        label: 'Demo 3',
        description: 'Another barrier case (reinforces)',
        ruleCovered: 'barrier',
        inputGrid: d3Input,
        outputGrid: d3Output,
      },
    ],
    test: {
      inputGrid: testInput,
      correctOutput: testCorrect,
      wrongOutput: testWrong,
      correctExplanation: 'Block stops directly above the barrier — collision detected!',
      wrongExplanation: 'Block ghosts through barrier and falls to the floor. The barrier rule was never learned.',
    },
    rules: [
      { id: 'gravity-floor', label: 'Gravity + Floor', coveredBy: 'd1' },
      { id: 'barrier', label: 'Barrier Collision', coveredBy: 'd2' },
    ],
  };
}

// ── Suite B: Parity & Color Inversion ──
function buildSuiteB(): Suite {
  const gSize = 4;

  // Demo 1: 3×3 red square → 3×3 red square (odd copies)
  const d1Input = placeCells(makeGrid(gSize, gSize), [
    [0, 0, 'red'], [0, 1, 'red'], [0, 2, 'red'],
    [1, 0, 'red'], [1, 1, 'red'], [1, 2, 'red'],
    [2, 0, 'red'], [2, 1, 'red'], [2, 2, 'red'],
  ]);
  const d1Output = d1Input.map(r => [...r]);

  // Demo 2: 2×2 blue → 2×2 yellow (even inverts)
  const d2Input = placeCells(makeGrid(gSize, gSize), [
    [0, 0, 'blue'], [0, 1, 'blue'],
    [1, 0, 'blue'], [1, 1, 'blue'],
  ]);
  const d2Output = placeCells(makeGrid(gSize, gSize), [
    [0, 0, 'yellow'], [0, 1, 'yellow'],
    [1, 0, 'yellow'], [1, 1, 'yellow'],
  ]);

  // Demo 3: 1×1 green → 1×1 green (odd copies)
  const d3Input = placeCell(makeGrid(gSize, gSize), 0, 0, 'green');
  const d3Output = placeCell(makeGrid(gSize, gSize), 0, 0, 'green');

  // Test: 4×4 purple → should be 4×4 yellow (even inverts)
  const testCells: [number, number, CellColor][] = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++)
      testCells.push([r, c, 'purple']);
  const testInput = placeCells(makeGrid(gSize, gSize), testCells);

  const testCorrectCells: [number, number, CellColor][] = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++)
      testCorrectCells.push([r, c, 'yellow']);
  const testCorrect = placeCells(makeGrid(gSize, gSize), testCorrectCells);

  const testWrong = testInput.map(r => [...r]);

  return {
    id: 'parity',
    name: 'Parity & Color Inversion',
    subtitle: 'Odd copies, Even inverts',
    icon: '🎨',
    gridSize: gSize,
    demos: [
      {
        id: 'd1',
        label: 'Demo 1',
        description: '3×3 red (odd) → copies as-is',
        ruleCovered: 'odd-copy',
        inputGrid: d1Input,
        outputGrid: d1Output,
      },
      {
        id: 'd2',
        label: 'Demo 2',
        description: '2×2 blue (even) → inverts color',
        ruleCovered: 'even-invert',
        inputGrid: d2Input,
        outputGrid: d2Output,
      },
      {
        id: 'd3',
        label: 'Demo 3',
        description: '1×1 green (odd) → copies as-is',
        ruleCovered: 'odd-copy',
        inputGrid: d3Input,
        outputGrid: d3Output,
      },
    ],
    test: {
      inputGrid: testInput,
      correctOutput: testCorrect,
      wrongOutput: testWrong,
      correctExplanation: '4×4 is even → colors invert. Purple becomes yellow!',
      wrongExplanation: 'Model assumed all shapes copy. It never saw the even-inversion rule, so it just copied purple.',
    },
    rules: [
      { id: 'odd-copy', label: 'Odd-size: Copy', coveredBy: 'd1' },
      { id: 'even-invert', label: 'Even-size: Invert', coveredBy: 'd2' },
    ],
  };
}

export const SUITES: Suite[] = [buildSuiteA(), buildSuiteB()];

// ── Heatmap generation (simulated latent state) ──
export function generateHeatmap(seed: number, size: number = 12): number[][] {
  const rng = (s: number) => {
    let x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };
  return Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => rng(seed * 13.37 + i * 7.1 + j * 3.9))
  );
}

// ── Challenge Mode Levels ──
export interface ChallengeLevel {
  id: number;
  title: string;
  description: string;
  type: 'find-missing' | 'predict-spurious' | 'minimal-set';
  suiteId: string;
  correctAnswer: string;
  options: string[];
  hint: string;
}

export const CHALLENGES: ChallengeLevel[] = [
  {
    id: 1,
    title: 'Find the Missing Link',
    description: 'The Barrier Collapse model is ghosting blocks through barriers. Which ONE demo is missing?',
    type: 'find-missing',
    suiteId: 'barrier',
    correctAnswer: 'Demo 2',
    options: ['Demo 1', 'Demo 2', 'Demo 3'],
    hint: 'Which demo introduces the concept of a barrier stopping a block?',
  },
  {
    id: 2,
    title: 'Predict the Spurious Rule',
    description: 'Given only Demos 1 & 3 from Parity Suite (odd copies), what rule did the model learn?',
    type: 'predict-spurious',
    suiteId: 'parity',
    correctAnswer: 'All shapes copy as-is',
    options: ['All shapes copy as-is', 'All shapes invert', 'Small shapes copy, big shapes vanish'],
    hint: 'Both demos show odd-sized shapes copying. What pattern would the model extract?',
  },
  {
    id: 3,
    title: 'Minimal Coverage Set',
    description: 'For the Barrier Suite, which 2 demos give 100% rule coverage?',
    type: 'minimal-set',
    suiteId: 'barrier',
    correctAnswer: 'Demos 1 & 2',
    options: ['Demos 1 & 2', 'Demos 1 & 3', 'Demos 2 & 3'],
    hint: 'Each demo covers specific rules. Find the pair that covers ALL rules without redundancy.',
  },
];
