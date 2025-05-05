<template>
  <div class="dropdown" :style="style">
    <div :class="[
      'dropdown__trigger',
      {
        '--small': size === 'small',
        '--medium': size === 'medium',
        '--large': size === 'large'
      }
    ]">
      <span
        v-if="placeholder && !currentValue.label"
        class="dropdown__trigger-label"
      >{{ placeholder }}</span>
      <Button
        type="button"
        :label="currentValue.label"
        :icon="currentValue.icon"
        :size="size"
        @click="isOptionsOpened = !isOptionsOpened"
      />
      <Sprite name="chevron-down" />
    </div>
    <transition name="fade">
      <div v-if="isOptionsOpened" class="dropdown__options">
        <ul class="dropdown__options-list">
          <li
            v-for="option in items"
            :key="option.value"
            :class="[
              'dropdown__options-item',
              {
                '--small': size === 'small',
                '--medium': size === 'medium',
                '--large': size === 'large'
              }
            ]"
            @click="applyValue(option)"
          >
            <Sprite v-if="option.icon" :name="option.icon" />
            <span class="dropdown__options-label">{{ localize(option.path) }}</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ComputedRef, Ref, StyleValue } from 'vue'
import type { DropdownItem } from '~/types/Common'
import useGlobalStore from '~/store/global'
import Button from '../Button.vue'
import Sprite from '../Sprite/Sprite.vue'

interface Props {
  items: DropdownItem[]
  placeholder?: string
  size?: 'small' | 'medium' | 'large'
  style?: StyleValue
  selectedValue?: ComputedRef<string> | Ref<string>
  isRequired?: boolean
  errorMessage?: string
}

interface Emits {
  (e: 'applyValue', option: DropdownItem): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  globalGetters: { localize }
} = useGlobalStore()

const isOptionsOpened = ref(false)

const currentValue = computed(() => {
  const current = props.items.find(({ value }) => value === props.selectedValue?.value)
  return current
    ? {
        label: localize(current.path),
        icon: current.icon
      }
    : { label: props.selectedValue?.value || '' }
})

const applyValue = (option: DropdownItem) => {
  emit('applyValue', option)
  isOptionsOpened.value = false
}
</script>

<style lang="scss" scoped>
@use '~/scss/variables' as var;

.dropdown {
  position: relative;

  &__trigger {
    position: relative;

    & > .button {
      padding-right: 2rem;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      border-color: var.$paleMD;

      &:hover {
        background-color: inherit;
        color: inherit;
      }
    }

    & > .icon {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
    }

    &.--small {

      .dropdown__trigger-label {
        font-size: .75rem;
        left: .875rem;
      }

      & > .icon {
        width: 1rem;
        height: 1rem;
      }
    }

    &.--medium {

      .dropdown__trigger-label {
        font-size: .875rem;
        left: 1rem;
      }

      & > .icon {
        width: 1.25rem;
        height: 1.25rem;
      }
    }

    &.--large {

      .dropdown__trigger-label {
        font-size: 1rem;
        left: 1.25rem;
      }

      & > .icon {
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    &-label {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 100%;
      display: block;
      color: var.$paleDP;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  &__options {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;

    &-list {
      background-color: var.$paleLT;
      margin: 0;
      padding: 0.5rem 0;
      box-shadow: var.$shadowMedium;
      border-radius: var.$borderRadiusMD;
    }

    &-item {
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.2s var.$animation;

      &:hover {
        background-color: var.$black;
        color: var.$white;
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

          & + .dropdown__options-label {
            margin-left: 5px;
          }
        }
      }

      &.--large {
        padding: .5rem 1.5rem;
        font-size: 1.25rem;

        .icon {
          width: 1.75rem;

          & + .dropdown__options-label {
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
