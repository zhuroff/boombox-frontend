<template>
  <textarea
    :placeholder="placeholder"
    :class="stateClasses"
    :rows="rows"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :type="type"
    :name="name"
    :id="id"
    v-model="text"
    ref="textareaElement"
    spellcheck="false"
    @input="emitTextareaValue"
  ></textarea>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, watch, ref, type Ref, type StyleValue } from 'vue'
import type { ElementSize, TextareaInputFieldSchema } from '~shared/lib'

interface Props {
  name: string
  type: TextareaInputFieldSchema['type']
  size?: ElementSize
  modelValue?: string
  id?: string
  isError?: boolean
  rows?: number
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
  readonly?: boolean
  style?: StyleValue
}

interface Emits {
  (e: 'onInput', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
  size: 'medium'
})

const emit = defineEmits<Emits>()

const textareaElement: Ref<null | HTMLTextAreaElement> = ref(null)
const text = ref<string>(props.modelValue || '')

const stateClasses = computed(() => [
  'textarea-field',
  props.className,
  {
    '--error': !!props.isError
  }
])

const getScrollParent = (el: HTMLElement | null): HTMLElement | null => {
  if (!el) return null

  let parent = el.parentElement
  while (parent) {
    const { overflowY } = getComputedStyle(parent)
    if (overflowY === 'auto' || overflowY === 'scroll') return parent
    parent = parent.parentElement
  }

  return null
}

const resizeTextarea = () => {
  const el = textareaElement.value
  if (!el) return

  const scrollParent = getScrollParent(el)
  const parentScrollTop = scrollParent?.scrollTop ?? 0

  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight + 2}px`

  if (scrollParent) {
    scrollParent.scrollTop = parentScrollTop
  }
}

onMounted(() => {
  resizeTextarea()
  window.addEventListener('resize', resizeTextarea)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeTextarea)
})

watch(
  () => props.modelValue,
  (modelValue) => {
    const next = modelValue || ''
    if (next === text.value) return

    text.value = next
    setTimeout(resizeTextarea, 0)
  }
)

const emitTextareaValue = () => {
  resizeTextarea()
  emit('onInput', text.value)
}
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.textarea-field {
  overflow-y: hidden;
  font-size: 0.875rem;
  display: block;
  width: 100%;
  border-radius: var.$borderRadiusSM;
  border: 1px solid var.$paleMD;
  padding: 0.5rem 1rem;

  &.--error {
    border-color: var.$error;
  }

  &[readonly] {
    background-color: transparent;
    padding: 0;
    border: none;
  }
}
</style>
