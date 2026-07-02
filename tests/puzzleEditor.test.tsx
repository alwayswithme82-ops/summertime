import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { PuzzleEditorPage } from '../src/features/puzzle-editor/PuzzleEditorPage'

afterEach(cleanup)

describe('PuzzleEditorPage (스모크)', () => {
  it('렌더되고 별을 배치하면 JSON에 반영된다', () => {
    render(<PuzzleEditorPage />)
    expect(screen.getByText('문제 제작기')).toBeInTheDocument()

    // 기본 편집 모드(별 추가)로 B2 클릭 → JSON stars에 B2가 들어간다.
    fireEvent.click(screen.getByRole('button', { name: 'B2' }))
    const json = document.querySelector('.ej-code')?.textContent ?? ''
    const parsed = JSON.parse(json)
    expect(parsed.stars).toContain('B2')
    expect(parsed.rule.requiredStars).toContain('B2')
    expect(parsed.rows).toBe(5)
  })

  it('보드 크기를 7x7로 바꾸면 JSON rows/cols가 7이 된다', () => {
    render(<PuzzleEditorPage />)
    fireEvent.click(screen.getByRole('button', { name: '7x7' }))
    const parsed = JSON.parse(document.querySelector('.ej-code')?.textContent ?? '{}')
    expect(parsed.rows).toBe(7)
    expect(parsed.cols).toBe(7)
  })
})
