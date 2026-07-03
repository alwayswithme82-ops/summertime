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

// 벽 튕김 금지: 빛은 벽/테두리에서 절대 반사되지 않고, 보드 밖으로 나가는 즉시 종료된다.
describe('벽 반사 금지 (빛은 벽에 튕기지 않는다)', () => {
  it('거울이 없으면 방향이 절대 바뀌지 않고 직진해 나간다', () => {
    const p = make({ entry: { side: 'LEFT', index: 2, direction: 'RIGHT' } })
    const r = simulateLight(p, {})
    // A2 → B2 → C2, 모든 스텝에서 방향은 RIGHT 그대로.
    expect(r.path.map((s) => s.cell)).toEqual(['A2', 'B2', 'C2'])
    expect(r.path.every((s) => s.direction === 'RIGHT')).toBe(true)
    expect(r.exited).toBe(true)
  })

  it('출구가 아닌 벽으로 나가면 wrongExit이고 즉시 종료된다 (튕겨서 계속 진행 금지)', () => {
    // 출구는 TOP B열인데, 빛은 오른쪽 벽(RIGHT 2행)으로 직진해 나간다.
    const p = make({
      entry: { side: 'LEFT', index: 2, direction: 'RIGHT' },
      exit: { side: 'TOP', index: 2, direction: 'UP' },
    })
    const r = simulateLight(p, {})
    // 보드 밖으로 나간 순간 시뮬레이션 종료 — 경로는 정확히 3칸에서 끝난다.
    expect(r.path).toHaveLength(3)
    expect(r.path[r.path.length - 1].cell).toBe('C2')
    expect(r.exited).toBe(true)
    expect(r.exitedAtCorrectExit).toBe(false)
    expect(r.wrongExit).toBe(true)
    // 튕겨 돌아오지 않았으므로 같은 칸을 두 번 방문하지 않는다.
    expect(new Set(r.path.map((s) => s.cell)).size).toBe(r.path.length)
  })

  it('아래 벽으로 직진해도 반사 없이 그대로 나간다 (방향 불변)', () => {
    const p = make({
      entry: { side: 'TOP', index: 1, direction: 'DOWN' },
      exit: { side: 'RIGHT', index: 3, direction: 'RIGHT' },
    })
    const r = simulateLight(p, {})
    expect(r.path.map((s) => s.cell)).toEqual(['A1', 'A2', 'A3'])
    expect(r.path.every((s) => s.direction === 'DOWN')).toBe(true)
    expect(r.wrongExit).toBe(true)
    expect(r.exitedAtCorrectExit).toBe(false)
  })

  it('정해진 출구로 나가면 exitedAtCorrectExit true', () => {
    const p = make() // LEFT 1행 → RIGHT 1행 직진
    const r = simulateLight(p, {})
    expect(r.exitedAtCorrectExit).toBe(true)
    expect(r.wrongExit).toBe(false)
  })
})
