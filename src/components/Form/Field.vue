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
    <ul
      v-if="searchResultsData?.length"
    >
      <li
        v-for="item in searchResultsData"
        :key="item._id"
      >{{ item.title }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { h, ref, reactive, defineAsyncComponent, computed } from 'vue'
import { FieldApi, type Validator } from '@tanstack/vue-form'
import { useSearch } from '~/hooks/useSearch'
import { debounce } from '~/utils'

type TanstackFormField = FieldApi<
  CustomFormData,
  string,
  Validator<string, unknown> | undefined, undefined, string | File
>

interface Props {
  property: FormSchemaProperty
  field: TanstackFormField
}

const props = defineProps<Props>()

const searchQuery = ref('')
const renderConfig = reactive({
  name: props.field.name,
  defaultValue: props.field.state.value,
  onBlur: props.field.handleBlur,
  onInput: (e: Event) => {
    props.field.handleChange((e.target as HTMLInputElement).value)
    props.property.refKey && searchRef((e.target as HTMLInputElement).value)
  }
})

const { searchResults, searchRefetch, searchError } = useSearch(searchQuery, props.property.refKey)

const searchRef = debounce((query: string) => {
  searchQuery.value = query
  query && searchRefetch()
}, 1000)

const searchResultsData = computed(() => searchResults.value?.[0]?.data)

const FieldLabel = () => {
  const label = defineAsyncComponent(() => (
    import('./InputLabel.vue').then((sfc) => sfc.default)
  ))

  if (props.property.id && props.property.label) {
    return h(
      label,
      {
        targetId: props.property.id,
        size: props.property.size,
        ...props.property.label
      }
    )
  }

  return h(
    label,
    {
      // @ts-expect-error: fix
      size: props.property.size,
      ...props.property.label
    },
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
