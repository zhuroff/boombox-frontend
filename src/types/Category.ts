export type CategoryKeysSingular = 'artist' | 'genre' | 'period'
export type CategoryKeysPlural = 'artists' | 'genres' | 'periods'
export type CategoryKeys = Record<CategoryKeysSingular, string>
export type CategoryMatcher = Record<CategoryKeysPlural, CategoryKeysSingular>
