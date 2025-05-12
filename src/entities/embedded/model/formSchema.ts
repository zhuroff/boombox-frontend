import type { FormSchemaProperty } from '~shared/model/types'

const embeddedAlbumFormSchema = new Map<string, FormSchemaProperty>([
  ['title', {
    id: 'album-title',
    name: 'title',
    placeholder: 'embeddedForm.titlePlaceholder',
    required: true,
    type: 'text',
    label: {
      labelText: 'embeddedForm.title'
    }
  }],
  ['artist', {
    id: 'album-artist',
    name: 'artist',
    placeholder: 'embeddedForm.artistPlaceholder',
    required: true,
    type: 'text',
    refKey: 'artists',
    label: {
      labelText: 'embeddedForm.artist'
    }
  }],
  ['genre', {
    id: 'album-genre',
    name: 'genre',
    placeholder: 'embeddedForm.genrePlaceholder',
    required: true,
    type: 'text',
    refKey: 'genres',
    label: {
      labelText: 'embeddedForm.genre'
    }
  }],
  ['period', {
    id: 'album-period',
    name: 'period',
    placeholder: 'embeddedForm.periodPlaceholder',
    required: true,
    type: 'text',
    refKey: 'periods',
    label: {
      labelText: 'embeddedForm.period'
    }
  }],
  ['frame', {
    id: 'album-frame',
    name: 'frame',
    placeholder: 'embeddedForm.framePlaceholder',
    required: true,
    type: 'textarea',
    label: {
      labelText: 'embeddedForm.frame'
    }
  }]
])

export default embeddedAlbumFormSchema
