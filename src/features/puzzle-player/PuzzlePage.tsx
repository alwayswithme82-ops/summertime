import { useMemo, useState } from 'react'
import type { MirrorType, PlacedMirrors, Puzzle, ValidationResult } from '../../core'
import { validateSolution, scoreSolution, cellKeyToPosition } from '../../core'
import { samplePuzzles } from '../../data/samplePuzzles'
import { PuzzleBoard } from './PuzzleBoard'
import { MirrorPalette } from './MirrorPalette'
import { RulePanel } from './RulePanel'
import { ResultPanel } from './ResultPanel'
import { DebugPanel } from './DebugPanel'
import './puzzle-player.css'

/** 별/금지칸/허용칸 정책에 따라 이 칸에 거울을 놓을 수 있는지. */
function canPlaceMirror(puzzle: Puzzle, cellKey: string): boolean {
  if (puzzle.stars.includes(cellKey)) return false
  if (puzzle.forbiddenCells.includes(cellKey)) return false
  const pos = cellKeyToPosition(cellKey)
  if (pos.row < 1 || pos.row > puzzle.rows || pos.col < 1 || pos.col > puzzle.cols) return false
  if (puzzle.rule.mirrorPlacementMode === 'MARKED_ONLY') {
    const allowed = puzzle.rule.allowedMirrorCells ?? puzzle.allowedMirrorCells ?? []
    if (!allowed.includes(cellKey)) return false
  }
  return true
}

interface PuzzlePageProps {
  /** 플레이할 문제. 생략하면 첫 번째 예제 문제. */
  puzzle?: Puzzle
  /** 문제 목록으로 돌아가기(있으면 버튼 표시). */
  onBack?: () => void
}

/** 학생용 퍼즐 플레이 화면. 정답 판정은 validateSolution만 사용한다. */
export function PuzzlePage({ puzzle = samplePuzzles[0], onBack }: PuzzlePageProps = {}) {
  const [placedMirrors, setPlacedMirrors] = useState<PlacedMirrors>({})
  const [selectedMirror, setSelectedMirror] = useState<MirrorType>('/')
  const [result, setResult] = useState<ValidationResult | null>(null)

  const score = useMemo(
    () => (result ? scoreSolution(puzzle, result, placedMirrors) : null),
    [result, puzzle, placedMirrors],
  )

  function handleCellClick(cellKey: string) {
    if (!canPlaceMirror(puzzle, cellKey)) return
    setResult(null) // 배치가 바뀌면 이전 결과/경로는 지운다.
    setPlacedMirrors((prev) => {
      const next = { ...prev }
      if (next[cellKey] === selectedMirror) {
        delete next[cellKey] // 같은 거울을 다시 클릭 → 제거
      } else {
        next[cellKey] = selectedMirror // 없거나 다른 거울 → 선택한 거울로 교체
      }
      return next
    })
  }

  function handleRun() {
    setResult(validateSolution(puzzle, placedMirrors))
  }

  function handleReset() {
    setPlacedMirrors({})
    setResult(null)
  }

  function handleShowSample() {
    const sample = puzzle.sampleAnswer
    if (!sample) return
    // 학생의 현재 배치를 덮어쓰기 전에 확인.
    if (Object.keys(placedMirrors).length > 0) {
      const ok = window.confirm('지금 놓은 거울을 지우고 예시 정답을 보여줄까요?')
      if (!ok) return
    }
    // 예시 정답은 정답 판정 기준이 아니라 해설용 배치일 뿐이다.
    setPlacedMirrors({ ...sample })
    setResult(validateSolution(puzzle, sample))
  }

  return (
    <div className="puzzle-page">
      <header className="pp-header">
        {onBack && (
          <button type="button" className="btn btn-ghost pp-back" onClick={onBack}>
            ← 문제 목록
          </button>
        )}
        <h1>빛 반사 설계 활동</h1>
        <p className="pp-puzzle-title">{puzzle.title}</p>
      </header>

      <div className="pp-layout">
        <main className="pp-main">
          <PuzzleBoard
            puzzle={puzzle}
            placedMirrors={placedMirrors}
            simulation={result?.simulation ?? null}
            onCellClick={handleCellClick}
          />
        </main>

        <aside className="pp-side">
          <RulePanel puzzle={puzzle} mirrorsUsed={Object.keys(placedMirrors).length} />
          <MirrorPalette selected={selectedMirror} onSelect={setSelectedMirror} />
          <div className="pp-actions">
            <button type="button" className="btn btn-primary" onClick={handleRun}>
              실행하기
            </button>
            <button type="button" className="btn btn-ghost" onClick={handleReset}>
              초기화
            </button>
          </div>

          <div className="pp-sample">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleShowSample}
              disabled={!puzzle.sampleAnswer}
            >
              예시 정답 보기
            </button>
            <p className="pp-sample-note">예시는 여러 가능한 풀이 중 하나예요.</p>
          </div>

          <ResultPanel result={result} score={score} />

          {/* 개발 검수용. 학생용 정식 화면에서는 이 줄만 지우면 숨길 수 있다. */}
          <DebugPanel placedMirrors={placedMirrors} result={result} />
        </aside>
      </div>
    </div>
  )
}
