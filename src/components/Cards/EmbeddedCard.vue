<template>
  <li class="cards__album">
    <router-link
      class="cards__album-link"
      :to="{ path: `/${rootPath}/${card._id}` }"
    >
      <div class="cards__album-image">
        <div
          v-html="card.frame"
          class="cards__album-cover"
        />
        <img
          src="/img/vinyl.png"
          alt="vinyl placeholder"
          class="cards__album-vinyl"
        />
      </div>
      <div class="cards__album-title">{{ card.title }}</div>
      <div class="cards__album-info">{{ cardCaption }}</div>
    </router-link>
    <Button
      icon="delete"
      size="small"
      className="--delete"
      isInverted
      isRounded
      @click="() => $emit('deleteEntity', card._id)"
    />
  </li>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from 'vue'
import EmbeddedItem from '~/classes/EmbeddedItem'
import Button from '~/components/Button.vue'

export default defineComponent({
  name: 'EmbeddedCard',
  components: {
    Button
  },
  props: {
    card: {
      type: Object as PropType<EmbeddedItem>,
      required: true
    },
    rootPath: {
      type: String,
      required: true
    }
  },
  setup({ card }) {
    const cardCaption = computed(() => (
      `${card.artist.title } / ${card.period.title} / ${card.genre.title}`
    ))

    return { cardCaption }
  }
})
</script>

<style lang="scss">
@import '~/scss/variables';
@import 'include-media';

.cards {
  &__album {
    &-cover {
      overflow: hidden;
      
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
      }

      iframe {
        width: inherit !important;
        height: inherit !important;
        background-color: $white;
      }
    }
  }
}
</style>
