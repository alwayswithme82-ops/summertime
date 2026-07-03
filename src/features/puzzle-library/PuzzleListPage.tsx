import type { Puzzle } from '../../core'
import { samplePuzzles } from '../../data/samplePuzzles'
import { PuzzleCard } from './PuzzleCard'
import './puzzle-library.css'

interface PuzzleListPageProps {
  onSelect: (puzzle: Puzzle) => void
}

export function PuzzleListPage({ onSelect }: PuzzleListPageProps) {
  return (
    <div className="puzzle-list-page">
      <header className="plp-hero">
        <div className="plp-hero-copy">
          <p className="plp-eyebrow">빛 · 거울 · 반사</p>
          <h1 className="plp-title">
            빛의 길을
            <br />
            <span className="plp-title-accent">직접 설계해요</span>
          </h1>
          <p className="plp-lead">
            거울의 방향을 바꾸고 빛의 움직임을 예측해 보세요.
            별을 모두 통과해 정해진 출구에 도착하면 설계 성공!
          </p>
          <div className="plp-meta" aria-label="활동 특징">
            <span>✦ 5개의 단계</span>
            <span>⌁ 즉시 실행</span>
            <span>✓ 정답 자동 확인</span>
          </div>
        </div>

        <div className="plp-hero-art" aria-hidden="true">
          <div className="plp-art-board" />
          <svg className="plp-art-beam" viewBox="0 0 240 182">
            <path d="M10 162 H90 V78 H180 V18 H228" />
          </svg>
          <span className="plp-art-star is-one">★</span>
          <span className="plp-art-star is-two">★</span>
          <span className="plp-art-mirror" />
        </div>
      </header>

      <div className="plp-section-head">
        <h2 className="sr-only">문제 목록</h2>
        <div className="plp-section-title">
          <span className="plp-section-kicker">Choose a mission</span>
          <h3>도전할 문제를 골라요</h3>
        </div>
        <span className="plp-count">{samplePuzzles.length}개</span>
        <p className="plp-section-note">기초부터 큰 보드까지, 한 단계씩 도전해 보세요.</p>
      </div>

      <div className="plp-grid">
        {samplePuzzles.map((puzzle, index) => (
          <PuzzleCard
            key={puzzle.id}
            puzzle={puzzle}
            order={index}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
