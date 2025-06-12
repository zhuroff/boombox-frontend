<template>
  <ul
    class="action-list"
    :class="`--${size}`"
  >
    <li
      v-for="option in data"
      :key="option.value"
      class="action-list__option"
      @click="() => emit('selectOption', option)"
    >
      {{ option.label }}
    </li>
    <li
      v-if="canBeCreated"
      class="action-list__option --create"
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

.action-list {
  background-color: var.$paleLW;
  border-bottom-left-radius: var.$borderRadiusSM;
  border-bottom-right-radius: var.$borderRadiusSM;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  box-shadow: var.$shadowMedium;
  height: auto;
  width: 100%;
  max-height: 10rem;
  overflow-y: auto;

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
