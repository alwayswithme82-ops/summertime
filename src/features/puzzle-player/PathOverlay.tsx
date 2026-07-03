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
        <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff8b5" />
          <stop offset="45%" stopColor="#ffc928" />
          <stop offset="100%" stopColor="#f26b4b" />
        </linearGradient>
        <filter id="beam-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polyline className="path-track" points={pointsAttribute} />
      <polyline className="path-beam" points={pointsAttribute} />
      <circle className="path-origin" cx={points[0][0]} cy={points[0][1]} r={7} />
    </svg>
  )
}
