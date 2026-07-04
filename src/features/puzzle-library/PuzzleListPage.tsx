import type { Puzzle } from '../../core'
import { samplePuzzles } from '../../data/samplePuzzles'
import { PuzzleTile } from './PuzzleTile'
import './puzzle-library.css'

interface PuzzleListPageProps {
  onSelect: (puzzle: Puzzle) => void
}

const CLEARED_STORAGE_KEY = 'light-puzzle:cleared'

/** 클리어한 문제 id 목록을 localStorage에서 읽는다. 없거나 깨졌으면 빈 배열. */
function readClearedIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CLEARED_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

/** '하는 법' 3단계. 스케치풍 아이콘 + 한 줄 설명. */
const HOW_TO_STEPS = [
  {
    text: '거울(/ \\)을 빈 칸에 놓기',
    icon: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <rect x="6" y="6" width="28" height="28" rx="5" />
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

export function PuzzleListPage({ onSelect }: PuzzleListPageProps) {
  const clearedIds = readClearedIds()

  return (
    <div className="puzzle-list-page">
      <header className="plp-head">
        <h1 className="plp-title">거울을 설치해 빛을 탈출시켜라!</h1>
        <p className="plp-lead">
          거울로 빛을 반사시켜, 모든 별을 지나 출구로 내보내면 성공.
        </p>

        <ol className="plp-howto" aria-label="하는 법">
          {HOW_TO_STEPS.map((step, index) => (
            <li className="plp-step" key={step.text}>
              <span className="plp-step-num">{index + 1}</span>
              <span className="plp-step-icon">{step.icon}</span>
              <span className="plp-step-text">{step.text}</span>
            </li>
          ))}
        </ol>
      </header>

      <div className="plp-section-head">
        <h2 className="plp-section-title">문제를 골라 시작해요</h2>
        <span className="plp-count">{samplePuzzles.length}단계</span>
      </div>

      <div className="plp-grid">
        {samplePuzzles.map((puzzle, index) => (
          <PuzzleTile
            key={puzzle.id}
            puzzle={puzzle}
            order={index}
            cleared={clearedIds.includes(puzzle.id)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
