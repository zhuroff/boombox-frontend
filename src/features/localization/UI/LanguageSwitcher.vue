<template>
  <Dropdown
    size="medium"
    :items="localesSelector"
    :selectedValue="selectedValue"
    @applyValue="applySelect"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTranslate, LocaleKeys } from '~features/localization'
import { Dropdown } from '~shared/UI'
import type { DropdownItem } from '~shared/lib'

const { locales, currentLocale, setLocale } = useTranslate()

const localesSelector = computed<DropdownItem[]>(() => {
  return (
    Array.from(locales.values())
      .map(({ locale }) => ({
        path: `languages.${locale}`,
        value: locale,
        icon: `flag-${locale}`
      }))
  )
})

const selectedValue = computed(() => (
  currentLocale.value.locale as string
))

const applySelect = (option: DropdownItem) => {
  const locale = locales.get(option.value as LocaleKeys)
  if (locale) {
    setLocale(locale)
  }
}
</script>
