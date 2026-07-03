import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { PuzzlePage } from '../src/features/puzzle-player/PuzzlePage'

afterEach(cleanup)

describe('PuzzlePage (스모크)', () => {
  it('화면이 렌더되고 보드/버튼이 보인다', () => {
    render(<PuzzlePage />)
    expect(screen.getByText('빛 반사 설계 활동')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '실행하기' })).toBeInTheDocument()
    // 5x5 보드의 칸(C1)이 존재한다.
    expect(screen.getByRole('button', { name: 'C1' })).toBeInTheDocument()
  })

  it('거울 없이 실행하면 실패 메시지를 보여준다', () => {
    render(<PuzzlePage />)
    fireEvent.click(screen.getByRole('button', { name: '실행하기' }))
    expect(screen.getByText('다시 해볼까요?')).toBeInTheDocument()
  })

  it('입구/출구가 보드 바깥에 고정 표시된다 (학생이 변경 불가)', () => {
    render(<PuzzlePage />)
    // 안내용 고정 마커 — 버튼이 아니므로 클릭으로 바꿀 수 없다.
    expect(screen.getByText('입구')).toBeInTheDocument()
    expect(screen.getByText('출구')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '입구' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '출구' })).not.toBeInTheDocument()
  })

  it('금지칸에는 거울이 놓이지 않는다', () => {
    render(<PuzzlePage />)
    // p1의 금지칸 E3를 클릭해도 거울(문자)이 생기지 않는다.
    const forbidden = screen.getByRole('button', { name: 'E3' })
    fireEvent.click(forbidden)
    expect(forbidden.textContent).toBe('✕')
  })

  it('"예시 정답 보기"를 누르면 예시가 적용되고 성공으로 판정된다', () => {
    render(<PuzzlePage />)
    fireEvent.click(screen.getByRole('button', { name: '예시 정답 보기' }))
    // 예시 정답 적용 후 자동 판정 → 성공 메시지
    expect(screen.getByText('성공!')).toBeInTheDocument()
    // 예시 배치의 거울(A1 '/')이 SVG 대각선으로 보드에 표시된다.
    const a1 = screen.getByRole('button', { name: 'A1' })
    expect(a1.querySelector('svg[data-mirror="/"]')).not.toBeNull()
  })
})
