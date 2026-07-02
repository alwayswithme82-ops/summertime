import { describe, it, expect } from 'vitest'
import type { Puzzle } from '../src/core'
import { validateSolution } from '../src/core'
import { samplePuzzles } from '../src/data/samplePuzzles'

// 3x3, 위 입구(A1 아래로), 아래 출구(C3 아래로), 별은 중앙 B2.
const multi: Puzzle = {
  id: 'multi', title: '여러 정답', level: 'NORMAL', rows: 3, cols: 3,
  entry: { side: 'TOP', index: 1, direction: 'DOWN' },
  exit: { side: 'BOTTOM', index: 3, direction: 'DOWN' },
  stars: ['B2'], forbiddenCells: [],
  rule: { requiredStars: ['B2'], forbiddenCells: [], mirrorPlacementMode: 'ANY_EMPTY', maxMirrors: 6 },
}

describe('validateSolution — 같은 문제의 서로 다른 정답', () => {
  it('정답 A: 네 거울로 우회하는 경로', () => {
    const r = validateSolution(multi, { A1: '\\', B1: '\\', B3: '\\', C3: '\\' })
    expect(r.success).toBe(true)
    expect(r.errors).toEqual([])
    expect(r.messages.length).toBeGreaterThan(0)
  })

  it('정답 B: 두 거울만 쓰는 다른 경로', () => {
    const r = validateSolution(multi, { A2: '\\', C2: '\\' })
    expect(r.success).toBe(true)
    expect(r.simulation.visitedStars).toContain('B2')
  })
})

describe('validateSolution — 실패 원인', () => {
  it('거울이 없으면 별을 못 지나고 출구도 틀리다', () => {
    const r = validateSolution(multi, {})
    expect(r.success).toBe(false)
    expect(r.errors.some((e) => e.includes('별'))).toBe(true)
    expect(r.errors.some((e) => e.includes('출구'))).toBe(true)
  })

  it('금지 칸을 지나면 실패한다', () => {
    const withForbidden: Puzzle = {
      ...multi,
      forbiddenCells: ['C2'],
      rule: { ...multi.rule, forbiddenCells: ['C2'] },
    }
    const r = validateSolution(withForbidden, { A2: '\\', C2: '\\' })
    expect(r.success).toBe(false)
    expect(r.errors.some((e) => e.includes('C2'))).toBe(true)
  })
})

describe('validateSolution — 거울 개수/배치 규칙', () => {
  const base = (rule: Puzzle['rule'], extra: Partial<Puzzle> = {}): Puzzle => ({
    ...multi, rule, ...extra,
  })

  it('maxMirrors를 넘으면 실패', () => {
    const r = validateSolution(base({ ...multi.rule, maxMirrors: 1 }), { A2: '\\', C2: '\\' })
    expect(r.errors.some((e) => e.includes('최대'))).toBe(true)
  })

  it('exactMirrorCount와 다르면 실패', () => {
    const r = validateSolution(base({ ...multi.rule, exactMirrorCount: 2 }), { A1: '/' })
    expect(r.errors.some((e) => e.includes('정확히'))).toBe(true)
  })

  it('requiredMirrorCounts와 다르면 실패', () => {
    const r = validateSolution(
      base({ ...multi.rule, requiredMirrorCounts: { slash: 1, backslash: 1 } }),
      { A1: '/', B1: '/' },
    )
    expect(r.errors.some((e) => e.includes("'/'"))).toBe(true)
    expect(r.errors.some((e) => e.includes('\\'))).toBe(true)
  })

  it('MARKED_ONLY 모드에서 허용되지 않은 칸에 놓으면 실패', () => {
    const r = validateSolution(
      base(
        { ...multi.rule, mirrorPlacementMode: 'MARKED_ONLY', allowedMirrorCells: ['A1'] },
        { allowedMirrorCells: ['A1'] },
      ),
      { B1: '/' },
    )
    expect(r.errors.some((e) => e.includes('놓을 수 없는'))).toBe(true)
  })
})

describe('validateSolution — 모든 sampleAnswer는 실제로 통과해야 한다', () => {
  for (const puzzle of samplePuzzles) {
    it(`"${puzzle.title}"의 sampleAnswer는 정답이다`, () => {
      expect(puzzle.sampleAnswer).toBeDefined()
      const r = validateSolution(puzzle, puzzle.sampleAnswer!)
      expect(r.success).toBe(true)
    })
  }
})
