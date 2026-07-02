import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// core 로직은 순수 함수라 노드 환경이면 충분하지만,
// 컴포넌트 테스트(@testing-library/react)를 위해 jsdom을 기본 환경으로 둔다.
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
  },
})
