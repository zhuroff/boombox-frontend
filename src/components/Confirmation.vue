<template>
  <div class="confirmation">
    <div class="confirmation__message">{{ message }}</div>
    <div class="confirmation__actions">
      <Button
        :label="localize('delete')"
        @click="() => $emit('confirm')"
      />
      <Button
        :label="localize('cancel')"
        @click="() => $emit('reject')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import useGlobalStore from '~/store/global'
import Button from '~/components/Button.vue'

interface Props {
  message: string
}

defineProps<Props>()

const {
  globalGetters: { localize }
} = useGlobalStore()
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
    margin-bottom: 1rem;
    color: $black;
    font-weight: 600;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem
  }
}
</style>
