import type { Ref } from 'vue'
import type { SortingValue } from '~shared/lib'

export type Pagination = {
  totalDocs: number
  totalPages: number
  page: number
}

export type UsePaginationProps = {
  docsLimit?: Ref<number>
  docsSort?: Ref<SortingValue>
  isRouted?: boolean
  localStorageKey?: string
}

export type PaginationState = {
  page: number
  limit: number
  sort: SortingValue
}

export type PaginationConfig = {
  limiter?: number[]
  increment?: true
  decrement?: true
  selected?: number
  totalDocs: number
  totalPages: number
}

export type PaginationStateSetter = <T extends keyof PaginationState>(key: T, value: PaginationState[T]) => void

export type PaginationConfigSetter = <T extends keyof PaginationConfig>(key: T, value: PaginationConfig[T]) => void