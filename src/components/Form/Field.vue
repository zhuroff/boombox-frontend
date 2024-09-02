<template>
  <div class="field">
    <component
      v-if="!!property.label"
      :is="FieldLabel()"
    />
    <component
      v-if="!property.label || !!property.id"
      :is="FieldComponent()"
    />
  </div>
</template>

<script setup lang="ts">
import { h, reactive, defineAsyncComponent } from 'vue'
import { FieldApi } from '@tanstack/vue-form'
import type { Validator } from '@tanstack/vue-form'

type TanstackFormField = FieldApi<
  CustomFormData,
  string,
  Validator<string, unknown> | undefined, undefined, string
>

interface Props {
  property: FormSchemaProperty
  field: TanstackFormField
}

const props = defineProps<Props>()

const renderConfig = reactive({
  name: props.field.name,
  defaultValue: props.field.state.value,
  onBlur: props.field.handleBlur,
  onInput: (e: Event) => {
    props.field.handleChange((e.target as HTMLInputElement).value)
  }
})

const FieldLabel = () => {
  const label = defineAsyncComponent(() => (
    import('./InputLabel.vue').then((sfc) => sfc.default)
  ))

  if (props.property.id && props.property.label) {
    return h(
      label,
      {
        targetId: props.property.id,
        ...props.property.label
      }
    )
  }

  return h(
    label,
    props.property.label,
    FieldComponent
  )
}

const FieldComponent = () => {
  const component = importAsyncComponent()

  if (component?.sfc) {
    // @ts-expect-error: wtf?
    return h(component.sfc, {
      ...props.property,
      ...renderConfig,
      ...(component.props || {})
    })
  }

  return null
}

const importAsyncComponent = () => {
  switch(props.property.type) {
    case 'text':
    case 'email':
    case 'password':
      return {
        sfc: defineAsyncComponent(() => (
          import('./TextInput.vue').then((sfc) => sfc.default)
        )),
        props: {
          type: props.property.type
        }
      }
    case 'textarea':
      return {
        sfc: defineAsyncComponent(() => (
          import('./TextareaInput.vue').then((sfc) => sfc.default)
        ))
      }
    default:
      console.error(`Unknown field component type: ${props.property.type}`)
      return null
  }
}
</script>

<style setup lang="scss">
@import '~/scss/variables.scss';
@import 'include-media';

.field {
  margin-bottom: 1rem;
}
</style>
