import type { Ref } from 'vue'

export enum LocaleKeys {
  EN = 'en',
  BY = 'by',
}

export type LocaleItem = {
  intlName: string
  locale: LocaleKeys
  stateFlag: string
  title: string
}

export type LocalizationConfig = {
  locales: Map<string, LocaleItem>
  currentLocale: Ref<LocaleItem>
  localize: (path: string, ...vars: string[]) => string
  setLocale: (locale: LocaleItem) => void
  checkAndSetLocale: () => void
}
