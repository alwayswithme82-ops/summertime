import { useState } from 'react'
import type { Puzzle } from './core'
import { PuzzleListPage } from './features/puzzle-library/PuzzleListPage'
import { PuzzlePage } from './features/puzzle-player/PuzzlePage'
import { PuzzleEditorPage } from './features/puzzle-editor/PuzzleEditorPage'
import './App.css'

type View = 'list' | 'editor'

function App() {
  const [view, setView] = useState<View>('list')
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null)

  function showList() {
    setView('list')
    setSelectedPuzzle(null)
  }

  const viewKey = view === 'editor' ? 'editor' : selectedPuzzle?.id ?? 'list'

  return (
    <>
      <nav className="app-nav" aria-label="주요 메뉴">
        <div className="app-nav-inner">
          <button type="button" className="app-brand" onClick={showList}>
            <svg className="app-brand-mark" viewBox="0 0 44 44" aria-hidden="true">
              <rect x="2" y="2" width="40" height="40" rx="13" fill="var(--teal)" />
              <path d="M10 31 31 10" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
              <path
                d="m28 28 5 5M31 22l7 2M22 31l2 7"
                stroke="var(--yellow)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <span className="app-brand-copy">
              <span className="app-brand-name">빛 반사 설계 활동</span>
              <span className="app-brand-kicker">Light Lab</span>
            </span>
          </button>

          <button
            type="button"
            className={`app-tab${view === 'list' ? ' is-active' : ''}`}
            onClick={showList}
            aria-current={view === 'list' ? 'page' : undefined}
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" />
              <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" />
              <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" />
              <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" />
            </svg>
            문제 목록
          </button>
          <button
            type="button"
            className={`app-tab${view === 'editor' ? ' is-active' : ''}`}
            onClick={() => setView('editor')}
            aria-current={view === 'editor' ? 'page' : undefined}
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m4 16 1-4L14.5 2.5a2.1 2.1 0 0 1 3 3L8 15l-4 1Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="m12.5 4.5 3 3M3 18h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            문제 제작기
          </button>
        </div>
      </nav>

      <div className="app-view" key={viewKey}>
        {view === 'editor' ? (
          <PuzzleEditorPage />
        ) : selectedPuzzle ? (
          <PuzzlePage puzzle={selectedPuzzle} onBack={showList} />
        ) : (
          <PuzzleListPage onSelect={setSelectedPuzzle} />
        )}
      </div>
    </>
  )
}

export default App
