import { BasicEntity } from '~/types/Common'
import { RadioStation } from '~/types/Radio'
import ListCardBasic from './ListCardBasic'

export default class RadioCard extends ListCardBasic implements BasicEntity {
  _id: string
  title: string
  country: string
  url: string
  urlResolved: string
  tags: string

  constructor(station: RadioStation, cardType: string) {
    super(cardType)
    this._id = station.stationuuid
    this.title = station.name
    this.country = station.country
    this.url = station.url
    this.urlResolved = station.url_resolved
    this.tags = station.tags
  }
}
