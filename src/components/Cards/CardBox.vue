<template>
  <router-link
    class="card-box__link"
    :to="{ path: `/${rootPath}/${card._id}` }"
  >
    <div class="card-box__image">
      <img
        :src="card.coverURL"
        :alt="card.title"
        class="card-box__image_img"
      />
      <img
        src="/img/vinyl.png"
        alt="vinyl placeholder"
        class="card-box__image_vinyl"
      />
    </div>
    <div class="card-box__title">{{ card.title }}</div>
    <div class="card-box__info">{{ card.caption }}</div>
  </router-link>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue'
import { CardBasic } from '~/types/Global'

export default defineComponent({
  name: 'CardBox',

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

<style lang="scss">
@import '~/scss/variables';
@import 'include-media';

.card-box {
  position: relative;
  border-radius: 5px;
  transition: all 0.3s ease;

  @include media('>=desktop') {
    margin-bottom: 15px;
    padding: 10px;
  }

  &__link {
    display: block;
    text-align: center;
    position: relative;

    @include media('>=desktop') {
      padding: 0 10px;
      min-height: 252px;
    }
  }

  &__image {
    object-fit: cover;
    position: relative;

    &_img,
    &_vinyl {
      width: 100%;
      display: block;
      transition: transform 0.5s $animation;

      @include media('>=desktop') {
        height: 212px;
      }
    }

    &_img {
      position: relative;
      z-index: 2;
      border-radius: 5px;
      object-fit: cover;

      @include media('>=desktop') {
        &:hover {
          transform: translateX(-10px);
          transition: transform 0.5s $animation;

          & + .card-box__image_vinyl {
            transform: translateX(20px);
            transition: transform 0.5s $animation;
          }
        }
      }
    }

    &_vinyl {
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
  }

  &__title {

    @include media('<desktop') {
      display: none
    }

    @include media('>=desktop') {
      font-weight: 600;
      color: $dark;
      font-size: 14px;
      position: relative;
      margin-top: 7px;
    }
  }

  &__info {

    @include media('<desktop') {
      display: none
    }

    @include media('>=desktop') {
      font-weight: 600;
      color: $pale;
      font-size: 12px;
      position: relative;
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

  &.--active {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }

  &.sortable-chosen {
    background-color: $border;
  }

  @include media('>=desktop') {
    &:hover {
      box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      transition: box-shadow 0.3s ease;

      .delete {
        opacity: 1;
        transition: opacity 0.3s ease;
      }

      .--drag {
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }
  }

  &__confirmation {
    position: absolute;
    top: 10px;
    left: 20px;
    background-color: rgba(0, 0, 0, 0.35);
    height: 212px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: calc(100% - 40px);
    border-radius: 5px;
    z-index: 10;

    .button {
      margin: 5px 0;
    }
  }

  .--drag {
    width: 30px;
    height: 30px;
    cursor: move;
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    top: 15px;
    left: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.3s ease;

    .icon {
      width: 18px;
    }
  }

  &__youtube {
    
    iframe {
      width: 100%;
      display: block;
      border-radius: 5px;

      @include media('<tablet') {
        height: 26vmax;
      }

      @include media('>=tablet') {
        height: 18vmax;
      }

      @include media('>=desktop') {
        height: 270px;
      }
    }
  }
}
</style>
