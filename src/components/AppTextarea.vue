<template>
  
<textarea
  :placeholder="placeholder"
  :class="`textarea ${classname}`"
  :style="`height: ${initHeight}px`"
  :disabled="isDisabled"
  v-model="text"
  ref="textElement"
  spellcheck="false"
  @input="typeText"
></textarea>

</template>

<script lang="ts">

import { defineComponent, onMounted, watchEffect, ref, Ref } from 'vue'

export default defineComponent({
  props: {
    content: {
      type: String,
      required: false,
      default: ''
    },

    initHeight: {
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
    }
  },

  setup(props, { emit }) {
    const textElement: Ref<null | HTMLTextAreaElement> = ref(null)
    const text = ref(props.content)

    const resizeTextarea = () => {
      if (textElement.value) {
        textElement.value.setAttribute('style', 'height: auto;')
        textElement.value.setAttribute('style', `height: ${textElement.value.scrollHeight}px;`)
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

    const typeText = () => {
      resizeTextarea()
      emit('typeText', text.value)
    }

    return {
      textElement,
      text,
      typeText
    }
  }
})

</script>

<style lang="scss" scoped>

.textarea {
  overflow-y: hidden;
}

</style>
