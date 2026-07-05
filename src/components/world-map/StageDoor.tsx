import type { CSSProperties } from 'react'
import LockIcon from './icons/LockIcon'
import SparkleIcon from './icons/SparkleIcon'
import './StageDoor.css'

export type StageDoorStatus = 'current' | 'available' | 'completed' | 'locked'

interface StageDoorProps {
  id: number
  label: string
  puzzleTitle: string
  difficulty: string
  status: StageDoorStatus
  left: number
  top: number
  isActive: boolean
  isOpening: boolean
  onSelect: () => void
}

export default function StageDoor({
  id,
  label,
  puzzleTitle,
  difficulty,
  status,
  left,
  top,
  isActive,
  isOpening,
  onSelect,
}: StageDoorProps) {
  const isLocked = status === 'locked'
  const position = { '--door-left': `${left}%`, '--door-top': `${top}%` } as CSSProperties

  return (
    <button
      type="button"
      className={`stage-door stage-door--${status}${isActive ? ' stage-door--active' : ''}${isOpening ? ' stage-door--opening' : ''}`}
      style={position}
      onClick={onSelect}
      disabled={isLocked || isActive || isOpening}
      aria-label={
        isLocked
          ? `${label} ${difficulty} 잠김`
          : `${label} ${difficulty} 시작하기`
      }
    >
      <span className="sr-only">{puzzleTitle}</span>
      <span className="stage-door__label">{label}</span>
      <span className="stage-door__ground" aria-hidden="true" />

      <span className="stage-door__body" aria-hidden="true">
        <span className="stage-door__light" />
        <span className="stage-door__wing stage-door__wing--left" />
        <span className="stage-door__wing stage-door__wing--right" />
        <span className="stage-door__number">{id}</span>
        <span className="stage-door__knob stage-door__knob--left" />
        <span className="stage-door__knob stage-door__knob--right" />

        {status === 'current' && (
          <span className="stage-door__sparkles">
            <SparkleIcon className="stage-door__sparkle stage-door__sparkle--one" />
            <SparkleIcon className="stage-door__sparkle stage-door__sparkle--two" />
            <SparkleIcon className="stage-door__sparkle stage-door__sparkle--three" />
          </span>
        )}

        {status === 'completed' && (
          <span className="stage-door__completed" />
        )}

        {isLocked && (
          <span className="stage-door__lock">
            <LockIcon size={34} fill="#B79B70" stroke="#543C2B" />
          </span>
        )}
      </span>

      <span className="stage-door__info">
        <span>{difficulty}</span>
      </span>
    </button>
  )
}
