import type { MirrorType } from '../../core'
import { MirrorIcon } from '../../components/MirrorIcon'

/** 손으로 그린 듯한 별 윤곽선. 채우기보다 삐뚤한 스케치 선이 주인공. */
function SketchStar({ size }: { size: number }) {
  return (
    <svg
      className="pc-star"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label="목표 별"
    >
      <path
        d="M12 2.4 L14.7 8.7 L21.4 9.2 L16.3 13.7 L18 20.2 L12 16.6 L5.9 20.4 L7.6 13.6 L2.6 9.1 L9.4 8.8 Z"
        fill="var(--yellow-soft)"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

interface PuzzleCellProps {
  cellKey: string
  size: number
  mirror?: MirrorType
  isStar: boolean
  isForbidden: boolean
  isAllowed: boolean
  isEntry: boolean
  isExit: boolean
  onClick: () => void
}

/** 격자 한 칸. 거울/별/금지/허용 표시를 담당한다. (입구/출구는 보드 밖 화살표로 표시) */
export function PuzzleCell({
  cellKey,
  size,
  mirror,
  isStar,
  isForbidden,
  isAllowed,
  isEntry,
  isExit,
  onClick,
}: PuzzleCellProps) {
  const classes = ['pb-cell']
  if (isEntry) classes.push('is-entry')
  if (isExit) classes.push('is-exit')
  if (isStar && !mirror) classes.push('is-star')
  if (isForbidden && !mirror) classes.push('is-forbidden')
  if (isAllowed) classes.push('is-allowed')

  let content: React.ReactNode = null
  if (mirror) {
    content = <MirrorIcon type={mirror} size={Math.round(size * 0.6)} className="pc-mirror" />
  } else if (isStar) {
    content = <SketchStar size={Math.round(size * 0.62)} />
  } else if (isForbidden) {
    content = <span className="pc-forbidden">✕</span>
  } else if (isAllowed) {
    content = <span className="pc-allowed">△</span>
  }

  return (
    <button
      type="button"
      className={classes.join(' ')}
      style={{ width: size, height: size }}
      onClick={onClick}
      aria-label={cellKey}
      title={cellKey}
    >
      {content}
    </button>
  )
}
