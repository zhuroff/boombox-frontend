<template>
  <table></table>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { TableSchema } from '~/types/Global'

export default defineComponent({
  name: 'Table',
  props: {
    tableState: {
      type: Object as PropType<any>,
      required: true
    }
  },
  setup({ tableState }) {
    console.log(tableState)
  }
})
</script>
