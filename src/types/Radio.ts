type RadioConfig = {
  genre: string
  offset: number
}

type RadioStationResponse = {
  country: string
  countrycode: string
  favicon: string
  homepage: string
  name: string
  stationuuid: string
  url: string
  url_resolved: string
  votes: number
}

type RadioPage = {
  isFetched: boolean
  data: Map<'saved' | 'all', any>
}

export {
  RadioConfig,
  RadioStationResponse,
  RadioPage
}
