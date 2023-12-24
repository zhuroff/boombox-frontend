<template>
  <form class="form" @submit.prevent="onSubmit">
    <div
      v-for="[key, value] in schemaProps"
      class="form__element"
    >
      <TextInput
        v-if="isTextInput(value)"
        :placeholder="value.title"
        @setInputValue="(value) => formData[key] = value"
      />
    </div>
    <div class="form__footer">
      <Button
        label="Submit"
        type="submit"
      />
    </div>
  </form>
</template>

<script lang="ts">
import { PropType, computed, defineComponent, reactive } from 'vue'
import { JSONSchema4 } from 'json-schema'
import TextInput from './TextInput.vue'
import Button from './Button.vue'

export default defineComponent({
  name: 'form',
  components: {
    TextInput,
    Button
  },
  props: {
    schema: {
      type: Object as PropType<JSONSchema4>,
      required: true
    }
  },
  setup({ schema }) {
    if (!schema.properties) {
      throw new Error('No properties in schema')
    }

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
          // acc.set(key, initValues(value))
          
          return acc
        }, {} as Record<string, ReturnType<typeof initValues>>)
        // }, new Map())
    )
    
    const schemaProps = computed(() => (
      new Map([...Object.entries(schema.properties || {})])
    ))

    const isTextInput = (value: JSONSchema4) => {
      return value.type === 'string' && !value.element || value.element === 'text'
    }

    const isTextarea = (value: JSONSchema4) => {
      return value.type === 'string' && value.element === 'textarea'
    }

    const onSubmit = () => {
      console.log(formData)
    }

    return {
      formData,
      schemaProps,
      isTextInput,
      isTextarea,
      onSubmit
    }
  }
})
</script>
