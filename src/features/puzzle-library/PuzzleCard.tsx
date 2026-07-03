import type { Puzzle, PuzzleLevel } from '../../core'

const LEVEL_LABEL: Record<PuzzleLevel, string> = {
  BASIC: '기초',
  NORMAL: '보통',
  HARD: '어려움',
  LARGE: '대형',
}

interface PuzzleCardProps {
  puzzle: Puzzle
  onSelect: (puzzle: Puzzle) => void
}

/** 문제 목록의 카드 한 장. 클릭하면 그 문제를 플레이한다. */
export function PuzzleCard({ puzzle, onSelect }: PuzzleCardProps) {
  return (
    <button type="button" className="puzzle-card" onClick={() => onSelect(puzzle)}>
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
    </button>
  )
}
