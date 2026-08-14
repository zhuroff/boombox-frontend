import wikiModule from 'wikipedia'

type WikipediaClient = typeof wikiModule & {
  default?: typeof wikiModule
}

const wiki = (wikiModule as WikipediaClient).default ?? wikiModule

export default class WikiService {
  private client: WikipediaClient

  constructor() {
    this.client = wiki
  }

  getPage(pageID: string) {
    return this.client.page(pageID)
  }

  setLang(lang: string) {
    this.client.setLang(lang)
  }

  search(query: string) {
    return this.client.search(query)
  }
}
