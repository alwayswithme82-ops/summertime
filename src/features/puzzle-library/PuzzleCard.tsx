import type { Puzzle, PuzzleLevel } from '../../core'
import { positionToCellKey } from '../../core'

const LEVEL_LABEL: Record<PuzzleLevel, string> = {
  BASIC: '기초',
  NORMAL: '보통',
  HARD: '어려움',
  LARGE: '대형',
}

/** 카드 안에 들어가는 작은 보드 미리보기 (레벨 선택 화면용). */
function MiniPreview({ puzzle }: { puzzle: Puzzle }) {
  const stars = new Set(puzzle.stars)
  const forbidden = new Set(puzzle.forbiddenCells)
  const cells: React.ReactNode[] = []
  for (let row = 1; row <= puzzle.rows; row++) {
    for (let col = 1; col <= puzzle.cols; col++) {
      const key = positionToCellKey({ row, col })
      let cls = 'pcv-cell'
      if (stars.has(key)) cls += ' is-star'
      else if (forbidden.has(key)) cls += ' is-forbidden'
      cells.push(<span key={key} className={cls} />)
    }
  }
  return (
    <div
      className="pc-preview"
      style={{ gridTemplateColumns: `repeat(${puzzle.cols}, 1fr)` }}
      aria-hidden="true"
    >
      {cells}
    </div>
  )
}

interface PuzzleCardProps {
  puzzle: Puzzle
  onSelect: (puzzle: Puzzle) => void
}

/** 문제 목록의 카드 한 장. 클릭하면 그 문제를 플레이한다. */
export function PuzzleCard({ puzzle, onSelect }: PuzzleCardProps) {
  return (
    <button type="button" className="puzzle-card" onClick={() => onSelect(puzzle)}>
      <MiniPreview puzzle={puzzle} />
      <div className="pc-body">
        <div className="pc-top">
          <h3>{puzzle.title}</h3>
          <span className={`pc-level pc-level-${puzzle.level.toLowerCase()}`}>
            {LEVEL_LABEL[puzzle.level]}
          </span>
        </div>
        <p className="pc-size">
          {puzzle.rows}×{puzzle.cols} · 별 {puzzle.rule.requiredStars.length}개 · 거울 최대{' '}
          {puzzle.rule.maxMirrors}개
        </p>
        {puzzle.description && <p className="pc-desc">{puzzle.description}</p>}
      </div>
    </button>
  )
}
