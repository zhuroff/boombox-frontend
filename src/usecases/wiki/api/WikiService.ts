import wiki from 'wikipedia'

export default class WikiService {
  private client: typeof wiki

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
