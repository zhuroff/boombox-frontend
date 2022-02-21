type IPagination = {
  totalDocs: number
  totalPages: number
  page: number
}

type IDraggableEvent = {
  newIndex: number
  oldIndex: number
}

type IFloatModalCheckAction = {
  inList: boolean
  itemID: string
  listID: string
  order: number
}

type ISnackbar = {
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
  IPagination,
  IDraggableEvent,
  IFloatModalCheckAction,
  ISnackbar,
  RequestConfig,
  ResponseMessage
}
