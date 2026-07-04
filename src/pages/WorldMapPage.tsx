import type { Puzzle } from '../core'
import LevelMarker, { type MarkerState } from '../components/world-map/LevelMarker'
import LightPath from '../components/world-map/LightPath'
import SparkleIcon from '../components/world-map/icons/SparkleIcon'
import { samplePuzzles } from '../data/samplePuzzles'
import { stages } from '../data/stages'
import './WorldMapPage.css'

interface WorldMapPageProps {
  onSelect: (puzzle: Puzzle) => void
}

const CLEARED_STORAGE_KEY = 'cleared_puzzle_ids'
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

export default function WorldMapPage({ onSelect }: WorldMapPageProps) {
  const clearedPuzzleIds = readClearedPuzzleIds()
  const currentStageIndex = stages.findIndex(
    (stage) => !clearedPuzzleIds.includes(stage.puzzleId),
  )

  function markerState(index: number, puzzleId: string): MarkerState {
    if (clearedPuzzleIds.includes(puzzleId)) return 'cleared'
    if (index === currentStageIndex || currentStageIndex === -1) return 'current'
    return 'upcoming'
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
          <header className="world-map-heading">
            <SparkleIcon className="world-map-heading__sparkle world-map-heading__sparkle--left" />
            <div>
              <h1 id="world-map-title">거울을 설치해 빛을 탈출시켜라!</h1>
              <p>길을 따라 단계를 하나씩 정복해요!</p>
            </div>
            <SparkleIcon className="world-map-heading__sparkle world-map-heading__sparkle--right" />
          </header>

          <div className="world-map-markers">
            {stages.map((stage, index) => {
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
                  state={markerState(index, stage.puzzleId)}
                  x={stage.x}
                  y={stage.y}
                  onSelect={() => onSelect(puzzle)}
                />
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
