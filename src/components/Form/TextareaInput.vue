<template>  
  <textarea
    :placeholder="localize(placeholder || '')"
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
import { onMounted, computed, watchEffect, ref } from 'vue'
import type { Ref, StyleValue } from 'vue'
import useGlobalStore from '~/store/global'

interface Props {
  name: string
  type: TextareaInputFieldSchema['type']
  size?: ElementSize
  defaultValue?: string
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

const {
  globalGetters: { localize }
} = useGlobalStore()

const textareaElement: Ref<null | HTMLTextAreaElement> = ref(null)
const text = ref<string>(props.defaultValue || '')

const stateClasses = computed(() => [
  'textarea-field',
  props.className,
  {
    '--error': !!props.isError
  }
])

const resizeTextarea = () => {
  if (textareaElement.value) {
    textareaElement.value.setAttribute('style', 'height: auto;')
    textareaElement.value.setAttribute('style', `height: ${textareaElement.value.scrollHeight + 2}px;`)
  }
}

onMounted(() => {
  resizeTextarea()
  window.onresize = resizeTextarea
})

watchEffect(() => {
  text.value = props.defaultValue || ''
  setTimeout(resizeTextarea, 0)
})

const emitTextareaValue = () => {
  resizeTextarea()
  emit('onInput', text.value)
}
</script>

<style lang="scss">
@import '~/scss/variables.scss';

.textarea-field {
  overflow-y: hidden;
  font-size: .875rem;
  display: block;
  width: 100%;
  border-radius: $borderRadiusSM;
  border: 1px solid $paleMD;
  padding: .5rem 1rem;

  &.--error {
    border-color: $error;
  }
}
</style>
