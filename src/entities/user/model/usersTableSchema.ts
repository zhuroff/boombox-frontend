import type { JSONSchema4 } from 'json-schema'

const usersTableSchema: JSONSchema4 = {
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
      component: '/src/entities/user/UI/DeleteUserButton.vue',
      props: {
        size: 'small',
        align: 'right',
        valueRef: 'id'
      }
    }
  }
}

export default usersTableSchema
