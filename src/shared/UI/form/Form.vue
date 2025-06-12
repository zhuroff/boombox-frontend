<template>
  <form
    class="form"
    @submit.prevent.stop="emit('formSubmit', formState)"
  >
    <div class="form__body">
      <Field
        v-for="[key, property] in formSchema"
        :key="key"
        :property="property"
        @setFormProperty="setFormProperty"
        @passRefQuery="passRefQuery"
      />
    </div>
    <footer class="form__footer">
      <Button
        type="submit"
        :label="submitButtonLocale"
      />
    </footer>
  </form>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import type { FormPayload, FormSchemaProperty } from '~shared/lib'
import { Button } from '~shared/UI'
import Field from './Field.vue'

interface Props {
  formSchema: Map<string, FormSchemaProperty>
  submitButtonLocale?: string
}

interface Emits {
  (e: 'formSubmit', value: FormPayload): void
  (e: 'passRefQuery', payload: [Record<string, string>, typeof setFormProperty]): void
  (e: 'resetForm'): void
}

withDefaults(defineProps<Props>(), {
  submitButtonLocale: 'submit'
})

const emit = defineEmits<Emits>()

const formState = ref<FormPayload>({})

const setFormProperty = (payload: [string, string | File]) => {
  const [key, value] = payload
  formState.value[key] = value
}

const passRefQuery = (payload: Record<string, string>) => {
  emit('passRefQuery', [payload, setFormProperty])
}

onUnmounted(() => {
  formState.value = {}
  emit('resetForm')
})
</script>

<style lang="scss">
@use '~/app/styles/variables' as var;

.form {

  &__body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__footer {
    margin-top: 1rem;
  }
}

.input-field {
  border: 1px solid;
  border-color: var.$paleMD;
  padding: .5rem .75rem;
  width: 100%;

  &::placeholder {
    color: var.$paleDP;
  }

  &.--error {
    border-color: var.$error;
    outline-color: var.$error;
  }
}
</style>
