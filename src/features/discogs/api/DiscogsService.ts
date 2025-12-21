import { api } from '~shared/api'
import type { DiscogsSearchQueryConfig, DiscogsCollectionRow, DiscogsTableRow, DiscogsCollectionQueryConfig } from '../lib/types'

export default class DiscogsService {
  getCollection = async (searchParams: DiscogsCollectionQueryConfig) => {
    const response = await api.get<DiscogsCollectionRow[]>(
      '/api/discogs/collection',
      { params: searchParams }
    )

    if (response?.status === 200) {
      return response.data
    }

    throw new Error('Failed request')
  }

  searchDiscogsData = async (searchParams: DiscogsSearchQueryConfig): Promise<DiscogsTableRow[]> => {
    const response = await api.get<DiscogsTableRow[]>(
      '/api/discogs/search', 
      { params: searchParams }
    )

    if (response?.status === 200) {
      return response.data
    }

    throw new Error('Failed request')
  }
}
