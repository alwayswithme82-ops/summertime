import { describe, it, expect } from 'vitest'
import type { Direction } from '../src/core'
import {
  cellKeyToPosition,
  positionToCellKey,
  isInsideBoard,
  getNextPosition,
  getExitEdge,
  isSameEdgePoint,
} from '../src/core'

describe('cellKeyToPosition (1-기반)', () => {
  it('A1 → { row:1, col:1 }', () => {
    expect(cellKeyToPosition('A1')).toEqual({ row: 1, col: 1 })
  })
  it('C4 → { row:4, col:3 }', () => {
    expect(cellKeyToPosition('C4')).toEqual({ row: 4, col: 3 })
  })
  it('잘못된 CellKey는 에러', () => {
    expect(() => cellKeyToPosition('1A')).toThrow()
  })
})

describe('positionToCellKey', () => {
  it('{ row:4, col:3 } → C4', () => {
    expect(positionToCellKey({ row: 4, col: 3 })).toBe('C4')
  })
  it('cellKeyToPosition와 왕복 변환이 일치한다', () => {
    for (const key of ['A1', 'B2', 'C4', 'E5', 'Z9']) {
      expect(positionToCellKey(cellKeyToPosition(key))).toBe(key)
    }
  })
})

describe('isInsideBoard', () => {
  it('1..rows, 1..cols 범위 안팎을 구분한다', () => {
    expect(isInsideBoard({ row: 1, col: 1 }, 5, 5)).toBe(true)
    expect(isInsideBoard({ row: 5, col: 5 }, 5, 5)).toBe(true)
    expect(isInsideBoard({ row: 0, col: 1 }, 5, 5)).toBe(false)
    expect(isInsideBoard({ row: 6, col: 1 }, 5, 5)).toBe(false)
    expect(isInsideBoard({ row: 1, col: 6 }, 5, 5)).toBe(false)
  })
})

describe('getNextPosition', () => {
  const cases: [Direction, { row: number; col: number }][] = [
    ['UP', { row: 2, col: 3 }],
    ['DOWN', { row: 4, col: 3 }],
    ['LEFT', { row: 3, col: 2 }],
    ['RIGHT', { row: 3, col: 4 }],
  ]
  for (const [dir, expected] of cases) {
    it(`${dir}`, () => {
      expect(getNextPosition({ row: 3, col: 3 }, dir)).toEqual(expected)
    })
  }
})

describe('getExitEdge (5x5)', () => {
  it('E1에서 RIGHT로 나가면 side RIGHT, index 1', () => {
    const e = getExitEdge({ row: 1, col: 5 }, 'RIGHT', 5, 5)
    expect(e.side).toBe('RIGHT')
    expect(e.index).toBe(1)
  })
  it('C1에서 UP으로 나가면 side TOP, index 3', () => {
    const e = getExitEdge({ row: 1, col: 3 }, 'UP', 5, 5)
    expect(e.side).toBe('TOP')
    expect(e.index).toBe(3)
  })
})

describe('isSameEdgePoint', () => {
  it('side와 index가 같으면 방향이 달라도 같은 출구', () => {
    expect(
      isSameEdgePoint(
        { side: 'RIGHT', index: 1, direction: 'RIGHT' },
        { side: 'RIGHT', index: 1, direction: 'LEFT' },
      ),
    ).toBe(true)
    expect(
      isSameEdgePoint(
        { side: 'RIGHT', index: 1, direction: 'RIGHT' },
        { side: 'RIGHT', index: 2, direction: 'RIGHT' },
      ),
    ).toBe(false)
  })
})
