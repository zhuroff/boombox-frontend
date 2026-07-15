<template>
  <Dropdown
    size="medium"
    isInverted
    :items="sortOptions"
    :selectedValue="albumSort"
    @applyValue="applySelect"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Dropdown } from '~shared/UI'
import { useLocalization } from '~shared/model'
import type { AlbumSortOption, DropdownItem } from '~shared/lib'
import { ALBUM_SORT_OPTIONS } from '../lib/albumSort'

interface Props {
  albumSort: AlbumSortOption
}

interface Emits {
  (e: 'update:albumSort', value: AlbumSortOption): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { localize } = useLocalization()

const sortOptions = computed<DropdownItem[]>(() =>
  ALBUM_SORT_OPTIONS.map((value) => ({
    path: localize(`albumSort.${value}`),
    value
  }))
)

const applySelect = (option: DropdownItem) => {
  emit('update:albumSort', option.value as AlbumSortOption)
}
</script>
