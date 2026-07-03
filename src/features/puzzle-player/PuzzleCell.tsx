import type { MirrorType } from '../../core'
import { MirrorIcon } from '../../components/MirrorIcon'

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
    content = <span className="pc-star">★</span>
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
