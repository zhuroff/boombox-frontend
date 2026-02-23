<template>
  <li
    :class="className"
    @click="() => emit('applyValue', option)"
  >
    <Sprite v-if="option.icon" :name="option.icon" />
    <span class="dropdown__option-label">
      {{ option.path }}
    </span>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Sprite } from '~shared/UI'
import type { DropdownItem } from '~shared/lib'

interface Props {
  option: DropdownItem
  size: 'small' | 'medium' | 'large'
}

interface Emits {
  (e: 'applyValue', option: DropdownItem): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
})

const emit = defineEmits<Emits>()

const className = computed(() => [
  'dropdown__option',
  {
    '--small': props.size === 'small',
    '--medium': props.size === 'medium',
    '--large': props.size === 'large'
  }
])
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.dropdown__option {
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s var.$animation;

  &:hover {
    background-color: var.$dark;
    color: var.$light;
    transition: all 0.2s var.$animation;
  }

  &.--small {
    padding: 0 0.5rem;
    font-size: .75rem;

    .icon {
      width: 1rem;

      & + .dropdown__options-label {
        margin-left: 3px;
      }
    }
  }

  &.--medium {
    padding: .25rem 1rem;
    font-size: 1rem;

    .icon {
      width: 1.25rem;

      & + .dropdown__option-label {
        margin-left: var.$basicPadding;
      }
    }
  }

  &.--large {
    padding: .5rem 1.5rem;
    font-size: 1.25rem;

    .icon {
      width: 1.75rem;

      & + .dropdown__option-label {
        margin-left: var.$basicPadding;
      }
    }
  }
}
</style>
