<template>
  <div class="album__info">
    <div class="album__info-head">
      <Button
        :label="lang('getRandomAlbum')"
        size="small"
        isOutlined
        isInverted
        @click="getRandomAlbum()"
      />
    </div>
    <div class="album__info-heading">
      <RouterLink
        :to="`/artists/${artist._id}`"
        class="album__info-category"
      >{{ artist.title }}</RouterLink>&nbsp;
      <span class="album__info-divisor">\</span>&nbsp;
      <strong class="album__info-title">{{ title }}</strong>&nbsp;
      <span class="album__info-divisor">\</span>&nbsp;
      <RouterLink
        :to="`/periods/${period._id}`"
        class="album__info-category"
      >{{ period.title }}</RouterLink>,
      <RouterLink
        :to="`/genres/${genre._id}`"
        class="album__info-category"
      >{{ genre.title }}</RouterLink><br>
    </div>
    <div class="album__info-total">{{ totalCounts }}</div>
    <div class="album__info-actions">
      <Button
        :label="lang('playButton')"
        icon="play"
      />
      <Button
        icon="ellipsis"
        isText
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { CategoryBasic } from '~/types/Category'
import { useLocales } from '~/hooks/useLocales'
import Button from './Button.vue'

export default defineComponent({
  name: 'AlbumInfo',
  components: {
    Button
  },
  props: {
    title: {
      type: String,
      required: true
    },
    artist: {
      type: Object as PropType<CategoryBasic>,
      required: true
    },
    genre: {
      type: Object as PropType<CategoryBasic>,
      required: true
    },
    period: {
      type: Object as PropType<CategoryBasic>,
      required: true
    },
    entityType: {
      type: String,
      required: true
    },
    totalCounts: {
      type: String,
      required: true
    },
    getRandomAlbum: {
      type: Function as PropType<() => void>,
      required: true
    }
  },
  setup() {
    const { lang } = useLocales()
    return { lang }
  }
})
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import 'include-media';

.album {

  &__info {
    padding-left: 25px;
    display: flex;
    flex-direction: column;

    &-heading {
      font-weight: 900;
      color: $pale;
      margin: 0.5rem 0 0.5rem;
    }

    &-title {
      color: $warning;
      @include serif(2.25rem, bold);
    }

    &-category {
      font-size: 1.25rem;
      color: inherit;
      transition: color .2s $animation;

      &:hover {
        color: $white;
        transition: color .2s $animation;
      }
    }

    &-divisor {
      font-size: 3rem;
      font-weight: normal;
      color: $warning;
    }

    &-total {
      color: $pale;
      margin-top: auto;
      font-weight: 600;
    }

    &-actions {
      margin-top: 3rem;
      display: flex;
      align-items: center;
    }
  }
}
</style>
