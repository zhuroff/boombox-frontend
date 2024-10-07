import { describe, it, expect } from 'vitest'
import {
  hostString,
  coverPlaceholders
} from './utils'

describe('hostString', () => {
  it('returns the correct host string', () => {
    expect(hostString('')).toBe(import.meta.env.VITE_DEV_HOST)
    expect(hostString('/')).toBe(`${import.meta.env.VITE_DEV_HOST}/`)
    expect(hostString('/foo')).toBe(`${import.meta.env.VITE_DEV_HOST}/foo`)
    expect(hostString('/bar/777')).toBe(`${import.meta.env.VITE_DEV_HOST}/bar/777`)
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
