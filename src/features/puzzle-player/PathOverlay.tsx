import type { Direction, PathStep } from '../../core'
import { directionToDelta } from '../../core'

/** 빛이 한 칸 나아가는 데 걸리는 시간(ms). 아이가 과정을 눈으로 따라갈 수 있는 속도. */
export const CELL_MS = 320

/** 경로 칸 수 → 빛이 끝까지 그려지는 총 시간(ms). 결과 표시 타이밍에도 쓴다. */
export function beamDurationMs(pathCells: number): number {
  return Math.max(500, pathCells * CELL_MS)
}

interface PathOverlayProps {
  path: PathStep[]
  rows: number
  cols: number
  cellSize: number
  finalDirection?: Direction
  exited?: boolean
  /** 성공/실패에 따라 빛 색이 달라진다(성공·진행=노랑, 실패=빨강). */
  status?: 'success' | 'fail' | null
}

/* .pb-grid의 gap(2px)과 반드시 같아야 빛이 칸 중심을 지난다. */
const GRID_GAP = 2

export function PathOverlay({
  path,
  rows,
  cols,
  cellSize,
  finalDirection,
  exited,
  status,
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

  // 빛이 입구부터 한 칸씩 그려지도록 stroke-dashoffset 애니메이션에 쓸 전체 길이.
  let beamLength = 0
  for (let i = 1; i < points.length; i += 1) {
    beamLength += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1])
  }
  const durationMs = beamDurationMs(points.length - 1)

  const statusClass = status ? ` is-${status}` : ''

  return (
    <svg
      className={`path-overlay${statusClass}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={
        {
          '--beam-len': beamLength,
          '--beam-ms': `${durationMs}ms`,
        } as React.CSSProperties
      }
    >
      <defs>
        <filter id="beam-glow" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      {/* 노란 발광 빔이 입구에서 출구 쪽으로 한 칸씩 그려진다.
          바깥 글로우(번짐) → 코어 → 흐르는 하이라이트 순으로 얹는다.
          실패하면 다 그려진 뒤 빔 전체가 빨갛게 물든다. */}
      <polyline className="path-glow" points={pointsAttribute} />
      <polyline className="path-core" points={pointsAttribute} />
      <polyline className="path-spark" points={pointsAttribute} />
      {/* 빛 시작점(입구)의 작은 발광 원 */}
      <circle className="path-origin-glow" cx={points[0][0]} cy={points[0][1]} r={11} />
      <circle className="path-origin" cx={points[0][0]} cy={points[0][1]} r={5.5} />
    </svg>
  )
}
