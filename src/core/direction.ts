import type { Direction } from './types'

/** 모든 방향 목록. */
export const DIRECTIONS: readonly Direction[] = ['UP', 'RIGHT', 'DOWN', 'LEFT']

/** 행/열 이동량. row는 아래로 갈수록 커진다. */
export interface Delta {
  dRow: number
  dCol: number
}

/** 각 방향의 이동 벡터. */
export const VECTORS: Record<Direction, Delta> = {
  UP: { dRow: -1, dCol: 0 },
  DOWN: { dRow: 1, dCol: 0 },
  LEFT: { dRow: 0, dCol: -1 },
  RIGHT: { dRow: 0, dCol: 1 },
}

const OPPOSITE: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
}

/** 반대 방향. */
export function opposite(dir: Direction): Direction {
  return OPPOSITE[dir]
}

/** 시각화용 화살표 글리프. */
export const ARROW: Record<Direction, string> = {
  UP: '↑',
  DOWN: '↓',
  LEFT: '←',
  RIGHT: '→',
}
