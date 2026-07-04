import { useState } from 'react'
import type { Puzzle } from './core'
import { PuzzlePage } from './features/puzzle-player/PuzzlePage'
import WorldMapPage from './pages/WorldMapPage'
import './App.css'

function App() {
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null)

  function showList() {
    setSelectedPuzzle(null)
  }

  const viewKey = selectedPuzzle?.id ?? 'list'

  return (
    <div className="app-view" key={viewKey}>
      {selectedPuzzle ? (
        <PuzzlePage puzzle={selectedPuzzle} onBack={showList} />
      ) : (
        <WorldMapPage onSelect={setSelectedPuzzle} />
      )}
    </div>
  )
}

export default App
