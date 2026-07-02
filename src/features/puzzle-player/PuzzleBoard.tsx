import type { PlacedMirrors, Puzzle, SimulationResult } from '../../core'
import { colToLetters, positionToCellKey } from '../../core'
import { PuzzleCell } from './PuzzleCell'
import { PathOverlay } from './PathOverlay'

const CELL_SIZE = 52

interface PuzzleBoardProps {
  puzzle: Puzzle
  placedMirrors: PlacedMirrors
  simulation: SimulationResult | null
  onCellClick: (cellKey: string) => void
}

/** 출구 EdgePoint가 붙은 마지막 보드 칸의 CellKey. */
function exitCellKey(puzzle: Puzzle): string {
  const { exit, rows, cols } = puzzle
  switch (exit.side) {
    case 'TOP':
      return positionToCellKey({ row: 1, col: exit.index })
    case 'BOTTOM':
      return positionToCellKey({ row: rows, col: exit.index })
    case 'LEFT':
      return positionToCellKey({ row: exit.index, col: 1 })
    case 'RIGHT':
      return positionToCellKey({ row: exit.index, col: cols })
  }
}

function entryCellKey(puzzle: Puzzle): string {
  const { entry, rows, cols } = puzzle
  switch (entry.side) {
    case 'TOP':
      return positionToCellKey({ row: 1, col: entry.index })
    case 'BOTTOM':
      return positionToCellKey({ row: rows, col: entry.index })
    case 'LEFT':
      return positionToCellKey({ row: entry.index, col: 1 })
    case 'RIGHT':
      return positionToCellKey({ row: entry.index, col: cols })
  }
}

/** 격자판. 라벨과 칸을 그리고 그 위에 빛 경로(PathOverlay)를 얹는다. */
export function PuzzleBoard({ puzzle, placedMirrors, simulation, onCellClick }: PuzzleBoardProps) {
  const { rows, cols } = puzzle
  const stars = new Set(puzzle.stars)
  const forbidden = new Set(puzzle.forbiddenCells)
  const allowed = new Set(puzzle.rule.allowedMirrorCells ?? puzzle.allowedMirrorCells ?? [])
  const isMarkedOnly = puzzle.rule.mirrorPlacementMode === 'MARKED_ONLY'
  const entryCell = entryCellKey(puzzle)
  const exitCell = exitCellKey(puzzle)

  const colLabels = Array.from({ length: cols }, (_, i) => colToLetters(i + 1))
  const rowNumbers = Array.from({ length: rows }, (_, i) => i + 1)

  return (
    <div className="pb-wrap">
      {/* 열 라벨 */}
      <div className="pb-col-labels" style={{ marginLeft: CELL_SIZE }}>
        {colLabels.map((label) => (
          <div key={label} className="pb-label" style={{ width: CELL_SIZE }}>
            {label}
          </div>
        ))}
      </div>

      <div className="pb-body">
        {/* 행 라벨 */}
        <div className="pb-row-labels">
          {rowNumbers.map((n) => (
            <div key={n} className="pb-label" style={{ height: CELL_SIZE }}>
              {n}
            </div>
          ))}
        </div>

        <div
          className="pb-grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,
          }}
        >
          {rowNumbers.map((row) =>
            colLabels.map((_, c) => {
              const cellKey = positionToCellKey({ row, col: c + 1 })
              return (
                <PuzzleCell
                  key={cellKey}
                  cellKey={cellKey}
                  size={CELL_SIZE}
                  mirror={placedMirrors[cellKey]}
                  isStar={stars.has(cellKey)}
                  isForbidden={forbidden.has(cellKey)}
                  isAllowed={isMarkedOnly && allowed.has(cellKey)}
                  isEntry={cellKey === entryCell}
                  isExit={cellKey === exitCell}
                  onClick={() => onCellClick(cellKey)}
                />
              )
            }),
          )}

          {simulation && (
            <PathOverlay
              path={simulation.path}
              rows={rows}
              cols={cols}
              cellSize={CELL_SIZE}
              finalDirection={simulation.finalDirection}
              exited={simulation.exited}
            />
          )}
        </div>
      </div>
    </div>
  )
}
