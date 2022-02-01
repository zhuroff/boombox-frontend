interface IPagination {
  totalDocs: number
  totalPages: number
  page: number
}

interface IDraggableEvent {
  newIndex: number
  oldIndex: number
}

interface IFloatModalCheckAction {
  inList: boolean
  itemID: string
  listID: string
  order?: number
}

export {
  IPagination,
  IDraggableEvent,
  IFloatModalCheckAction
}
