import type { CellKey, PlacedMirrors, Puzzle, ValidationResult } from './types'
import { simulateLight } from './simulateLight'

/**
 * 학생의 거울 배치를 시뮬레이션한 뒤 문제 규칙(rule)을 만족하는지 판정한다.
 * 정답 좌표와 비교하지 않으므로 여러 정답이 모두 통과할 수 있다.
 */
export function validateSolution(puzzle: Puzzle, placed: PlacedMirrors): ValidationResult {
  const simulation = simulateLight(puzzle, placed)
  const { rule } = puzzle
  const errors: string[] = []
  const messages: string[] = []

  const cells = Object.keys(placed) as CellKey[]
  const mirrorCount = cells.length

  // 1) 거울 배치 위치 규칙
  if (rule.mirrorPlacementMode === 'MARKED_ONLY') {
    const allowed = new Set(rule.allowedMirrorCells ?? puzzle.allowedMirrorCells ?? [])
    const illegal = cells.filter((c) => !allowed.has(c))
    if (illegal.length > 0) {
      errors.push(`거울을 놓을 수 없는 칸에 놓았어요: ${illegal.join(', ')}`)
    }
  } else {
    const onForbidden = cells.filter((c) => puzzle.forbiddenCells.includes(c))
    if (onForbidden.length > 0) {
      errors.push(`금지 칸에는 거울을 놓을 수 없어요: ${onForbidden.join(', ')}`)
    }
  }

  // 2) 거울 개수 규칙
  if (mirrorCount > rule.maxMirrors) {
    errors.push(`거울을 너무 많이 썼어요. 최대 ${rule.maxMirrors}개까지예요. (지금 ${mirrorCount}개)`)
  }
  if (rule.exactMirrorCount !== undefined && mirrorCount !== rule.exactMirrorCount) {
    errors.push(`거울을 정확히 ${rule.exactMirrorCount}개 써야 해요. (지금 ${mirrorCount}개)`)
  }
  if (rule.requiredMirrorCounts) {
    const slash = cells.filter((c) => placed[c] === '/').length
    const backslash = cells.filter((c) => placed[c] === '\\').length
    const { slash: needSlash, backslash: needBackslash } = rule.requiredMirrorCounts
    if (needSlash !== undefined && slash !== needSlash) {
      errors.push(`'/' 거울을 ${needSlash}개 써야 해요. (지금 ${slash}개)`)
    }
    if (needBackslash !== undefined && backslash !== needBackslash) {
      errors.push(`'\\' 거울을 ${needBackslash}개 써야 해요. (지금 ${backslash}개)`)
    }
  }

  // 3) 별 통과
  const visitedStarSet = new Set(simulation.visitedStars)
  const missedStars = rule.requiredStars.filter((s) => !visitedStarSet.has(s))
  if (missedStars.length > 0) {
    errors.push(`아직 지나지 않은 별이 ${missedStars.length}개 있어요: ${missedStars.join(', ')}`)
  }

  // 4) 금지 칸
  const visitedSet = new Set(simulation.visitedCells)
  const forbiddenHit = rule.forbiddenCells.filter((c) => visitedSet.has(c))
  if (forbiddenHit.length > 0) {
    errors.push(`금지 칸(X)을 지나갔어요: ${forbiddenHit.join(', ')}`)
  }

  // 5) 출구 / 루프
  if (simulation.loopDetected) {
    errors.push('빛이 거울 사이에서 무한히 맴돌아요. 거울 배치를 바꿔 보세요.')
  } else if (!simulation.exited) {
    errors.push('빛이 격자 밖으로 나가지 못했어요.')
  } else if (!simulation.exitedAtCorrectExit) {
    errors.push('빛이 정해진 출구로 나가지 않았어요.')
  }

  const success = errors.length === 0
  if (success) {
    messages.push('정답이에요! 빛이 모든 별을 지나 정해진 출구로 나갔어요. 🎉')
  }

  return { success, messages, errors, simulation }
}
