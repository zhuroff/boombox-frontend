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
      ></SearchModal>
    </Modal>
    <slot></slot>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useSearch from '~/shared/useSearch'
import DatabaseService from '~/services/DatabaseService'
import Button from '~/components/Button.vue'
import Modal from '~/components/Modal.vue'
import SearchModal from '~/components/Search/SearchModal.vue'

interface Props {
  heading: string
  withSearch?: boolean
}

defineProps<Props>()

const dbService = new DatabaseService()

const searchQuery = ref('')
const isSearchMode = ref(false)

const { searchResults, isSearchFetching } = useSearch(searchQuery, dbService)

const onSearch = (value: string) => {
  searchQuery.value = value
}
</script>

<style lang="scss">
@use '~/scss/variables' as var;

.header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: relative;

  @include var.media('<laptop') {
    background-color: var.$dark;
    color: var.$white;
    position: relative;
    padding: 25px 25px 0;

    &:after {
      content: '';
      width: 100vw;
      height: 75vh;
      background: linear-gradient(to bottom, var.$dark, var.$white);
      position: absolute;
      left: 0;
      top: 100%;
    }

    .dropdown {
      display: none;
    }
  }

  @include var.media('>=laptop') {
    padding: 0 25px;
    background-color: var.$dark;
    height: 70px;
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  &__heading {

    @include var.media('<tablet') {
      @include var.serif(1.5rem);
      margin-right: 1rem;
    }

    @include var.media('>=tablet') {
      @include var.serif(1.75rem);
      margin-right: auto;
      color: var.$paleMD;
    }
  }
}
</style>
