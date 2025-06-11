<template>
  <div :class="[{'--disabled': isCreatingEntity}, 'ref-field']">
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
      class="ref-field__clear"
      isText
      @click="clearInput"
    />

    <transition name="fade">
      <RefList
        v-if="isListOpen"
        :name="name"
        :size="size"
        :searchQuery="searchQuery"
        :refList="refList"
        :canBeCreated="canBeCreated"
        @selectOption="selectOption"
        @createNewEntity="createNewEntity"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { cleanAndCapitalize, debounce } from '~/utils'
import { useCreateEntity, useSearch } from '~shared/model'
import { TextInput, Button } from '~shared/UI'
import { DatabaseService } from '~/shared/api'
import type { ElementSize, Entity, SelectInputFieldSchema } from '~shared/lib'
import RefList from './RefList.vue'

type Props = {
  modelValue?: string
  placeholder?: string
  size?: ElementSize
  isError?: boolean
  name: string
  refKey: string
}

type Emits = {
  (e: 'update:modelValue', value: string): void
  (e: 'selectOption', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
})

const emit = defineEmits<Emits>()

const dbService = new DatabaseService()

const refQuery = ref(props.modelValue || '')
const selectedOption = ref<SelectInputFieldSchema['options'][number] | null>(null)
const isNewEntityQueryEnabled = ref(false)

const selectOption = (option: SelectInputFieldSchema['options'][number]) => {
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
}
</style>
