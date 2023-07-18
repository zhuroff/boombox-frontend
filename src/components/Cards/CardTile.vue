<template>
  <li :class="`tile ${className}`">
    <router-link class="tile__link" :to="{ path: `/${rootPath}/${card._id}` }">
      <img class="tile__cover" :src="card.coverURL" :alt="card.title">
      <div class="tile__caption">
        <div class="tile__caption-heading">{{ card.title }}</div>
        <div class="tile__caption-description">{{ card.caption }}</div>
      </div>
    </router-link>
  </li>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { CardTile } from '~/types/Global';

export default defineComponent({
  name: 'CardTile',
  props: {
    card: {
      type: Object as PropType<CardTile>,
      required: true
    },
    rootPath: {
      type: String,
      required: true
    },
    className: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';
@import 'include-media';

.tile {

  &__link {
    position: relative;
    overflow: hidden;
    display: block;

    &:hover {
      .tile__caption {
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
      color: $border;
      opacity: 0;
      transform: translateY(10%);
      transition: all 0.75s $animation;
    }
  }
}
</style>
