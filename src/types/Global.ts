interface IPagination {
  totalDocs: number
  totalPages: number
  page: number
}

interface IDraggableEvent {
  newIndex: number
  oldIndex: number
}

export {
  IPagination,
  IDraggableEvent
}
