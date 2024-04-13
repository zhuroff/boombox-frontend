import RadioCard from '~/classes/RadioCard'

export interface RadioConfig {
  genre: string
  offset: number
}

export interface RadioStation {
  country: string
  name: string
  stationuuid: string
  url: string
  url_resolved: string
  tags: string
}

export interface RadioSavePayload {
  stationuuid: string
  name: string
}

export type RadioPageData = Map<string, RadioCard[]>
