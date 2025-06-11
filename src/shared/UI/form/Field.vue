<template>
  <div class="field">
    <FieldLabel
      :labelText="property.label?.labelText"
      :errors="property.errorMessages"
    >
      <template #formInput>
        <component :is="fieldComponent" />
      </template>
    </FieldLabel>
  </div>
</template>

<script setup lang="ts">
import { h, computed } from 'vue'
import type { FormSchemaProperty } from '~shared/lib'
import { TextInput, TextareaInput, RefField } from '~shared/UI'
import FieldLabel from './FieldLabel.vue'

interface Props {
  property: FormSchemaProperty
}

interface Emits {
  <T>(e: 'setFormProperty', payload: [string, T]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const fieldComponent = computed(() => {
  switch(props.property.type) {
    case 'text':
    case 'email':
    case 'password':
      return (
        props.property.refKey
          ? h(
              RefField,
              {
                name: props.property.name,
                placeholder: props.property.placeholder,
                refKey: props.property.refKey,
                isError: !!props.property.errorMessages?.length,
                onSelectOption: (value: string) => {
                  emit('setFormProperty', [props.property.name, value])
                }
              }
            )
          : h(
              TextInput,
              {
                name: props.property.name,
                type: props.property.type,
                placeholder: props.property.placeholder,
                isError: !!props.property.errorMessages?.length,
                onOnInput: (value: string) => {
                  emit('setFormProperty', [props.property.name, value])
                }
              }
            )
      )
    case 'textarea':
      return h(
        TextareaInput,
        {
          name: props.property.name,
          type: props.property.type,
          placeholder: props.property.placeholder,
          isError: !!props.property.errorMessages?.length,
          onOnInput: (value: string) => {
            emit('setFormProperty', [props.property.name, value])
          }
        }
      )
    default:
      return h(
        'div', {}, 'Unknown field type'
      )
  }
})
</script>

<style scoped lang="scss">
@use '~/app/styles/variables' as var;

.field {

  &__set {
    display: block;
  }
}
</style>
