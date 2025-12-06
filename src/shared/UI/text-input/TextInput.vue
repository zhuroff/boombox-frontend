<template>
  <input
    :id="id"
    :class="stateClasses"
    :placeholder="placeholder"
    :style="style"
    :type="type"
    :name="name"
    :readonly="readonly"
    :required="required"
    :value="modelValue"
    ref="textInputElement"
    @input="(e) => {
      const value = (e.target as HTMLInputElement).value
      emit('update:modelValue', value)
      emit('onInput', value)
    }"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, type StyleValue } from 'vue'
import type { ElementSize, TextInputFieldSchema } from '~shared/lib'

interface Props {
  name: string
  type: TextInputFieldSchema['type']
  modelValue?: string
  size?: ElementSize
  id?: string
  isError?: boolean
  placeholder?: string
  readonly?: boolean
  required?: boolean
  disabled?: boolean
  style?: StyleValue
  isFocused?: boolean
}

interface Emits {
  (e: 'onInput', value: string): void
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  isError: false,
  required: false,
  readonly: false,
  disabled: false,
  size: 'medium'
})

const emit = defineEmits<Emits>()

const textInputElement = ref<null | HTMLInputElement>(null)

const stateClasses = computed(() => [
  'input-field',
  `--${props.size}`,
  {
    '--error': props.isError
  }
])

onMounted(() => {
  if (props.isFocused) {
    textInputElement.value?.focus()
  }
})
</script>
