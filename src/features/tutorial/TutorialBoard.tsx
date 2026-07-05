import type { CSSProperties } from 'react'
import type { CellKey, Direction, EdgePoint, PathStep, PlacedMirrors, Puzzle } from '../../core'
import { cellKeyToPosition, colToLetters, directionToDelta, positionToCellKey } from '../../core'
import { MirrorIcon } from '../../components/MirrorIcon'

/* 튜토리얼 보드는 자체 좌표계로 그린다(강조/손가락/빛을 픽셀로 얹기 위함). */
const CELL = 60
const GAP = 6
const EDGE = 46 // 격자 바깥 입구/출구 띠

interface BeamInfo {
  steps: PathStep[]
  extend: boolean
  finalDirection?: Direction
}

interface TutorialBoardProps {
  puzzle: Puzzle
  placed: PlacedMirrors
  /** 지금 클릭할 수 있는 칸(그 외에는 잠금). null = 전부 잠금. */
  interactiveCells: CellKey[] | null
  /** 스포트라이트로 밝힐 칸(나머지는 어둡게). null = 스포트라이트 없음. */
  spotlight: CellKey | null
  /** 전체를 살짝 어둡게 할지(포커스 연출). */
  dimmed: boolean
  /** 손가락(화살표)으로 가리킬 칸. */
  finger: CellKey | null
  /** 입구/출구 마커를 반짝이게 할지. */
  glowEntry: boolean
  glowExit: boolean
  /** 빛줄기(한 칸씩 자라남). null = 안 보임. */
  beam: BeamInfo | null
  reduceMotion: boolean
  onCellClick: (cell: CellKey) => void
}

