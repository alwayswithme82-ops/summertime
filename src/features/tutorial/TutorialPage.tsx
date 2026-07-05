import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CellKey, PlacedMirrors } from '../../core'
import { simulateLight } from '../../core'
import HintMascot from '../../components/world-map/HintMascot'
import { MirrorIcon } from '../../components/MirrorIcon'
import { playPlace, playReflect, playRunStart, playStar, playSuccess } from '../../audio/sfx'
import { tutorialPuzzle, TUTORIAL_TARGET_CELL, TUTORIAL_TARGET_MIRROR } from '../../data/tutorialPuzzle'
import { TutorialBoard } from './TutorialBoard'
import { useTypewriter } from './useTypewriter'
import { markTutorialDone } from './tutorialProgress'
import '../puzzle-player/puzzle-player.css'
import './tutorial.css'

type Phase = 'intro' | 'place' | 'ready' | 'running' | 'done'
type Glow = 'entry' | 'exit' | null

// 초등 4학년 대상 — 짧고 쉽고 친근하게.
const GREET = '안녕! 거울로 빛을 별에 통과시켜 출구로 보내는 게 목표야!'
const CAP_ENTRY = '여기가 빛이 들어오는 입구야.'
const CAP_STAR = '이 별을 꼭 지나가야 해!'
const CAP_EXIT = '그리고 여기 출구로 빛을 내보내자.'
const PLACE = "반짝이는 칸에 거울을 놓아봐!"
const READY = "잘했어! 이제 아래 '실행하기'를 눌러봐."
const REFLECT_MSG = '봤지? 거울에 부딪히면 빛이 90도로 꺾여!'
const STAR_MSG = '별을 지났어! 반짝!'
const EXIT_MSG = '출구로 쏙! 성공이야!'
const DONE = '정말 잘했어! 이제 진짜 도전하러 가볼까?'

// 튜토리얼 보드의 주요 칸(입구 첫 칸·별·출구 마지막 칸).
const ENTRY_CELL: CellKey = 'A3'
const STAR_CELL: CellKey = 'B2'
const EXIT_CELL: CellKey = 'B1'

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

interface TutorialPageProps {
  onExit: () => void
}

