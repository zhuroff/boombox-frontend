<template>
  <li class="cards__album">
    <router-link
      class="cards__album-link"
      :to="{ path: `/${rootPath}/${card._id}` }"
    >
      <div class="cards__album-image">
        <img
          :src="card.coverURL || placeholderImage"
          :alt="card.title"
          class="cards__album-cover"
        />
        <img
          src="/img/vinyl.png"
          alt="vinyl placeholder"
          class="cards__album-vinyl"
        />
      </div>
      <div class="cards__album-title">{{ card.title }}</div>
      <div class="cards__album-info">{{ card.caption }}</div>
    </router-link>
    <Button
      v-if="isDraggable"
      icon="drag"
      size="small"
      className="--drag"
      isText
    />
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import AlbumItem from '~/classes/AlbumItem'
import Button from '~/components/Button.vue'

export default defineComponent({
  name: 'AlbumCard',
  components: {
    Button
  },
  props: {
    card: {
      type: Object as PropType<AlbumItem>,
      required: true
    },
    rootPath: {
      type: String,
      required: true
    },
    placeholderImage: {
      type: String,
      required: true
    },
    isDraggable: {
      type: Boolean,
      required: true
    }
  }
})
</script>

<style lang="scss">
@import '~/scss/variables';
@import 'include-media';

.cards {

  &__album {
    position: relative;
    border-radius: 5px;
    transition: all 0.3s ease;
    list-style: none;

    @include media('>=desktop') {
      margin-bottom: 15px;
      padding: 10px;
    }

    .--drag {
      position: absolute;
      top: 1rem;
      left: 1.65rem;
      z-index: 2000;
      background-color: $white;
      cursor: move;
    }

    &-link {
      display: block;
      text-align: center;
      position: relative;

      @include media('>=desktop') {
        padding: 0 10px;
        min-height: 252px;
      }
    }

    &-image {
      object-fit: cover;
      position: relative;
    }

    &-cover,
    &-vinyl {
      width: 100%;
      display: block;
      transition: transform 0.5s $animation;

      @include media('>=desktop') {
        height: 212px;
      }
    }

    &-cover {
      position: relative;
      z-index: 2;
      border-radius: 5px;
      object-fit: cover;

      @include media('>=desktop') {
        &:not(.--fixed) {
          &:hover {
            transform: translateX(-10px);
            transition: transform 0.3s $animation;

            & + .cards__album-vinyl {
              transform: translateX(20px);
              transition: transform 0.3s $animation;
            }
          }
        }
      }
    }

    &-vinyl {
      @include media('<desktop') {
        display: none
      }

      @include media('>=desktop') {
        position: absolute;
        z-index: 1;
        top: 0;
        right: 0;
      }
    }

    &-title {

      @include media('<desktop') {
        display: none
      }

      @include media('>=desktop') {
        @include cardHeading();
      }
    }

    &-info {

      @include media('<desktop') {
        display: none
      }

      @include media('>=desktop') {
        @include cardCaption();
      }
    }

    &__cover {

      &_label {
        position: relative;
        z-index: 1;

        .icon {
          width: 50px;
          height: 50px;
          color: $white;
        }
      }
    }

    // &.--active {
    //   box-shadow: $shadowMedium;
    // }

    // &.sortable-chosen {
    //   background-color: $paleLT;
    // }

    // @include media('>=desktop') {
    //   &:hover {
    //     box-shadow: $shadowMedium;
    //     transition: box-shadow 0.3s ease;

    //     .delete {
    //       opacity: 1;
    //       transition: opacity 0.3s ease;
    //     }

    //     .--drag {
    //       opacity: 1;
    //       transition: opacity 0.3s ease;
    //     }
    //   }
    // }

    // &__confirmation {
    //   position: absolute;
    //   top: 10px;
    //   left: 20px;
    //   background-color: rgba(0, 0, 0, 0.35);
    //   height: 212px;
    //   display: flex;
    //   flex-direction: column;
    //   justify-content: center;
    //   align-items: center;
    //   width: calc(100% - 40px);
    //   border-radius: 5px;
    //   z-index: 10;

    //   .button {
    //     margin: 5px 0;
    //   }
    // }

    // .--drag {
    //   width: 30px;
    //   height: 30px;
    //   cursor: move;
    //   background-color: #fff;
    //   border-radius: 50%;
    //   position: absolute;
    //   top: 15px;
    //   left: 15px;
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    //   z-index: 10;
    //   opacity: 0;
    //   transition: opacity 0.3s ease;

    //   .icon {
    //     width: 18px;
    //   }
    // }
  }
}
</style>
