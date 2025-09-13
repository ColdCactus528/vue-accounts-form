import { describe, it, expect } from 'vitest'
import { parseLabels } from './tags'

describe('parseLabels', () => {
  it('splits by ";" trims and removes empties', () => {
    expect(parseLabels(' HR; Admin ; ; IT ')).toEqual([
      { text: 'HR' },
      { text: 'Admin' },
      { text: 'IT' },
    ])
  })

  it('returns empty for empty string', () => {
    expect(parseLabels('')).toEqual([])
  })
})
