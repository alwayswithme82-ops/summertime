/** 빛 반사 엔진 공개 API. React는 이 모듈만 통해 core를 사용한다. */
export type {
  Direction,
  MirrorType,
  CellKey,
  Position,
  EdgeSide,
  EdgePoint,
  PuzzleLevel,
  MirrorPlacementMode,
  RequiredMirrorCounts,
  PuzzleRule,
  Puzzle,
  PlacedMirrors,
  PathEvent,
  PathStep,
  SimulationResult,
  ValidationResult,
} from './types'

export { DIRECTIONS, VECTORS, ARROW, opposite, type Delta } from './direction'
export {
  colToLetters,
  positionToCellKey,
  cellKeyToPosition,
  samePosition,
  inBounds,
  move,
  edgeEntryPosition,
  beamExitEdge,
  sameEdge,
} from './coordinate'
export { reflect, nextMirror } from './mirror'
export { simulateLight } from './simulateLight'
export { validateSolution } from './validateSolution'
export { scoreSolution, type Score } from './scoreSolution'
