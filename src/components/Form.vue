<template>
  <form
    class="form"
    :style="style"
    @submit.prevent="onSubmit"
  >
    <div
      v-for="[key, value] in schemaProps"
      class="form__element"
      :style="{ width: value.width || '100%' }"
    >
      <TextInput
        v-if="isTextInput(value)"
        :errorMessage="errorInputs.has(key) ? lang('formLabels.errorRequired') : undefined"
        :isRequired="Boolean(value.required)"
        :placeholder="value.title && lang(value.title)"
        :refEntityKey="value.$ref"
        @setInputValue="(value) => formData[key] = value"
      />
      <Textarea
        v-else-if="isTextarea(value)"
        :rows="1"
        :errorMessage="errorInputs.has(key) ? lang('formLabels.errorRequired') : undefined"
        :isRequired="Boolean(value.required)"
        :placeholder="value.title && lang(value.title)"
        @setTextareaValue="(value) => formData[key] = value"
      />
    </div>
    <div class="form__footer">
      <Button
        label="Отправить"
        type="submit"
      />
    </div>
  </form>
</template>

<script lang="ts">
import { PropType, StyleValue, ref, computed, defineComponent, reactive } from 'vue'
import { BasicEntity } from '~/types/Common'
import { JSONSchema4 } from 'json-schema'
import { useLocales } from '~/hooks/useLocales'
import TextInput from './TextInput.vue'
import Textarea from './Textarea.vue'
import Button from './Button.vue'

export default defineComponent({
  name: 'form',
  components: {
    TextInput,
    Textarea,
    Button
  },
  props: {
    schema: {
      type: Object as PropType<JSONSchema4>,
      required: true
    },
    style: {
      type: Object as PropType<StyleValue>,
      required: false
    }
  },
  setup({ schema }, { emit }) {
    if (!schema.properties) {
      throw new Error('No properties in schema')
    }

    const { lang } = useLocales()
    const errorInputs = ref<Set<string>>(new Set())

    const initValues = (value: JSONSchema4) => {
      switch (value.type) {
        case 'string':
          return value.default || ''
        case 'number':
          return value.default || 0
        case 'boolean':
          return value.default || false
        case 'array':
          return value.default || (!value.maxItems || value.maxItems > 1) ? [] : {}
        case 'object':
          return value.default || {}
        default:
          throw new Error('Unsupported type')
      }
    }

    const formData = reactive(
      Object.entries(schema.properties)
        .reduce((acc, [key, value]) => {
          acc[key] = initValues(value)          
          return acc
        }, {} as Record<string, ReturnType<typeof initValues>>)
    )
    
    const schemaProps = computed(() => (
      new Map([...Object.entries(schema.properties || {})])
    ))

    const isTextInput = (value: JSONSchema4) => {
      return (value.type === 'string' || value.$ref) && value.element !== 'textarea'
    }

    const isTextarea = (value: JSONSchema4) => {
      return value.type === 'string' && !value.$ref && value.element === 'textarea'
    }

    const onSubmit = () => {
      for (const [key, value] of schemaProps.value) {
        if (value.required && !formData[key]) {
          errorInputs.value.add(key)
        } else {
          errorInputs.value.delete(key)
        }
      }
      
      if (!errorInputs.value.size) {
        emit('formSubmit', formData)
      }
    }

    return {
      lang,
      formData,
      schemaProps,
      isTextInput,
      errorInputs,
      isTextarea,
      onSubmit
    }
  }
})
</script>
