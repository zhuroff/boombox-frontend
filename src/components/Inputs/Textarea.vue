<template>  
  <div class="textarea-input">
    <textarea
      :placeholder="placeholder && `${placeholder}${isRequired ? '*' : ''}`"
      :class="['textarea-input__element', errorMessage ? '--error' : '', classname]"
      :rows="rows"
      :disabled="isDisabled"
      v-model="text"
      ref="textElement"
      spellcheck="false"
      @input="emitTextareaValue"
    ></textarea>
    <div
      v-if="errorMessage"
      class="textarea-input__error"
    >{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watchEffect, ref, Ref } from 'vue'

interface Props {
  content?: string
  rows: number
  placeholder?: string
  classname?: string
  isDisabled?: boolean
  isRequired?: boolean
  errorMessage?: string
}

interface Emits {
  (e: 'setTextareaValue', value?: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const textElement: Ref<null | HTMLTextAreaElement> = ref(null)
const text = ref(props.content)

const resizeTextarea = () => {
  if (textElement.value) {
    textElement.value.setAttribute('style', 'height: auto;')
    textElement.value.setAttribute('style', `height: ${textElement.value.scrollHeight + 2}px;`)
  }
}

onMounted(() => {
  resizeTextarea()
  window.onresize = resizeTextarea
})

watchEffect(() => {
  text.value = props.content
  setTimeout(() => resizeTextarea(), 0)
})

const emitTextareaValue = () => {
  resizeTextarea()
  emit('setTextareaValue', text.value)
}
</script>

<style lang="scss">
@import '../../scss/variables.scss';
.textarea-input {
  &__element {
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

  &__error {
    color: $error;
    font-size: 0.75rem;
  }
}
</style>
