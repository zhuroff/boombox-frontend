<template>
  <header class="header">
    <h1 class="header__heading">{{ heading }}</h1>
    <Button
      icon="loupe"
      isRounded
      isInverted
      @click="isSearchMode = !isSearchMode"
    />
    <Modal
      :isModalActive="isSearchMode"
      @closeModal="isSearchMode = false"
    >
      <SearchModal
        :isFetching="isSearchFetching"
        :results="searchResults"
        @onSearch="onSearch"
      />
    </Modal>
    <slot></slot>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Modal, Button } from '~shared/UI'
import { useSearch, SearchService, SearchModal } from '~features/search'

interface Props {
  heading: string
  withSearch?: boolean
}

defineProps<Props>()

const searchService = new SearchService()

const searchQuery = ref('')
const isSearchMode = ref(false)

const { searchResults, isSearchFetching } = useSearch(searchQuery, searchService)

const onSearch = (value: string) => {
  searchQuery.value = value
}
</script>

<style lang="scss">
@use '~/app/styles/variables' as var;

.header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: relative;

  @include var.media('<desktop') {
    position: relative;
    padding: 1rem 1rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .dropdown {
      display: none;
    }
  }

  @include var.media('>=desktop') {
    padding: 0 var.$mainPadding;
    background-color: var.$dark;
    height: var.$desktopHeaderHeight;
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  &__heading {
    color: var.$paleMD;

    @include var.media('<desktop') {
      @include var.serif(1.25rem);
      margin-right: 1rem;
    }

    @include var.media('>=desktop') {
      @include var.serif(1.75rem);
      margin-right: auto;
    }
  }
}
</style>
