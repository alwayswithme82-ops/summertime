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

export {
  DIRECTIONS,
  ARROW,
  oppositeDirection,
  directionToDelta,
  isHorizontal,
  isVertical,
  type Delta,
} from './direction'
export {
  colToLetters,
  positionToCellKey,
  cellKeyToPosition,
  samePosition,
  isInsideBoard,
  getNextPosition,
  getExitEdge,
  isSameEdgePoint,
  edgeEntryPosition,
} from './coordinate'
export { reflectDirection, nextMirror } from './mirror'
export { simulateLight } from './simulateLight'
export { validateSolution } from './validateSolution'
export { scoreSolution, type Score, type ScoreItem } from './scoreSolution'
