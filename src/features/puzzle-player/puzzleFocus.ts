import type { PuzzleRule } from '../../core'

/**
 * 문제 성격 판단(표시 전용 — core 판정 로직과 무관).
 *
 * - 개수 중심: 정확히 N개(exactMirrorCount)나 종류별 개수(requiredMirrorCounts)가
 *   핵심 제약인 문제. 거울 카운터와 종류별 남은 개수를 또렷하게 보여준다.
 * - 위치 중심: 그 외(빛나는 칸에만 놓는 MARKED_ONLY 등). 개수 제약은 사실상
 *   장식이므로 개수 문구를 빼고 "어디에 놓는지"를 부각한다.
 *
 * 하드코딩 대신 rule 필드로만 판단해 새 문제가 추가돼도 자동으로 맞는 UI가 된다.
 */
export function isCountFocused(rule: PuzzleRule): boolean {
  return rule.exactMirrorCount != null || rule.requiredMirrorCounts != null
}
