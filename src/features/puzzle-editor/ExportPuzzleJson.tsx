import { useState } from 'react'
import type { Puzzle } from '../../core'

interface ExportPuzzleJsonProps {
  puzzle: Puzzle
}

/** 현재 편집 중인 문제를 Puzzle JSON으로 보여준다. (저장 기능은 이후 단계) */
export function ExportPuzzleJson({ puzzle }: ExportPuzzleJsonProps) {
  const [copied, setCopied] = useState(false)
  const json = JSON.stringify(puzzle, null, 2)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="export-json">
      <div className="ej-head">
        <h3>Puzzle JSON</h3>
        <button type="button" className="btn btn-ghost" onClick={handleCopy}>
          {copied ? '복사됨!' : '복사'}
        </button>
      </div>
      <pre className="ej-code">{json}</pre>
    </div>
  )
}
