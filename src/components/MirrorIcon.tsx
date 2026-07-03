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
        strokeWidth={Math.max(3.5, size * 0.14)}
        strokeLinecap="round"
      />
    </svg>
  )
}
