import type { CellKey, Direction, EdgePoint, EdgeSide, Position } from './types'

/**
 * 좌표 유틸리티.
 *
 * 규약:
 * - 내부 row, col은 1부터 시작한다. (A1 → { row: 1, col: 1 })
 * - 열 알파벳: A=col 1, B=col 2, ... (C4 → { row: 4, col: 3 })
 * - EdgePoint.index는 그 변을 따라가는 행 또는 열 번호(1-기반)를 의미한다.
 */

/** 1-기반 열 번호 → 스프레드시트식 알파벳. 1→"A", 3→"C", 27→"AA". */
export function colToLetters(col: number): string {
  let n = col - 1
  let s = ''
  do {
    s = String.fromCharCode(65 + (n % 26)) + s
    n = Math.floor(n / 26) - 1
  } while (n >= 0)
  return s
}

/** CellKey → Position. 예: "A1" → { row: 1, col: 1 }, "C4" → { row: 4, col: 3 }. */
export function cellKeyToPosition(cellKey: CellKey): Position {
  const match = /^([A-Za-z]+)(\d+)$/.exec(cellKey)
  if (!match) throw new Error(`잘못된 CellKey: ${cellKey}`)
  let col = 0
  for (const ch of match[1].toUpperCase()) col = col * 26 + (ch.charCodeAt(0) - 64)
  return { row: Number(match[2]), col }
}

/** Position → CellKey. 예: { row: 4, col: 3 } → "C4". */
export function positionToCellKey(position: Position): CellKey {
  return `${colToLetters(position.col)}${position.row}`
}

/** 두 위치가 같은 칸인지. */
export function samePosition(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col
}

/** 위치가 보드 안(1..rows, 1..cols)에 있는지. */
export function isInsideBoard(position: Position, rows: number, cols: number): boolean {
  return position.row >= 1 && position.row <= rows && position.col >= 1 && position.col <= cols
}

/**
 * 진행 방향으로 한 칸 이동한 새 위치.
 * UP: row-1, DOWN: row+1, LEFT: col-1, RIGHT: col+1
 */
export function getNextPosition(position: Position, direction: Direction): Position {
  switch (direction) {
    case 'UP':
      return { row: position.row - 1, col: position.col }
    case 'DOWN':
      return { row: position.row + 1, col: position.col }
    case 'LEFT':
      return { row: position.row, col: position.col - 1 }
    case 'RIGHT':
      return { row: position.row, col: position.col + 1 }
  }
}

/**
 * 빛이 이 위치에서 direction 방향으로 보드 밖으로 나갈 때 어느 edge로 나갔는지.
 * TOP/BOTTOM으로 나가면 index는 열 번호, LEFT/RIGHT로 나가면 index는 행 번호.
 * 예(5x5): E1에서 RIGHT → { side:'RIGHT', index:1 }, C1에서 UP → { side:'TOP', index:3 }.
 */
export function getExitEdge(
  position: Position,
  direction: Direction,
  rows: number,
  cols: number,
): EdgePoint {
  if (rows < 1 || cols < 1) throw new Error('보드 크기가 올바르지 않습니다.')
  const side: EdgeSide =
    direction === 'UP'
      ? 'TOP'
      : direction === 'DOWN'
        ? 'BOTTOM'
        : direction === 'LEFT'
          ? 'LEFT'
          : 'RIGHT'
  const index = direction === 'UP' || direction === 'DOWN' ? position.col : position.row
  return { side, index, direction }
}

/** 같은 출구인지 판단. side와 index가 같으면 같은 출구로 본다(방향은 보지 않음). */
export function isSameEdgePoint(a: EdgePoint, b: EdgePoint): boolean {
  return a.side === b.side && a.index === b.index
}

/** 입구 EdgePoint가 가리키는 첫 칸(보드 안쪽 가장자리 칸)의 위치. (1-기반) */
export function edgeEntryPosition(entry: EdgePoint, rows: number, cols: number): Position {
  switch (entry.side) {
    case 'TOP':
      return { row: 1, col: entry.index }
    case 'BOTTOM':
      return { row: rows, col: entry.index }
    case 'LEFT':
      return { row: entry.index, col: 1 }
    case 'RIGHT':
      return { row: entry.index, col: cols }
  }
}
