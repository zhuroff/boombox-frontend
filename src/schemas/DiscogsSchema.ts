import type { JSONSchema4 } from 'json-schema'

const discogsTableSchema: JSONSchema4 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    id: {
      type: 'integer'
    },
    country: {
      type: 'string',
      minLength: 2,
      maxLength: 2
    },
    cover: {
      type: 'string',
      format: 'uri',
      element: 'img'
    },
    releaseFormat: {
      $ref: '#/definitions/stringArray'
    },
    label: {
      $ref: '#/definitions/stringArray'
    },
    pageURL: {
      type: 'string',
      format: 'uri',
      isRowLink: true,
      isInnerPage: false
    },
    releaseTitle: {
      type: 'string'
    },
    releaseYear: {
      type: 'string',
      pattern: '^[0-9]{4}$'
    }
  },
  order: [
    'cover',
    'releaseTitle',
    'country',
    'releaseFormat',
    'label',
    'releaseYear'
  ],
  definitions: {
    stringArray: {
      type: 'array',
      items: {
        type: 'string'
      },
      minItems: 1
    }
  },
  additionalProperties: false
}

export default discogsTableSchema
