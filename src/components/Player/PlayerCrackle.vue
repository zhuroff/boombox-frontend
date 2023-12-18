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
import store from '~/store'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  components: {
    Sprite
  },
  setup() {
    const { actions } = store
    const isCrackled = ref(false)

    const crackleSwitch = () => {
      actions.crackleSwitch()
      isCrackled.value = !isCrackled.value
    }

    return {
      isCrackled,
      crackleSwitch
    }
  },
})
</script>
