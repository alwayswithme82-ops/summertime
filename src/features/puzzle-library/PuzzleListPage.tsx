import type { Puzzle } from '../../core'
import { samplePuzzles } from '../../data/samplePuzzles'
import { PuzzleCard } from './PuzzleCard'
import './puzzle-library.css'

interface PuzzleListPageProps {
  onSelect: (puzzle: Puzzle) => void
}

/** 문제 목록(레벨 선택) 화면. 카드를 클릭하면 그 문제 플레이로 이동한다. */
export function PuzzleListPage({ onSelect }: PuzzleListPageProps) {
  return (
    <div className="puzzle-list-page">
      <header className="plp-hero">
        <p className="plp-eyebrow">빛 · 거울 · 반사</p>
        <h1 className="plp-title">
          빛 반사 <span className="plp-title-accent">설계 활동</span>
        </h1>
        <p className="plp-lead">
          거울을 놓아 빛의 길을 설계하는 보드 퍼즐이에요. 별을 모두 지나 정해진 출구로 빛을
          내보내 보세요.
        </p>
      </header>

      <div className="plp-section-head">
        <h2>문제 목록</h2>
        <span className="plp-count">{samplePuzzles.length}개</span>
      </div>

      <div className="plp-grid">
        {samplePuzzles.map((p) => (
          <PuzzleCard key={p.id} puzzle={p} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}
