import type { TableSchema } from '~shared/lib'

const usersTableSchema: TableSchema = {
  type: 'object',
  order: ['id', 'email', 'role', 'delete'],
  properties: {
    id: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    role: {
      type: 'string'
    },
    delete: {
      type: 'object',
      component: '/src/features/user/UI/DeleteUserButton.vue',
      props: {
        size: 'small',
        align: 'right',
        valueRef: 'id'
      }
    }
  }
}

export default usersTableSchema
