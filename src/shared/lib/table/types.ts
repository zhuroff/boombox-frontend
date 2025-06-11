import type { Pagination } from '~shared/lib'

export type TableConfig<T, U> = {
  rows: T[]
  schema: U
  pagination?: Pagination
  setPagination?: (payload: Partial<Pagination>) => void
}

export type TableCellConfig<T, U> = {
  key: string
  value: T
  schema: U
}

export type TableHeadConfig<T> = {
  key: string
  heading: string
  schema: T | undefined
  filter: T | undefined
}

export type TableFilters = Record<string, string[]>
