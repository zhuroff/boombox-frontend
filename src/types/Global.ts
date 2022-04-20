type TPagination = {
  totalDocs: number
  totalPages: number
  page: number
}

type DraggableEvent = {
  newIndex: number
  oldIndex: number
}

type ReorderPayload = {
  entityID: string
  oldOrder: number
  newOrder: number
}

type FloatModalCheckAction = {
  inList: boolean
  itemID: string
  listID: string
  order: number
}

type TSnackbar = {
  message: string
  type: 'warning' | 'success' | 'error' | 'info'
  order: number
}

type RequestConfig = {
  page: number
  sort: { [index: string]: number },
  limit: number
}

type ResponseMessage = {
  message: string | number
}

export {
  TPagination,
  DraggableEvent,
  ReorderPayload,
  FloatModalCheckAction,
  TSnackbar,
  RequestConfig,
  ResponseMessage
}
