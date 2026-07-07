import { useEffect } from 'react'

interface RulePanelProps {
  open: boolean
  onClose: () => void
}

/** '하는 법' 3단계. 스케치풍 아이콘 + 한 줄 설명. */
const HOW_TO_STEPS = [
  {
    text: '거울(/ \\)을 빈 칸에 놓기',
    icon: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <rect x="6" y="6" width="28" height="28" rx="4" />
        <path className="hs-mirror" d="M13 27 L27 13" />
      </svg>
    ),
  },
  {
    text: '실행하면 빛이 반사돼 나아감',
    icon: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path className="hs-beam" d="M6 30 L20 30 L20 14 L34 14" />
        <path className="hs-mirror" d="M15 35 L25 25" />
      </svg>
    ),
  },
  {
    text: '별을 모두 지나 출구로!',
    icon: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path
          className="hs-star"
          d="M20 6 L23.4 15.6 L33.5 15.9 L25.4 22 L28.2 31.7 L20 25.9 L11.8 31.7 L14.6 22 L6.5 15.9 L16.6 15.6 Z"
        />
        <path className="hs-arrow" d="M30 33 L36 33 M33 30 L36 33 L33 36" />
      </svg>
    ),
  },
]

/**
 * '이렇게 풀어요' 도움말 모달. ⓘ 버튼으로 열리고 닫기/배경 클릭/Esc로 닫힌다.
 * 문제 조건은 여기가 아니라 항상 보이는 GoalPanel이 보여준다.
 */
export function RulePanel({ open, onClose }: RulePanelProps) {
  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="rule-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="rule-modal panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rule-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="rule-modal-close"
          onClick={onClose}
          aria-label="도움말 닫기"
        >
          ×
        </button>

        <div className="rp-title">
          <h2 id="rule-modal-title">이렇게 풀어요</h2>
        </div>

        <ol className="rp-howto" aria-label="하는 법">
          {HOW_TO_STEPS.map((step, index) => (
            <li className="rp-howto-step" key={step.text}>
              <span className="rp-howto-num">{index + 1}</span>
              <span className="rp-howto-icon">{step.icon}</span>
              <span className="rp-howto-text">{step.text}</span>
            </li>
          ))}
        </ol>

        <div className="rule-modal-foot">
          <div className="rule-modal-actions">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              알겠어요
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
