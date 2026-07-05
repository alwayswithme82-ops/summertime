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
  row: number
  col: number
  size: number
  mirror?: MirrorType
  isStar: boolean
  isForbidden: boolean
  isAllowed: boolean
  isEntry: boolean
  isExit: boolean
  /** 거울을 놓을 수 있는 빈 칸인지 (놓기 힌트 반짝임 대상). */
  isPlaceable: boolean
  /** 도구 선택 직후 잠깐 켜지는 "여기 누르면 돼" 반짝임. */
  showPlaceHint: boolean
  /** 반짝일 대상: 거울 도구면 빈 칸, 지우개면 거울 있는 칸. */
  hintMode: 'place' | 'erase'
  onClick: () => void
}

/** 스크린리더용 칸 설명. 좌표(A1) 대신 아이가 이해할 수 있는 말로. */
function cellLabel(row: number, col: number, props: PuzzleCellProps): string {
  const base = `${row}번째 줄 ${col}번째 칸`
  if (props.mirror) {
    return `${base}, ${props.mirror === '/' ? '/ 모양 거울' : '\\ 모양 거울'} 있음`
  }
  if (props.isStar) return `${base}, 별`
  if (props.isForbidden) return `${base}, 금지 칸`
  return base
}

/** 격자 한 칸. 거울/별/금지/허용 표시를 담당한다. (입구/출구는 보드 밖 화살표로 표시) */
export function PuzzleCell(props: PuzzleCellProps) {
  const { row, col, size, mirror, isStar, isForbidden, isAllowed, isEntry, isExit, isPlaceable, showPlaceHint, hintMode, onClick } = props
  const classes = ['pb-cell']
  if (isEntry) classes.push('is-entry')
  if (isExit) classes.push('is-exit')
  if (isStar && !mirror) classes.push('is-star')
  if (isForbidden && !mirror) classes.push('is-forbidden')
  if (isAllowed) classes.push('is-allowed')
  const hintTarget = hintMode === 'erase' ? Boolean(mirror) : isPlaceable && !mirror
  if (showPlaceHint && hintTarget) classes.push('is-place-hint')

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
      aria-label={cellLabel(row, col, props)}
    >
      {content}
    </button>
  )
}
