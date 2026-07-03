import type { Puzzle } from '../../core'
import { samplePuzzles } from '../../data/samplePuzzles'
import { PuzzleCard } from './PuzzleCard'
import './puzzle-library.css'

interface PuzzleListPageProps {
  onSelect: (puzzle: Puzzle) => void
}

/** 문제 목록 화면. 카드를 클릭하면 그 문제 플레이로 이동한다. */
export function PuzzleListPage({ onSelect }: PuzzleListPageProps) {
  return (
    <div className="puzzle-list-page">
      <h2>문제 목록</h2>
      <p className="plp-hint">풀고 싶은 문제를 골라 보세요.</p>
      <div className="plp-grid">
        {samplePuzzles.map((p) => (
          <PuzzleCard key={p.id} puzzle={p} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}
