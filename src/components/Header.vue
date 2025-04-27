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
      <SearchBlock
        :isFetching="isSearchFetching"
        :results="searchResults"
        @onSearch="onSearch"
      ></SearchBlock>
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
import SearchBlock from '~/components/Search/SearchBlock.vue'

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
@import '~/scss/variables';
@import 'include-media';

.header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: relative;

  @include media('<laptop') {
    background-color: $dark;
    color: $white;
    position: relative;
    padding: 25px 25px 0;

    &:after {
      content: '';
      width: 100vw;
      height: 75vh;
      background: linear-gradient(to bottom, $dark, $white);
      position: absolute;
      left: 0;
      top: 100%;
    }

    .dropdown {
      display: none;
    }
  }

  @include media('>=laptop') {
    padding: 0 25px;
    justify-content: space-between;
    background-color: $dark;
    height: 70px;
  }

  &__heading {

    @include media('<tablet') {
      @include serif(1.5rem);
      margin-right: 1rem;
    }

    @include media('>=tablet') {
      @include serif(1.75rem);
      margin-right: 2rem;
      color: $paleMD;
    }
  }
}
</style>
