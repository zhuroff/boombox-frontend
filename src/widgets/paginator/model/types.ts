export interface Pagination {
  totalDocs: number
  totalPages: number
  page: number
}

export interface UsePaginationProps {
  docsLimit?: number
  docsSort?: SortingValue
  isRouted?: boolean
  localStorageKey?: string
}

export interface PaginationState extends Pick<Pagination, 'page'> {
  limit: number
  sort: SortingValue
}

export interface PaginationConfig {
  limiter?: number[]
  increment?: true
  decrement?: true
  selected?: number
  totalDocs: number,
  totalPages: number
}

export type PaginationStateSetter = <T extends keyof PaginationState>(key: T, value: PaginationState[T]) => void

export type PaginationConfigSetter = <T extends keyof PaginationConfig>(key: T, value: PaginationConfig[T]) => void