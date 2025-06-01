<template>
  <section class="settings__section">
    <h2 class="settings__section-heading">
      {{ localize('headings.users') }}
    </h2>
  </section>
</template>

<script setup lang="ts">
import { useTranslate } from '~features/localization'

const { localize } = useTranslate()
</script>

<style lang="scss" scoped>
@use '~/scss/variables' as var;

.settings__section {
  grid-area: users;

  &-heading {
    @include var.serif(1.75rem);
    margin-bottom: .5rem;
  }
}
</style>
