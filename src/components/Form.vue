<template>
  <form
    class="form"
    :style="style"
    @submit.prevent="onSubmit"
  >
    <div
      v-for="([key, value], index) in schemaProps"
      class="form__element"
      :style="{
        width: value.width || '100%',
        zIndex: schemaProps.size - index
      }"
    >
      <TextInput
        v-if="isTextInput(value)"
        :errorMessage="errorInputs.has(key) ? lang('formLabels.errorRequired') : undefined"
        :type="value.format"
        :isRequired="Boolean(value.required)"
        :placeholder="value.title && lang(value.title)"
        :refEntityKey="value.$ref"
        @setInputValue="(val) => formData[key] = val"
      />
      <Textarea
        v-else-if="isTextarea(value)"
        :rows="1"
        :errorMessage="errorInputs.has(key) ? lang('formLabels.errorRequired') : undefined"
        :isRequired="Boolean(value.required)"
        :placeholder="value.title && lang(value.title)"
        @setTextareaValue="(val) => formData[key] = val"
      />
      <Dropdown
        v-else-if="isDropdown(value)"
        :items="dropdownItems(value)"
        :placeholder="value.title && `${lang(value.title)}${value.required ? '*' : ''}`"
        :selectedValue="getDropdownValue(key, value)"
        @applyValue="(option) => formData[key] = option.value"
      />
    </div>
    <div class="form__footer">
      <Button
        :label="lang('submit')"
        :isInverted="isInverted"
        type="submit"
      />
    </div>
  </form>
</template>

<script lang="ts">
import { PropType, StyleValue, ref, computed, defineComponent, reactive, toRef } from 'vue'
import { JSONSchema4 } from 'json-schema'
import { useLocales } from '~/hooks/useLocales'
import TextInput from '~/components/Inputs/TextInput.vue'
import Textarea from '~/components/Inputs/Textarea.vue'
import Button from './Button.vue'
import Dropdown from './Inputs/Dropdown.vue'

export default defineComponent({
  name: 'Form',
  components: {
    TextInput,
    Textarea,
    Dropdown,
    Button
  },
  props: {
    schema: {
      type: Object as PropType<JSONSchema4>,
      required: true
    },
    isInverted: {
      type: Boolean,
      required: false,
      default: false
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
        .reduce<Record<string, ReturnType<typeof initValues>>>((acc, [key, value]) => {
          acc[key] = initValues(value)          
          return acc
        }, {})
    )
    
    const schemaProps = computed(() => (
      new Map([...Object.entries(schema.properties || {})])
    ))

    const isTextInput = (value: JSONSchema4) => {
      return (value.type === 'string' || value.$ref) && !value.element
    }

    const isTextarea = (value: JSONSchema4) => {
      return value.type === 'string' && !value.$ref && value.element === 'textarea'
    }

    const isDropdown = (value: JSONSchema4) => {
      return value.type === 'string' && !value.$ref && value.element === 'select'
    }

    const dropdownItems = (value: JSONSchema4) => {
      return (
        Object.entries(value.properties || {})
          .map(([key, value]) => ({ value: key, label: lang(value.title || '') }))
      )
    }

    const getDropdownValue = (key: string, entity: JSONSchema4) => {
      const localeKey = String(formData[key])
      const localePath = entity.properties?.[localeKey]?.title
      return toRef(() => localePath ? lang(localePath) : String(formData[key]))
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
      isDropdown,
      dropdownItems,
      getDropdownValue,
      onSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.form {

  &__element {
    position: relative;
  }
}
</style>
