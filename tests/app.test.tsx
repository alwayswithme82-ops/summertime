import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import App from '../src/App'

afterEach(cleanup)

describe('App — 문제 목록에서 문제 선택', () => {
  it('처음에는 문제 목록이 보인다', () => {
    render(<App />)
    expect(screen.getByText('문제 목록', { selector: 'h2' })).toBeInTheDocument()
    // 5개 예제 문제 카드가 모두 보인다.
    expect(screen.getByText('첫 번째 반사')).toBeInTheDocument()
    expect(screen.getByText('작은 미로')).toBeInTheDocument()
    expect(screen.getByText('큰 미로')).toBeInTheDocument()
  })

  it('카드를 클릭하면 그 문제 플레이 화면으로 이동한다 (7x7)', () => {
    render(<App />)
    fireEvent.click(screen.getByText('큰 미로'))
    // 플레이 화면 + 7x7 보드의 G7 칸(7행 7열)이 존재.
    expect(screen.getByRole('button', { name: '실행하기' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '7번째 줄 7번째 칸' })).toBeInTheDocument()
  })

  it('4x4 문제를 선택하면 4x4 보드가 렌더된다', () => {
    render(<App />)
    fireEvent.click(screen.getByText('작은 미로'))
    expect(screen.getByRole('button', { name: '4번째 줄 4번째 칸' })).toBeInTheDocument()
    // 4x4에는 5번째 줄/칸이 없다.
    expect(screen.queryByRole('button', { name: '1번째 줄 5번째 칸' })).not.toBeInTheDocument()
  })

  it('"← 문제 목록"으로 목록에 돌아올 수 있다', () => {
    render(<App />)
    fireEvent.click(screen.getByText('작은 미로'))
    fireEvent.click(screen.getByRole('button', { name: '문제 목록으로 돌아가기' }))
    expect(screen.getByText('문제 목록', { selector: 'h2' })).toBeInTheDocument()
  })
})
