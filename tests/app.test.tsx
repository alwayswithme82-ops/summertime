import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import App from '../src/App'

afterEach(cleanup)

describe('App — 문제 목록에서 문제 선택', () => {
  it('처음에는 문제 목록이 보인다', () => {
    render(<App />)
    expect(screen.getByText('문제 목록', { selector: 'h2' })).toBeInTheDocument()
    // 5개 예제 문제 카드가 모두 보인다.
    expect(screen.getByText('오른쪽으로 빠져나가기')).toBeInTheDocument()
    expect(screen.getByText('작은 미로 (4x4)')).toBeInTheDocument()
    expect(screen.getByText('큰 미로 (7x7)')).toBeInTheDocument()
  })

  it('카드를 클릭하면 그 문제 플레이 화면으로 이동한다 (7x7)', () => {
    render(<App />)
    fireEvent.click(screen.getByText('큰 미로 (7x7)'))
    // 플레이 화면 + 7x7 보드의 G7 칸이 존재.
    expect(screen.getByRole('button', { name: '실행하기' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'G7' })).toBeInTheDocument()
  })

  it('4x4 문제를 선택하면 4x4 보드가 렌더된다', () => {
    render(<App />)
    fireEvent.click(screen.getByText('작은 미로 (4x4)'))
    expect(screen.getByRole('button', { name: 'D4' })).toBeInTheDocument()
    // 4x4에는 E열이 없다.
    expect(screen.queryByRole('button', { name: 'E1' })).not.toBeInTheDocument()
  })

  it('"← 문제 목록"으로 목록에 돌아올 수 있다', () => {
    render(<App />)
    fireEvent.click(screen.getByText('작은 미로 (4x4)'))
    fireEvent.click(screen.getByRole('button', { name: '← 문제 목록' }))
    expect(screen.getByText('문제 목록', { selector: 'h2' })).toBeInTheDocument()
  })
})
