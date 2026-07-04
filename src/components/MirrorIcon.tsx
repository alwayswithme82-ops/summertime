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

  // 직선 대신 살짝 떨리게 휘는 손그림 대각선.
  // 두 제어점을 진행 방향의 수직으로 반대로 밀어 미세한 S자 흔들림을 준다.
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const px = -dy / len
  const py = dx / len
  const amp = size * 0.05
  const c1x = x1 + dx * 0.32 + px * amp
  const c1y = y1 + dy * 0.32 + py * amp
  const c2x = x1 + dx * 0.68 - px * amp
  const c2y = y1 + dy * 0.68 - py * amp
  const d = `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`
  const width = Math.max(3.5, size * 0.15)

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
      {/* 옅게 겹쳐 그린 밑선 — 두 번 그은 연필 느낌 */}
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.28}
        transform="translate(0.6 0.6)"
      />
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
