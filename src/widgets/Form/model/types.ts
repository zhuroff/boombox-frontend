export interface InputLabelConfig {
  labelText: string
  labelTextPosition?: 'right' | 'left'
  size?: ElementSize
  isError?: boolean
}

export interface BaseInputFieldSchema {
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

export interface TextInputFieldSchema extends BaseInputFieldSchema {
  type: 'text' | 'email' | 'password'
  placeholder?: string
}

export interface TextareaInputFieldSchema extends BaseInputFieldSchema {
  type: 'textarea'
  placeholder?: string
  rows?: number
}

interface NumberInputFieldSchema extends BaseInputFieldSchema {
  type: 'number' | 'range'
  minValue?: number
  maxValue?: number
  placeholder?: string
}

interface CheckboxInputFieldSchema extends BaseInputFieldSchema {
  type: 'checkbox' | 'radio'
}

interface FileInputFieldSchema extends BaseInputFieldSchema {
  type: 'file'
}

interface SelectInputFieldSchema extends BaseInputFieldSchema {
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
  
export type FormPayload = Record<string, string | File>
