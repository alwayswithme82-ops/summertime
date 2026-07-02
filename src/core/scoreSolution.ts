import type { PlacedMirrors, Puzzle, ValidationResult } from './types'

export interface ScoreItem {
  label: string
  point: number
}

export interface Score {
  total: number
  breakdown: ScoreItem[]
}

/**
 * 판정 결과를 바탕으로 간단한 점수를 매긴다. (React 비의존 순수 함수)
 *
 * 규칙:
 * - 정해진 출구로 나가면 +5
 * - 별 하나 지날 때마다 +2
 * - 금지칸을 지나지 않으면 +2
 * - 사용 제한보다 적게 쓰면 남은 거울 1개당 +1
 * - 성공하면 추가 +5
 */
export function scoreSolution(
  puzzle: Puzzle,
  validation: ValidationResult,
  placedMirrors: PlacedMirrors,
): Score {
  const { simulation } = validation
  const breakdown: ScoreItem[] = []

  // 출구 도달
  if (simulation.exitedAtCorrectExit) {
    breakdown.push({ label: '출구 도달', point: 5 })
  }

  // 별 통과 (필수 별 기준)
  const requiredStarSet = new Set(puzzle.rule.requiredStars)
  const starsHit = simulation.visitedStars.filter((s) => requiredStarSet.has(s)).length
  if (starsHit > 0) {
    breakdown.push({ label: `별 ${starsHit}개 통과`, point: starsHit * 2 })
  }

  // 금지칸 회피
  if (simulation.hitForbidden.length === 0) {
    breakdown.push({ label: '금지칸 회피', point: 2 })
  }

  // 남은 거울
  const mirrorsUsed = Object.keys(placedMirrors).length
  const remaining = puzzle.rule.maxMirrors - mirrorsUsed
  if (remaining > 0) {
    breakdown.push({ label: `남은 거울 ${remaining}개`, point: remaining })
  }

  // 성공 보너스
  if (validation.success) {
    breakdown.push({ label: '성공 보너스', point: 5 })
  }

  const total = breakdown.reduce((sum, item) => sum + item.point, 0)
  return { total, breakdown }
}
