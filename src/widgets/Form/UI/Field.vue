<template>
  <div class="field">
    <FieldLabel
      :labelText="property.label?.labelText"
    >
      <template #formInput>
        <component :is="fieldComponent" />
      </template>
    </FieldLabel>
  </div>
</template>

<script setup lang="ts">
import { h, computed } from 'vue'
import type { FormSchemaProperty } from '~widgets/Form/model/types'
import FieldLabel from './FieldLabel.vue'
import { TextInput, TextareaInput } from '~shared/UI'
import { RefListInput } from '~features/refs'

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
              RefListInput,
              {
                name: props.property.name,
                placeholder: props.property.placeholder,
                refKey: props.property.refKey,
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
@use '~/scss/variables' as var;

.field {

  &__set {
    display: block;
  }
}
</style>
