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
      let className = 'ptv-cell'
      if (stars.has(key)) className += ' is-star'
      else if (forbidden.has(key)) className += ' is-forbidden'
      cells.push(<span key={key} className={className} />)
    }
  }

  return (
    <div
      className="pt-preview"
      style={{ gridTemplateColumns: `repeat(${puzzle.cols}, 1fr)` }}
      aria-hidden="true"
    >
      {cells}
    </div>
  )
}

interface PuzzleTileProps {
  puzzle: Puzzle
  order: number
  cleared: boolean
  onSelect: (puzzle: Puzzle) => void
}

export function PuzzleTile({ puzzle, order, cleared, onSelect }: PuzzleTileProps) {
  // 손그림풍 비대칭을 타일마다 살짝 다르게(고정값).
  const rotate = (order % 2 === 0 ? -1 : 1) * (0.5 + (order % 3) * 0.25)
  const style = { '--tile-order': order, '--tile-rotate': `${rotate}deg` } as CSSProperties

  return (
    <button
      type="button"
      className={`level-tile${cleared ? ' is-cleared' : ''}`}
      style={style}
      onClick={() => onSelect(puzzle)}
      aria-label={`${order + 1}단계 ${puzzle.title}${cleared ? ' (완료)' : ''}`}
    >
      <div className="lt-frame">
        <span className="lt-number">{order + 1}</span>
        {cleared && (
          <span className="lt-clear" aria-hidden="true">
            ★
          </span>
        )}
        <MiniPreview puzzle={puzzle} />
      </div>
      <div className="lt-caption">
        <span className="lt-name">{puzzle.title}</span>
        <span className={`lt-level lt-level-${puzzle.level.toLowerCase()}`}>
          {LEVEL_LABEL[puzzle.level]}
        </span>
      </div>
    </button>
  )
}
