import { GoogleGenAI } from '@google/genai';

// --- TYPES ---
export const Direction = {
  N: 1,
  E: 2,
  S: 4,
  W: 8,
};

export const ItemType = {
  Start: 'start',
  Exit: 'exit',
  Health: 'health',
  Score: 'score',
  Hazard: 'hazard',
  Weapon: 'weapon',
  Empty: 'empty',
  // Elemental / Theme Items
  IceCube: 'ice_cube',
  Fire: 'fire',
  CO2: 'co2',
  Fumes: 'fumes',
  Antivenom: 'antivenom',
  Robber: 'robber',
  // Specific Hazards
  Snake: 'snake',
  Quicksand: 'quicksand',
  Bees: 'bees',
  Meteor: 'meteor',
  Aliens: 'aliens',
  Bear: 'bear',
  // New Items
  Water: 'water',
  Bandage: 'bandage',
  Herb: 'herb',
  Honey: 'honey',
  Rope: 'rope',
  Stick: 'stick',
  Teamwork: 'teamwork',
  ShieldGenerator: 'shield_generator',
  EvasiveManeuver: 'evasive_maneuver',
  NegotiationItem: 'negotiation_item',
  RadiationShield: 'radiation_shield',
  OxygenTank: 'oxygen_tank',
  OxygenMask: 'oxygen_mask',
  Root: 'root',
  Trap: 'trap',
  Shelter: 'shelter',
  PharmacyPack: 'pharmacy_pack',
  Sunscreen: 'sunscreen',
  LifeJacket: 'life_jacket',
  Ventilation: 'ventilation',
  Helmet: 'helmet',
  Shield: 'shield',
  Money: 'money',
  ReflexBoost: 'reflex_boost',
  Dodge: 'dodge',
  HealthBerries: 'health_berries',
  FlowerPollen: 'flower_pollen',
  GameMeat: 'game_meat',
  Syringe: 'syringe',
  PoisonBerries: 'poison_berries',
  GasMask: 'gas_mask',
} as const;

export type ItemTypeValues = typeof ItemType[keyof typeof ItemType];

export interface Cell {
  x: number;
  y: number;
  walls: number;
  item: ItemTypeValues;
  seen: boolean;
  visible: boolean;
  valid: boolean;
}

export type Theme = 'dungeon' | 'orchard' | 'farm' | 'vacation' | 'forest' | 'ocean' | 'cartoon' | 'galaxy';

export const LEVEL_CONFIG: Record<number, { w: number; h: number; shape: string; theme: Theme }> = {
  1: { w: 12, h: 12, shape: 'rectangle', theme: 'dungeon' },
  2: { w: 12, h: 12, shape: 'rectangle', theme: 'orchard' },
  3: { w: 12, h: 12, shape: 'circle', theme: 'farm' },
  4: { w: 12, h: 12, shape: 'diamond', theme: 'vacation' },
  5: { w: 12, h: 12, shape: 'pineapple', theme: 'forest' },
  6: { w: 12, h: 12, shape: 'circle', theme: 'ocean' },
  7: { w: 12, h: 12, shape: 'diamond', theme: 'cartoon' },
  8: { w: 12, h: 12, shape: 'pineapple', theme: 'galaxy' },
};

// --- MAZE GENERATOR ---
const DX = { [Direction.E]: 1, [Direction.W]: -1, [Direction.N]: 0, [Direction.S]: 0 };
const DY = { [Direction.E]: 0, [Direction.W]: 0, [Direction.N]: -1, [Direction.S]: 1 };
const OPPOSITE = { [Direction.E]: Direction.W, [Direction.W]: Direction.E, [Direction.N]: Direction.S, [Direction.S]: Direction.N };

const isCellInShape = (x: number, y: number, w: number, h: number, shape: string): boolean => {
  const cx = w / 2;
  const cy = h / 2;
  const nx = (x - cx) / (w / 2); // Normalized -1 to 1
  const ny = (y - cy) / (h / 2);

  switch (shape) {
    case 'circle':
      return (nx * nx + ny * ny) <= 1;
    case 'diamond':
      return (Math.abs(nx) + Math.abs(ny)) <= 1;
    case 'pineapple':
      // Oval body
      if (ny > -0.5) return (nx * nx + ny * ny) <= 0.8;
      // Leaves on top
      return (Math.abs(nx) < 0.3 && ny > -0.9);
    case 'rectangle':
    default:
      return true;
  }
};

