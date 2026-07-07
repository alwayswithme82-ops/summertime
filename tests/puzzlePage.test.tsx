import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import { PuzzlePage } from '../src/features/puzzle-player/PuzzlePage'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

/** 빛 애니메이션이 끝나 결과가 표시될 때까지 가짜 시계를 돌린다. */
function finishBeamAnimation() {
  act(() => {
    vi.advanceTimersByTime(20_000)
  })
}

describe('PuzzlePage (스모크)', () => {
  it('화면이 렌더되고 보드/버튼이 보인다', () => {
    render(<PuzzlePage />)
    expect(screen.getByText('빛 반사 설계 활동')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '실행하기' })).toBeInTheDocument()
    // 5x5 보드의 칸(1행 3열 = C1)이 존재한다.
    expect(screen.getByRole('button', { name: '1번째 줄 3번째 칸' })).toBeInTheDocument()
  })

  it('문제 조건이 모달 없이 항상 화면에 떠 있다', () => {
    render(<PuzzlePage />)
    const panel = screen.getByRole('complementary', { name: '문제 조건' })
    expect(panel).toBeInTheDocument()
    // 성공 조건(별/출구/거울)이 풀이 중에 계속 보인다.
    expect(panel).toHaveTextContent('별 3개 모두 지나기')
    expect(panel).toHaveTextContent('출구')
    // 위치 중심 문제(p1)는 개수 문구 대신 "빛나는 칸" 안내가 보인다.
    expect(panel).toHaveTextContent('빛나는 칸에만 거울을 놓을 수 있어요')
    expect(panel).not.toHaveTextContent('이하')
    // 입장 시 자동으로 뜨는 규칙 모달은 더 이상 없다.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('거울 없이 실행하면 실패 메시지를 보여준다', () => {
    vi.useFakeTimers()
    render(<PuzzlePage />)
    fireEvent.click(screen.getByRole('button', { name: '실행하기' }))
    finishBeamAnimation()
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
    // p1의 금지칸 E3(3행 5열)를 클릭해도 거울(문자)이 생기지 않는다.
    const forbidden = screen.getByRole('button', { name: '3번째 줄 5번째 칸, 금지 칸' })
    fireEvent.click(forbidden)
    expect(forbidden.textContent).toBe('✕')
  })

  it('"예시 정답 보기"를 누르면 예시가 적용되고 성공으로 판정된다', () => {
    vi.useFakeTimers()
    render(<PuzzlePage />)
    fireEvent.click(screen.getByRole('button', { name: '예시 정답 보기' }))
    finishBeamAnimation()
    // 예시 정답 적용 후 자동 판정 → 성공 모달
    expect(screen.getByText('성공!')).toBeInTheDocument()
    // 예시 배치의 거울(A1 '/')이 SVG 대각선으로 보드에 표시된다.
    const a1 = screen.getByRole('button', { name: '1번째 줄 1번째 칸, / 모양 거울 있음' })
    expect(a1.querySelector('svg[data-mirror="/"]')).not.toBeNull()
  })
})
