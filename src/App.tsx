import { useState } from 'react'
import type { Puzzle } from './core'
import { PuzzleListPage } from './features/puzzle-library/PuzzleListPage'
import { PuzzlePage } from './features/puzzle-player/PuzzlePage'
import { PuzzleEditorPage } from './features/puzzle-editor/PuzzleEditorPage'
import './App.css'

/** 화면 전환은 React Router 없이 상태로만 한다(정적 배포 시 라우팅 문제 방지). */
type View = 'list' | 'editor'

function App() {
  const [view, setView] = useState<View>('list')
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null)

  function showList() {
    setView('list')
    setSelectedPuzzle(null)
  }

  return (
    <>
      <nav className="app-nav">
        <button
          type="button"
          className={`app-tab${view === 'list' ? ' is-active' : ''}`}
          onClick={showList}
        >
          문제 목록
        </button>
        <button
          type="button"
          className={`app-tab${view === 'editor' ? ' is-active' : ''}`}
          onClick={() => setView('editor')}
        >
          문제 제작기
        </button>
      </nav>
      {view === 'editor' ? (
        <PuzzleEditorPage />
      ) : selectedPuzzle ? (
        // key로 문제가 바뀔 때 배치/결과 상태를 초기화한다.
        <PuzzlePage key={selectedPuzzle.id} puzzle={selectedPuzzle} onBack={showList} />
      ) : (
        <PuzzleListPage onSelect={setSelectedPuzzle} />
      )}
    </>
  )
}

export default App
