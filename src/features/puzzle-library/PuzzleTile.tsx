import type { CSSProperties } from 'react'
import type { Puzzle } from '../../core'
import { positionToCellKey } from '../../core'

/** 보드 크기로 난이도를 정한다: 4×4=기초, 5×5=보통, 7×7=대형. */
function difficultyOf(puzzle: Puzzle): { key: string; label: string } {
  const size = Math.max(puzzle.rows, puzzle.cols)
  if (size <= 4) return { key: 'basic', label: '기초' }
  if (size >= 7) return { key: 'large', label: '대형' }
  return { key: 'normal', label: '보통' }
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
  const stage = order + 1
  const starCount = puzzle.rule.requiredStars.length
  const difficulty = difficultyOf(puzzle)
  const goal = `별 ${starCount}개 · ${puzzle.rows}×${puzzle.cols}`
  const style = { '--tile-order': order } as CSSProperties

  return (
    <button
      type="button"
      className={`level-tile${cleared ? ' is-cleared' : ''}`}
      style={style}
      onClick={() => onSelect(puzzle)}
      aria-label={`${stage}단계, ${goal}, 난이도 ${difficulty.label}${cleared ? ', 완료' : ''}`}
    >
      <div className="lt-top">
        <span className="lt-stage">{stage}단계</span>
        <span className={`lt-badge lt-badge-${difficulty.key}`}>{difficulty.label}</span>
        {cleared && (
          <span className="lt-clear" aria-hidden="true">
            ★
          </span>
        )}
      </div>

      <div className="lt-frame">
        <MiniPreview puzzle={puzzle} />
      </div>

      <p className="lt-goal">{goal}</p>

      <span className="lt-start" aria-hidden="true">
        시작하기 ▶
      </span>
    </button>
  )
}
