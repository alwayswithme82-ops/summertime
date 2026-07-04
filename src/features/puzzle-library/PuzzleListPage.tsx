import type { Puzzle } from '../../core'
import { samplePuzzles } from '../../data/samplePuzzles'
import { PuzzleTile } from './PuzzleTile'
import './puzzle-library.css'

interface PuzzleListPageProps {
  onSelect: (puzzle: Puzzle) => void
}

const CLEARED_STORAGE_KEY = 'cleared_puzzle_ids'

/** 난이도(쉬운→어려운) 순서로 노출한다. */
const PUZZLE_ORDER = ['p4', 'p1', 'p2', 'p3', 'p5']

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

/** 지정한 난이도 순으로 정렬. 목록에 없는 문제는 뒤에 붙인다. */
function orderPuzzles(puzzles: Puzzle[]): Puzzle[] {
  const byId = new Map(puzzles.map((p) => [p.id, p]))
  const ordered = PUZZLE_ORDER.map((id) => byId.get(id)).filter(
    (p): p is Puzzle => p !== undefined,
  )
  const rest = puzzles.filter((p) => !PUZZLE_ORDER.includes(p.id))
  return [...ordered, ...rest]
}

export function PuzzleListPage({ onSelect }: PuzzleListPageProps) {
  const clearedIds = readClearedIds()
  const puzzles = orderPuzzles(samplePuzzles)
  const clearedCount = puzzles.filter((p) => clearedIds.includes(p.id)).length

  return (
    <div className="puzzle-list-page">
      <header className="plp-head">
        <h1 className="plp-title">거울을 설치해 빛을 탈출시켜라!</h1>
        <p className="plp-lead">
          거울로 빛을 반사시켜, 모든 별을 지나 출구로 내보내면 성공.
        </p>
      </header>

      <div className="plp-section-head">
        <h2 className="plp-section-title">단계를 골라 시작해요</h2>
        <span className="plp-progress">
          전체 {puzzles.length}단계 · {clearedCount}개 완료
        </span>
      </div>

      <div className="plp-grid">
        {puzzles.map((puzzle, index) => (
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