function SketchStar({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.4 L14.7 8.7 L21.4 9.2 L16.3 13.7 L18 20.2 L12 16.6 L5.9 20.4 L7.6 13.6 L2.6 9.1 L9.4 8.8 Z"
        fill="var(--yellow-soft)"
        stroke="var(--star)"
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** 아래를 가리키는 손 모양 포인터(이모지 아님, SVG). */
function FingerPointer() {
  return (
    <svg className="tb-finger" width="34" height="40" viewBox="0 0 34 40" aria-hidden="true">
      <path
        d="M15 2 C12.5 2 11 3.7 11 6.2 L11 18 L9 16.4 C7.2 15 4.6 15.3 3.4 17 C2.4 18.4 2.7 20.2 4 21.6 L11.5 30 C13.4 32.2 16 33.6 19 33.6 L22 33.6 C26.4 33.6 30 30 30 25.6 L30 15.5 C30 13.4 28.3 11.7 26.2 11.7 C25.6 11.7 25 11.9 24.5 12.2 C24.2 10.4 22.6 9 20.7 9 C20 9 19.4 9.2 18.9 9.5 C18.5 8 17.1 6.9 15.5 6.9 L15 6.9 Z"
        fill="#ffd65c"
        stroke="#8a5726"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function TutorialBoard({
  puzzle,
  placed,
  interactiveCells,
  spotlight,
  dimmed,
  finger,
  glowEntry,
  glowExit,
  beam,
  reduceMotion,
  onCellClick,
}: TutorialBoardProps) {
  const { rows, cols } = puzzle
  const stars = new Set(puzzle.stars)
  const placeable = new Set(puzzle.allowedMirrorCells ?? [])
  const gridW = cols * CELL + (cols - 1) * GAP
  const gridH = rows * CELL + (rows - 1) * GAP
  const frameW = gridW + 2 * EDGE
  const frameH = gridH + 2 * EDGE
  const clickable = interactiveCells ? new Set(interactiveCells) : new Set<CellKey>()

  const centerX = (col: number) => EDGE + (col - 1) * (CELL + GAP) + CELL / 2
  const centerY = (row: number) => EDGE + (row - 1) * (CELL + GAP) + CELL / 2
  const cellCenter = (cell: CellKey) => {
    const p = cellKeyToPosition(cell)
    return { x: centerX(p.col), y: centerY(p.row) }
  }

  const rowNumbers = Array.from({ length: rows }, (_, i) => i + 1)
  const colLabels = Array.from({ length: cols }, (_, i) => colToLetters(i + 1))

  // 빛줄기 좌표(프레임 좌표계).
  let beamPointsAttr = ''
  if (beam && beam.steps.length > 0) {
    const pts = beam.steps.map((s) => [centerX(s.position.col), centerY(s.position.row)])
    if (beam.extend && beam.finalDirection) {
      const last = beam.steps[beam.steps.length - 1].position
      const delta = directionToDelta(beam.finalDirection)
      pts.push([
        centerX(last.col) + delta.dCol * (CELL + GAP),
        centerY(last.row) + delta.dRow * (CELL + GAP),
      ])
    }
    beamPointsAttr = pts.map(([x, y]) => `${x},${y}`).join(' ')
  }

  const spot = spotlight ? cellCenter(spotlight) : null
  const dimStyle = {
    '--spot-x': spot ? `${spot.x}px` : '50%',
    '--spot-y': spot ? `${spot.y}px` : '50%',
    '--spot-r': spot ? `${CELL * 0.72}px` : '0px',
  } as CSSProperties

  return (
    <div className="tb-frame" style={{ width: frameW, height: frameH }}>
      {/* 입구/출구 마커 */}
      <EdgeMark
        kind="entry"
        point={puzzle.entry}
        x={markX(puzzle.entry, frameW, centerX)}
        y={markY(puzzle.entry, frameH, centerY)}
        glow={glowEntry}
      />
      <EdgeMark
        kind="exit"
        point={puzzle.exit}
        x={markX(puzzle.exit, frameW, centerX)}
        y={markY(puzzle.exit, frameH, centerY)}
        glow={glowExit}
      />

      {/* 격자 */}
      <div
        className="tb-grid"
        style={{
          position: 'absolute',
          top: EDGE,
          left: EDGE,
          gridTemplateColumns: `repeat(${cols}, ${CELL}px)`,
          gridTemplateRows: `repeat(${rows}, ${CELL}px)`,
          gap: GAP,
        }}
      >
        {rowNumbers.map((row) =>
          colLabels.map((_, c) => {
            const cell = positionToCellKey({ row, col: c + 1 })
            const mirror = placed[cell]
            const isStar = stars.has(cell)
            const isPlaceable = placeable.has(cell) && !mirror
            const canClick = clickable.has(cell)
            const classes = ['tb-cell']
            if (isStar && !mirror) classes.push('is-star')
            if (isPlaceable) classes.push('is-placeable')
            if (canClick) classes.push('is-clickable')
            return (
              <button
                key={cell}
                type="button"
                className={classes.join(' ')}
                style={{ width: CELL, height: CELL }}
                onClick={() => onCellClick(cell)}
                disabled={!canClick}
                aria-label={cell}
                title={cell}
              >
                {mirror ? (
                  <MirrorIcon type={mirror} size={Math.round(CELL * 0.6)} className="tb-mirror" />
                ) : isStar ? (
                  <SketchStar size={Math.round(CELL * 0.62)} />
                ) : isPlaceable ? (
                  <span className="tb-placeable-mark" aria-hidden="true" />
                ) : null}
              </button>
            )
          }),
        )}
      </div>

      {/* 스포트라이트(포커스) — 지금 짚는 대상만 밝게 */}
      {dimmed && (
        <div
          className={`tb-dim${spot ? ' tb-dim--spot' : ''}${reduceMotion ? ' tb-dim--still' : ''}`}
          style={dimStyle}
          aria-hidden="true"
        />
      )}

      {/* 강조 링 + 손가락 + 빛줄기 (프레임 전체를 덮는 SVG/요소) */}
      <svg
        className="tb-fx"
        width={frameW}
        height={frameH}
        viewBox={`0 0 ${frameW} ${frameH}`}
        aria-hidden="true"
      >
        {beamPointsAttr && (
          <>
            <polyline className="tb-beam-glow" points={beamPointsAttr} />
            <polyline className="tb-beam-core" points={beamPointsAttr} />
            {!reduceMotion && <polyline className="tb-beam-spark" points={beamPointsAttr} />}
          </>
        )}
      </svg>

      {spot && (
        <span
          className={`tb-ring${reduceMotion ? ' tb-ring--still' : ''}`}
          style={{ left: spot.x, top: spot.y }}
          aria-hidden="true"
        />
      )}

      {finger && (
        <span
          className={`tb-finger-wrap${reduceMotion ? ' tb-finger-wrap--still' : ''}`}
          style={{ left: cellCenter(finger).x, top: cellCenter(finger).y - CELL * 0.72 }}
        >
          <FingerPointer />
        </span>
      )}
    </div>
  )
}

/* ---- 입구/출구 마커 ---- */

const ARROW_ROTATION: Record<Direction, number> = { RIGHT: 0, DOWN: 90, LEFT: 180, UP: 270 }

function entryArrowDir(side: EdgePoint['side']): Direction {
  return ({ TOP: 'DOWN', LEFT: 'RIGHT', RIGHT: 'LEFT', BOTTOM: 'UP' } as const)[side]
}
function exitArrowDir(side: EdgePoint['side']): Direction {
  return ({ TOP: 'UP', RIGHT: 'RIGHT', LEFT: 'LEFT', BOTTOM: 'DOWN' } as const)[side]
}

function markX(point: EdgePoint, frameW: number, centerX: (c: number) => number): number {
  switch (point.side) {
    case 'TOP':
    case 'BOTTOM':
      return centerX(point.index)
    case 'LEFT':
      return EDGE / 2
    case 'RIGHT':
      return frameW - EDGE / 2
  }
}
function markY(point: EdgePoint, frameH: number, centerY: (r: number) => number): number {
  switch (point.side) {
    case 'LEFT':
    case 'RIGHT':
      return centerY(point.index)
    case 'TOP':
      return EDGE / 2
    case 'BOTTOM':
      return frameH - EDGE / 2
  }
}

interface EdgeMarkProps {
  kind: 'entry' | 'exit'
  point: EdgePoint
  x: number
  y: number
  glow: boolean
}

function EdgeMark({ kind, point, x, y, glow }: EdgeMarkProps) {
  const rotation = ARROW_ROTATION[kind === 'entry' ? entryArrowDir(point.side) : exitArrowDir(point.side)]
  const label = kind === 'entry' ? '입구' : '출구'
  return (
    <span
      className={`tb-mark tb-mark--${kind}${glow ? ' tb-mark--glow' : ''}`}
      style={{ left: x, top: y }}
    >
      <span className="tb-mark-label">{label}</span>
      <svg width="18" height="18" viewBox="0 0 20 20" style={{ transform: `rotate(${rotation}deg)` }} aria-hidden="true">
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
    </span>
  )
}
