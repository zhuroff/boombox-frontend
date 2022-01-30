interface IPagination {
  totalDocs: number
  totalPages: number
  page: number
}

interface IDraggableEvent {
  newIndex: number
  oldIndex: number
}

interface IFloatModal {
  isFetched: boolean,
  isActive: boolean,
  data: any
}

export {
  IPagination,
  IDraggableEvent,
  IFloatModal
}
