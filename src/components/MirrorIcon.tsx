import type { MirrorType } from '../core'

interface MirrorIconProps {
  type: MirrorType
  /** 정사각 아이콘 한 변(px). */
  size?: number
  className?: string
}

/**
 * 거울 아이콘. 문자('/', '\')가 아니라 SVG 대각선 막대로 그린다.
 * - '/' : 왼쪽 아래 → 오른쪽 위로 올라가는 대각선
 * - '\' : 왼쪽 위 → 오른쪽 아래로 내려가는 대각선
 * 그림자 → 유리 몸통 → 광택 줄 → 반짝임 순으로 겹쳐 "유리 거울" 느낌을 낸다.
 * 색은 currentColor를 따르므로 놓인 곳(보드/버튼)의 글자색으로 칠해진다.
 * 빛이 꺾이는 방향은 들어오는 방향에 따라 달라지므로 화살표는 그리지 않는다.
 */
export function MirrorIcon({ type, size = 28, className }: MirrorIconProps) {
  const pad = size * 0.2
  // 두 끝점: y가 작은 쪽(top)이 위쪽 끝.
  const [x1, y1, x2, y2] =
    type === '/'
      ? [pad, size - pad, size - pad, pad] // 좌하 → 우상
      : [pad, pad, size - pad, size - pad] // 좌상 → 우하
  const width = Math.max(4, size * 0.18)

  // 선 방향 단위벡터(d)와 수직 단위벡터(p). 광택/반짝임 배치에 쓴다.
  const len = Math.hypot(x2 - x1, y2 - y1) || 1
  const dx = (x2 - x1) / len
  const dy = (y2 - y1) / len
  const px = -dy
  const py = dx

  // 위쪽 끝(윗변에 가까운 끝점)에서 25% 내려온 지점 — 반짝임 위치.
  const [tx, ty] = y1 < y2 ? [x1, y1] : [x2, y2]
  const toCenterX = y1 < y2 ? dx : -dx
  const toCenterY = y1 < y2 ? dy : -dy
  const sx = tx + toCenterX * len * 0.25
  const sy = ty + toCenterY * len * 0.25
  const tick = size * 0.085

  // 광택 줄: 몸통 위쪽 가장자리를 따라 흐르는 얇은 흰 선.
  const glossOffset = width * 0.26
  const g1x = x1 + dx * len * 0.16 - px * glossOffset
  const g1y = y1 + dy * len * 0.16 - py * glossOffset
  const g2x = x1 + dx * len * 0.6 - px * glossOffset
  const g2y = y1 + dy * len * 0.6 - py * glossOffset

  const shadow = size * 0.05

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      data-mirror={type}
      role="img"
      aria-label={type === '/' ? '/ 모양 거울' : '\\ 모양 거울'}
    >
      {/* 바닥 그림자 */}
      <line
        x1={x1 + shadow}
        y1={y1 + shadow}
        x2={x2 + shadow}
        y2={y2 + shadow}
        stroke="#000000"
        strokeWidth={width}
        strokeLinecap="round"
        opacity={0.16}
      />
      {/* 유리 몸통 */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth={width}
        strokeLinecap="round"
      />
      {/* 광택 줄 */}
      <line
        x1={g1x}
        y1={g1y}
        x2={g2x}
        y2={g2y}
        stroke="#ffffff"
        strokeWidth={Math.max(1.4, width * 0.3)}
        strokeLinecap="round"
        opacity={0.55}
      />
      {/* 반짝임(+자 스파클) */}
      <path
        d={`M ${sx - tick} ${sy} H ${sx + tick} M ${sx} ${sy - tick} V ${sy + tick}`}
        stroke="#ffffff"
        strokeWidth={Math.max(1.3, size * 0.05)}
        strokeLinecap="round"
        opacity={0.9}
      />
    </svg>
  )
}
