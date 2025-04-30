<template>
  <form @submit.prevent.stop="form.handleSubmit()">
    <div
      v-for="[key, property] in formSchema"
      :key="key"
    >
      <form.Field :name="key">
        <template v-slot="{ field }">
          <Field
            :property="property"
            :field="field"
          />
        </template>
      </form.Field>
    </div>
    <Button
      type="submit"
      :label="submitButtonLocale"
    />
  </form>
</template>

<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import Field from './Field.vue'
import Button from '~/components/Button.vue'

interface Props {
  formSchema: Map<string, FormSchemaProperty>
  submitButtonLocale?: string
}

interface Emits {
  (e: 'formSubmit', value: CustomFormData): void
}

const props = withDefaults(defineProps<Props>(), {
  submitButtonLocale: 'submit'
})
const emit = defineEmits<Emits>()

const form = useForm({
  defaultValues: [...props.formSchema.entries()]
    .reduce<CustomFormData>((acc, [key, value]) => {
      acc[key] = value.defaultValue || ''
      return acc
    }, {}),
  onSubmit: ({ value }) => {
    emit('formSubmit', value)
  }
})
</script>

<style lang="scss">
@use '~/scss/variables' as var;

.input-field {
  border: 1px solid;
  border-color: var.$paleMD;
  padding: .5rem .75rem;
  width: 100%;

  &::placeholder {
    color: var.$paleDP;
  }

  &.--error {
    border-color: var.$error;
    outline-color: var.$error;
  }
}
</style>
