<template>
  <ul
    class="ref-field__options"
    :class="`--${size}`"
  >
    <li
      v-for="option in refList"
      :key="option.value"
      class="ref-field__option"
      @click="() => emit('selectOption', option)"
    >
      {{ option.label }}
    </li>
    <li
      v-if="canBeCreated"
      class="ref-field__option --create"
      @click="() => emit('createNewEntity')"
    >
      <span>
        {{ localize('createEntityLabel', name, searchQuery) }}
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useLocalization, type ElementSize, type SelectInputFieldSchema } from '~shared/lib'

type Props = {
  name: string
  searchQuery: string
  size: ElementSize
  refList: SelectInputFieldSchema['options']
  canBeCreated: boolean
}

type Emits = {
  (e: 'selectOption', value: SelectInputFieldSchema['options'][number]): void
  (e: 'createNewEntity'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { localize } = useLocalization()
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.ref-field {

  &__options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var.$paleLW;
    border-bottom-left-radius: var.$borderRadiusSM;
    border-bottom-right-radius: var.$borderRadiusSM;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    box-shadow: var.$shadowMedium;
    height: auto;
    max-height: 10rem;
    overflow-y: auto;
    z-index: 1000;

    &.--small {
      font-size: 0.875rem;
    }

    &.--large {
      font-size: 1.125rem;
    }
  }

  &__option {
    padding: 0.5rem 1rem;
    cursor: pointer;

    &:hover {
      background: var.$paleMD;
    }

    &.--create {
      color: var.$info;
    }
  }
}
</style>
