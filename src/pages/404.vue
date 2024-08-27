<template>
  <section class="section">
    <div class="section__center">
      <h1>{{ localize('pageNotFound') }}</h1>
      <div>
        <Button
          :label="localize('goBack')"
          @click="() => router.back()"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import useGlobalStore from '~/store/global'
import Button from '~/components/Button.vue'

const router = useRouter()

const {
  globalGetters: { localize }
} = useGlobalStore()
</script>
