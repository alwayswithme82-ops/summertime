import { useEffect } from 'react'
import type { Direction, EdgeSide, Puzzle } from '../../core'
import { colToLetters } from '../../core'
import { MirrorIcon } from '../../components/MirrorIcon'

interface RulePanelProps {
  puzzle: Puzzle
  mirrorsUsed: number
  open: boolean
  onClose: () => void
  onShowSample?: () => void
  hideIntro?: boolean
  onToggleHideIntro?: (hide: boolean) => void
}

/** '하는 법' 3단계. 스케치풍 아이콘 + 한 줄 설명. 플레이 진입 시 안내로 노출. */
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

const SIDE_LABEL: Record<EdgeSide, string> = {
  TOP: '위쪽',
  BOTTOM: '아래쪽',
  LEFT: '왼쪽',
  RIGHT: '오른쪽',
}

const DIR_WORD: Record<Direction, string> = {
  UP: '위로',
  DOWN: '아래로',
  LEFT: '왼쪽으로',
  RIGHT: '오른쪽으로',
}

/** 가장자리 점을 "위쪽 C열" / "오른쪽 1행" 처럼 사람이 읽는 문구로. */
function describeEdge(side: EdgeSide, index: number): string {
  const where = side === 'TOP' || side === 'BOTTOM' ? `${colToLetters(index)}열` : `${index}행`
  return `${SIDE_LABEL[side]} ${where}`
}

/** "…열로" / "…행으로" 조사 처리. */
function toParticle(side: EdgeSide): string {
  return side === 'TOP' || side === 'BOTTOM' ? '로' : '으로'
}

const LEVEL_LABEL: Record<Puzzle['level'], string> = {
  BASIC: '기초',
  NORMAL: '보통',
  HARD: '어려움',
  LARGE: '대형',
}

/**
 * 문제 목표/규칙 안내 모달.
 * ⓘ 버튼 또는 문제 입장 시 열리고, 닫기 버튼/배경 클릭/Esc로 닫힌다.
 * 입구/출구는 문제에서 미리 정해진 조건이며, 학생은 거울 배치만 바꿀 수 있다.
 */
export function RulePanel({
  puzzle,
  mirrorsUsed,
  open,
  onClose,
  onShowSample,
  hideIntro,
  onToggleHideIntro,
}: RulePanelProps) {
  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const { rule } = puzzle

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
          aria-label="규칙 닫기"
        >
          ×
        </button>

        <div className="rp-title">
          <h2 id="rule-modal-title">{puzzle.title}</h2>
          <span className={`rp-level rp-level-${puzzle.level.toLowerCase()}`}>
            {LEVEL_LABEL[puzzle.level]}
          </span>
        </div>
        {puzzle.description && <p className="rp-desc">{puzzle.description}</p>}

        <h3 className="rp-subtitle">이렇게 풀어요</h3>
        <ol className="rp-howto" aria-label="하는 법">
          {HOW_TO_STEPS.map((step, index) => (
            <li className="rp-howto-step" key={step.text}>
              <span className="rp-howto-num">{index + 1}</span>
              <span className="rp-howto-icon">{step.icon}</span>
              <span className="rp-howto-text">{step.text}</span>
            </li>
          ))}
        </ol>

        <h3 className="rp-subtitle">성공 조건</h3>
        <ul className="rp-goals">
          <li>별 {rule.requiredStars.length}개 모두 지나기</li>
          {rule.forbiddenCells.length > 0 && <li>금지칸 지나지 않기</li>}
          <li>
            입구: {describeEdge(puzzle.entry.side, puzzle.entry.index)}에서{' '}
            {DIR_WORD[puzzle.entry.direction]} 시작
          </li>
          <li>
            출구: {describeEdge(puzzle.exit.side, puzzle.exit.index)}
            {toParticle(puzzle.exit.side)} 나가기
          </li>
          <li>
            거울: {mirrorsUsed} / {rule.exactMirrorCount ?? rule.maxMirrors}개
            {rule.exactMirrorCount ? ' (정확히)' : ' 이하'}
          </li>
          {rule.requiredMirrorCounts && (
            <li className="rp-mirror-counts">
              거울 종류:
              <MirrorIcon type="/" size={16} /> {rule.requiredMirrorCounts.slash ?? 0}개,
              <MirrorIcon type={'\\'} size={16} /> {rule.requiredMirrorCounts.backslash ?? 0}개
            </li>
          )}
        </ul>

        <div className="rule-modal-foot">
          {onToggleHideIntro && (
            <label className="rp-hide">
              <input
                type="checkbox"
                checked={hideIntro ?? false}
                onChange={(event) => onToggleHideIntro(event.target.checked)}
              />
              다시 보지 않기
            </label>
          )}
          <div className="rule-modal-actions">
            {onShowSample && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  onShowSample()
                  onClose()
                }}
                disabled={!puzzle.sampleAnswer}
              >
                예시 정답 보기
              </button>
            )}
            <button type="button" className="btn btn-primary" onClick={onClose}>
              알겠어요
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
