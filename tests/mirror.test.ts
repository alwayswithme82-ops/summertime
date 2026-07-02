import { describe, it, expect } from 'vitest'
import type { Direction, MirrorType } from '../src/core'
import { reflectDirection } from '../src/core'

describe("reflectDirection — '/' 거울 (모든 방향)", () => {
  const cases: [Direction, Direction][] = [
    ['RIGHT', 'UP'],
    ['UP', 'RIGHT'],
    ['LEFT', 'DOWN'],
    ['DOWN', 'LEFT'],
  ]
  for (const [inDir, outDir] of cases) {
    it(`${inDir} → ${outDir}`, () => {
      expect(reflectDirection(inDir, '/')).toBe(outDir)
    })
  }
})

describe("reflectDirection — '\\' 거울 (모든 방향)", () => {
  const cases: [Direction, Direction][] = [
    ['RIGHT', 'DOWN'],
    ['DOWN', 'RIGHT'],
    ['LEFT', 'UP'],
    ['UP', 'LEFT'],
  ]
  for (const [inDir, outDir] of cases) {
    it(`${inDir} → ${outDir}`, () => {
      expect(reflectDirection(inDir, '\\')).toBe(outDir)
    })
  }
})

describe('reflectDirection — 두 번 반사하면 원래 방향으로 되돌아온다', () => {
  const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT']
  const mirrors: MirrorType[] = ['/', '\\']
  for (const m of mirrors) {
    for (const d of dirs) {
      it(`${m} 거울, ${d} 왕복`, () => {
        expect(reflectDirection(reflectDirection(d, m), m)).toBe(d)
      })
    }
  }
})

describe('reflectDirection — 잘못된 입력은 에러', () => {
  it('잘못된 거울 종류', () => {
    expect(() => reflectDirection('UP', 'X' as MirrorType)).toThrow()
  })
  it('잘못된 방향', () => {
    expect(() => reflectDirection('DIAGONAL' as Direction, '/')).toThrow()
  })
})
