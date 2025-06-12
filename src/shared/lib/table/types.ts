import type { Component } from 'vue'
import type { JSONSchema4, JSONSchema4Type } from 'json-schema'

// export type TableConfig<T, U> = {
//   rows: T[]
//   schema: U
//   pagination?: Pagination
//   setPagination?: (payload: Partial<Pagination>) => void
// }

// export type TableCellConfig<T, U> = {
//   key: string
//   value: T
//   schema: U
// }

// export type TableHeadConfig<T> = {
//   key: string
//   heading: string
//   schema: T | undefined
//   filter: T | undefined
// }

export type TableSchema = JSONSchema4 & { order: string[] }

export type TableRow = Record<string, JSONSchema4Type> & { id: string }

export type TableFilters = Record<string, string[]>

export type TableHeaderConfig = {
  key: string
  element: HTMLElement | Component
}
