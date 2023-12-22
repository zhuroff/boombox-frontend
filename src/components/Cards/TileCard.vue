<template>
  <li class="cards__tile">
    <router-link
      class="card-tile__link"
      :to="{ path: `/${rootPath}/${card._id}` }"
    >
      <img
        class="card-tile__cover"
        :src="card.coverURL"
        :alt="card.title"
      >
      <div class="card-tile__caption">
        <div class="card-tile__caption-heading">{{ card.title }}</div>
        <div class="card-tile__caption-description">{{ card.caption }}</div>
      </div>
    </router-link>
  </li>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { CardBasic } from '~/types/Common'

export default defineComponent({
  name: 'TileCard',
  props: {
    card: {
      type: Object as PropType<CardBasic>,
      required: true
    },
    rootPath: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';
@import 'include-media';

.card-tile {

  &__link {
    position: relative;
    overflow: hidden;
    display: block;

    &:hover {
      .card-tile__caption {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.5s $animation;

        &-heading {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.75s $animation;
        }

        &-description {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.75s $animation;
        }
      }
    }
  }

  &__cover {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__caption {
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 100%;
    left: 0;
    bottom: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 5% 5%;
    opacity: 0;
    transform: translateY(25%);
    transition: all 0.5s $animation;
    background: linear-gradient(to top, $dark 25%, transparent 100%);

    &-heading {
      font-weight: 600;
      color: $white;
      opacity: 0;
      transform: translateY(50%);
      transition: all 0.75s $animation;
    }

    &-description {
      font-size: 70%;
      color: $paleLT;
      opacity: 0;
      transform: translateY(10%);
      transition: all 0.75s $animation;
    }
  }
}
</style>
