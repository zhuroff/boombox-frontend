<template>
  <section class="content">
    <div class="unknown-page">
      <h1>{{ localize('pageNotFound') }}</h1>
      <div>
        <Button
          label="goBack"
          @click="() => router.back()"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLocalization } from '~shared/lib'
import { Button } from '~shared/UI'

const router = useRouter()

const { localize } = useLocalization()
</script>

<style lang="scss" scoped>
@use '~app/styles/variables' as var;

.unknown-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1 {
    @include var.serif(2rem);
    margin-bottom: 1rem;
  }
}
</style>