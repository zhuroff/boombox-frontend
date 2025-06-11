import type { FormSchemaProperty } from '~shared/lib'

const embeddedAlbumFormSchema = new Map<string, FormSchemaProperty>([
  ['title', {
    id: 'album-title',
    name: 'title',
    placeholder: 'embeddedForm.titlePlaceholder',
    required: true,
    type: 'text',
    label: {
      labelText: 'embeddedForm.title'
    },
    errorMessages: [],
    validator<T = string>(value: T) {
      if (!this.errorMessages) {
        return 0
      }

      this.errorMessages.length = 0

      if (!value) {
        this.errorMessages.push('embeddedForm.titleRequired')
      }

      return this.errorMessages.length
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
    },
    errorMessages: [],
    validator<T = string>(value: T) {
      if (!this.errorMessages) {
        return 0
      }

      this.errorMessages.length = 0

      if (!value) {
        this.errorMessages.push('embeddedForm.artistRequired')
      }

      return this.errorMessages.length
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
    },
    errorMessages: [],
    validator<T = string>(value: T) {
      if (!this.errorMessages) {
        return 0
      }

      this.errorMessages.length = 0

      if (!value) {
        this.errorMessages.push('embeddedForm.genreRequired')
      }

      return this.errorMessages.length
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
    },
    errorMessages: [],
    validator<T = string>(value: T) {
      if (!this.errorMessages) {
        return 0
      }

      this.errorMessages.length = 0

      if (!value) {
        this.errorMessages.push('embeddedForm.periodRequired')
      }

      return this.errorMessages.length
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
    },
    errorMessages: [],
    validator<T = string>(value: T) {
      if (!this.errorMessages) {
        return 0
      }
      
      this.errorMessages.length = 0

      if (!value) {
        this.errorMessages.push('embeddedForm.frameRequired')
      }

      if (!String(value).startsWith('<iframe') || !String(value).endsWith('</iframe>')) {
        this.errorMessages.push('embeddedForm.frameInvalid')
      }

      return this.errorMessages.length
    }
  }]
])

export default embeddedAlbumFormSchema
