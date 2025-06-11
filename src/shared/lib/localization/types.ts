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

export type LocalizationService = {
  locales: Map<string, LocaleItem>
  currentLocale: Ref<LocaleItem>
  localize(path: string, ...vars: string[]): string
  setLocale(locale: LocaleItem): void
  checkAndSetLocale(): void
}

let localizationService: LocalizationService | null = null

export const setLocalizationService = (service: LocalizationService) => {
  localizationService = service
};

export const useLocalization = () => {
  if (!localizationService) {
    throw new Error('Localization service not initialized')
  }
  return localizationService
}
