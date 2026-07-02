import { describe, it, expect } from 'vitest'
import type { Direction, Puzzle } from '../src/core'
import { simulateLight, reflectDirection, cellKeyToPosition, positionToCellKey } from '../src/core'

/** 3x3 기본 문제. extra로 필요한 부분만 덮어쓴다. */
function make(extra: Partial<Puzzle> = {}): Puzzle {
  return {
    id: 't', title: '', level: 'BASIC', rows: 3, cols: 3,
    entry: { side: 'LEFT', index: 1, direction: 'RIGHT' },
    exit: { side: 'RIGHT', index: 1, direction: 'RIGHT' },
    stars: [], forbiddenCells: [],
    rule: { requiredStars: [], forbiddenCells: [], mirrorPlacementMode: 'ANY_EMPTY', maxMirrors: 9 },
    ...extra,
  }
}

// 목표 1: '/' 거울 반사 규칙
describe("'/' 거울 반사 규칙", () => {
  const cases: [Direction, Direction][] = [
    ['RIGHT', 'UP'], ['UP', 'RIGHT'], ['LEFT', 'DOWN'], ['DOWN', 'LEFT'],
  ]
  for (const [i, o] of cases) it(`${i} → ${o}`, () => expect(reflectDirection(i, '/')).toBe(o))
})

// 목표 2: '\' 거울 반사 규칙
describe("'\\' 거울 반사 규칙", () => {
  const cases: [Direction, Direction][] = [
    ['RIGHT', 'DOWN'], ['DOWN', 'RIGHT'], ['LEFT', 'UP'], ['UP', 'LEFT'],
  ]
  for (const [i, o] of cases) it(`${i} → ${o}`, () => expect(reflectDirection(i, '\\')).toBe(o))
})

// 목표 3: 좌표 변환
describe('좌표 변환 (1-기반)', () => {
  it('cellKey ↔ position', () => {
    expect(cellKeyToPosition('A1')).toEqual({ row: 1, col: 1 })
    expect(cellKeyToPosition('C4')).toEqual({ row: 4, col: 3 })
    expect(positionToCellKey({ row: 4, col: 3 })).toBe('C4')
  })
})

describe('simulateLight — 진행/반사/출구', () => {
  it('거울 없이 직진해 지정 출구로 나간다', () => {
    const r = simulateLight(make(), {})
    expect(r.visitedCells).toEqual(['A1', 'B1', 'C1'])
    expect(r.exited).toBe(true)
    expect(r.exitedAtCorrectExit).toBe(true)
    expect(r.finalCell).toBe('C1')
    expect(r.finalDirection).toBe('RIGHT')
  })

  it("'\\' 거울에서 아래로 꺾여 나간다", () => {
    const r = simulateLight(make({ exit: { side: 'BOTTOM', index: 3, direction: 'DOWN' } }), { C1: '\\' })
    expect(r.visitedCells).toEqual(['A1', 'B1', 'C1', 'C2', 'C3'])
    expect(r.exitedAtCorrectExit).toBe(true)
  })

  it('별과 금지칸 방문을 각각 기록한다', () => {
    const r = simulateLight(
      make({ exit: { side: 'BOTTOM', index: 3, direction: 'DOWN' }, stars: ['C1'], forbiddenCells: ['C2'] }),
      { C1: '\\' },
    )
    expect(r.visitedStars).toEqual(['C1'])
    expect(r.hitForbidden).toEqual(['C2'])
  })

  it('가장자리 진입 빛은 루프 없이 항상 나간다', () => {
    const r = simulateLight(make(), {
      A1: '/', B1: '\\', C1: '/', A2: '\\', B2: '/', C2: '\\', A3: '/', B3: '\\', C3: '/',
    })
    expect(r.loopDetected).toBe(false)
    expect(r.exited).toBe(true)
  })
})
