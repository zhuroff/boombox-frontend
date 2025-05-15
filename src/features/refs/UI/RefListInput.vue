<template>
  <div :class="[{'--disabled': isCreatingEntity}, 'reflist']">
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

    <Button
      v-if="refQuery || selectedOption"
      type="button"
      icon="close"
      class="reflist__clear"
      isText
      @click="clearInput"
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
        <li
          v-if="canBeCreated"
          class="reflist__option --create"
          @click="createNewEntity"
        >
          <span>
            {{ localize('createEntityLabel', name, searchQuery) }}
          </span>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSearch, useCreateEntity, type Option } from '~shared/model'
import { TextInput, Button } from '~shared/UI'
import { DatabaseService } from '~/shared/api'
import { cleanAndCapitalize, debounce } from '~/utils'
import useGlobalStore from '~/store/global'

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

const {
  globalGetters: { localize }
} = useGlobalStore()

const refQuery = ref(props.modelValue || '')
const selectedOption = ref<Option | null>(null)
const isNewEntityQueryEnabled = ref(false)

const selectOption = (option: Option) => {
  selectedOption.value = option
  refQuery.value = ''
  emit('update:modelValue', option.value)
  emit('selectOption', option.value)
}

const debouncedAssigning = debounce((value: string) => {
  refQuery.value = cleanAndCapitalize(value)
}, 700)

const searchQuery = computed(() => refQuery.value)
const searchEntityKey = computed(() => props.refKey)
const creatingPayload = computed(() => ({ value: refQuery.value }))

const { searchResults, isSearchFetched } = useSearch(searchQuery, dbService, searchEntityKey)

const {
  data: createdEntity,
  isFetching: isCreatingEntity
} = useCreateEntity<Entity, { value: string }>(
  searchEntityKey,
  creatingPayload,
  dbService,
  isNewEntityQueryEnabled
)

const refList = computed(() => {
  return searchResults.value?.[0]?.data.map(({ _id, title }) => ({
    label: title,
    value: _id
  })) || []
})

const isListOpen = computed(() => (
  refQuery.value && isSearchFetched.value && !isNewEntityQueryEnabled.value
))

const canBeCreated = computed(() => (
  refQuery.value
  && !searchResults.value?.[0]?.data.some(({ title }) => title === refQuery.value)
))

const clearInput = () => {
  refQuery.value = ''
  selectedOption.value = null
}

const createNewEntity = () => {
  isNewEntityQueryEnabled.value = true
}

watch(
  createdEntity,
  (newVal) => {
    if (newVal) {
      isNewEntityQueryEnabled.value = false
      selectOption({
        label: newVal.title,
        value: newVal._id
      })
    }
  }
)
</script>

<style lang="scss" scoped>
@use '~/scss/variables' as var;

.reflist {
  position: relative;
  width: 100%;

  &__clear {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1000;
  }

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

  &.--disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style> 