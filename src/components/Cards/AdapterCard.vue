<template>
  <component
    :is="cardComponent"
    :card="card"
    :isDraggable="isDraggable"
    :rootPath="card.cardPath"
    :placeholderImage="placeholderImage"
  />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import type { BasicEntity } from '~/types/Common'
import ListCardBasic from '~/classes/ListCardBasic'

interface Props {
  card: BasicEntity & ListCardBasic
  placeholderImage: string
  isDraggable: boolean
}

const props = defineProps<Props>()

const cardComponent = defineAsyncComponent(() => (
  import(`./${props.card.cardType}.vue`).then((sfc) => sfc.default)
))
</script>
