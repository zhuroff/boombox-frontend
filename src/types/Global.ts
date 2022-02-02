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
}

interface ISnackbar {
  message: string
  type: 'warning' | 'success' | 'error' | 'info'
  order: number
}

export {
  IPagination,
  IDraggableEvent,
  IFloatModalCheckAction,
  ISnackbar
}
