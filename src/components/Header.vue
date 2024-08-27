<template>
  <header class="header">
    <h1 class="header__heading">{{ heading }}</h1>
    <SearchBlock
      v-if="withSearch"
      type="search"
      :results="results"
      :placeholder="localize('search.placeholder')"
      @setInputValue="searchSubmit"
    />
    <slot></slot>
  </header>
</template>

<script setup lang="ts">
import { useSearch } from '~/hooks/useSearch'
import useGlobalStore from '~/store/global'
import SearchBlock from '~/components/SearchBlock.vue'

interface Props {
  heading: string
  withSearch?: boolean
}

defineProps<Props>()

const {
  globalGetters: { localize }
} = useGlobalStore()

const { searchSubmit, results } = useSearch()
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
    padding: 25px 25px 0;
  }

  &__heading {

    @include media('<tablet') {
      @include serif(1.5rem);
      margin-right: 1rem;
    }

    @include media('>=tablet') {
      @include serif(1.75rem);
      margin-right: 2rem;
    }
  }
}
</style>
