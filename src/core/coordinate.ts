import type { CellKey, Direction, EdgePoint, Position } from './types'
import { VECTORS } from './direction'

/**
 * 열 인덱스(0-기반)를 스프레드시트식 알파벳으로. 0→"A", 25→"Z", 26→"AA".
 */
export function colToLetters(col: number): string {
  let n = col
  let s = ''
  do {
    s = String.fromCharCode(65 + (n % 26)) + s
    n = Math.floor(n / 26) - 1
  } while (n >= 0)
  return s
}

/** Position → CellKey. 예: {row:0,col:0} → "A1", {row:6,col:6} → "G7". */
export function positionToCellKey(pos: Position): CellKey {
  return `${colToLetters(pos.col)}${pos.row + 1}`
}

/** CellKey → Position. 예: "B3" → {row:2,col:1}. */
export function cellKeyToPosition(key: CellKey): Position {
  const match = /^([A-Z]+)(\d+)$/.exec(key)
  if (!match) throw new Error(`잘못된 CellKey: ${key}`)
  let col = 0
  for (const ch of match[1]) col = col * 26 + (ch.charCodeAt(0) - 64)
  return { row: Number(match[2]) - 1, col: col - 1 }
}

/** 두 위치가 같은 칸인지. */
export function samePosition(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col
}

/** 위치가 격자 안에 있는지. */
export function inBounds(pos: Position, rows: number, cols: number): boolean {
  return pos.row >= 0 && pos.row < rows && pos.col >= 0 && pos.col < cols
}

/** 위치에서 방향으로 한 칸 이동한 새 위치. */
export function move(pos: Position, dir: Direction): Position {
  const v = VECTORS[dir]
  return { row: pos.row + v.dRow, col: pos.col + v.dCol }
}

/** 입구 EdgePoint가 가리키는 첫 칸(격자 안쪽 가장자리 칸)의 위치. */
export function edgeEntryPosition(entry: EdgePoint, rows: number, cols: number): Position {
  switch (entry.side) {
    case 'TOP':
      return { row: 0, col: entry.index }
    case 'BOTTOM':
      return { row: rows - 1, col: entry.index }
    case 'LEFT':
      return { row: entry.index, col: 0 }
    case 'RIGHT':
      return { row: entry.index, col: cols - 1 }
  }
}

/**
 * 마지막 칸(pos)에서 dir 방향으로 격자를 벗어날 때의 출구 EdgePoint.
 * (dir로 한 칸 갔더니 격자 밖이라는 전제.)
 */
export function beamExitEdge(pos: Position, dir: Direction): EdgePoint {
  switch (dir) {
    case 'UP':
      return { side: 'TOP', index: pos.col, direction: 'UP' }
    case 'DOWN':
      return { side: 'BOTTOM', index: pos.col, direction: 'DOWN' }
    case 'LEFT':
      return { side: 'LEFT', index: pos.row, direction: 'LEFT' }
    case 'RIGHT':
      return { side: 'RIGHT', index: pos.row, direction: 'RIGHT' }
  }
}

/** 두 EdgePoint가 같은 입/출구인지. */
export function sameEdge(a: EdgePoint, b: EdgePoint): boolean {
  return a.side === b.side && a.index === b.index && a.direction === b.direction
}
