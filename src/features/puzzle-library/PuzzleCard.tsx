import type { CSSProperties } from 'react'
import type { Puzzle, PuzzleLevel } from '../../core'
import { positionToCellKey } from '../../core'

const LEVEL_LABEL: Record<PuzzleLevel, string> = {
  BASIC: '기초',
  NORMAL: '보통',
  HARD: '어려움',
  LARGE: '대형',
}

function MiniPreview({ puzzle }: { puzzle: Puzzle }) {
  const stars = new Set(puzzle.stars)
  const forbidden = new Set(puzzle.forbiddenCells)
  const cells: React.ReactNode[] = []

  for (let row = 1; row <= puzzle.rows; row++) {
    for (let col = 1; col <= puzzle.cols; col++) {
      const key = positionToCellKey({ row, col })
      let className = 'pcv-cell'
      if (stars.has(key)) className += ' is-star'
      else if (forbidden.has(key)) className += ' is-forbidden'
      cells.push(<span key={key} className={className} />)
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
  order: number
  onSelect: (puzzle: Puzzle) => void
}

export function PuzzleCard({ puzzle, order, onSelect }: PuzzleCardProps) {
  const style = { '--card-order': order } as CSSProperties

  return (
    <button
      type="button"
      className="puzzle-card"
      style={style}
      onClick={() => onSelect(puzzle)}
    >
      <div className="pc-preview-wrap">
        <span className="pc-number">{String(order + 1).padStart(2, '0')}</span>
        <MiniPreview puzzle={puzzle} />
      </div>
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
        <span className="pc-start">
          설계 시작 <span className="pc-start-arrow">→</span>
        </span>
      </div>
    </button>
  )
}
