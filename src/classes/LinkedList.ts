class Node<T> {
  public next: Node<T> | null = null
  public prev: Node<T> | null = null
  constructor(public data: T) {}
}

interface ILinkedList<T extends object> {
  size: number
  unshift(payload: T): Node<T>
  push(payload: T): Node<T>
  remove(node: Node<T>): void
  toArray(): T[]
  toMap<U extends keyof T>(criteria: U): Map<U, T>
  traverse(callback?: <U, V>(...args: U[]) => V): void
  // search(comparator: (payload: T) => boolean): Node<T> | null
}

export class LinkedList<T extends object> implements ILinkedList<T> {
  #head: Node<T> | null = null
  #size = 0

  get size() {
    return this.#size
  }

  unshift(payload: T) {
    const node = new Node(payload)

    if (!this.#head) {
      this.#head = node
    } else {
      this.#head.prev = node
      node.next = this.#head
      this.#head = node
    }

    this.#size++
    return node
  }

  push(payload: T) {
    const node = new Node(payload)

    if (!this.#head) {
      this.#head = node
    } else {
      let current = this.#head

      while (current.next) {
        current = current.next
      }

      current.next = node
    }

    this.#size++
    return node
  }

  remove(node: Node<T>) {
    if (!node.prev) {
      this.#head = node.next
    } else {
      const prevNode = node.prev
      prevNode.next = node.next
    }

    this.#size--
  }

  toArray() {
    const arr: T[] = []
    let current = this.#head

    while (current) {
      arr.push(current.data)
      current = current.next
    }

    return arr
  }

  toMap<U extends keyof T>(criteria: U) {
    const map = new Map<U, T>()
    let current = this.#head

    while (current) {
      map.set(current.data[criteria] as U, current.data)
      current = current.next
    }

    return map
  }

  traverse(callback?: <U, V>(...args: U[]) => V) {
    let current = this.#head

    while (current) {
      callback?.(current.data) || console.log(current.data)
      current = current.next
    }
  }
}
