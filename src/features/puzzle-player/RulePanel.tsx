import type { EdgeSide, Puzzle } from '../../core'
import { colToLetters } from '../../core'

interface RulePanelProps {
  puzzle: Puzzle
  mirrorsUsed: number
}

const SIDE_LABEL: Record<EdgeSide, string> = {
  TOP: '위쪽',
  BOTTOM: '아래쪽',
  LEFT: '왼쪽',
  RIGHT: '오른쪽',
}

/** 가장자리 점을 "위쪽 C열" / "오른쪽 1행" 처럼 사람이 읽는 문구로. */
function describeEdge(side: EdgeSide, index: number): string {
  const where = side === 'TOP' || side === 'BOTTOM' ? `${colToLetters(index)}열` : `${index}행`
  return `${SIDE_LABEL[side]} ${where}`
}

/** 문제 목표/규칙 안내 패널. */
export function RulePanel({ puzzle, mirrorsUsed }: RulePanelProps) {
  const { rule } = puzzle
  return (
    <div className="rule-panel">
      <div className="rp-title">
        <h2>{puzzle.title}</h2>
        <span className="rp-level">{puzzle.level}</span>
      </div>
      {puzzle.description && <p className="rp-desc">{puzzle.description}</p>}
      <ul className="rp-goals">
        <li>⭐ 별 {rule.requiredStars.length}개 모두 지나기</li>
        {rule.forbiddenCells.length > 0 && <li>✕ 금지칸 지나지 않기</li>}
        <li>➡ 입구: {describeEdge(puzzle.entry.side, puzzle.entry.index)}에서 출발</li>
        <li>🏁 출구: {describeEdge(puzzle.exit.side, puzzle.exit.index)}로 나가기</li>
        <li>
          🪞 거울 {mirrorsUsed} / {rule.exactMirrorCount ?? rule.maxMirrors}개
          {rule.exactMirrorCount ? ' (정확히)' : ' 이하'}
        </li>
        {rule.requiredMirrorCounts && (
          <li>
            카드 제한: / {rule.requiredMirrorCounts.slash ?? 0}개, \{' '}
            {rule.requiredMirrorCounts.backslash ?? 0}개
          </li>
        )}
      </ul>
    </div>
  )
}
