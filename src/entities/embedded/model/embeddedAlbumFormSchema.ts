import type { FormSchemaProperty, LocalizationConfig } from '~shared/lib'

const embeddedAlbumFormSchema = (localize: LocalizationConfig['localize']) => {
  return new Map<string, FormSchemaProperty>([
    ['title', {
      id: 'album-title',
      name: 'title',
      placeholder: localize('embeddedForm.titlePlaceholder'),
      required: true,
      type: 'text',
      label: {
        labelText: localize('embeddedForm.title')
      },
      errorMessages: [],
      validator<T = string>(value: T) {
        if (!this.errorMessages) {
          return 0
        }
  
        this.errorMessages.length = 0
  
        if (!value) {
          this.errorMessages.push(localize('embeddedForm.titleRequired'))
        }
  
        return this.errorMessages.length
      }
    }],
    ['artist', {
      id: 'album-artist',
      name: 'artist',
      placeholder: localize('embeddedForm.artistPlaceholder'),
      required: true,
      type: 'text',
      refKey: 'artists',
      label: {
        labelText: localize('embeddedForm.artist')
      },
      errorMessages: [],
      validator<T = string>(value: T) {
        if (!this.errorMessages) {
          return 0
        }
  
        this.errorMessages.length = 0
  
        if (!value) {
          this.errorMessages.push(localize('embeddedForm.artistRequired'))
        }
  
        return this.errorMessages.length
      }
    }],
    ['genre', {
      id: 'album-genre',
      name: 'genre',
      placeholder: localize('embeddedForm.genrePlaceholder'),
      required: true,
      type: 'text',
      refKey: 'genres',
      label: {
        labelText: localize('embeddedForm.genre')
      },
      errorMessages: [],
      validator<T = string>(value: T) {
        if (!this.errorMessages) {
          return 0
        }
  
        this.errorMessages.length = 0
  
        if (!value) {
          this.errorMessages.push(localize('embeddedForm.genreRequired'))
        }
  
        return this.errorMessages.length
      }
    }],
    ['period', {
      id: 'album-period',
      name: 'period',
      placeholder: localize('embeddedForm.periodPlaceholder'),
      required: true,
      type: 'text',
      refKey: 'periods',
      label: {
        labelText: localize('embeddedForm.period')
      },
      errorMessages: [],
      validator<T = string>(value: T) {
        if (!this.errorMessages) {
          return 0
        }
  
        this.errorMessages.length = 0
  
        if (!value) {
          this.errorMessages.push(localize('embeddedForm.periodRequired'))
        }
  
        return this.errorMessages.length
      }
    }],
    ['frame', {
      id: 'album-frame',
      name: 'frame',
      placeholder: localize('embeddedForm.framePlaceholder'),
      required: true,
      type: 'textarea',
      label: {
        labelText: localize('embeddedForm.frame')
      },
      errorMessages: [],
      validator<T = string>(value: T) {
        if (!this.errorMessages) {
          return 0
        }
        
        this.errorMessages.length = 0
  
        if (!value) {
          this.errorMessages.push(localize('embeddedForm.frameRequired'))
        }
  
        if (!String(value).startsWith('<iframe') || !String(value).endsWith('</iframe>')) {
          this.errorMessages.push(localize('embeddedForm.frameInvalid'))
        }
  
        return this.errorMessages.length
      }
    }]
  ])
}

export default embeddedAlbumFormSchema
