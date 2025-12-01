<template>
  <div>CARD</div>
</template>

<script setup lang="ts">
import type { CollectionFull } from '../lib/types'

type Props = {
  card: CollectionFull
  entityKey: string
  placeholderPreview: string
}

const props = defineProps<Props>()
console.log(props)
</script>
