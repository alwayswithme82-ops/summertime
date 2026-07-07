import { useEffect, useState } from 'react'
import type { MirrorType, PlacedMirrors, Puzzle, ValidationResult } from '../../core'
import { cellKeyToPosition, validateSolution } from '../../core'
import { samplePuzzles } from '../../data/samplePuzzles'
import { MirrorPalette, type PaletteTool } from './MirrorPalette'
import { PuzzleBoard } from './PuzzleBoard'
import { playErase, playFail, playPlace, playReflect, playRunStart, playStar, playSuccess } from '../../audio/sfx'
import { CELL_MS, beamDurationMs } from './PathOverlay'
import { GoalPanel } from './GoalPanel'
import { ResultPanel } from './ResultPanel'
import { RulePanel } from './RulePanel'
import { SuccessModal } from './SuccessModal'
import './puzzle-player.css'

const LEVEL_LABEL: Record<Puzzle['level'], string> = {
  BASIC: '기초',
  NORMAL: '보통',
  HARD: '어려움',
  LARGE: '대형',
}

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

const OTHER_MIRROR: Record<MirrorType, MirrorType> = { '/': '\\', '\\': '/' }

interface PuzzlePageProps {
  puzzle?: Puzzle
  onBack?: () => void
  /** 성공 모달의 "다음 단계" — 없으면 버튼을 숨긴다. */
  onNext?: () => void
}

