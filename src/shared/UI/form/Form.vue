<template>
  <!-- <form @submit.prevent.stop="form.handleSubmit()">
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
  </form> -->
  <form class="form">

  </form>
</template>

<script setup lang="ts">
import type { FormPayload, FormSchemaProperty } from '~/shared/model/types'
import { Button } from '~shared/UI'
import Field from './Field.vue'

interface Props {
  formSchema: Map<string, FormSchemaProperty>
  submitButtonLocale?: string
}

interface Emits {
  (e: 'formSubmit', value: FormPayload): void
}

const props = withDefaults(defineProps<Props>(), {
  submitButtonLocale: 'submit'
})
const emit = defineEmits<Emits>()
console.log(props)

// const form = useForm({
//   defaultValues: [...props.formSchema.entries()]
//     .reduce<CustomFormData>((acc, [key, value]) => {
//       acc[key] = value.defaultValue || ''
//       return acc
//     }, {}),
//   onSubmit: ({ value }) => {
//     emit('formSubmit', value)
//   }
// })
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
