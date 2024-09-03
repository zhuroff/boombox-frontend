import { describe, it, expect } from 'vitest'
import {
  hostString,
  coverPlaceholders
} from './utils'

describe('hostString', () => {
  it('returns the correct host string', () => {
    expect(hostString('')).toBe('http://localhost:3001')
    expect(hostString('/')).toBe('http://localhost:3001')
    expect(hostString('/foo')).toBe('http://localhost:3001/foo')
    expect(hostString('/bar/777')).toBe('http://localhost:3001/bar/777')
  })
})

describe('coverPlaceholders', () => {
  it('returns the cover image placeholder', () => {
    expect(coverPlaceholders('artists')).toBe('/img/artist.webp')
    expect(coverPlaceholders('genres')).toBe('/img/genre.webp')
    expect(coverPlaceholders('periods')).toBe('/img/period.webp')
    expect(coverPlaceholders('frames')).toBe('/img/frame.webp')
    expect(coverPlaceholders('albums')).toBe('/img/album.webp')
    expect(coverPlaceholders('anything')).toBe('/img/album.webp')
    expect(coverPlaceholders('')).toBe('/img/album.webp')
  })
})
