import type { EdgePoint, PlacedMirrors, Puzzle, SimulationResult } from '../../core'
import { colToLetters, positionToCellKey } from '../../core'
import { PuzzleCell } from './PuzzleCell'
import { PathOverlay } from './PathOverlay'

/** 문제 크기에 따라 칸 크기를 조절해 보드 전체 폭을 비슷하게 유지한다. */
function cellSizeFor(cols: number): number {
  if (cols <= 4) return 62
  if (cols <= 5) return 54
  return 42
}

/** 행 라벨(1,2,3…)이 차지하는 왼쪽 여백. 열 라벨 정렬에도 똑같이 쓴다. */
const GUTTER = 26
/** 열 라벨 줄 높이. */
const LABEL_H = 22
/** 보드 바깥 입구/출구 화살표가 들어가는 띠의 두께. */
const EDGE_ZONE = 44

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

/** 화살표가 가리킬 방향(회전 각도). 오른쪽(→)을 0도로 본다. */
const ROTATION: Record<string, number> = { RIGHT: 0, DOWN: 90, LEFT: 180, UP: 270 }

/**
 * 입구/출구 화살표 방향 규칙(기획 고정):
 * - 입구: 빛이 들어가는 방향 (TOP→↓, LEFT→→, RIGHT→←, BOTTOM→↑)
 * - 출구: 빛이 나가는 방향 (TOP→↑, RIGHT→→, LEFT→←, BOTTOM→↓)
 */
function markerArrowDirection(kind: 'entry' | 'exit', side: EdgePoint['side']): string {
  if (kind === 'entry') {
    return { TOP: 'DOWN', LEFT: 'RIGHT', RIGHT: 'LEFT', BOTTOM: 'UP' }[side]
  }
  return { TOP: 'UP', RIGHT: 'RIGHT', LEFT: 'LEFT', BOTTOM: 'DOWN' }[side]
}

interface EdgeMarkerProps {
  kind: 'entry' | 'exit'
  point: EdgePoint
  rows: number
  cols: number
  cellSize: number
}

/**
 * 보드 바깥 여백에 고정 표시되는 입구/출구 마커(화살표 + 라벨).
 * 학생이 클릭하거나 바꿀 수 없는 안내용 표시다.
 */
function EdgeMarker({ kind, point, rows, cols, cellSize }: EdgeMarkerProps) {
  const { side, index } = point
  // 격자 원점(왼쪽 위)의 좌표. 바깥 띠(EDGE_ZONE) + 라벨 여백을 지나야 격자가 시작된다.
  const gridX = EDGE_ZONE + GUTTER
  const gridY = EDGE_ZONE + LABEL_H

  const style: React.CSSProperties = { position: 'absolute' }
  const centerAlong = (i: number) => (i - 0.5) * cellSize

  switch (side) {
    case 'TOP':
      style.left = gridX + centerAlong(index)
      style.top = 2
      style.transform = 'translateX(-50%)'
      break
    case 'BOTTOM':
      style.left = gridX + centerAlong(index)
      style.top = gridY + rows * cellSize + 4
      style.transform = 'translateX(-50%)'
      break
    case 'LEFT':
      style.left = 0
      style.top = gridY + centerAlong(index)
      style.transform = 'translateY(-50%)'
      break
    case 'RIGHT':
      style.left = gridX + cols * cellSize + 6
      style.top = gridY + centerAlong(index)
      style.transform = 'translateY(-50%)'
      break
  }

  const rotation = ROTATION[markerArrowDirection(kind, side)]
  const label = kind === 'entry' ? '입구' : '출구'

  return (
    <div className={`pb-marker pb-marker-${kind}`} style={style}>
      <span className="pb-marker-label">{label}</span>
      <svg
        className="pb-marker-arrow"
        width={20}
        height={20}
        viewBox="0 0 20 20"
        style={{ transform: `rotate(${rotation}deg)` }}
        aria-hidden="true"
      >
        {/* 손그림 화살표: 살짝 휜 자루 + 삐뚤한 촉, 둥근 선끝 */}
        <path
          d="M2.4 10.4 Q8 9.2 13.8 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M10 4.2 Q16.6 9.6 13.9 10.1 Q16.4 11 10.2 16.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

/** 격자판. 라벨/칸/입출구 화살표를 그리고 그 위에 빛 경로(PathOverlay)를 얹는다. */
export function PuzzleBoard({ puzzle, placedMirrors, simulation, onCellClick }: PuzzleBoardProps) {
  const { rows, cols } = puzzle
  const CELL_SIZE = cellSizeFor(cols)
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
      {/* 바깥 띠(EDGE_ZONE)에 입구/출구 화살표가, 안쪽에 라벨과 격자가 놓인다. */}
      <div className="pb-frame" style={{ position: 'relative', padding: EDGE_ZONE }}>
        {/* 열 라벨 — 각 칸 중앙 위에 정렬 */}
        <div className="pb-col-labels" style={{ marginLeft: GUTTER, height: LABEL_H }}>
          {colLabels.map((label) => (
            <div key={label} className="pb-label" style={{ width: CELL_SIZE }}>
              {label}
            </div>
          ))}
        </div>

        <div className="pb-body">
          {/* 행 라벨 — 각 행 중앙 왼쪽에 정렬 */}
          <div className="pb-row-labels" style={{ width: GUTTER }}>
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

        {/* 입구/출구 고정 표시 (학생이 변경 불가) */}
        <EdgeMarker kind="entry" point={puzzle.entry} rows={rows} cols={cols} cellSize={CELL_SIZE} />
        <EdgeMarker kind="exit" point={puzzle.exit} rows={rows} cols={cols} cellSize={CELL_SIZE} />
      </div>
    </div>
  )
}
