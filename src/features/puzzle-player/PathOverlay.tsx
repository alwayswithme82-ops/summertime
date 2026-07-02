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

/**
 * 빛의 이동 경로를 보드 위에 빨간 선(SVG polyline)으로 표시한다.
 * 시각화만 담당하며 시뮬레이션 로직은 건드리지 않는다.
 * path의 각 칸 중앙점을 잇고, 마지막엔 출구 방향으로 보드 밖으로 살짝 나가게 그린다.
 */
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
    (col - 0.5) * cellSize,
    (row - 0.5) * cellSize,
  ]

  const points: [number, number][] = path.map((s) => center(s.position.col, s.position.row))

  // 출구 방향으로 마지막 선을 보드 바깥으로 조금 연장한다.
  if (exited && finalDirection) {
    const last = path[path.length - 1].position
    const d = directionToDelta(finalDirection)
    const [x, y] = center(last.col, last.row)
    points.push([x + d.dCol * cellSize, y + d.dRow * cellSize])
  }

  const width = cols * cellSize
  const height = rows * cellSize
  const pointsAttr = points.map(([x, y]) => `${x},${y}`).join(' ')

  return (
    <svg
      className="path-overlay"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points={pointsAttr}
        fill="none"
        stroke="#2563eb"
        strokeWidth={5}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.85}
      />
      {points.length > 0 && (
        <circle cx={points[0][0]} cy={points[0][1]} r={6} fill="#2563eb" />
      )}
    </svg>
  )
}
