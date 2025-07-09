import type { LocalizationConfig } from '../lib/localization/types'

let localizationConfig: LocalizationConfig | null = null

export const setLocalizationConfig = (config: LocalizationConfig) => {
  localizationConfig = config
}

export const useLocalization = () => {
  if (!localizationConfig) {
    throw new Error('Localization config not initialized')
  }

  return localizationConfig
}
