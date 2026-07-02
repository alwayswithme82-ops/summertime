import type { Direction, MirrorType } from './types'

/**
 * '/' 거울의 반사 규칙.
 * RIGHT → UP, UP → RIGHT, LEFT → DOWN, DOWN → LEFT
 */
const SLASH: Record<Direction, Direction> = {
  RIGHT: 'UP',
  UP: 'RIGHT',
  LEFT: 'DOWN',
  DOWN: 'LEFT',
}

/**
 * '\\' 거울의 반사 규칙.
 * RIGHT → DOWN, DOWN → RIGHT, LEFT → UP, UP → LEFT
 */
const BACKSLASH: Record<Direction, Direction> = {
  RIGHT: 'DOWN',
  DOWN: 'RIGHT',
  LEFT: 'UP',
  UP: 'LEFT',
}

/**
 * 거울에 방향 dir로 들어온 빛이 반사되어 나가는 방향을 반환한다.
 * 반사 방향은 들어오는 방향에 따라 달라진다.
 * ('/'를 "위 거울", '\\'를 "아래 거울"이라고 부르지 않는다.)
 */
export function reflect(mirror: MirrorType, dir: Direction): Direction {
  return mirror === '/' ? SLASH[dir] : BACKSLASH[dir]
}

/** 클릭 순환: 없음 → '/' → '\\' → 없음. */
export function nextMirror(current: MirrorType | null): MirrorType | null {
  if (current === null) return '/'
  if (current === '/') return '\\'
  return null
}
