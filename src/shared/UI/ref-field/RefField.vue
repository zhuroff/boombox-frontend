<template>
  <div class="ref-field">
    <TextInput
      type="text"
      :name="name"
      :placeholder="placeholder"
      :size="size"
      :isError="isError"
      :modelValue="refQuery || selectedOption?.label"
      @onInput="(value) => {
        value.length > 0
          ? debouncedAssigning(value)
          : refQuery = ''
      }"
    />

    <Button
      v-if="refQuery || selectedOption"
      type="button"
      icon="close"
      class="ref-field__clear"
      isText
      @click="clearInput"
    />

    <div :data-ref="refKey"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { cleanAndCapitalize, debounce } from '~shared/utils'
import { TextInput, Button } from '~shared/UI'
import type { ElementSize, SelectInputFieldSchema } from '~shared/lib'

type Props = {
  modelValue?: string
  placeholder?: string
  size?: ElementSize
  isError?: boolean
  name: string
  refKey: string
}

type Emits = {
  (e: 'passRefQuery', value: Record<string, string>): void
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
})

const emit = defineEmits<Emits>()

const refQuery = ref(props.modelValue || '')
const selectedOption = ref<SelectInputFieldSchema['options'][number] | null>(null)

const debouncedAssigning = debounce((value: string) => {
  emit('passRefQuery', {
    name: props.name,
    value: cleanAndCapitalize(value.trim())
  })
}, 700)

const clearInput = () => {
  refQuery.value = ''
  selectedOption.value = null
  emit('update:modelValue', '')
}

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      refQuery.value = newVal || ''
    }
  }
)
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.ref-field {
  position: relative;
  width: 100%;

  &__clear {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1000;
  }

  &.--disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  [data-ref] {
    position: absolute;
    width: 100%;
    height: auto;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
  }
}
</style>
