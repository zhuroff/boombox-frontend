import type { Component } from 'vue'
import type { JSONSchema4, JSONSchema4Type } from 'json-schema'

export type TableSchema = JSONSchema4 & { order: string[] }

export type TableRow = Record<string, JSONSchema4Type> & { id: string }

export type TableFilters = Record<string, string[]>

export type TableHeaderConfig = {
  key: string
  element: HTMLElement | Component
}

export type BasicTableState = {
  rows: TableRow[]
  schema: TableSchema
  properties?: Record<string, JSONSchema4Type | Record<string, JSONSchema4Type>>
}
