export default class ListCardBasic {
  readonly cardType: string
  readonly cardPath?: string

  constructor(cardType: string, cardPath?: string) {
    this.cardType = cardType

    if (cardPath) {
      this.cardPath = cardPath
    }
  }
}
