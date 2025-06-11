import type { ElementSize } from '~shared/lib'

export type FormPayload = Record<string, string | File>

export type InputLabelConfig = {
  labelText: string
  labelTextPosition?: 'right' | 'left'
  size?: ElementSize
  isError?: boolean
}

export type BaseInputFieldSchema = {
  name: string
  id?: string
  errorMessages?: string[]
  validator?: <T>(value: T) => number
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  refKey?: string
  defaultValue?: string
  size?: ElementSize
  label?: InputLabelConfig
}

export type TextInputFieldSchema = BaseInputFieldSchema & {
  type: 'text' | 'email' | 'password'
  placeholder?: string
}

export type TextareaInputFieldSchema = BaseInputFieldSchema & {
  type: 'textarea'
  placeholder?: string
  rows?: number
}

export type NumberInputFieldSchema = BaseInputFieldSchema & {
  type: 'number' | 'range'
  minValue?: number
  maxValue?: number
  placeholder?: string
}

export type CheckboxInputFieldSchema = BaseInputFieldSchema & {
  type: 'checkbox' | 'radio'
}

export type FileInputFieldSchema = BaseInputFieldSchema & {
  type: 'file'
}

export type SelectInputFieldSchema = BaseInputFieldSchema & {
  type: 'select' | 'multiselect'
  options: Array<{ label: string, value: string }>
}

export type FormSchemaProperty = 
  | TextInputFieldSchema
  | TextareaInputFieldSchema
  | NumberInputFieldSchema
  | CheckboxInputFieldSchema
  | FileInputFieldSchema
  | SelectInputFieldSchema
