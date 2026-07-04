import type { Puzzle } from '../core'
import LevelMarker, { type MarkerState } from '../components/world-map/LevelMarker'
import LightPath from '../components/world-map/LightPath'
import SparkleIcon from '../components/world-map/icons/SparkleIcon'
import StarIcon from '../components/world-map/icons/StarIcon'
import { samplePuzzles } from '../data/samplePuzzles'
import { stages } from '../data/stages'
import './WorldMapPage.css'

interface WorldMapPageProps {
  onSelect: (puzzle: Puzzle) => void
}

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

export default function WorldMapPage({ onSelect }: WorldMapPageProps) {
  const clearedPuzzleIds = readClearedPuzzleIds()
  const savedStageId = readSelectedStageId()
  const defaultStageId = stages.find(
    (stage) => !clearedPuzzleIds.includes(stage.puzzleId),
  )?.puzzleId
  const selectedStageId = stages.some((stage) => stage.puzzleId === savedStageId)
    ? savedStageId
    : defaultStageId

  function markerState(puzzleId: string): MarkerState {
    if (puzzleId === selectedStageId) return 'current'
    if (clearedPuzzleIds.includes(puzzleId)) return 'cleared'
    return 'upcoming'
  }

  function selectStage(puzzle: Puzzle) {
    rememberSelectedStage(puzzle.id)
    onSelect(puzzle)
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

        <div className="world-map-ui">
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
                <LevelMarker
                  key={stage.puzzleId}
                  number={stage.number}
                  difficulty={stage.difficulty}
                  difficultyLabel={stage.difficultyLabel}
                  stars={puzzle.rule.requiredStars.length}
                  puzzleTitle={puzzle.title}
                  state={markerState(stage.puzzleId)}
                  x={stage.x}
                  y={stage.y}
                  onSelect={() => selectStage(puzzle)}
                />
              )
            })}
          </div>

          <aside className="world-map-sign" aria-label="모험 안내">
            <StarIcon className="world-map-sign__star" size={24} />
            <span>다음 목표를 향해 가자!</span>
            <i aria-hidden="true" />
          </aside>
        </div>
      </section>
    </main>
  )
}