export const generateMaze = (width: number, height: number, shape: string = 'rectangle', difficulty: 'easy' | 'hard' | 'tough_genius' = 'easy', level: number = 1): { grid: Cell[][], startPos: { x: number, y: number } } => {
  const grid: Cell[][] = [];
  const visited: boolean[][] = [];

  // 1. Initialize Grid
  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    const visitedRow: boolean[] = [];
    for (let x = 0; x < width; x++) {
      const isValid = isCellInShape(x, y, width, height, shape);
      row.push({
        x, y,
        walls: 15, // All walls
        item: ItemType.Empty,
        seen: false,
        visible: false,
        valid: isValid
      });
      // Mark invalid cells as visited so the generator doesn't try to go there
      visitedRow.push(!isValid);
    }
    grid.push(row);
    visited.push(visitedRow);
  }

  // 2. Recursive Backtracker (Guarantees perfect connectivity)
  const genStartX = Math.floor(width / 2);
  const genStartY = Math.floor(height / 2);
  
  const stack: { x: number, y: number }[] = [];
  // Ensure start is valid (it should be for our shapes, but safety first)
  if (grid[genStartY][genStartX].valid) {
    visited[genStartY][genStartX] = true;
    stack.push({ x: genStartX, y: genStartY });
  }

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = [Direction.N, Direction.S, Direction.E, Direction.W]
      .map(dir => ({ dir, x: current.x + DX[dir], y: current.y + DY[dir] }))
      .filter(n => 
        n.x >= 0 && n.x < width && n.y >= 0 && n.y < height && 
        !visited[n.y][n.x]
      );

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      // Remove walls
      grid[current.y][current.x].walls &= ~next.dir;
      grid[next.y][next.x].walls &= ~OPPOSITE[next.dir];

      visited[next.y][next.x] = true;
      stack.push({ x: next.x, y: next.y });
    } else {
      stack.pop();
    }
  }

  // 1. Identify all carved cells (reachable)
  const carvedCells = grid.flat().filter(c => c.valid && c.walls !== 15);
  
  // 2. Pick Random Player Start
  const playerStartCell = carvedCells[Math.floor(Math.random() * carvedCells.length)];
  const startX = playerStartCell.x;
  const startY = playerStartCell.y;
  grid[startY][startX].item = ItemType.Start;

  // 3. BFS from NEW Start to find distances
  const dist = new Map<string, number>();
  const q: {x: number, y: number, d: number}[] = [{x: startX, y: startY, d: 0}];
  dist.set(`${startX},${startY}`, 0);
  let maxDist = 0;

  while (q.length > 0) {
    const {x, y, d} = q.shift()!;
    maxDist = Math.max(maxDist, d);

    [Direction.N, Direction.S, Direction.E, Direction.W].forEach(dir => {
      if (!(grid[y][x].walls & dir)) { // If no wall
        const nx = x + DX[dir];
        const ny = y + DY[dir];
        if (!dist.has(`${nx},${ny}`)) {
          dist.set(`${nx},${ny}`, d + 1);
          q.push({x: nx, y: ny, d: d + 1});
        }
      }
    });
  }

  // 4. Find candidates for exit
  // Increase minimum distance by 10% per level for progressive difficulty
  // Base: 0.50 (50%), Level 1: 0.50, Level 2: 0.55, Level 3: 0.60, etc.
  const minDistanceRatio = Math.min(0.50 + (level - 1) * 0.10, 0.95);
  const exitCandidates = grid.flat().filter(c => {
    if (!c.valid || (c.x === startX && c.y === startY)) return false;

    const d = dist.get(`${c.x},${c.y}`) || 0;
    if (d < maxDist * minDistanceRatio) return false;

    // Check if edge
    const isEdge = [Direction.N, Direction.S, Direction.E, Direction.W].some(dir => {
      const nx = c.x + DX[dir];
      const ny = c.y + DY[dir];
      return nx < 0 || nx >= width || ny < 0 || ny >= height || !grid[ny][nx].valid;
    });

    return isEdge;
  });

  if (exitCandidates.length > 0) {
    const exit = exitCandidates[Math.floor(Math.random() * exitCandidates.length)];
    exit.item = ItemType.Exit;
  } else {
    const fallback = grid.flat().filter(c => c.valid && c.walls !== 15 && c.item === ItemType.Empty && !(c.x === startX && c.y === startY)).pop();
    if (fallback) fallback.item = ItemType.Exit;
  }

  // 5. Place Items (exclude Start and Exit)
  const validItemCells = grid.flat().filter(c => c.valid && c.walls !== 15 && c.item === ItemType.Empty);
  const placedItems: {x: number, y: number}[] = [];
  
  // Add Start and Exit to placed items to avoid crowding them
  placedItems.push({x: startX, y: startY});
  const exitCell = grid.flat().find(c => c.item === ItemType.Exit);
  if (exitCell) placedItems.push({x: exitCell.x, y: exitCell.y});

  const isSafeDistance = (c: Cell) => {
    return placedItems.every(p => (Math.abs(c.x - p.x) + Math.abs(c.y - p.y)) >= 3);
  };

  const pickSafeCell = () => {
    // Filter valid cells by distance
    const safeCells = validItemCells.filter(c => isSafeDistance(c));
    if (safeCells.length === 0) return null;
    
    const idx = Math.floor(Math.random() * safeCells.length);
    const cell = safeCells[idx];
    
    // Remove from validItemCells (find index in original array)
    const originalIdx = validItemCells.indexOf(cell);
    if (originalIdx > -1) validItemCells.splice(originalIdx, 1);
    
    placedItems.push({x: cell.x, y: cell.y});
    return cell;
  };
  
  // Difficulty Scaling
  let hazardCount = Math.floor(validItemCells.length * 0.05);
  if (difficulty === 'hard') hazardCount = Math.floor(validItemCells.length * 0.10);
  if (difficulty === 'tough_genius') hazardCount = Math.floor(validItemCells.length * 0.15);

  // Place Hazards
  for (let i = 0; i < hazardCount; i++) {
    const cell = pickSafeCell();
    if (!cell) break;
    
    // Random Hazard Type
    const hazards = [
      ItemType.Fire, ItemType.Fumes, ItemType.Robber,
      ItemType.Snake, ItemType.Quicksand, ItemType.Bees, 
      ItemType.Meteor, ItemType.Aliens, ItemType.Bear,
      ItemType.PoisonBerries
    ];
    cell.item = hazards[Math.floor(Math.random() * hazards.length)];
  }

  // Place Helpful Items
  let helpCount = Math.floor(validItemCells.length * 0.08);
  if (difficulty === 'hard') helpCount = Math.floor(validItemCells.length * 0.05);
  if (difficulty === 'tough_genius') helpCount = Math.floor(validItemCells.length * 0.03);

  for (let i = 0; i < helpCount; i++) {
    const cell = pickSafeCell();
    if (!cell) break;
    
    const items = [
      ItemType.Health, ItemType.Score, ItemType.Weapon, 
      ItemType.IceCube, ItemType.CO2, ItemType.Antivenom,
      ItemType.Water, ItemType.Rope, ItemType.Shield,
      ItemType.Bandage, ItemType.Herb, ItemType.Honey, ItemType.Stick,
      ItemType.Teamwork, ItemType.ShieldGenerator, ItemType.EvasiveManeuver,
      ItemType.NegotiationItem, ItemType.RadiationShield, ItemType.OxygenTank,
      ItemType.OxygenMask, ItemType.Root, ItemType.Trap, ItemType.Shelter,
      ItemType.PharmacyPack, ItemType.Sunscreen, ItemType.LifeJacket,
      ItemType.Ventilation, ItemType.Helmet, ItemType.Money,
      ItemType.ReflexBoost, ItemType.Dodge, ItemType.HealthBerries,
      ItemType.FlowerPollen, ItemType.GameMeat, ItemType.Syringe,
      ItemType.GasMask
    ];
    cell.item = items[Math.floor(Math.random() * items.length)];
  }

  return { grid, startPos: { x: startX, y: startY } };
};
