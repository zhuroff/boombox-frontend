<template>
  <div class="field">Field</div>
</template>

<script setup lang="ts">
import type { UglyFieldProp } from '~/shared/model/types'

interface Props {
  property: FormSchemaProperty
  field: UglyFieldProp
}

const props = defineProps<Props>()
console.log(props)
</script>
