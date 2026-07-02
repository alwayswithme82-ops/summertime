import { colToLetters, positionToCellKey } from '../../core'

function cellSizeFor(size: number): number {
  if (size <= 4) return 58
  if (size <= 5) return 50
  return 40
}

interface BoardEditorProps {
  size: number
  stars: string[]
  forbidden: string[]
  allowed: string[]
  onCellClick: (cell: string) => void
}

/** 격자 편집기. 클릭한 칸에 현재 편집 모드의 요소를 배치한다. */
export function BoardEditor({ size, stars, forbidden, allowed, onCellClick }: BoardEditorProps) {
  const CELL_SIZE = cellSizeFor(size)
  const starSet = new Set(stars)
  const forbiddenSet = new Set(forbidden)
  const allowedSet = new Set(allowed)

  const colLabels = Array.from({ length: size }, (_, i) => colToLetters(i + 1))
  const rowNumbers = Array.from({ length: size }, (_, i) => i + 1)

  return (
    <div className="be-wrap">
      <div className="be-col-labels" style={{ marginLeft: CELL_SIZE }}>
        {colLabels.map((label) => (
          <div key={label} className="be-label" style={{ width: CELL_SIZE }}>
            {label}
          </div>
        ))}
      </div>
      <div className="be-body">
        <div className="be-row-labels">
          {rowNumbers.map((n) => (
            <div key={n} className="be-label" style={{ height: CELL_SIZE }}>
              {n}
            </div>
          ))}
        </div>
        <div
          className="be-grid"
          style={{ gridTemplateColumns: `repeat(${size}, ${CELL_SIZE}px)` }}
        >
          {rowNumbers.map((row) =>
            colLabels.map((_, c) => {
              const cell = positionToCellKey({ row, col: c + 1 })
              let content = ''
              let cls = ''
              let cellCls = 'be-cell'
              if (starSet.has(cell)) {
                content = '⭐'
                cellCls += ' is-star'
              } else if (forbiddenSet.has(cell)) {
                content = '✕'
                cls = 'be-forbidden'
                cellCls += ' is-forbidden'
              } else if (allowedSet.has(cell)) {
                content = '△'
                cls = 'be-allowed'
              }
              return (
                <button
                  key={cell}
                  type="button"
                  className={cellCls}
                  style={{ width: CELL_SIZE, height: CELL_SIZE }}
                  onClick={() => onCellClick(cell)}
                  aria-label={cell}
                  title={cell}
                >
                  <span className={cls}>{content}</span>
                </button>
              )
            }),
          )}
        </div>
      </div>
    </div>
  )
}
