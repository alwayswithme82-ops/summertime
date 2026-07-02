import { useState } from 'react'
import { PuzzlePage } from './features/puzzle-player/PuzzlePage'
import { PuzzleEditorPage } from './features/puzzle-editor/PuzzleEditorPage'
import './App.css'

type View = 'play' | 'editor'

function App() {
  const [view, setView] = useState<View>('play')

  return (
    <>
      <nav className="app-nav">
        <button
          type="button"
          className={`app-tab${view === 'play' ? ' is-active' : ''}`}
          onClick={() => setView('play')}
        >
          플레이
        </button>
        <button
          type="button"
          className={`app-tab${view === 'editor' ? ' is-active' : ''}`}
          onClick={() => setView('editor')}
        >
          문제 제작기
        </button>
      </nav>
      {view === 'play' ? <PuzzlePage /> : <PuzzleEditorPage />}
    </>
  )
}

export default App
