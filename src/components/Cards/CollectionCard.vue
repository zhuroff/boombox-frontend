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
    </router-link>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import CollectionEntity from '~/classes/CollectionEntity'

export default defineComponent({
  name: 'CollectionCard',
  props: {
    card: {
      type: Object as PropType<CollectionEntity<number>>,
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
  }
})
</script>
