<template>
  <ul
    class="droplist"
    :class="`--${size}`"
  >
    <li
      v-for="option in data"
      :key="option.value"
      class="droplist__option"
      @click="() => emit('selectOption', option)"
    >
      {{ option.label }}
    </li>
    <li
      v-if="canBeCreated"
      class="droplist__option --create"
      @click="() => emit('createNewEntity')"
    >
      <span>
        {{ localize('createEntityLabel', name, query) }}
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useLocalization } from '~shared/model'
import type { ElementSize, SelectInputFieldSchema } from '~shared/lib'

type Props = {
  name: string
  query: string
  data: SelectInputFieldSchema['options']
  size?: ElementSize
  canBeCreated?: boolean
}

type Emits = {
  (e: 'selectOption', value: SelectInputFieldSchema['options'][number]): void
  (e: 'createNewEntity'): void
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
  canBeCreated: false
})
const emit = defineEmits<Emits>()

const { localize } = useLocalization()
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.droplist {
  background-color: var.$paleLW;
  border-bottom-left-radius: var.$borderRadiusSM;
  border-bottom-right-radius: var.$borderRadiusSM;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  box-shadow: var.$shadowMedium;
  height: auto;
  width: 100%;
  max-height: 12rem;
  overflow-y: auto;
  padding: 0.5rem 0;
  color: var.$black;

  &.--small {
    font-size: 0.875rem;
  }

  &.--large {
    font-size: 1.125rem;
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
