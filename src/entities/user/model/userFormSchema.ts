import type { FormSchemaProperty, LocalizationConfig } from '~shared/lib'

const userFormSchema = (localize: LocalizationConfig['localize']) => {
  return new Map<string, FormSchemaProperty>([
    ['login', {
      id: 'user-login',
      name: 'login',
      placeholder: localize('userForm.loginPlaceholder'),
      required: true,
      type: 'text',
      label: {
        labelText: localize('userForm.login')
      },
      errorMessages: [],
      validator<T = string>(value: T) {
        if (!value) {
          this.errorMessages?.push(localize('userForm.loginFieldRequired'))
        }

        return this.errorMessages?.length || 0
      }
    }],
    ['role', {
      id: 'user-role',
      name: 'role',
      required: true,
      type: 'select',
      label: {
        labelText: localize('userForm.role')
      },
      options: [
        {
          label: localize('userForm.roleAdmin'),
          value: 'admin'
        },
        {
          label: localize('userForm.roleUser'),
          value: 'user'
        },
        {
          label: localize('userForm.roleListener'),
          value: 'listener'
        }
      ],
      errorMessages: [],
      validator<T = string>(value: T) {
        if (!value) {
          this.errorMessages?.push(localize('userForm.roleFieldRequired'))
        }

        return this.errorMessages?.length || 0
      }
    }],
    ['email', {
      id: 'user-email',
      name: 'email',
      placeholder: localize('userForm.emailPlaceholder'),
      required: true,
      type: 'email',
      label: {
        labelText: localize('userForm.email')
      },
      errorMessages: [],
      validator<T = string>(value: T) {
        if (!value) {
          this.errorMessages?.push(localize('userForm.emailFieldRequired'))
        }

        return this.errorMessages?.length || 0
      }
    }],
    ['password', {
      id: 'user-password',
      name: 'password',
      placeholder: localize('userForm.passwordPlaceholder'),
      required: true,
      type: 'password',
      label: {
        labelText: localize('userForm.password')
      },
      errorMessages: [],
      validator<T = string>(value: T) {
        if (!value) {
          this.errorMessages?.push(localize('userForm.passwordFieldRequired'))
        }

        return this.errorMessages?.length || 0
      }
    }],
    ['passwordConfirm', {
      id: 'user-password-confirm',
      name: 'passwordConfirm',
      placeholder: localize('userForm.passwordConfirmPlaceholder'),
      required: true,
      type: 'password',
      label: {
        labelText: localize('userForm.passwordConfirm')
      },
      errorMessages: [],
      validator<T = string>(value: T) {
        if (!value) {
          this.errorMessages?.push(localize('userForm.passwordConfirmFieldRequired'))
        }

        return this.errorMessages?.length || 0
      }
    }]
  ])
}

export default userFormSchema
