<template>
  <section class="section">
    <div class="section__center">
      <h1>{{ lang('pageNotFound') }}</h1>
      <div>
        <Button
          :label="lang('goBack')"
          @click="() => router.back()"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useLocales } from '~/hooks/useLocales'
import Button from '~/components/Button.vue'

export default defineComponent({
  name: 'not-found',
  components: {
    Button
  },
  setup() {
    const router = useRouter()
    const { lang } = useLocales()

    return { router, lang }
  }
})
</script>
