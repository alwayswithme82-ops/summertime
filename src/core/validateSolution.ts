import type { CellKey, PlacedMirrors, Puzzle, ValidationResult } from './types'
import { simulateLight } from './simulateLight'

/**
 * 거울 배치 정책. 나중에 문제별로 바꾸기 쉽게 한곳에 모아 둔다.
 * 기본: 별 칸과 금지 칸에는 거울을 놓을 수 없다.
 */
const PLACEMENT_POLICY = {
  allowMirrorOnStar: false,
  allowMirrorOnForbidden: false,
}

/**
 * 학생의 거울 배치를 조건 검증 방식으로 판정한다.
 * 절대 sampleAnswer와 비교하지 않는다 — simulateLight 결과와 규칙만으로 success를 정한다.
 */
export function validateSolution(puzzle: Puzzle, placedMirrors: PlacedMirrors): ValidationResult {
  const { rule } = puzzle
  const errors: string[] = []
  const messages: string[] = []

  const cells = Object.keys(placedMirrors) as CellKey[]
  const mirrorCount = cells.length
  let hasMirrorCountOrTypeError = false

  // 2) maxMirrors 초과. 정확히 N개 조건이 있으면 그 조건 하나로 안내한다.
  if (rule.exactMirrorCount === undefined && mirrorCount > rule.maxMirrors) {
    errors.push(`거울을 ${rule.maxMirrors}개 이하로 사용해야 해요.`)
    hasMirrorCountOrTypeError = true
  }

  // 3) exactMirrorCount
  if (rule.exactMirrorCount !== undefined && mirrorCount !== rule.exactMirrorCount) {
    errors.push(`거울을 정확히 ${rule.exactMirrorCount}개 사용해야 해요.`)
    hasMirrorCountOrTypeError = true
  }

  // 4) requiredMirrorCounts (/ 와 \ 개수)
  if (rule.requiredMirrorCounts) {
    const slash = cells.filter((c) => placedMirrors[c] === '/').length
    const backslash = cells.filter((c) => placedMirrors[c] === '\\').length
    const { slash: needSlash, backslash: needBackslash } = rule.requiredMirrorCounts
    if (needSlash !== undefined && slash !== needSlash) {
      errors.push(`'/' 거울을 ${needSlash}개 사용해야 해요.`)
      hasMirrorCountOrTypeError = true
    }
    if (needBackslash !== undefined && backslash !== needBackslash) {
      errors.push(`'\\' 거울을 ${needBackslash}개 사용해야 해요.`)
      hasMirrorCountOrTypeError = true
    }
  }

  // 5)+6) 놓을 수 없는 칸 검사 (MARKED_ONLY 허용칸 + 별/금지칸 정책)
  const allowedSet = new Set(rule.allowedMirrorCells ?? puzzle.allowedMirrorCells ?? [])
  const starSet = new Set(puzzle.stars)
  const forbiddenSet = new Set(puzzle.forbiddenCells)
  const illegalCells = cells.filter((c) => {
    if (rule.mirrorPlacementMode === 'MARKED_ONLY' && !allowedSet.has(c)) return true
    if (!PLACEMENT_POLICY.allowMirrorOnStar && starSet.has(c)) return true
    if (!PLACEMENT_POLICY.allowMirrorOnForbidden && forbiddenSet.has(c)) return true
    return false
  })
  if (illegalCells.length > 0) {
    errors.push(`거울을 놓을 수 없는 칸에 거울이 있어요: ${illegalCells.join(', ')}`)
  }

  // 7) 시뮬레이션 실행
  const simulation = simulateLight(puzzle, placedMirrors)

  // 8) 금지칸 통과
  const visitedSet = new Set(simulation.visitedCells)
  const forbiddenHit = rule.forbiddenCells.filter((c) => visitedSet.has(c))
  if (forbiddenHit.length > 0) {
    errors.push(`금지칸을 지나갔어요: ${forbiddenHit.join(', ')}`)
  }

  // 9) 무한 루프
  if (simulation.loopDetected) {
    errors.push('빛이 같은 곳을 반복해서 돌고 있어요.')
  }

  // 10) 모든 별 통과
  const visitedStarSet = new Set(simulation.visitedStars)
  const missedStars = rule.requiredStars.filter((s) => !visitedStarSet.has(s))
  if (missedStars.length > 0) {
    errors.push(`아직 지나지 않은 별이 있어요: ${missedStars.join(', ')}`)
  }

  // 11) 정해진 출구
  if (!hasMirrorCountOrTypeError && !simulation.exitedAtCorrectExit) {
    errors.push('정해진 출구로 나가지 않았어요.')
  }

  // 12) 성공 판정
  const success = errors.length === 0
  if (success) {
    messages.push('성공했어요!')
    messages.push('모든 별을 지났어요.')
    messages.push('금지칸을 지나지 않았어요.')
    messages.push('정해진 출구로 나갔어요.')
  }

  return { success, messages, errors, simulation }
}