export default function TutorialPage({ onExit }: TutorialPageProps) {
  const [reduceMotion] = useState(prefersReducedMotion)
  const [phase, setPhase] = useState<Phase>('intro')
  const [placed, setPlaced] = useState<PlacedMirrors>({})
  const [guide, setGuide] = useState(GREET)
  const [spot, setSpot] = useState<CellKey | null>(null)
  const [glow, setGlow] = useState<Glow>(null)
  const [beamCount, setBeamCount] = useState(0)
  const [beamExtend, setBeamExtend] = useState(false)
  // 대사를 다 보여준 뒤 사용자 입력(스페이스/탭)을 기다리는 중인지.
  const [waiting, setWaiting] = useState(false)

  const { text: typed, done: typingDone, skip: skipTyping } = useTypewriter(guide, reduceMotion)

  // 입력이 오면 진행을 재개하는 콜백. 대기 중이 아니면 null.
  const advanceRef = useRef<(() => void) | null>(null)

  const solvedSim = useMemo(() => simulateLight(tutorialPuzzle, placed), [placed])
  const solvedSimRef = useRef(solvedSim)
  solvedSimRef.current = solvedSim

  const timersRef = useRef<number[]>([])
  const clearTimers = () => {
    timersRef.current.forEach(window.clearTimeout)
    timersRef.current = []
  }

  const STEP_MS = reduceMotion ? 150 : 340

  // 스텝 진행: 각 phase 진입 시 안내/강조/빛 애니메이션을 구동한다.
  // 대사는 자동으로 넘어가지 않고 waitAdvance()로 사용자 입력을 기다린다.
  useEffect(() => {
    let alive = true
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timersRef.current.push(window.setTimeout(resolve, ms))
      })
    const waitAdvance = () =>
      new Promise<void>((resolve) => {
        setWaiting(true)
        advanceRef.current = () => {
          advanceRef.current = null
          setWaiting(false)
          resolve()
        }
      })

    async function runIntro() {
      setSpot(null)
      setGlow(null)
      setGuide(GREET)
      await waitAdvance()
      if (!alive) return
      setSpot(ENTRY_CELL)
      setGlow('entry')
      setGuide(CAP_ENTRY)
      await waitAdvance()
      if (!alive) return
      setSpot(STAR_CELL)
      setGlow(null)
      setGuide(CAP_STAR)
      await waitAdvance()
      if (!alive) return
      setSpot(EXIT_CELL)
      setGlow('exit')
      setGuide(CAP_EXIT)
      await waitAdvance()
      if (!alive) return
      setSpot(null)
      setGlow(null)
      setPhase('place')
    }

    async function runRunning() {
      setSpot(null)
      setGlow(null)
      setBeamExtend(false)
      setBeamCount(0)
      const sim = solvedSimRef.current
      for (let i = 1; i <= sim.path.length; i += 1) {
        if (!alive) return
        setBeamCount(i)
        const event = sim.path[i - 1].event
        await sleep(STEP_MS)
        if (!alive) return
        if (event === 'REFLECT') {
          playReflect()
          setGuide(REFLECT_MSG)
          await waitAdvance()
        } else if (event === 'STAR') {
          playStar()
          setGuide(STAR_MSG)
          await waitAdvance()
        } else if (event === 'EXIT') {
          setBeamExtend(true)
          playSuccess()
          setGuide(EXIT_MSG)
          await waitAdvance()
        }
        if (!alive) return
      }
      if (!alive) return
      setPhase('done')
    }

    if (phase === 'intro') {
      runIntro()
    } else if (phase === 'place') {
      setSpot(TUTORIAL_TARGET_CELL)
      setGlow(null)
      setGuide(PLACE)
      setBeamCount(0)
      setBeamExtend(false)
    } else if (phase === 'ready') {
      setSpot(null)
      setGlow(null)
      setGuide(READY)
    } else if (phase === 'running') {
      runRunning()
    } else if (phase === 'done') {
      setSpot(null)
      setGlow(null)
      setGuide(DONE)
      markTutorialDone()
    }

    return () => {
      alive = false
      clearTimers()
      advanceRef.current = null
      setWaiting(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  /**
   * 스페이스/클릭(탭) 한 번 = 타이핑 중이면 즉시 완성, 다 보였으면 다음 대사로.
   * 행동 스텝(place/ready)에서는 대기 콜백이 없으므로 타이핑 완성만 되고 넘어가지 않는다.
   */
  const handleAdvance = useCallback(() => {
    if (!typingDone) {
      skipTyping()
      return
    }
    advanceRef.current?.()
  }, [typingDone, skipTyping])

  // 스페이스는 포커스 위치와 상관없이 동작한다(창 단위 리스너).
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.code !== 'Space' || event.repeat) return
      // 넘길 것이 없으면(행동 스텝 등) 스페이스의 기본 동작(버튼 활성화)을 막지 않는다.
      if (typingDone && !advanceRef.current) return
      event.preventDefault()
      handleAdvance()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleAdvance, typingDone])

  // 화면 아무 곳이나 클릭/탭해도 넘어간다. 버튼(건너뛰기·실행하기·거울 칸)은 제 역할 유지.
  function handlePageClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement
    if (target.closest('button')) return
    handleAdvance()
  }

  function handleCellClick(cell: CellKey) {
    if (phase !== 'place') return
    if (cell !== TUTORIAL_TARGET_CELL) return
    playPlace()
    setPlaced({ [TUTORIAL_TARGET_CELL]: TUTORIAL_TARGET_MIRROR })
    setPhase('ready')
  }

  function handleRun() {
    if (phase !== 'ready') return
    playRunStart()
    setPhase('running')
  }

  function handleSkip() {
    clearTimers()
    const full = simulateLight(tutorialPuzzle, { [TUTORIAL_TARGET_CELL]: TUTORIAL_TARGET_MIRROR })
    setPlaced({ [TUTORIAL_TARGET_CELL]: TUTORIAL_TARGET_MIRROR })
    setBeamCount(full.path.length)
    setBeamExtend(true)
    setPhase('done')
  }

  const dimmed = phase === 'intro' || phase === 'place'
  const finger = phase === 'place' ? TUTORIAL_TARGET_CELL : null
  const interactiveCells = phase === 'place' ? [TUTORIAL_TARGET_CELL] : null
  const beam =
    beamCount > 0
      ? {
          steps: solvedSim.path.slice(0, beamCount),
          extend: beamExtend,
          finalDirection: solvedSim.finalDirection,
        }
      : null

  const showAdvanceHint = waiting && typingDone

  return (
    <div
      className={`tut-page${showAdvanceHint || !typingDone ? ' is-awaiting-input' : ''}`}
      onClick={handlePageClick}
    >
      <header className="tut-top">
        <span className="tut-badge">튜토리얼</span>
        <h1 className="tut-heading">빛요정과 함께 배우기</h1>
        {phase !== 'done' && (
          <button type="button" className="tut-skip" onClick={handleSkip}>
            건너뛰기
          </button>
        )}
      </header>

      <main className="tut-stage">
        <div className="tut-board-hold">
          <TutorialBoard
            puzzle={tutorialPuzzle}
            placed={placed}
            interactiveCells={interactiveCells}
            spotlight={spot}
            dimmed={dimmed}
            finger={finger}
            glowEntry={glow === 'entry'}
            glowExit={glow === 'exit'}
            beam={beam}
            reduceMotion={reduceMotion}
            onCellClick={handleCellClick}
          />
        </div>
      </main>

      <div className="tut-guide">
        <div className={`tut-mascot${reduceMotion ? ' tut-mascot--still' : ''}`}>
          <HintMascot size={92} />
        </div>
        <div className="tut-speech" role="status" aria-live="polite">
          <span className="tut-speech-text">{typed}</span>
          {!typingDone && <span className="tut-caret" aria-hidden="true" />}
          {showAdvanceHint && (
            <span className="tut-advance">
              <span aria-hidden="true">▶ </span>스페이스 / 탭으로 계속
            </span>
          )}
        </div>
      </div>

      <div className="tut-dock">
        <div className="tut-tool" aria-hidden={phase !== 'place'}>
          <span className={`tut-tool-chip${phase === 'place' ? ' is-active' : ''}`}>
            <MirrorIcon type={TUTORIAL_TARGET_MIRROR} size={26} />
          </span>
          <span className="tut-tool-label">빛을 꺾는 거울</span>
        </div>

        <div className="tut-actions">
          {(phase === 'ready' || phase === 'place') && (
            <button
              type="button"
              className={`btn btn-primary tut-run${phase === 'ready' ? ' is-guide-pulse' : ''}`}
              onClick={handleRun}
              disabled={phase !== 'ready'}
            >
              <span className="btn-icon" aria-hidden="true">▶</span>
              실행하기
            </button>
          )}
          {phase === 'running' && !waiting && (
            <span className="tut-running-hint">빛이 나아가는 중…</span>
          )}
          {phase === 'done' && (
            <button type="button" className="btn btn-primary tut-run" onClick={onExit}>
              시작화면으로
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
