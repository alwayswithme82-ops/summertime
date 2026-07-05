import type { CSSProperties } from 'react'
import './StageDoor.css'

interface TutorialDoorProps {
  left: number
  top: number
  done: boolean
  isActive: boolean
  isOpening: boolean
  onSelect: () => void
}

/** 책 모양 글리프(이모지 아님, SVG). 튜토리얼 문 안에 표시. */
function BookGlyph() {
  return (
    <svg className="tutorial-door__glyph" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path
        d="M16 7 C12 4.5 7 4.5 4 6 L4 25 C7 23.5 12 23.5 16 26 C20 23.5 25 23.5 28 25 L28 6 C25 4.5 20 4.5 16 7 Z"
        fill="#fff6e2"
        stroke="#2b4f49"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M16 7 L16 26" fill="none" stroke="#2b4f49" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 11 Q10.5 10 13 11" fill="none" stroke="#2b4f49" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M19 11 Q21.5 10 25 11" fill="none" stroke="#2b4f49" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

/**
 * 월드맵의 튜토리얼 문. 기존 StageDoor 와 같은 문 뼈대(.stage-door)를 재사용하되
 * 색·라벨·글리프를 달리하고 "처음이라면?" 깃발을 달아 눈에 띄게 한다.
 * 입장 연출(active/opening)은 StageDoor 와 동일한 클래스로 동작한다.
 */
export default function TutorialDoor({
  left,
  top,
  done,
  isActive,
  isOpening,
  onSelect,
}: TutorialDoorProps) {
  const position = { '--door-left': `${left}%`, '--door-top': `${top}%` } as CSSProperties
  const className =
    'stage-door stage-door--tutorial' +
    (isActive ? ' stage-door--active' : '') +
    (isOpening ? ' stage-door--opening' : '')

  return (
    <button
      type="button"
      className={className}
      style={position}
      onClick={onSelect}
      disabled={isActive || isOpening}
      aria-label={done ? '튜토리얼 다시 하기 (완료함)' : '튜토리얼 시작하기, 처음이라면 여기부터'}
    >
      <span className="tutorial-door__flag" aria-hidden="true">처음이라면?</span>
      <span className="stage-door__ground" aria-hidden="true" />

      <span className="stage-door__body" aria-hidden="true">
        <span className="stage-door__light" />
        <span className="stage-door__wing stage-door__wing--left" />
        <span className="stage-door__wing stage-door__wing--right" />
        <BookGlyph />
        <span className="stage-door__knob stage-door__knob--left" />
        <span className="stage-door__knob stage-door__knob--right" />
        {done && <span className="stage-door__completed" />}
      </span>

      <span className="stage-door__info">
        <span>{done ? '튜토리얼 완료!' : '튜토리얼'}</span>
      </span>
    </button>
  )
}
