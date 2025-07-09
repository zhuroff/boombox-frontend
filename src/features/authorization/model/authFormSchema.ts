import type { FormSchemaProperty, LocalizationConfig } from '~shared/lib'

const authFormSchema = (localize: LocalizationConfig['localize']) => {
  return new Map<string, FormSchemaProperty>([
    ['email', {
      id: 'login-email',
      name: 'email',
      placeholder: localize('loginForm.emailPlaceholder'),
      required: true,
      type: 'email',
      label: {
        labelText: localize('loginForm.email')
      },
      errorMessages: [],
      validator<T = string>(value: T) {
        if (!value) {
          this.errorMessages?.push(localize('loginForm.emailRequired'))
        }
  
        return this.errorMessages?.length || 0
      }
    }],
    ['password', {
      id: 'login-password',
      name: 'password',
      placeholder: localize('loginForm.passwordPlaceholder'),
      required: true,
      type: 'password',
      label: {
        labelText: localize('loginForm.password')
      },
      errorMessages: [],
      validator<T = string>(value: T) {
        if (!value) {
          this.errorMessages?.push(localize('loginForm.passwordRequired'))
        }
  
        return this.errorMessages?.length || 0
      }
    }]
  ])
}

export default authFormSchema
