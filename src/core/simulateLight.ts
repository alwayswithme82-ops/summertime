import type {
  CellKey,
  Direction,
  PathEvent,
  PathStep,
  PlacedMirrors,
  Position,
  Puzzle,
  SimulationResult,
} from './types'
import { reflectDirection } from './mirror'
import {
  edgeEntryPosition,
  getExitEdge,
  getNextPosition,
  isInsideBoard,
  isSameEdgePoint,
  positionToCellKey,
} from './coordinate'

/**
 * 주어진 거울 배치로 빛의 경로를 실제로 추적한다.
 * 좌표 정답과 비교하지 않는다 — 결과(경로/방문/출구/루프)만 돌려준다.
 * 판정은 validateSolution.ts가 담당한다.
 */
export function simulateLight(puzzle: Puzzle, placed: PlacedMirrors): SimulationResult {
  const { rows, cols, entry } = puzzle
  const starSet = new Set(puzzle.stars)
  const forbiddenSet = new Set(puzzle.forbiddenCells)

  const path: PathStep[] = []
  const visitedCells: CellKey[] = []
  const visitedCellSet = new Set<CellKey>()
  const visitedStars: CellKey[] = []
  const visitedStarSet = new Set<CellKey>()
  const hitForbidden: CellKey[] = []
  const hitForbiddenSet = new Set<CellKey>()
  const seenStates = new Set<string>()

  let pos: Position = edgeEntryPosition(entry, rows, cols)
  let dir: Direction = entry.direction
  let loopDetected = false
  let exited = false
  let first = true

  // 무한 루프 방지용 상한. (상태 반복 감지가 우선이고, 이건 안전망.)
  const maxSteps = rows * cols * 4 + 10
  let steps = 0

  while (isInsideBoard(pos, rows, cols)) {
    if (steps++ > maxSteps) {
      loopDetected = true
      break
    }
    const state = `${pos.row},${pos.col},${dir}`
    if (seenStates.has(state)) {
      loopDetected = true
      break
    }
    seenStates.add(state)

    const cell = positionToCellKey(pos)
    const mirror = placed[cell]

    if (!visitedCellSet.has(cell)) {
      visitedCellSet.add(cell)
      visitedCells.push(cell)
    }
    if (starSet.has(cell) && !visitedStarSet.has(cell)) {
      visitedStarSet.add(cell)
      visitedStars.push(cell)
    }
    if (forbiddenSet.has(cell) && !hitForbiddenSet.has(cell)) {
      hitForbiddenSet.add(cell)
      hitForbidden.push(cell)
    }

    // 이 칸에서 두드러진 사건 하나(우선순위: 금지 > 반사 > 별 > 입장).
    let event: PathEvent | undefined
    if (forbiddenSet.has(cell)) event = 'FORBIDDEN'
    else if (mirror) event = 'REFLECT'
    else if (starSet.has(cell)) event = 'STAR'
    else if (first) event = 'ENTER'

    const step: PathStep = { cell, position: { ...pos }, direction: dir }
    if (mirror) step.mirror = mirror
    if (event) step.event = event
    path.push(step)
    first = false

    if (mirror) dir = reflectDirection(dir, mirror)

    const next = getNextPosition(pos, dir)
    if (!isInsideBoard(next, rows, cols)) {
      exited = true
      break
    }
    pos = next
  }

  let exitedAtCorrectExit = false
  let wrongExit = false
  if (exited) {
    const actualExit = getExitEdge(pos, dir, rows, cols)
    exitedAtCorrectExit = isSameEdgePoint(actualExit, puzzle.exit)
    wrongExit = !exitedAtCorrectExit
    // 마지막 스텝에 출구 사건 표시(금지 칸이 아니라면).
    const last = path[path.length - 1]
    if (last && last.event !== 'FORBIDDEN') {
      last.event = exitedAtCorrectExit ? 'EXIT' : 'WRONG_EXIT'
    }
  } else if (loopDetected) {
    const last = path[path.length - 1]
    if (last) last.event = 'LOOP'
  }

  const finalStep = path[path.length - 1]

  return {
    path,
    visitedCells,
    visitedStars,
    hitForbidden,
    exited,
    exitedAtCorrectExit,
    wrongExit,
    outOfBounds: exited,
    loopDetected,
    finalCell: finalStep?.cell,
    finalDirection: finalStep ? dir : undefined,
  }
}
