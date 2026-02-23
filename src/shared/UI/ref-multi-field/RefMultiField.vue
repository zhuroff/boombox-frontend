<template>
  <div class="ref-multi-field">
    <div class="ref-multi-field__tags">
      <span
        v-for="item in modelValue"
        :key="item.value"
        class="ref-multi-field__tag"
      >
        {{ item.label }}
        <button
          type="button"
          class="ref-multi-field__tag-remove"
          aria-label="Remove"
          @click="removeTag(item)"
        >
          ×
        </button>
      </span>
    </div>
    <div class="ref-multi-field__input-wrap">
      <TextInput
        type="text"
        :name="name"
        :placeholder="placeholder"
        :size="size"
        :isError="isError"
        :modelValue="refQuery"
        @onInput="onInput"
      />
      <div :data-ref="refKey" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { cleanAndCapitalize, debounce } from '~shared/utils'
import { TextInput } from '~shared/UI'
import type { ElementSize, SelectInputFieldSchema } from '~shared/lib'

export type RefMultiOption = SelectInputFieldSchema['options'][number]

type Props = {
  modelValue?: RefMultiOption[]
  placeholder?: string
  size?: ElementSize
  isError?: boolean
  name: string
  refKey: string
}

type Emits = {
  (e: 'passRefQuery', value: Record<string, string>): void
  (e: 'update:modelValue', value: RefMultiOption[]): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  modelValue: () => []
})

const emit = defineEmits<Emits>()

const refQuery = ref('')

watch(
  () => props.modelValue?.length ?? 0,
  (newLen, oldLen) => {
    if (newLen > (oldLen ?? 0)) {
      refQuery.value = ''
    }
  }
)

const debouncedEmit = debounce((value: string) => {
  emit('passRefQuery', {
    name: props.name,
    value: cleanAndCapitalize(value.trim())
  })
}, 700)

const onInput = (value: string) => {
  refQuery.value = value
  if (value.length > 0) {
    debouncedEmit(value)
  }
}

const removeTag = (item: RefMultiOption) => {
  const next = (props.modelValue || []).filter((t) => t.value !== item.value)
  emit('update:modelValue', next)
}
</script>

<style scoped lang="scss">
@use '~/app/styles/variables' as var;

.ref-multi-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;

  &__tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
    min-height: 1.5rem;
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    background: var.$paleMD;
    border: 1px solid var.$paleDP;
    border-radius: var.$borderRadiusSM;
    color: var.$dark;
  }

  &__tag-remove {
    padding: 0;
    margin: 0;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1.1rem;
    line-height: 1;
    color: var.$paleDP;
    transition: color 0.2s;

    &:hover {
      color: var.$error;
    }
  }

  &__input-wrap {
    position: relative;
    width: 100%;

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
}
</style>
