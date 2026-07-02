import type { Direction } from './types'

/** 모든 방향 목록. */
export const DIRECTIONS: readonly Direction[] = ['UP', 'RIGHT', 'DOWN', 'LEFT']

/** 행/열 이동량. row는 아래로 갈수록 커진다. */
export interface Delta {
  dRow: number
  dCol: number
}

const DIRECTION_SET = new Set<string>(DIRECTIONS)

function assertDirection(direction: Direction): void {
  if (!DIRECTION_SET.has(direction)) {
    throw new Error(`잘못된 방향: ${String(direction)}`)
  }
}

const OPPOSITE: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
}

/** 반대 방향. */
export function oppositeDirection(direction: Direction): Direction {
  assertDirection(direction)
  return OPPOSITE[direction]
}

const DELTA: Record<Direction, Delta> = {
  UP: { dRow: -1, dCol: 0 },
  DOWN: { dRow: 1, dCol: 0 },
  LEFT: { dRow: 0, dCol: -1 },
  RIGHT: { dRow: 0, dCol: 1 },
}

/** 방향 → 행/열 이동량. */
export function directionToDelta(direction: Direction): Delta {
  assertDirection(direction)
  return DELTA[direction]
}

/** 가로 방향(LEFT/RIGHT)인지. */
export function isHorizontal(direction: Direction): boolean {
  assertDirection(direction)
  return direction === 'LEFT' || direction === 'RIGHT'
}

/** 세로 방향(UP/DOWN)인지. */
export function isVertical(direction: Direction): boolean {
  assertDirection(direction)
  return direction === 'UP' || direction === 'DOWN'
}

/** 시각화용 화살표 글리프. */
export const ARROW: Record<Direction, string> = {
  UP: '↑',
  DOWN: '↓',
  LEFT: '←',
  RIGHT: '→',
}
