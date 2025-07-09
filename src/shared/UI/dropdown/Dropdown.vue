<template>
  <div
    class="dropdown"
    :style="style"
    ref="dropdownRef"
  >
    <DropdownTrigger
      :placeholder="placeholder"
      :size="size"
      :currentValue="currentValue"
      @triggerToggle="isOptionsOpened = !isOptionsOpened"
    />
    <transition name="fade">
      <ul
        v-if="isOptionsOpened"
        class="dropdown__options"
      >
        <DropdownOption
          v-for="option in items"
          :key="option.value"
          :option="option"
          :size="size"
          @applyValue="applyValue"
        />
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, type StyleValue } from 'vue'
import type { DropdownItem } from '~shared/lib'
import DropdownTrigger from './DropdownTrigger.vue'
import DropdownOption from './DropdownOption.vue'

interface Props {
  items: DropdownItem[]
  placeholder?: string
  size?: 'small' | 'medium' | 'large'
  style?: StyleValue
  selectedValue?: string
  isRequired?: boolean
  errorMessage?: string
}

interface Emits {
  (e: 'applyValue', option: DropdownItem): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  size: 'medium',
})
const emit = defineEmits<Emits>()

const isOptionsOpened = ref(false)

const currentValue = computed(() => {
  const current = props.items.find(({ value }) => value === props.selectedValue)
  return current
    ? {
        label: current.path,
        icon: current.icon
      }
    : { label: props.selectedValue || '' }
})

const applyValue = (option: DropdownItem) => {
  emit('applyValue', option)
  isOptionsOpened.value = false
}

const dropdownRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOptionsOpened.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.dropdown {
  position: relative;

  &__options {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: var.$paleLT;
    margin: 0;
    padding: 0.5rem 0;
    box-shadow: var.$shadowMedium;
    border-radius: var.$borderRadiusMD;
  }
}
</style>
