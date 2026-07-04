import { useState } from 'react'
import type { Puzzle } from './core'
import { PuzzleListPage } from './features/puzzle-library/PuzzleListPage'
import { PuzzlePage } from './features/puzzle-player/PuzzlePage'
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
        <PuzzleListPage onSelect={setSelectedPuzzle} />
      )}
    </div>
  )
}

export default App
