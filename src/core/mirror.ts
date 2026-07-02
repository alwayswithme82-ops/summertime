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
 * '\\' 거울의 반사 규칙. (코드에서 \ 문자는 '\\'로 표기)
 * RIGHT → DOWN, DOWN → RIGHT, LEFT → UP, UP → LEFT
 */
const BACKSLASH: Record<Direction, Direction> = {
  RIGHT: 'DOWN',
  DOWN: 'RIGHT',
  LEFT: 'UP',
  UP: 'LEFT',
}

/**
 * 거울에 direction으로 들어온 빛이 반사되어 나가는 방향.
 * 반사 방향은 들어오는 방향에 따라 달라진다.
 * ('/'를 "위 거울", '\\'를 "아래 거울"이라고 부르지 않는다.)
 *
 * 잘못된 mirrorType이나 direction이 들어오면 명확한 에러를 던진다.
 */
export function reflectDirection(direction: Direction, mirrorType: MirrorType): Direction {
  const table = mirrorType === '/' ? SLASH : mirrorType === '\\' ? BACKSLASH : null
  if (table === null) {
    throw new Error(`잘못된 거울 종류: ${String(mirrorType)} ('/' 또는 '\\'만 허용)`)
  }
  const out = table[direction]
  if (out === undefined) {
    throw new Error(`잘못된 방향: ${String(direction)}`)
  }
  return out
}

/** 클릭 순환: 없음 → '/' → '\\' → 없음. */
export function nextMirror(current: MirrorType | null): MirrorType | null {
  if (current === null) return '/'
  if (current === '/') return '\\'
  return null
}
