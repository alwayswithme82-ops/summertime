import { describe, it, expect } from 'vitest'
import type { Puzzle } from '../src/core'
import { simulateLight } from '../src/core'

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

describe('simulateLight — 거울 없는 직진', () => {
  it('왼쪽 입구에서 오른쪽으로 직진해 지정 출구로 나간다', () => {
    const r = simulateLight(make(), {})
    expect(r.exited).toBe(true)
    expect(r.exitedAtCorrectExit).toBe(true)
    expect(r.visitedCells).toEqual(['A1', 'B1', 'C1'])
    expect(r.finalCell).toBe('C1')
    expect(r.finalDirection).toBe('RIGHT')
    expect(r.loopDetected).toBe(false)
  })
})

describe('simulateLight — 거울 하나로 꺾기', () => {
  it("'\\' 거울에서 RIGHT가 DOWN으로 꺾여 아래로 나간다", () => {
    const puzzle = make({ exit: { side: 'BOTTOM', index: 3, direction: 'DOWN' } })
    const r = simulateLight(puzzle, { C1: '\\' })
    expect(r.visitedCells).toEqual(['A1', 'B1', 'C1', 'C2', 'C3'])
    expect(r.finalCell).toBe('C3')
    expect(r.finalDirection).toBe('DOWN')
    expect(r.exitedAtCorrectExit).toBe(true)
  })

  it("'/' 거울에서 RIGHT가 UP으로 꺾여 위로 나간다", () => {
    const puzzle = make({
      entry: { side: 'LEFT', index: 2, direction: 'RIGHT' },
      exit: { side: 'TOP', index: 3, direction: 'UP' },
    })
    const r = simulateLight(puzzle, { C2: '/' })
    expect(r.visitedCells).toEqual(['A2', 'B2', 'C2', 'C1'])
    expect(r.finalCell).toBe('C1')
    expect(r.finalDirection).toBe('UP')
    expect(r.exitedAtCorrectExit).toBe(true)
  })
})

describe('simulateLight — 별/금지 방문 기록', () => {
  it('경로가 지난 별과 금지 칸을 각각 기록한다', () => {
    const puzzle = make({
      exit: { side: 'BOTTOM', index: 3, direction: 'DOWN' },
      stars: ['C1'], forbiddenCells: ['C2'],
    })
    const r = simulateLight(puzzle, { C1: '\\' })
    expect(r.visitedStars).toEqual(['C1'])
    expect(r.hitForbidden).toEqual(['C2'])
  })
})

describe('simulateLight — 순수 거울은 무한 루프가 없다', () => {
  it('가장자리에서 들어온 빛은 항상 격자를 벗어난다(반사는 가역적)', () => {
    // 온 격자에 거울을 채워도 loopDetected는 false여야 한다.
    const puzzle = make()
    const r = simulateLight(puzzle, {
      A1: '/', B1: '\\', C1: '/', A2: '\\', B2: '/', C2: '\\', A3: '/', B3: '\\', C3: '/',
    })
    expect(r.loopDetected).toBe(false)
    expect(r.exited).toBe(true)
  })
})
