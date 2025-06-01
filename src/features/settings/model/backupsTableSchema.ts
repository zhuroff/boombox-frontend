import type { JSONSchema4 } from 'json-schema'

const backupsTableSchema: JSONSchema4 = {
  type: 'object',
  order: ['timestamp', 'restore', 'delete'],
  properties: {
    timestamp: {
      type: 'string',
      format: 'date-time'
    },
    restore: {
      type: 'object',
      component: '/src/features/settings/UI/BackupActions.vue',
      props: {
        action: 'restore',
        size: 'small',
        align: 'right',
        valueRef: 'timestamp',
      }
    },
    delete: {
      type: 'object',
      component: '/src/features/settings/UI/BackupActions.vue',
      props: {
        action: 'delete',
        size: 'small',
        align: 'right',
        valueRef: 'timestamp',
      }
    }
  }
}

export default backupsTableSchema
