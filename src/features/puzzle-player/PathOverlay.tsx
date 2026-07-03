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
 * 빛의 이동 경로를 보드 위에 빛나는 앰버색 광선(SVG path)으로 표시한다.
 * 시각화만 담당하며 시뮬레이션 로직은 건드리지 않는다.
 * - 광선이 입구부터 스르륵 그려지는 애니메이션(stroke-dashoffset)
 * - 경로를 따라 반복해서 달리는 광자(photon) 원
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
  const d = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`)
    .join(' ')

  // 전체 길이(직선 구간 합) — 그려지기 애니메이션과 광자 속도에 사용.
  let totalLen = 0
  for (let i = 1; i < points.length; i++) {
    totalLen +=
      Math.abs(points[i][0] - points[i - 1][0]) + Math.abs(points[i][1] - points[i - 1][1])
  }
  const drawDur = Math.min(1.6, 0.25 + totalLen / 600) // 길수록 조금 더 길게, 최대 1.6초
  const photonDur = Math.max(1.2, totalLen / 220) // 광자 순회 시간

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
        <filter id="beam-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 바깥쪽 은은한 빛 번짐 */}
      <path
        d={d}
        fill="none"
        stroke="rgba(251, 191, 36, 0.35)"
        strokeWidth={11}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={totalLen}
        strokeDashoffset={totalLen}
        filter="url(#beam-glow)"
      >
        <animate
          attributeName="stroke-dashoffset"
          from={totalLen}
          to={0}
          dur={`${drawDur}s`}
          fill="freeze"
        />
      </path>

      {/* 광선 본체 */}
      <path
        id="beam-core"
        d={d}
        fill="none"
        stroke="#fbbf24"
        strokeWidth={4}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={totalLen}
        strokeDashoffset={totalLen}
      >
        <animate
          attributeName="stroke-dashoffset"
          from={totalLen}
          to={0}
          dur={`${drawDur}s`}
          fill="freeze"
        />
      </path>

      {/* 출발점 표시 */}
      <circle cx={points[0][0]} cy={points[0][1]} r={6} fill="#fde68a">
        <animate attributeName="r" values="5;7;5" dur="1.4s" repeatCount="indefinite" />
      </circle>

      {/* 경로를 따라 달리는 광자 */}
      <circle r={5} fill="#fffbeb" filter="url(#beam-glow)">
        <animateMotion
          dur={`${photonDur}s`}
          begin={`${drawDur}s`}
          repeatCount="indefinite"
          path={d}
        />
      </circle>
    </svg>
  )
}
