import type { MirrorType } from '../../core'

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

/** 격자 한 칸. 거울/별/금지/허용/입구/출구 표시를 담당한다. */
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

  let content: string | null = null
  let contentClass = ''
  if (mirror) {
    content = mirror
    contentClass = 'pc-mirror'
  } else if (isStar) {
    content = '⭐'
    contentClass = 'pc-star'
  } else if (isForbidden) {
    content = '✕'
    contentClass = 'pc-forbidden'
  } else if (isAllowed) {
    content = '△'
    contentClass = 'pc-allowed'
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
      {content && <span className={contentClass}>{content}</span>}
    </button>
  )
}
