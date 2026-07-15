import type { AlbumSortOption, SortingValue } from '~shared/lib'

export const DEFAULT_ALBUM_SORT: AlbumSortOption = 'dateCreated-desc'

export const ALBUM_SORT_OPTIONS: AlbumSortOption[] = [
  'title-asc',
  'title-desc',
  'period-asc',
  'period-desc',
  'dateCreated-asc',
  'dateCreated-desc',
  'modified-asc',
  'modified-desc'
]

export const albumSortToSortingValue = (sort: AlbumSortOption): SortingValue => {
  const [field, direction] = sort.split('-') as [string, 'asc' | 'desc']
  const order = direction === 'asc' ? 1 : -1

  return { [field]: order }
}

export const parseAlbumSort = (value: unknown): AlbumSortOption => {
  if (typeof value === 'string' && ALBUM_SORT_OPTIONS.includes(value as AlbumSortOption)) {
    return value as AlbumSortOption
  }

  return DEFAULT_ALBUM_SORT
}
