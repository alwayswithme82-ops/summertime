import { describe, it, expect } from 'vitest'
import { validateSolution } from '../src/core'
import { samplePuzzles, getPuzzle } from '../src/data/samplePuzzles'

// 목표 4: 모든 sampleAnswer가 validateSolution에서 success true (좌표 비교 아님)
describe('sampleAnswer는 조건 검증으로 통과해야 한다', () => {
  for (const puzzle of samplePuzzles) {
    it(`"${puzzle.title}" (${puzzle.id})`, () => {
      expect(puzzle.sampleAnswer).toBeDefined()
      const r = validateSolution(puzzle, puzzle.sampleAnswer!)
      expect(r.errors).toEqual([])
      expect(r.success).toBe(true)
    })
  }
})

// 목표 5: 금지칸을 지나면 실패
describe('금지칸 통과 시 실패', () => {
  it('빛이 금지칸(B1)을 지나면 금지칸 오류가 나온다', () => {
    // 입구 A2 RIGHT로 직진하면 B1은 안 밟으므로, 금지칸을 밟는 경로를 만든다:
    // A2에서 위로 꺾어 A1 → 오른쪽으로 B1(금지) 통과.
    const r = validateSolution(
      {
        id: 'x', title: '', level: 'BASIC', rows: 3, cols: 3,
        entry: { side: 'LEFT', index: 2, direction: 'RIGHT' },
        exit: { side: 'RIGHT', index: 1, direction: 'RIGHT' },
        stars: [], forbiddenCells: ['B1'],
        rule: { requiredStars: [], forbiddenCells: ['B1'], mirrorPlacementMode: 'ANY_EMPTY', maxMirrors: 4 },
      },
      { A2: '/', A1: '/' },
    )
    expect(r.success).toBe(false)
    expect(r.errors.some((e) => e.includes('금지칸을 지나갔어요'))).toBe(true)
  })
})

// 목표 6: 별을 일부 지나지 않으면 실패
describe('별을 다 지나지 않으면 실패', () => {
  it('거울이 없으면 별을 못 지나 실패한다', () => {
    const p1 = getPuzzle('p1')!
    const r = validateSolution(p1, {})
    expect(r.success).toBe(false)
    expect(r.errors.some((e) => e.includes('아직 지나지 않은 별'))).toBe(true)
  })
})

// 목표 7: 잘못된 출구로 나가면 실패
describe('잘못된 출구로 나가면 실패', () => {
  it('거울이 없으면 다른 곳으로 나가 실패한다', () => {
    const p1 = getPuzzle('p1')!
    const r = validateSolution(p1, {})
    expect(r.errors.some((e) => e.includes('정해진 출구로 나가지 않았어요'))).toBe(true)
  })
})

// 목표 8: 거울 개수 제한 초과 시 실패
describe('거울 개수 제한 초과 시 실패', () => {
  it('maxMirrors를 넘으면 실패한다', () => {
    const p4 = getPuzzle('p4')! // maxMirrors 4, allowed A2,A3,D3,D4
    const r = validateSolution(p4, { A2: '/', A3: '\\', D3: '\\', D4: '/', B1: '/' })
    expect(r.success).toBe(false)
    expect(r.errors.some((e) => e.includes('이하로 사용'))).toBe(true)
  })
})

// 목표 9: MARKED_ONLY에서 허용되지 않은 칸에 놓으면 실패
describe('MARKED_ONLY 허용칸 밖 배치 시 실패', () => {
  it('허용되지 않은 칸에 거울을 놓으면 실패한다', () => {
    const p4 = getPuzzle('p4')! // allowed: A2,A3,D3,D4
    const r = validateSolution(p4, { B2: '/' })
    expect(r.success).toBe(false)
    expect(r.errors.some((e) => e.includes('놓을 수 없는 칸'))).toBe(true)
  })
})

// 목표 10: 7x7에서 / 3개, \ 2개 제한 작동
describe('requiredMirrorCounts(/ 3, \\ 2) 작동', () => {
  it('개수 비율이 맞지 않으면 실패한다', () => {
    const p5 = getPuzzle('p5')!
    const r = validateSolution(p5, { C2: '/', E3: '/', G3: '/', C5: '/', E5: '/' }) // / 5개
    expect(r.success).toBe(false)
    expect(r.errors.some((e) => e.includes("'/'"))).toBe(true)
    expect(r.errors.some((e) => e.includes('\\'))).toBe(true)
  })
})
