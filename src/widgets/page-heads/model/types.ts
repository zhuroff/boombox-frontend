export interface ActionPropertyItem {
  icon: string
  title: string
  action: () => void
}

export interface HeadEmits {
  (e: 'getRandomAlbum'): void
  (e: 'callSearchBlock'): void
  (e: 'addToCollection'): void
  (e: 'getWikiInfo'): void
  (e: 'deleteAlbum'): void
}
