import { describe, it, expect } from 'vitest'
import type { Direction } from '../src/core'
import { oppositeDirection, directionToDelta, isHorizontal, isVertical } from '../src/core'

describe('oppositeDirection', () => {
  const pairs: [Direction, Direction][] = [
    ['UP', 'DOWN'],
    ['DOWN', 'UP'],
    ['LEFT', 'RIGHT'],
    ['RIGHT', 'LEFT'],
  ]
  for (const [dir, opp] of pairs) {
    it(`${dir} → ${opp}`, () => {
      expect(oppositeDirection(dir)).toBe(opp)
    })
  }
  it('잘못된 방향은 에러', () => {
    expect(() => oppositeDirection('DIAGONAL' as Direction)).toThrow()
  })
})

describe('directionToDelta', () => {
  it('각 방향의 행/열 이동량', () => {
    expect(directionToDelta('UP')).toEqual({ dRow: -1, dCol: 0 })
    expect(directionToDelta('DOWN')).toEqual({ dRow: 1, dCol: 0 })
    expect(directionToDelta('LEFT')).toEqual({ dRow: 0, dCol: -1 })
    expect(directionToDelta('RIGHT')).toEqual({ dRow: 0, dCol: 1 })
  })
})

describe('isHorizontal / isVertical', () => {
  it('LEFT/RIGHT는 가로, UP/DOWN은 세로', () => {
    expect(isHorizontal('LEFT')).toBe(true)
    expect(isHorizontal('RIGHT')).toBe(true)
    expect(isHorizontal('UP')).toBe(false)
    expect(isVertical('UP')).toBe(true)
    expect(isVertical('DOWN')).toBe(true)
    expect(isVertical('RIGHT')).toBe(false)
  })
})
