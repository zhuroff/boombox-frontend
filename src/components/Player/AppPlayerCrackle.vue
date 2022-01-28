<template>
  
<button
  :class="[{ '--active' : isCrackled }, 'player__crackle']"
  @click="crackleSwitch"
>
  <AppSprite name="vinyl" />
</button>

</template>

<script lang="ts">

import { defineComponent, ref } from 'vue'
import usePlayer from './usePlayer'
import AppSprite from '~/components/AppSprite.vue'

export default defineComponent({
  components: {
    AppSprite
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

