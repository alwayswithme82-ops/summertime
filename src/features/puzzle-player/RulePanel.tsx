import type { Direction, EdgeSide, Puzzle } from '../../core'
import { colToLetters } from '../../core'
import { MirrorIcon } from '../../components/MirrorIcon'

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

const DIR_WORD: Record<Direction, string> = {
  UP: '위로',
  DOWN: '아래로',
  LEFT: '왼쪽으로',
  RIGHT: '오른쪽으로',
}

/** 가장자리 점을 "위쪽 C열" / "오른쪽 1행" 처럼 사람이 읽는 문구로. */
function describeEdge(side: EdgeSide, index: number): string {
  const where = side === 'TOP' || side === 'BOTTOM' ? `${colToLetters(index)}열` : `${index}행`
  return `${SIDE_LABEL[side]} ${where}`
}

/** "…열로" / "…행으로" 조사 처리. */
function toParticle(side: EdgeSide): string {
  return side === 'TOP' || side === 'BOTTOM' ? '로' : '으로'
}

const LEVEL_LABEL: Record<Puzzle['level'], string> = {
  BASIC: '기초',
  NORMAL: '보통',
  HARD: '어려움',
  LARGE: '대형',
}

/**
 * 문제 목표/규칙 안내 패널.
 * 입구/출구는 문제에서 미리 정해진 조건이며, 학생은 거울 배치만 바꿀 수 있다.
 */
export function RulePanel({ puzzle, mirrorsUsed }: RulePanelProps) {
  const { rule } = puzzle
  return (
    <div className="panel rule-panel">
      <div className="rp-title">
        <h2>{puzzle.title}</h2>
        <span className={`rp-level rp-level-${puzzle.level.toLowerCase()}`}>
          {LEVEL_LABEL[puzzle.level]}
        </span>
      </div>
      {puzzle.description && <p className="rp-desc">{puzzle.description}</p>}

      <h3 className="rp-subtitle">성공 조건</h3>
      <ul className="rp-goals">
        <li>별 {rule.requiredStars.length}개 모두 지나기</li>
        {rule.forbiddenCells.length > 0 && <li>금지칸 지나지 않기</li>}
        <li>
          입구: {describeEdge(puzzle.entry.side, puzzle.entry.index)}에서{' '}
          {DIR_WORD[puzzle.entry.direction]} 시작
        </li>
        <li>
          출구: {describeEdge(puzzle.exit.side, puzzle.exit.index)}
          {toParticle(puzzle.exit.side)} 나가기
        </li>
        <li>
          거울: {mirrorsUsed} / {rule.exactMirrorCount ?? rule.maxMirrors}개
          {rule.exactMirrorCount ? ' (정확히)' : ' 이하'}
        </li>
        {rule.requiredMirrorCounts && (
          <li className="rp-mirror-counts">
            거울 종류:
            <MirrorIcon type="/" size={16} /> {rule.requiredMirrorCounts.slash ?? 0}개,
            <MirrorIcon type={'\\'} size={16} /> {rule.requiredMirrorCounts.backslash ?? 0}개
          </li>
        )}
      </ul>
    </div>
  )
}
