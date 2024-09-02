import { describe, it, expect } from 'vitest'
import {
  hostString
} from './utils'

describe('hostString', () => {
  it('returns the correct host string', () => {
    expect(hostString('')).toBe('http://localhost:3000')
    expect(hostString('/')).toBe('http://localhost:3000')
    expect(hostString('/foo')).toBe('http://localhost:3000/foo')
    expect(hostString('/bar/777')).toBe('http://localhost:3000/bar/777')
  })
})
