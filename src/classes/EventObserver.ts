export default class EventObserver {
  #observers: Function[]

  constructor () {
    this.#observers = []
  }

  subscribe(fn: Function) {
    this.#observers.push(fn)
  }

  unsubscribe(fn: Function) {
    this.#observers = this.#observers.filter((subscriber) => subscriber !== fn)
  }

  notify(data?: unknown) {
    this.#observers.forEach((subscriber) => subscriber(data))
  }
}
