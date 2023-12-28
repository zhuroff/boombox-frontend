<template>
  <header class="header">
    <h1 class="header__heading">{{ heading }}</h1>
    <SearchBlock
      v-if="withSearch"
      type="search"
      :results="results"
      :placeholder="lang('search.placeholder')"
      @setInputValue="searchSubmit"
    />
    <slot></slot>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useLocales } from '~/hooks/useLocales'
import { useSearch } from '~/hooks/useSearch'
import SearchBlock from '~/components/SearchBlock.vue'

export default defineComponent({
  name: 'Header',
  components: {
    SearchBlock
  },
  props: {
    heading: {
      type: String,
      required: true
    },
    withSearch: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup() {
    const { lang } = useLocales()
    const { searchSubmit, results } = useSearch()
    return { lang, results, searchSubmit }
  }
})
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
    padding: 75px 25px 0;

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
      @include serif(1.25rem, 600);
      margin-right: 1rem;
    }

    @include media('>=tablet') {
      @include serif(1.5rem, 600);
      margin-right: 2rem;
    }
  }
}
</style>
