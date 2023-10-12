<template>
  
<button
  :class="[{ '--active' : isCrackled }, 'player__crackle']"
  @click="crackleSwitch"
>
  <Sprite name="vinyl" />
</button>

</template>

<script lang="ts">

import { defineComponent, ref } from 'vue'
import usePlayer from '~/hooks/usePlayer'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  components: {
    Sprite
  },

  setup() {
    const { store } = usePlayer()

    const isCrackled = ref(false)

    const crackleSwitch = () => {
      store.dispatch('crackleSwitch')
      isCrackled.value = !isCrackled.value
    }

    return {
      isCrackled,
      crackleSwitch
    }
  },
})

</script>

../../hooks/usePlayer