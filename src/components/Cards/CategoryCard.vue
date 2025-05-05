<template>
  <li class="cardlist__item">
    <router-link
      class="cardlist__item-link"
      :to="`/${entityKey}/${card._id}`"
    >
      <img
        :src="card.avatar ? host(card.avatar) : placeholderPreview"
        :alt="card.title"
        class="cardlist__item-cover --fixed --rounded"
      >
      <div class="cardlist__item-title">
        {{ card.title }}
      </div>
      <div class="cardlist__item-info">
        {{ localize('navigation.albums') }}: {{ card.albums }}
      </div>
    </router-link>
  </li>
</template>

<script setup lang="ts">
import { hostString } from '~/utils'
import useGlobalStore from '~/store/global'
import CategoryItem from '~/classes/CategoryItem'

interface Props {
  card: CategoryItem
  placeholderPreview: string
  entityKey: string
}

defineProps<Props>()

const { globalGetters: { localize } } = useGlobalStore()
const host = (pathname: string) => hostString(pathname)
</script>
