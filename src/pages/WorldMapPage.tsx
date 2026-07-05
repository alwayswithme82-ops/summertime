import { useState } from 'react'
import type { Puzzle } from '../core'
import HintMascot from '../components/world-map/HintMascot'
import StageDoor, { type StageDoorStatus } from '../components/world-map/StageDoor'
import StageEntrance, { type EntranceTarget } from '../components/world-map/StageEntrance'
import TutorialDoor from '../components/world-map/TutorialDoor'
import LightPath from '../components/world-map/LightPath'
import SparkleIcon from '../components/world-map/icons/SparkleIcon'
import { samplePuzzles } from '../data/samplePuzzles'
import { stages, type StageDefinition } from '../data/stages'
import { readTutorialDone } from '../features/tutorial/tutorialProgress'
import './WorldMapPage.css'

interface WorldMapPageProps {
  onSelect: (puzzle: Puzzle) => void
  onStartTutorial: () => void
}

/** 튜토리얼 문의 월드맵 위치(오두막 쪽, 왼쪽 아래). */
const TUTORIAL_TARGET: EntranceTarget = { number: 0, x: 12, y: 78 }
const TUTORIAL_LINES = ['차근차근 배워볼까?', '처음이라면 여기부터!', '천천히 알려줄게!']

type Entrance =
  | { kind: 'puzzle'; target: EntranceTarget; puzzle: Puzzle }
  | { kind: 'tutorial'; target: EntranceTarget }

const CLEARED_STORAGE_KEY = 'cleared_puzzle_ids'
const SELECTED_STAGE_STORAGE_KEY = 'selected_world_map_stage_id'
const WORLD_MAP_BACKGROUND = '/assets/world-map/bg-world-map.png'

function readClearedPuzzleIds(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const value = window.localStorage.getItem(CLEARED_STORAGE_KEY)
    if (!value) return []

    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : []
  } catch {
    return []
  }
}

function readSelectedStageId(): string | null {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage.getItem(SELECTED_STAGE_STORAGE_KEY)
  } catch {
    return null
  }
}

function rememberSelectedStage(puzzleId: string) {
  try {
    window.localStorage.setItem(SELECTED_STAGE_STORAGE_KEY, puzzleId)
  } catch {
    // Stage selection still works when storage is unavailable.
  }
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export default function WorldMapPage({ onSelect, onStartTutorial }: WorldMapPageProps) {
  const [entrance, setEntrance] = useState<Entrance | null>(null)
  const [doorOpen, setDoorOpen] = useState(false)
  const clearedPuzzleIds = readClearedPuzzleIds()
  const tutorialDone = readTutorialDone()
  const savedStageId = readSelectedStageId()
  const defaultStageId = stages.find(
    (stage) => !clearedPuzzleIds.includes(stage.puzzleId),
  )?.puzzleId ?? stages[0]?.puzzleId
  const selectedStageId = stages.some((stage) => stage.puzzleId === savedStageId)
    ? savedStageId
    : defaultStageId

  function stageStatus(puzzleId: string): StageDoorStatus {
    if (clearedPuzzleIds.includes(puzzleId)) return 'completed'
    if (puzzleId === selectedStageId) return 'current'
    return 'available'
  }

  function selectStage(stage: StageDefinition, puzzle: Puzzle) {
    if (entrance) return

    rememberSelectedStage(puzzle.id)

    // 모션 최소화 설정이면 연출 없이 즉시 전환.
    if (prefersReducedMotion()) {
      onSelect(puzzle)
      return
    }

    setEntrance({
      kind: 'puzzle',
      target: { number: stage.number, x: stage.x, y: stage.y },
      puzzle,
    })
  }

  function selectTutorial() {
    if (entrance) return

    // 모션 최소화 설정이면 연출 없이 즉시 튜토리얼로.
    if (prefersReducedMotion()) {
      onStartTutorial()
      return
    }

    setEntrance({ kind: 'tutorial', target: TUTORIAL_TARGET })
  }

  return (
    <main className="world-map-screen">
      <section className="world-map-stage" aria-labelledby="world-map-title">
        <h2 className="sr-only">문제 목록</h2>
        <img
          className="world-map-bg"
          src={WORLD_MAP_BACKGROUND}
          alt=""
          aria-hidden="true"
          draggable="false"
        />

        <LightPath />

        <div className={`world-map-ui${entrance ? ' world-map-ui--sequence' : ''}`}>
          <header className="world-title-wrap">
            <SparkleIcon className="world-title-sparkle world-title-sparkle--far-left" />
            <SparkleIcon className="world-title-sparkle world-title-sparkle--left" />
            <h1 id="world-map-title" className="world-title-main">
              빛 반사 거울 설치 활동
            </h1>
            <p className="world-title-sub">거울을 설치해 빛을 탈출시켜라!</p>
            <SparkleIcon className="world-title-sparkle world-title-sparkle--right" />
            <SparkleIcon className="world-title-sparkle world-title-sparkle--far-right" />
          </header>

          <div className="world-map-markers">
            {stages.map((stage) => {
              const puzzle = samplePuzzles.find((candidate) => candidate.id === stage.puzzleId)
              if (!puzzle) return null

              return (
                <StageDoor
                  key={stage.puzzleId}
                  id={stage.number}
                  label={`${stage.number}단계`}
                  puzzleTitle={puzzle.title}
                  difficulty={stage.difficultyLabel}
                  status={stageStatus(stage.puzzleId)}
                  left={stage.x}
                  top={stage.y}
                  isActive={entrance?.kind === 'puzzle' && entrance.target.number === stage.number}
                  isOpening={
                    doorOpen && entrance?.kind === 'puzzle' && entrance.target.number === stage.number
                  }
                  onSelect={() => selectStage(stage, puzzle)}
                />
              )
            })}

            <TutorialDoor
              left={TUTORIAL_TARGET.x}
              top={TUTORIAL_TARGET.y}
              done={tutorialDone}
              isActive={entrance?.kind === 'tutorial'}
              isOpening={doorOpen && entrance?.kind === 'tutorial'}
              onSelect={selectTutorial}
            />
          </div>

          <aside className="world-map-mascot" aria-label="빛방울 요정">
            <p className="world-map-mascot__speech">문을 열어 볼까요?</p>
            <HintMascot className="world-map-mascot__character" />
          </aside>

          <aside className="world-map-sign" aria-label="모험 안내">
            <span>다음 목표를 향해 가자!</span>
            <i aria-hidden="true" />
          </aside>

          {entrance && (
            <StageEntrance
              key={entrance.kind === 'tutorial' ? 'tutorial' : entrance.target.number}
              stage={entrance.target}
              lines={entrance.kind === 'tutorial' ? TUTORIAL_LINES : undefined}
              onOpenDoor={() => setDoorOpen(true)}
              onComplete={() =>
                entrance.kind === 'tutorial' ? onStartTutorial() : onSelect(entrance.puzzle)
              }
            />
          )}
        </div>
      </section>
    </main>
  )
}
