import type { MirrorType } from '../core'

interface MirrorIconProps {
  type: MirrorType
  /** 정사각 아이콘 한 변(px). */
  size?: number
  className?: string
}

/**
 * 거울 아이콘. 문자('/', '\')가 아니라 SVG 굵은 대각선으로 그린다.
 * - '/' : 왼쪽 아래 → 오른쪽 위로 올라가는 대각선
 * - '\' : 왼쪽 위 → 오른쪽 아래로 내려가는 대각선
 * 색은 currentColor를 따르므로 놓인 곳(보드/버튼)의 글자색으로 칠해진다.
 */
export function MirrorIcon({ type, size = 28, className }: MirrorIconProps) {
  const pad = size * 0.2
  const [x1, y1, x2, y2] =
    type === '/'
      ? [pad, size - pad, size - pad, pad] // 좌하 → 우상
      : [pad, pad, size - pad, size - pad] // 좌상 → 우하
  const width = Math.max(4, size * 0.16)

  // 거울면 위에 얹는 얇은 하이라이트 선의 수직 오프셋.
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const ox = (-dy / len) * width * 0.62
  const oy = (dx / len) * width * 0.62

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      data-mirror={type}
      role="img"
      aria-label={type === '/' ? '/ 거울' : '\\ 거울'}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth={width}
        strokeLinecap="round"
      />
      {/* 거울 유리의 반짝임을 나타내는 얇은 하이라이트 */}
      <line
        x1={x1 + dx * 0.18 + ox}
        y1={y1 + dy * 0.18 + oy}
        x2={x1 + dx * 0.5 + ox}
        y2={y1 + dy * 0.5 + oy}
        stroke="currentColor"
        strokeWidth={Math.max(1.6, width * 0.34)}
        strokeLinecap="round"
        opacity={0.4}
      />
    </svg>
  )
}
