export class CloudContent<T> {
  items: T[] = []
  limit: number = 10
  offset: number = 0
  total: number = 0
  isFetched: boolean = false
}
