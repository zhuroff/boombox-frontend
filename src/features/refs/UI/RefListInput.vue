<template>
  <div class="reflist">
    <TextInput
      type="text"
      :name="name"
      :placeholder="placeholder"
      :size="size"
      :isError="isError"
      :modelValue="refQuery || selectedOption?.label"
      @onInput="(value) => {
        value.length > 0
          ? debouncedAssigning(value.trim())
          : refQuery = ''
      }"
    />

    <transition name="fade">
      <ul
        v-if="isListOpen"
        class="reflist__options"
        :class="`--${size}`"
      >
        <li
          v-for="option in refList"
          :key="option.value"
          class="reflist__option"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </li>
      </ul>
    </transition>

    <transition name="fade">
      <div
        v-if="isCreateMode"
        class="reflist__create"
      >
        <Button
          type="button"
          size="small"
          :label="createButtonLocale"
          @click="createNewEntity"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSearch } from '~shared/model'
import type { Option } from '~shared/model/types'
import { TextInput, Button } from '~shared/UI'
import { DatabaseService } from '~/shared/api'
import { debounce } from '~/utils'

interface Props {
  modelValue?: string
  placeholder?: string
  size?: ElementSize
  isError?: boolean
  name: string
  refKey: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'selectOption', value: string): void
}>()

const dbService = new DatabaseService()

const refQuery = ref(props.modelValue || '')
const selectedOption = ref<Option | null>(null)

const selectOption = (option: Option) => {
  selectedOption.value = option
  refQuery.value = ''
  emit('update:modelValue', option.value)
  emit('selectOption', option.value)
}

const debouncedAssigning = debounce((value: string) => {
  refQuery.value = value
}, 700)

const searchQuery = computed(() => refQuery.value)
const searchEntityKey = computed(() => props.refKey)

const { searchResults, isSearchFetched } = useSearch(searchQuery, dbService, searchEntityKey)

const refList = computed(() => {
  return searchResults.value?.[0]?.data.map(({ _id, title }) => ({
    label: title,
    value: _id
  })) || []
})

const isListOpen = computed(() => (
  refQuery.value && isSearchFetched.value && refList.value.length > 0
))

const isCreateMode = computed(() => (
  refQuery.value && isSearchFetched.value && refList.value.length === 0
))

const createButtonLocale = computed<[string, Array<string>]>(() => (
  ['createEntityLabel', [props.name, searchQuery.value]]
))

const createNewEntity = () => {
  console.log(searchQuery.value)
}
</script>

<style lang="scss" scoped>
@use '~/scss/variables' as var;

.reflist {
  position: relative;
  width: 100%;

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
  }

  &__create {
    padding: 1rem;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: var.$paleLW;
    box-shadow: var.$shadowMedium;
    border-bottom-left-radius: var.$borderRadiusSM;
    border-bottom-right-radius: var.$borderRadiusSM;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style> 