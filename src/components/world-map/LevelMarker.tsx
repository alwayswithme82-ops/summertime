import type { CSSProperties } from 'react'
import type { StageDifficulty } from '../../data/stages'
import MagnifierIcon from './icons/MagnifierIcon'
import StageFaceIcon from './icons/StageFaceIcon'
import StarIcon from './icons/StarIcon'

export type MarkerState = 'cleared' | 'current' | 'upcoming'

interface LevelMarkerProps {
  number: number
  difficulty: StageDifficulty
  difficultyLabel: string
  stars: number
  puzzleTitle: string
  state: MarkerState
  x: number
  y: number
  onSelect: () => void
}

const STATE_LABEL: Record<MarkerState, string> = {
  cleared: '완료',
  current: '현재 단계',
  upcoming: '도전 가능',
}

export default function LevelMarker({
  number,
  difficulty,
  difficultyLabel,
  stars,
  puzzleTitle,
  state,
  x,
  y,
  onSelect,
}: LevelMarkerProps) {
  const position = { '--marker-x': `${x}%`, '--marker-y': `${y}%` } as CSSProperties

  return (
    <button
      type="button"
      className={`level-marker level-marker--${state}`}
      style={position}
      onClick={onSelect}
      aria-label={`${number}단계, ${difficultyLabel}, 별 ${stars}개, ${STATE_LABEL[state]}`}
    >
      <span className="sr-only">{puzzleTitle}</span>
      <span className="level-marker__ground-shadow" aria-hidden="true" />
      <span className="level-marker__grass" aria-hidden="true" />
      <span className="level-marker__sign">
        {state === 'current' && (
          <span className="level-marker__current-icon" aria-hidden="true">
            <MagnifierIcon size={32} />
          </span>
        )}
        <span className="level-marker__stage-label">{number}단계</span>
        <span className="level-marker__number">{number}</span>
        <span className="level-marker__face">
          <StageFaceIcon
            className="level-marker__face-icon"
            mood={state === 'current' ? 'happy' : 'calm'}
          />
        </span>
      </span>
      <span className="level-marker__wood" aria-hidden="true" />
      <span className={`level-marker__info level-marker__info--${difficulty}`}>
        <span>{difficultyLabel}</span>
        <span className="level-marker__divider" aria-hidden="true" />
        <StarIcon size={16} className="level-marker__star" />
        <span>{stars}</span>
      </span>
    </button>
  )
}
