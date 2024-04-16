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

<script lang="ts">
import { defineComponent, onMounted, watchEffect, ref, Ref } from 'vue'

export default defineComponent({
  name: 'Textarea',
  props: {
    content: {
      type: String,
      required: false,
      default: ''
    },
    rows: {
      type: Number,
      required: true,
      validator: (value: number) => value > 0
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    classname: {
      type: String,
      required: false,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    isRequired: {
      type: Boolean,
      required: false,
      default: false
    },
    errorMessage: {
      type: String,
      required: false
    }
  },
  setup(props, { emit }) {
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

    return {
      textElement,
      text,
      emitTextareaValue
    }
  }
})
</script>

<style lang="scss">
@import '../scss/variables.scss';
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
