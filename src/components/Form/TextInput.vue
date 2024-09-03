<template>
  <input
    :id="id"
    :class="stateClasses"
    :placeholder="localize(placeholder || '')"
    :style="style"
    :type="type"
    :name="name"
    :readonly="readonly"
    :required="required"
    autocomplete="off"
    @input="(e) => emit('onInput', (e.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StyleValue } from 'vue'
import useGlobalStore from '~/store/global'
import './InputField.scss'

interface Props {
  name: string
  type: TextInputFieldSchema['type']
  size?: ElementSize
  defaultValue?: string
  id?: string
  isError?: boolean
  placeholder?: string
  readonly?: boolean
  required?: boolean
  disabled?: boolean
  style?: StyleValue
}

interface Emits {
  (e: 'onInput', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  isError: false,
  required: false,
  readonly: false,
  disabled: false,
  size: 'medium'
})

const emit = defineEmits<Emits>()

const {
  globalGetters: { localize }
} = useGlobalStore()

const stateClasses = computed(() => [
  'input-field',
  `--${props.size}`,
  {
    '--error': props.isError
  }
])
</script>
