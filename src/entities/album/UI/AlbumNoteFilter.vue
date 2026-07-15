<template>
  <Dropdown
    size="medium"
    isInverted
    :items="filterOptions"
    :selectedValue="noteFilter"
    @applyValue="applySelect"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Dropdown } from '~shared/UI'
import { useLocalization } from '~shared/model'
import type { AlbumNoteFilter, DropdownItem } from '~shared/lib'

interface Props {
  noteFilter: AlbumNoteFilter
}

interface Emits {
  (e: 'update:noteFilter', value: AlbumNoteFilter): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { localize } = useLocalization()

const filterValues: AlbumNoteFilter[] = ['all', 'withReviews', 'withoutReviews']

const filterOptions = computed<DropdownItem[]>(() =>
  filterValues.map((value) => ({
    path: localize(`albumNoteFilter.${value}`),
    value
  }))
)

const applySelect = (option: DropdownItem) => {
  emit('update:noteFilter', option.value as AlbumNoteFilter)
}
</script>
