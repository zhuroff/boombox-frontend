<template>
  <div class="confirmation">
    <div class="confirmation__message">{{ message }}</div>
    <div class="confirmation__actions">
      <Button
        :label="lang('delete')"
        @click="() => $emit('confirm')"
      />
      <Button
        :label="lang('cancel')"
        @click="() => $emit('reject')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useLocales } from '~/hooks/useLocales'
import Button from '~/components/Button.vue'

export default defineComponent({
  name: 'Confirmation',
  components: {
    Button
  },
  props: {
    message: {
      type: String,
      required: true
    }
  },
  setup() {
    const { lang } = useLocales()
    return { lang }
  }
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';
@import 'include-media';

.confirmation {
  background-color: $white;
  border-radius: $borderRadiusMD;
  padding: 25px;

  &__message {
    text-align: center;
    font-size: 1rem;
    margin-bottom: 1rem;
    color: $black;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem
  }
}
</style>
