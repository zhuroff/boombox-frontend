export type BackupAction = 'create' | 'restore' | 'delete' | 'get'

export interface BackupActionConfig {
  label: string
  handler: (...args: any[]) => Promise<void>
}