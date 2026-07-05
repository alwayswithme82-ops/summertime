import { useState } from 'react'
import type { Puzzle } from './core'
import { PuzzlePage } from './features/puzzle-player/PuzzlePage'
import TutorialPage from './features/tutorial/TutorialPage'
import WorldMapPage from './pages/WorldMapPage'
import './App.css'

function App() {
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null)
  const [showTutorial, setShowTutorial] = useState(false)

  function showList() {
    setSelectedPuzzle(null)
  }

  const viewKey = showTutorial ? 'tutorial' : (selectedPuzzle?.id ?? 'list')

  return (
    <div className="app-view" key={viewKey}>
      {showTutorial ? (
        <TutorialPage onExit={() => setShowTutorial(false)} />
      ) : selectedPuzzle ? (
        <PuzzlePage puzzle={selectedPuzzle} onBack={showList} />
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
