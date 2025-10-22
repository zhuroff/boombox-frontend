<template>
  <section class="template">
    <iframe class="bandcamp" src="https://bandcamp.com/discover?s=new" />
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDevice } from '~shared/model'

const router = useRouter()
const { isMobile } = useDevice()

onMounted(() => {
  isMobile.value && router.push('/albums')
})
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.bandcamp {
  height: calc(100vh - var.$playerHeight);
}
</style>
