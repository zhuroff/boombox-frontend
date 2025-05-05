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
    :value="value"
    ref="textInputElement"
    autocomplete="off"
    @input="(e) => emit('onInput', (e.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { StyleValue } from 'vue'
import useGlobalStore from '~/store/global'

interface Props {
  name: string
  type: TextInputFieldSchema['type']
  value?: string
  size?: ElementSize
  defaultValue?: string
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
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  isError: false,
  required: false,
  readonly: false,
  disabled: false,
  size: 'medium'
})

const emit = defineEmits<Emits>()

const textInputElement = ref<null | HTMLInputElement>(null)

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

onMounted(() => {
  if (props.isFocused) {
    textInputElement.value?.focus()
  }
})
</script>
