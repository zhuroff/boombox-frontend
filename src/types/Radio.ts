type RadioConfig = {
  genre: string
  offset: number
}

type RadioStationResponse = {
  country: string
  name: string
  stationuuid: string
  url: string
  url_resolved: string
  tags: string
}

type RadioPage = {
  isFetched: boolean
  data: Map<'saved' | 'all', RadioStationResponse[]>
}

type RadioSavePayload = {
  stationuuid: string
  name: string
}

export {
  RadioConfig,
  RadioStationResponse,
  RadioPage,
  RadioSavePayload
}
