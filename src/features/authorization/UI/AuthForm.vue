<template>
  <form
    class="form"
    @submit.prevent.stop="form.handleSubmit"
  >
    <div class="form__body">
      <form.Field
        name="email"
        :validators="{
          onChange: ({ value }) => !value ? localize('loginForm.emailRequired') : undefined
        }"
      >
        <template v-slot="{ field, state }">
          <FieldLabel
            :label-text="localize('loginForm.email')"
            :errors="(state.meta.errors ?? []) as string[]"
          >
            <template #formInput>
              <TextInput
                :name="field.name"
                type="email"
                :model-value="String(field.state.value ?? '')"
                :placeholder="localize('loginForm.emailPlaceholder')"
                :is-error="!!state.meta.errors?.length"
                @on-input="(v: string) => field.handleChange(v)"
                @blur="field.handleBlur"
              />
            </template>
          </FieldLabel>
        </template>
      </form.Field>

      <form.Field
        name="password"
        :validators="{
          onChange: ({ value }) => !value ? localize('loginForm.passwordRequired') : undefined
        }"
      >
        <template v-slot="{ field, state }">
          <FieldLabel
            :label-text="localize('loginForm.password')"
            :errors="(state.meta.errors ?? []) as string[]"
          >
            <template #formInput>
              <TextInput
                :name="field.name"
                type="password"
                :model-value="String(field.state.value ?? '')"
                :placeholder="localize('loginForm.passwordPlaceholder')"
                :is-error="!!state.meta.errors?.length"
                @on-input="(v: string) => field.handleChange(v)"
                @blur="field.handleBlur"
              />
            </template>
          </FieldLabel>
        </template>
      </form.Field>
    </div>
    <footer class="form__footer">
      <form.Subscribe>
        <template v-slot="{ canSubmit, isSubmitting }">
          <slot
            name="submit"
            :can-submit="canSubmit"
            :is-submitting="isSubmitting"
          />
        </template>
      </form.Subscribe>
    </footer>
  </form>
</template>

<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { TextInput } from '~shared/UI'
import { FieldLabel } from '~features/form'
import { useLocalization } from '~shared/model'
import type { FormPayload } from '~shared/lib'

const { localize } = useLocalization()

const props = defineProps<{
  onSubmit: (payload: FormPayload) => void
}>()

const form = useForm({
  defaultValues: {
    email: '',
    password: ''
  },
  onSubmit: async ({ value }) => {
    props.onSubmit(value as FormPayload)
  }
})

defineExpose({ form })
</script>

<style lang="scss" scoped>
.form {
  &__body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__footer {
    margin-top: 1rem;
  }
}
</style>
