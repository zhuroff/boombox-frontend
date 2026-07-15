<template>
  <Dropdown
    size="medium"
    isInverted
    :items="filterOptions"
    :selectedValue="vinylFilter"
    @applyValue="applySelect"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Dropdown } from '~shared/UI'
import { useLocalization } from '~shared/model'
import type { AlbumVinylFilter, DropdownItem } from '~shared/lib'

interface Props {
  vinylFilter: AlbumVinylFilter
}

interface Emits {
  (e: 'update:vinylFilter', value: AlbumVinylFilter): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { localize } = useLocalization()

const filterValues: AlbumVinylFilter[] = ['all', 'onVinyl', 'notOnVinyl']

const filterOptions = computed<DropdownItem[]>(() =>
  filterValues.map((value) => ({
    path: localize(`albumVinylFilter.${value}`),
    value
  }))
)

const applySelect = (option: DropdownItem) => {
  emit('update:vinylFilter', option.value as AlbumVinylFilter)
}
</script>
