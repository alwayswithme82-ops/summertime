import { useEffect, useState } from 'react'
import type { Puzzle } from './core'
import { getPuzzle } from './data/samplePuzzles'
import { stages } from './data/stages'
import { startBgm } from './audio/bgm'
import { unlockAudioOnFirstGesture } from './audio/engine'
import { SoundToggle } from './components/SoundToggle'
import { PuzzlePage } from './features/puzzle-player/PuzzlePage'
import TutorialPage from './features/tutorial/TutorialPage'
import WorldMapPage from './pages/WorldMapPage'
import './App.css'
import './adventure-theme.css'

function App() {
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null)
  const [showTutorial, setShowTutorial] = useState(false)

  function showList() {
    setSelectedPuzzle(null)
  }

  // 첫 입력에서 오디오를 깨우고, 화면에 맞는 잔잔한 BGM을 튼다.
  useEffect(() => {
    unlockAudioOnFirstGesture()
  }, [])

  const inPlay = selectedPuzzle !== null && !showTutorial
  useEffect(() => {
    startBgm(inPlay ? 'play' : 'map')
  }, [inPlay])

  // 성공 모달의 "다음 단계"용 — 월드맵 단계 순서를 따른다. 마지막이면 버튼 숨김.
  const stageIndex = selectedPuzzle
    ? stages.findIndex((stage) => stage.puzzleId === selectedPuzzle.id)
    : -1
  const nextStage = stageIndex >= 0 ? stages[stageIndex + 1] : undefined
  const nextPuzzle = nextStage ? getPuzzle(nextStage.puzzleId) : undefined

  const viewKey = showTutorial ? 'tutorial' : (selectedPuzzle?.id ?? 'list')

  return (
    <div className="app-view" key={viewKey}>
      <SoundToggle />
      {showTutorial ? (
        <TutorialPage onExit={() => setShowTutorial(false)} />
      ) : selectedPuzzle ? (
        <PuzzlePage
          puzzle={selectedPuzzle}
          onBack={showList}
          onNext={nextPuzzle ? () => setSelectedPuzzle(nextPuzzle) : undefined}
        />
      ) : (
        <WorldMapPage
          onSelect={setSelectedPuzzle}
          onStartTutorial={() => setShowTutorial(true)}
        />
      )}
    </div>
  )
}

export default App
