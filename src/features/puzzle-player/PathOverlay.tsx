import type { Direction, PathStep } from '../../core'
import { directionToDelta } from '../../core'

interface PathOverlayProps {
  path: PathStep[]
  rows: number
  cols: number
  cellSize: number
  finalDirection?: Direction
  exited?: boolean
}

const GRID_GAP = 3

export function PathOverlay({
  path,
  rows,
  cols,
  cellSize,
  finalDirection,
  exited,
}: PathOverlayProps) {
  if (path.length === 0) return null

  const center = (col: number, row: number): [number, number] => [
    (col - 0.5) * cellSize + (col - 1) * GRID_GAP,
    (row - 0.5) * cellSize + (row - 1) * GRID_GAP,
  ]

  const points: [number, number][] = path.map((step) =>
    center(step.position.col, step.position.row),
  )

  if (exited && finalDirection) {
    const last = path[path.length - 1].position
    const delta = directionToDelta(finalDirection)
    const [x, y] = center(last.col, last.row)
    const stepSize = cellSize + GRID_GAP
    points.push([x + delta.dCol * stepSize, y + delta.dRow * stepSize])
  }

  const width = cols * cellSize + (cols - 1) * GRID_GAP
  const height = rows * cellSize + (rows - 1) * GRID_GAP
  const pointsAttribute = points.map(([x, y]) => `${x},${y}`).join(' ')

  return (
    <svg
      className="path-overlay"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="beam-glow" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      {/* 손그림 배경과 대비되는 유일하게 매끈한 요소: 하얀 발광 빔.
          바깥 아이보리 글로우(번짐) → 하얀 코어 → 흐르는 하이라이트 순으로 얹는다. */}
      <polyline className="path-glow" points={pointsAttribute} />
      <polyline className="path-core" points={pointsAttribute} />
      <polyline className="path-spark" points={pointsAttribute} />
      {/* 빛 시작점(입구)의 작은 발광 원 */}
      <circle className="path-origin-glow" cx={points[0][0]} cy={points[0][1]} r={11} />
      <circle className="path-origin" cx={points[0][0]} cy={points[0][1]} r={5.5} />
    </svg>
  )
}
