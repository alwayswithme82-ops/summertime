import { describe, it, expect } from 'vitest'
import { validateSolution } from '../src/core'
import type { PlacedMirrors, Puzzle } from '../src/core'
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

// 목표 4.5: 판정은 sampleAnswer 비교가 아니다 — 규칙만 만족하면 어떤 배치든 성공
describe('sampleAnswer가 아닌 배치도 규칙을 만족하면 성공한다', () => {
  // 정답이 여러 개인 문제: LEFT 2행 입구 → 별 B2 통과 → BOTTOM 4열 출구.
  const multi: Puzzle = {
    id: 'multi', title: '복수 정답', level: 'BASIC', rows: 4, cols: 4,
    entry: { side: 'LEFT', index: 2, direction: 'RIGHT' },
    exit: { side: 'BOTTOM', index: 4, direction: 'DOWN' },
    stars: ['B2'], forbiddenCells: [],
    rule: {
      requiredStars: ['B2'], forbiddenCells: [],
      mirrorPlacementMode: 'ANY_EMPTY', maxMirrors: 3,
    },
    // 예시 정답은 1개짜리 배치.
    sampleAnswer: { D2: '\\' },
  }

  it('예시 정답(D2 하나)이 성공한다', () => {
    const r = validateSolution(multi, { ...multi.sampleAnswer! })
    expect(r.errors).toEqual([])
    expect(r.success).toBe(true)
  })

  it('예시와 전혀 다른 3개짜리 배치(C2→C3→D3 우회)도 성공한다', () => {
    const alt: PlacedMirrors = { C2: '\\', C3: '\\', D3: '\\' }
    expect(alt).not.toEqual(multi.sampleAnswer) // 좌표가 다름을 명시
    const r = validateSolution(multi, alt)
    expect(r.errors).toEqual([])
    expect(r.success).toBe(true)
  })
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

  it('개수/종류 조건이 틀린 동안에는 출구 실패를 같이 보여주지 않는다', () => {
    const p5 = getPuzzle('p5')!
    const r = validateSolution(p5, {})
    expect(r.success).toBe(false)
    expect(r.errors.some((e) => e.includes('정확히 5개'))).toBe(true)
    expect(r.errors.some((e) => e.includes('정해진 출구'))).toBe(false)
  })

  it('정확히 N개 조건이 있으면 N개 이하 실패를 중복으로 만들지 않는다', () => {
    const p5 = getPuzzle('p5')!
    const r = validateSolution(p5, {
      A1: '/',
      A2: '/',
      A3: '/',
      A4: '/',
      A5: '/',
      A6: '/',
    })
    expect(r.success).toBe(false)
    expect(r.errors.some((e) => e.includes('정확히 5개'))).toBe(true)
    expect(r.errors.some((e) => e.includes('이하로 사용'))).toBe(false)
  })
})
