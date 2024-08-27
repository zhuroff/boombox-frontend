<template>
  <p>refactoring</p>
  <!-- <form
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
        :errorMessage="errorInputs.has(key) ? localize('formLabels.errorRequired') : undefined"
        :type="value.format"
        :isRequired="Boolean(value.required)"
        :placeholder="value.title && localize(value.title)"
        :refEntityKey="value.$ref"
        @setInputValue="(val) => formData[key] = val"
      />
      <Textarea
        v-else-if="isTextarea(value)"
        :rows="1"
        :errorMessage="errorInputs.has(key) ? localize('formLabels.errorRequired') : undefined"
        :isRequired="Boolean(value.required)"
        :placeholder="value.title && localize(value.title)"
        @setTextareaValue="(val) => formData[key] = val"
      />
      <Dropdown
        v-else-if="isDropdown(value)"
        :items="dropdownItems(value)"
        :placeholder="value.title && `${localize(value.title)}${value.required ? '*' : ''}`"
        :selectedValue="getDropdownValue(key, value)"
        @applyValue="(option) => formData[key] = option.value"
      />
    </div>
    <div class="form__footer">
      <Button
        :label="localize('submit')"
        :isInverted="isInverted"
        type="submit"
      />
    </div>
  </form> -->
</template>

<script setup lang="ts">
// import { StyleValue, ref, computed, reactive, toRef } from 'vue'
// import { JSONSchema4 } from 'json-schema'
// import useGlobalStore from '~/store/global'
// import TextInput from '~/components/Inputs/TextInput.vue'
// import Textarea from '~/components/Inputs/Textarea.vue'
// import Button from './Button.vue'
// import Dropdown from './Inputs/Dropdown.vue'
// import { DropdownItem } from '~/types/Common'

// interface Props {
//   schema: JSONSchema4
//   isInverted?: boolean
//   isResetAfterSubmit?: boolean
//   style?: StyleValue
// }

// interface Emits {
//   (e: 'formSubmit', formData: AuthData): void
// }

// const props = defineProps<Props>()
// const emit = defineEmits<Emits>()

// if (!props.schema.properties) {
//   throw new Error('No properties in schema')
// }

// const {
//   globalGetters: { localize }
// } = useGlobalStore()

// const errorInputs = ref<Set<string>>(new Set())

// const initValues = (value: JSONSchema4) => {
//   switch (value.type) {
//     case 'string':
//       return value.default || ''
//     case 'number':
//       return value.default || 0
//     case 'boolean':
//       return value.default || false
//     case 'array':
//       return value.default || (!value.maxItems || value.maxItems > 1) ? [] : {}
//     case 'object':
//       return value.default || {}
//     default:
//       throw new Error('Unsupported type')
//   }
// }

// const formData = reactive<AuthData>(
//   Object.entries(props.schema.properties)
//     .reduce<AuthData>((acc, [key, value]) => {
//       // @ts-expect-error: fix
//       acc[key] = initValues(value)          
//       return acc
//     }, {} as AuthData)
// )

// const schemaProps = computed(() => (
//   new Map([...Object.entries(props.schema.properties || {})])
// ))

// const isTextInput = (value: JSONSchema4) => {
//   return (value.type === 'string' || value.$ref) && !value.element
// }

// const isTextarea = (value: JSONSchema4) => {
//   return value.type === 'string' && !value.$ref && value.element === 'textarea'
// }

// const isDropdown = (value: JSONSchema4) => {
//   return value.type === 'string' && !value.$ref && value.element === 'select'
// }

// const dropdownItems = (value: JSONSchema4): DropdownItem[] => {
//   return (
//     Object.entries(value.properties || {})
//       .map<DropdownItem>(([key, value]) => ({ path: String(value.title), value: key }))
//   )
// }

// const getDropdownValue = (key: string, entity: JSONSchema4) => {
//   const localeKey = String(formData[key])
//   const localePath = entity.properties?.[localeKey]?.title
//   return toRef(() => localePath ? localize(localePath) : String(formData[key]))
// }

// const onSubmit = () => {
//   for (const [key, value] of schemaProps.value) {
//     if (value.required && !formData[key]) {
//       errorInputs.value.add(key)
//     } else {
//       errorInputs.value.delete(key)
//     }
//   }
  
//   if (!errorInputs.value.size) {
//     emit('formSubmit', formData)
    
//     if (props.isResetAfterSubmit) {
//       Object.keys(formData)
//         .forEach((key) => {
//           formData[key] = initValues(props.schema.properties?.[key] || {})
//         })
//     }
//   }
// }
</script>

<style lang="scss" scoped>
.form {

  &__element {
    position: relative;
  }
}
</style>
