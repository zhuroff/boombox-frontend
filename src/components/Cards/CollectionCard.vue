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
    <Button
      icon="delete"
      size="small"
      className="--delete"
      isText
      @click="() => $emit('deleteEntity', card._id)"
    />
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { BasicEntity } from '~/types/Common'
import { useLocales } from '~/hooks/useLocales'
import CollectionEntity from '~/classes/CollectionEntity'
import Button from '~/components/Button.vue'

export default defineComponent({
  name: 'CollectionCard',
  components: {
    Button
  },
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
  setup({ card }, { emit }) {
    const { lang } = useLocales()

    const cardCaption = computed(() => (
      `${lang('collections.cardCaption')}: ${card.albums.length}`
    ))

    return { cardCaption }
  }
})
</script>

<style lang="scss">
@import '~/scss/variables';

.cards {
  &__album {
    .--delete {
      position: absolute;
      top: 1rem;
      left: 1.65rem;
      z-index: 2000;
      background-color: $white;
      cursor: pointer;
    }
  }
}
</style>
