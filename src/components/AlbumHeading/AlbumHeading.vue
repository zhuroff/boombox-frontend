<template>  
  <div class="album__heading">
    <h1 class="album__name">{{ albumHead.title }}</h1>

    <div
      class="album__data"
      v-if="albumHead.artist"
    >
      <router-link
        :to="`/artists/${albumHead.artist._id}`"
        class="album__data-link"
      >
        {{ albumHead.artist.title }}
      </router-link>,

      <router-link
        :to="`/periods/${albumHead.period._id}`"
        class="album__data-link"
      >
        {{ albumHead.period.title }}
      </router-link> /

      <router-link
        :to="`/genres/${albumHead.genre._id}`"
        class="album__data-link"
      >
        {{ albumHead.genre.title }}
      </router-link>

      <Textarea
        :rows="2"
        :content="albumDescription"
        classname="album__description"
        placeholder="Type some description..."
        @setTextareaValue="textInputHandler"
      />
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent, ComputedRef, computed, PropType } from 'vue'
import { AlbumHeadProps } from '~/types/Album'
import Textarea from '~/components/Inputs/Textarea.vue'
import './AlbumHeading.scss'

export default defineComponent({
  name: 'AlbumHeading',

  components: {
    Textarea
  },

  props: {
    albumHead: {
      type: Object as PropType<AlbumHeadProps>,
      required: true
    }
  },

  setup(props, { emit }) {
    const albumDescription: ComputedRef<string> = computed(() => (
      props.albumHead.description
    ))

    const textInputHandler = (value: string) => (
      emit('textInputHandler', value)
    )

    return {
      albumDescription,
      textInputHandler
    }
  }
})

</script>
