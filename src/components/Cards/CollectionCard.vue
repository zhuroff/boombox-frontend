<template>
  <li class="cards__album">
    <router-link
      class="cards__album-link"
      :to="{ path: `/${rootPath}/${card._id}` }"
    >
      <div class="cards__album-image">
        <img
          :src="card.avatar || placeholderImage"
          :alt="card.title"
          class="cards__album-cover --fixed"
        />
      </div>
      <div class="cards__album-title">{{ card.title }}</div>
      <div class="cards__album-info">{{ cardCaption }}</div>
    </router-link>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { useLocales } from '~/hooks/useLocales'
import CollectionEntity from '~/classes/CollectionEntity'
import { BasicEntity } from '~/types/Common'

export default defineComponent({
  name: 'CollectionCard',
  props: {
    card: {
      type: Object as PropType<CollectionEntity<BasicEntity>>,
      required: true
    },
    rootPath: {
      type: String,
      required: true
    },
    placeholderImage: {
      type: String,
      required: true
    }
  },
  setup({ card }) {
    const { lang } = useLocales()

    const cardCaption = computed(() => (
      `${lang('collections.cardCaption')}: ${card.albums.length}`
    ))

    return { cardCaption }
  }
})
</script>
