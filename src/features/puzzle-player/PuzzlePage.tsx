import { useEffect, useMemo, useState } from 'react'
import type { MirrorType, PlacedMirrors, Puzzle, ValidationResult } from '../../core'
import { cellKeyToPosition, scoreSolution, validateSolution } from '../../core'
import { samplePuzzles } from '../../data/samplePuzzles'
import { MirrorPalette } from './MirrorPalette'
import { PuzzleBoard } from './PuzzleBoard'
import { beamDurationMs } from './PathOverlay'
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

const HIDE_INTRO_KEY = 'hide_intro_rules'

/** '다시 보지 않기' 설정을 localStorage에서 읽는다. */
function readHideIntro(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(HIDE_INTRO_KEY) === '1'
  } catch {
    return false
  }
}

function writeHideIntro(hide: boolean) {
  if (typeof window === 'undefined') return
  try {
    if (hide) window.localStorage.setItem(HIDE_INTRO_KEY, '1')
    else window.localStorage.removeItem(HIDE_INTRO_KEY)
  } catch {
    /* 저장 실패는 무시 */
  }
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
  const [selectedMirror, setSelectedMirror] = useState<MirrorType>('/')
  const [result, setResult] = useState<ValidationResult | null>(null)
  // 빛 애니메이션이 끝난 뒤에야 성공 모달/실패 배너를 보여준다.
  const [revealResult, setRevealResult] = useState(false)
  // 입장 직후와 거울 선택 직후, 놓을 수 있는 빈 칸을 잠깐 반짝인다.
  const [placeHint, setPlaceHint] = useState(true)
  // '다시 보지 않기'를 켜두지 않았다면 문제 입장 시 규칙을 한 번 자동으로 띄운다.
  const [hideIntro, setHideIntro] = useState(readHideIntro)
  const [showRules, setShowRules] = useState(() => !readHideIntro())

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
    const timer = window.setTimeout(
      () => setRevealResult(true),
      beamDurationMs(cells) + 400,
    )
    return () => window.clearTimeout(timer)
  }, [result])

  function handleToggleHideIntro(hide: boolean) {
    setHideIntro(hide)
    writeHideIntro(hide)
  }

  const score = useMemo(
    () => (result ? scoreSolution(puzzle, result, placedMirrors) : null),
    [result, puzzle, placedMirrors],
  )

  const mirrorsUsed = Object.keys(placedMirrors).length
  const mirrorLimit = puzzle.rule.exactMirrorCount ?? puzzle.rule.maxMirrors
  const totalStars = puzzle.rule.requiredStars.length
  const passedStars = result
    ? result.simulation.visitedStars.filter((s) => puzzle.rule.requiredStars.includes(s)).length
    : 0

  /** 같은 칸을 계속 누르면 빈칸 → 고른 거울 → 반대 거울 → 빈칸으로 순환한다. */
  function handleCellClick(cellKey: string) {
    if (!canPlaceMirror(puzzle, cellKey)) return
    setResult(null)
    setPlacedMirrors((previous) => {
      const next = { ...previous }
      const current = next[cellKey]
      if (!current) {
        next[cellKey] = selectedMirror
      } else if (current === selectedMirror) {
        next[cellKey] = OTHER_MIRROR[current]
      } else {
        delete next[cellKey]
      }
      return next
    })
  }

  function handleSelectMirror(mirror: MirrorType) {
    setSelectedMirror(mirror)
    setPlaceHint(true)
  }

  function handleRun() {
    setRevealResult(false)
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
    setRevealResult(false)
    setResult(validateSolution(puzzle, sample))
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
            onClick={() => setShowRules(true)}
            aria-label="규칙 보기"
          >
            <span aria-hidden="true">ⓘ</span>
          </button>
        </div>
      </header>

      <main className="pp-stage">
        <div className="pp-board-hold">
          <PuzzleBoard
            puzzle={puzzle}
            placedMirrors={placedMirrors}
            simulation={result?.simulation ?? null}
            resultStatus={resultStatus}
            placeHint={placeHint}
            onCellClick={handleCellClick}
          />
        </div>

        <div className="pp-result-live" aria-live="polite">
          {revealResult && (
            <ResultPanel result={result} onDismiss={() => setResult(null)} />
          )}
        </div>
      </main>

      <div className="pp-dock">
        <div className="pp-dock-mirrors">
          <MirrorPalette selected={selectedMirror} onSelect={handleSelectMirror} />
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
        <SuccessModal
          starCount={totalStars}
          score={score}
          onNext={onNext}
          onWorldMap={onBack}
        />
      )}

      <RulePanel
        puzzle={puzzle}
        mirrorsUsed={mirrorsUsed}
        open={showRules}
        onClose={() => setShowRules(false)}
        onShowSample={handleShowSample}
        hideIntro={hideIntro}
        onToggleHideIntro={handleToggleHideIntro}
      />
    </div>
  )
}
