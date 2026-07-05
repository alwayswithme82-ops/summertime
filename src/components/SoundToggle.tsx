import { useState } from 'react'
import { isMuted, setMuted } from '../audio/engine'
import './sound-toggle.css'

/** 화면 구석에 떠 있는 소리 켜기/끄기 버튼. 설정은 localStorage에 유지된다. */
export function SoundToggle() {
  const [muted, setMutedState] = useState(isMuted)

  function toggle() {
    const next = !muted
    setMutedState(next)
    setMuted(next)
  }

  return (
    <button
      type="button"
      className="sound-toggle"
      onClick={toggle}
      aria-label={muted ? '소리 켜기' : '소리 끄기'}
      aria-pressed={!muted}
      title={muted ? '소리 켜기' : '소리 끄기'}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        {/* 스피커 몸통 */}
        <path
          d="M3.5 8.5 H7 L11.5 4.5 V17.5 L7 13.5 H3.5 Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {muted ? (
          /* 음소거: X 표시 */
          <path
            d="M14.5 8.5 L19 13 M19 8.5 L14.5 13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ) : (
          /* 소리 물결 */
          <>
            <path
              d="M14 8.2 Q16 11 14 13.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M16.4 6.4 Q19.4 11 16.4 15.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </button>
  )
}
