interface IPagination {
  totalDocs: number
  totalPages: number
}

interface IDraggableEvent {
  newIndex: number
  oldIndex: number
}

export {
  IPagination,
  IDraggableEvent
}
