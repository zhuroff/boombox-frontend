<template>
  <component
    :is="cardElement"
    :to="routePath"
    class="cardlist__item-link"
  >
    <div class="cardlist__item-image">
      <div
        v-if="cardFrame"
        v-html="cardFrame"
        class="cardlist__item-cover --blind"
      />
      <img
        v-else
        :src="cardCover"
        :alt="cardTitle"
        referrerpolicy="no-referrer"
        :class="['cardlist__item-cover', ...coverClasses]"
      />
      <img
        v-if="withVinyl"
        src="/img/vinyl.png"
        alt="vinyl placeholder"
        class="cardlist__item-vinyl"
      />
    </div>
    <div class="cardlist__item-title">
      {{ cardTitle }}
    </div>
    <div
      v-if="cardCaption"
      class="cardlist__item-info"
    >
      {{ cardCaption }}
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  routePath: { path: string }
  cardTitle: string
  cardCover: string
  isRouteLink?: boolean
  cardFrame?: string
  cardCaption?: string
  coverClasses?: string[]
  withVinyl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  withVinyl: true,
  isRouteLink: true,
  coverClasses: () => []
})

const cardElement = computed(() => (
  props.isRouteLink ? 'router-link' : 'div'
))
</script>
