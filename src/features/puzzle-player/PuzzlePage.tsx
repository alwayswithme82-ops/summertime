import './puzzle-player.css'

interface PuzzlePageProps {
  puzzleId?: string
}

/** 학생용 퍼즐 플레이 화면 (스텁). */
export function PuzzlePage({ puzzleId }: PuzzlePageProps) {
  return (
    <div className="puzzle-page">
      <h2>퍼즐 플레이</h2>
      <p>puzzleId: {puzzleId ?? '(없음)'}</p>
    </div>
  )
}
