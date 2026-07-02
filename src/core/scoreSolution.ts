import type { PlacedMirrors, Puzzle } from './types'
import { validateSolution } from './validateSolution'

export interface Score {
  /** 정답 여부. */
  solved: boolean
  /** 지나간(필수) 별 수. */
  starsHit: number
  /** 필수 별 전체 수. */
  starsTotal: number
  /** 사용한 거울 수(적을수록 좋다). */
  mirrorsUsed: number
}

/**
 * 판정 결과를 학생에게 보여줄 간단한 점수 요약으로 정리한다.
 * (별점/랭킹 등 확장 여지를 위해 판정과 분리한다.)
 */
export function scoreSolution(puzzle: Puzzle, placed: PlacedMirrors): Score {
  const result = validateSolution(puzzle, placed)
  const requiredStarSet = new Set(puzzle.rule.requiredStars)
  const starsHit = result.simulation.visitedStars.filter((s) => requiredStarSet.has(s)).length
  return {
    solved: result.success,
    starsHit,
    starsTotal: puzzle.rule.requiredStars.length,
    mirrorsUsed: Object.keys(placed).length,
  }
}
