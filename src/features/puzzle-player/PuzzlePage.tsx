import { useMemo, useState } from 'react'
import type { MirrorType, PlacedMirrors, Puzzle, ValidationResult } from '../../core'
import { cellKeyToPosition, scoreSolution, validateSolution } from '../../core'
import { samplePuzzles } from '../../data/samplePuzzles'
import { DebugPanel } from './DebugPanel'
import { MirrorPalette } from './MirrorPalette'
import { PuzzleBoard } from './PuzzleBoard'
import { ResultPanel } from './ResultPanel'
import { RulePanel } from './RulePanel'
import './puzzle-player.css'

function canPlaceMirror(puzzle: Puzzle, cellKey: string): boolean {
  if (puzzle.stars.includes(cellKey)) return false
  if (puzzle.forbiddenCells.includes(cellKey)) return false
  const position = cellKeyToPosition(cellKey)
  if (
    position.row < 1 ||
    position.row > puzzle.rows ||
    position.col < 1 ||
    position.col > puzzle.cols
  ) {
    return false
  }
  if (puzzle.rule.mirrorPlacementMode === 'MARKED_ONLY') {
    const allowed = puzzle.rule.allowedMirrorCells ?? puzzle.allowedMirrorCells ?? []
    if (!allowed.includes(cellKey)) return false
  }
  return true
}

interface PuzzlePageProps {
  puzzle?: Puzzle
  onBack?: () => void
}

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
    setResult(null)
    setPlacedMirrors((previous) => {
      const next = { ...previous }
      if (next[cellKey] === selectedMirror) {
        delete next[cellKey]
      } else {
        next[cellKey] = selectedMirror
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
    if (Object.keys(placedMirrors).length > 0) {
      const shouldReplace = window.confirm(
        '지금 놓은 거울을 지우고 예시 정답을 보여줄까요?',
      )
      if (!shouldReplace) return
    }
    setPlacedMirrors({ ...sample })
    setResult(validateSolution(puzzle, sample))
  }

  const resultClass = result ? (result.success ? ' is-success' : ' is-fail') : ''

  return (
    <div className={`puzzle-page${resultClass}`}>
      <header className="pp-header">
        {onBack && (
          <button type="button" className="btn btn-ghost pp-back" onClick={onBack}>
            ← 문제 목록
          </button>
        )}
        <div className="pp-heading">
          <span className="sr-only">빛 반사 설계 활동</span>
          <span className="pp-kicker">Light mission</span>
          <h1>빛의 길을 설계해요</h1>
          <p className="pp-puzzle-title">{puzzle.title}</p>
        </div>
        <div className="pp-progress" aria-label="활동 순서">
          <span className="is-active" /> 거울 선택
          <span /> 배치
          <span /> 실행
        </div>
      </header>

      <div className="pp-layout">
        <main className="pp-main">
          <div className="pp-board-stage">
            <div className="pp-board-bar">
              <span className="pp-board-label">Puzzle board</span>
              <div className="pp-board-legend" aria-label="보드 기호">
                <span>★ 목표 별</span>
                <span>× 금지칸</span>
                <span>◇ 거울칸</span>
              </div>
            </div>
            <PuzzleBoard
              puzzle={puzzle}
              placedMirrors={placedMirrors}
              simulation={result?.simulation ?? null}
              onCellClick={handleCellClick}
            />
          </div>
        </main>

        <aside className="pp-side">
          <RulePanel puzzle={puzzle} mirrorsUsed={Object.keys(placedMirrors).length} />

          <div className="panel control-panel">
            <div className="control-step">
              <span className="control-step-number">1</span>
              <div className="control-step-body">
                <MirrorPalette selected={selectedMirror} onSelect={setSelectedMirror} />
              </div>
            </div>

            <div className="control-step">
              <span className="control-step-number">2</span>
              <div className="control-step-body">
                <div className="pp-actions">
                  <button type="button" className="btn btn-primary" onClick={handleRun}>
                    <span className="btn-icon" aria-hidden="true">▶</span>
                    실행하기
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={handleReset}>
                    <span className="btn-icon" aria-hidden="true">↺</span>
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
                  <p className="pp-sample-note">
                    예시는 여러 가능한 풀이 중 하나예요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ResultPanel result={result} score={score} />
          <DebugPanel placedMirrors={placedMirrors} result={result} />
        </aside>
      </div>
    </div>
  )
}
