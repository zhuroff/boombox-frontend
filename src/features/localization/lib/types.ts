export enum LocaleKeys {
  EN = 'en',
  BY = 'by',
}

export interface LocaleDictionary {
  [key: string]: string | LocaleDictionary
}

export interface LocaleItem {
  intlName: string
  locale: LocaleKeys
  stateFlag: string
  title: string
}