export function PuzzlePage({ puzzle = samplePuzzles[0], onBack, onNext }: PuzzlePageProps = {}) {
  const [placedMirrors, setPlacedMirrors] = useState<PlacedMirrors>({})
  const [selectedTool, setSelectedTool] = useState<PaletteTool>('/')
  const [result, setResult] = useState<ValidationResult | null>(null)
  // 빛 애니메이션이 끝난 뒤에야 성공 모달/실패 배너를 보여준다.
  const [revealResult, setRevealResult] = useState(false)
  // 입장 직후와 거울 선택 직후, 놓을 수 있는 빈 칸을 잠깐 반짝인다.
  const [placeHint, setPlaceHint] = useState(true)
  // '이렇게 풀어요' 도움말 — 문제 조건은 GoalPanel이 항상 보여주므로 필요할 때만 연다.
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    if (!placeHint) return
    const timer = window.setTimeout(() => setPlaceHint(false), 2600)
    return () => window.clearTimeout(timer)
  }, [placeHint])

  useEffect(() => {
    if (!result) {
      setRevealResult(false)
      return
    }
    const cells = result.simulation.path.length + (result.simulation.exited ? 1 : 0)
    const timer = window.setTimeout(() => {
      setRevealResult(true)
      if (result.success) playSuccess()
      else playFail()
    }, beamDurationMs(cells) + 400)
    return () => window.clearTimeout(timer)
  }, [result])

  const mirrorsUsed = Object.keys(placedMirrors).length
  const mirrorLimit = puzzle.rule.exactMirrorCount ?? puzzle.rule.maxMirrors
  const totalStars = puzzle.rule.requiredStars.length
  const passedStars = result
    ? result.simulation.visitedStars.filter((s) => puzzle.rule.requiredStars.includes(s)).length
    : 0

  /**
   * 거울 도구: 빈 칸이면 고른 거울을 놓고, 이미 있으면 반대 방향으로 바꾼다.
   * 지우개 도구: 거울이 있는 칸을 누르면 지운다.
   */
  function handleCellClick(cellKey: string) {
    if (!canPlaceMirror(puzzle, cellKey)) return
    const current = placedMirrors[cellKey]
    if (selectedTool === 'ERASER') {
      if (!current) return
      playErase()
      setResult(null)
      setPlacedMirrors((previous) => {
        const next = { ...previous }
        delete next[cellKey]
        return next
      })
      return
    }
    playPlace()
    setResult(null)
    setPlacedMirrors((previous) => ({
      ...previous,
      [cellKey]: previous[cellKey] ? OTHER_MIRROR[previous[cellKey]] : selectedTool,
    }))
  }

  function handleSelectTool(tool: PaletteTool) {
    setSelectedTool(tool)
    setPlaceHint(true)
  }

  /** 실행 사운드: 출발 스윕 + 빛 애니메이션 타이밍에 맞춘 반사·별 효과음 예약. */
  function playBeamSfx(run: ValidationResult) {
    playRunStart()
    run.simulation.path.forEach((step, i) => {
      const at = ((i + 1) * CELL_MS) / 1000
      if (step.event === 'REFLECT') playReflect(at)
      else if (step.event === 'STAR') playStar(at)
    })
  }

  function handleRun() {
    setRevealResult(false)
    const run = validateSolution(puzzle, placedMirrors)
    setResult(run)
    playBeamSfx(run)
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
    setRevealResult(false)
    const run = validateSolution(puzzle, sample)
    setResult(run)
    playBeamSfx(run)
  }

  const resultStatus = result ? (result.success ? 'success' : 'fail') : null
  const resultClass = resultStatus ? ` is-${resultStatus}` : ''

  return (
    <div className={`puzzle-page${resultClass}`}>
      <header className="pp-hud">
        <span className="sr-only">빛 반사 설계 활동</span>
        <div className="pp-hud-left">
          {onBack && (
            <button
              type="button"
              className="btn btn-ghost pp-back"
              onClick={onBack}
              aria-label="문제 목록으로 돌아가기"
            >
              ← 문제 목록
            </button>
          )}
        </div>

        <div className="pp-hud-center">
          <h1 className="pp-title">{puzzle.title}</h1>
          <p className="pp-meta">
            {LEVEL_LABEL[puzzle.level]} · {puzzle.rows}×{puzzle.cols}
          </p>
        </div>

        <div className="pp-hud-right">
          <span
            className="pp-badge pp-badge-star"
            aria-label={`지난 별 ${passedStars}개, 전체 별 ${totalStars}개`}
          >
            <span className="pp-badge-icon" aria-hidden="true">★</span>
            {passedStars}/{totalStars}
          </span>
          <span
            className="pp-badge pp-badge-mirror"
            aria-label={`사용한 거울 ${mirrorsUsed}개, 최대 ${mirrorLimit}개`}
          >
            <span className="pp-badge-icon" aria-hidden="true">◇</span>
            {mirrorsUsed}/{mirrorLimit}
          </span>
          <button
            type="button"
            className="pp-icon-btn"
            onClick={() => setShowHelp(true)}
            aria-label="푸는 방법 보기"
          >
            <span aria-hidden="true">ⓘ</span>
          </button>
        </div>
      </header>

      <main className="pp-stage">
        <GoalPanel
          puzzle={puzzle}
          mirrorsUsed={mirrorsUsed}
          passedStars={passedStars}
          onShowSample={puzzle.sampleAnswer ? handleShowSample : undefined}
        />

        <div className="pp-stage-main">
          <div className="pp-board-hold">
            <PuzzleBoard
              puzzle={puzzle}
              placedMirrors={placedMirrors}
              simulation={result?.simulation ?? null}
              resultStatus={resultStatus}
              placeHint={placeHint}
              hintMode={selectedTool === 'ERASER' ? 'erase' : 'place'}
              onCellClick={handleCellClick}
            />
          </div>

          <div className="pp-result-live" aria-live="polite">
            {revealResult && (
              <ResultPanel result={result} onDismiss={() => setResult(null)} />
            )}
          </div>
        </div>
      </main>

      <div className="pp-dock">
        <div className="pp-dock-mirrors">
          <MirrorPalette selected={selectedTool} onSelect={handleSelectTool} />
        </div>
        <div className="pp-dock-actions">
          <button type="button" className="btn btn-ghost" onClick={handleReset}>
            <span className="btn-icon" aria-hidden="true">↺</span>
            초기화
          </button>
          <button type="button" className="btn btn-primary pp-run" onClick={handleRun}>
            <span className="btn-icon" aria-hidden="true">▶</span>
            실행하기
          </button>
        </div>
      </div>

      {revealResult && result?.success && (
        <SuccessModal starCount={totalStars} onNext={onNext} onWorldMap={onBack} />
      )}

      <RulePanel open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  )
}
