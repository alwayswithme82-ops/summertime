import type { EdgePoint, PlacedMirrors, Puzzle, SimulationResult } from '../../core'
import { positionToCellKey } from '../../core'
import { PuzzleCell } from './PuzzleCell'
import { PathOverlay } from './PathOverlay'

/** 문제 크기에 따라 칸 크기를 조절해 보드 전체 폭을 비슷하게 유지한다. */
function cellSizeFor(cols: number): number {
  if (cols <= 4) return 62
  if (cols <= 5) return 54
  return 42
}

/** 보드 바깥 입구/출구 화살표가 들어가는 띠의 두께. */
const EDGE_ZONE = 44

/** .pb-grid의 실제 렌더 치수(border/padding/gap) — CSS와 일치해야 마커가 칸 중심에 온다. */
const GRID_BORDER = 3
const GRID_PAD = 2
const GRID_GAP = 2

interface PuzzleBoardProps {
  puzzle: Puzzle
  placedMirrors: PlacedMirrors
  simulation: SimulationResult | null
  /** 실행 결과 성공/실패 — 빛 색(노랑/빨강)을 정한다. */
  resultStatus: 'success' | 'fail' | null
  /** 도구 선택 직후 대상 칸들을 잠깐 반짝여 "여기 누르면 돼"를 알려준다. */
  placeHint: boolean
  /** 반짝일 대상: 거울 도구면 빈 칸, 지우개면 거울 있는 칸. */
  hintMode: 'place' | 'erase'
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
  // 격자 원점(왼쪽 위)의 좌표. 바깥 띠(EDGE_ZONE)를 지나야 격자가 시작된다.
  const gridX = EDGE_ZONE
  const gridY = EDGE_ZONE

  const style: React.CSSProperties = { position: 'absolute' }
  // i번째 칸의 중심까지 거리 — 격자 테두리·안쪽 여백·칸 사이 간격을 모두 지나야 한다.
  const centerAlong = (i: number) =>
    GRID_BORDER + GRID_PAD + (i - 1) * (cellSize + GRID_GAP) + cellSize / 2
  // 격자 상자의 전체 폭/높이(테두리 포함).
  const gridSpan = (count: number) =>
    2 * (GRID_BORDER + GRID_PAD) + count * cellSize + (count - 1) * GRID_GAP

  switch (side) {
    case 'TOP':
      style.left = gridX + centerAlong(index)
      style.top = 2
      style.transform = 'translateX(-50%)'
      break
    case 'BOTTOM':
      style.left = gridX + centerAlong(index)
      style.top = gridY + gridSpan(rows) + 4
      style.transform = 'translateX(-50%)'
      break
    case 'LEFT':
      style.left = 0
      style.top = gridY + centerAlong(index)
      style.transform = 'translateY(-50%)'
      break
    case 'RIGHT':
      style.left = gridX + gridSpan(cols) + 6
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

/** 격자판. 칸/입출구 화살표를 그리고 그 위에 빛 경로(PathOverlay)를 얹는다. */
export function PuzzleBoard({
  puzzle,
  placedMirrors,
  simulation,
  resultStatus,
  placeHint,
  hintMode,
  onCellClick,
}: PuzzleBoardProps) {
  const { rows, cols } = puzzle
  const CELL_SIZE = cellSizeFor(cols)
  const stars = new Set(puzzle.stars)
  const forbidden = new Set(puzzle.forbiddenCells)
  const allowed = new Set(puzzle.rule.allowedMirrorCells ?? puzzle.allowedMirrorCells ?? [])
  const isMarkedOnly = puzzle.rule.mirrorPlacementMode === 'MARKED_ONLY'
  const entryCell = entryCellKey(puzzle)
  const exitCell = exitCellKey(puzzle)

  const rowNumbers = Array.from({ length: rows }, (_, i) => i + 1)
  const colNumbers = Array.from({ length: cols }, (_, i) => i + 1)

  return (
    <div className="pb-wrap">
      {/* 바깥 띠(EDGE_ZONE)에 입구/출구 화살표가, 안쪽에 격자가 놓인다. */}
      <div className="pb-frame" style={{ position: 'relative', padding: EDGE_ZONE }}>
        <div
          className="pb-grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,
          }}
        >
          {rowNumbers.map((row) =>
            colNumbers.map((col) => {
              const cellKey = positionToCellKey({ row, col })
              const isStar = stars.has(cellKey)
              const isForbidden = forbidden.has(cellKey)
              const isPlaceable =
                !isStar && !isForbidden && (!isMarkedOnly || allowed.has(cellKey))
              return (
                <PuzzleCell
                  key={cellKey}
                  row={row}
                  col={col}
                  size={CELL_SIZE}
                  mirror={placedMirrors[cellKey]}
                  isStar={isStar}
                  isForbidden={isForbidden}
                  isAllowed={isMarkedOnly && allowed.has(cellKey)}
                  isEntry={cellKey === entryCell}
                  isExit={cellKey === exitCell}
                  isPlaceable={isPlaceable}
                  showPlaceHint={placeHint}
                  hintMode={hintMode}
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
              status={resultStatus}
            />
          )}
        </div>

        {/* 입구/출구 고정 표시 (학생이 변경 불가) */}
        <EdgeMarker kind="entry" point={puzzle.entry} rows={rows} cols={cols} cellSize={CELL_SIZE} />
        <EdgeMarker kind="exit" point={puzzle.exit} rows={rows} cols={cols} cellSize={CELL_SIZE} />
      </div>
    </div>
  )
}
