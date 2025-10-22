import type { TableSchema } from '~shared/lib'

const backupsTableSchema: TableSchema = {
  type: 'object',
  order: ['timestamp', 'restore', 'delete'],
  properties: {
    timestamp: {
      type: 'string',
      format: 'date-time'
    },
    restore: {
      type: 'object',
      component: '~/features/backup/UI/BackupActions.vue',
      props: {
        action: 'restore',
        size: 'small',
        align: 'right',
        valueRef: 'timestamp',
      }
    },
    delete: {
      type: 'object',
      component: '~/features/backup/UI/BackupActions.vue',
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
