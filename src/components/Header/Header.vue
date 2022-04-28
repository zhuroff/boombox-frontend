<template>
  <header class="header">
    <Search />
  </header>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import Search from '~/components/Search/Search.vue'
import './Header.scss'

export default defineComponent({
  name: 'Header',

  components: {
    Search
  }
})

</script>
