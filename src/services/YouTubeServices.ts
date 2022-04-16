import axios from 'axios'
import { YTPlaylistResponse } from '~/types/YouTube'

export default class YouTubeServices {
  static async playlist(perPage: number, nextPage: string | null) {
    const apiURL = 'https://www.googleapis.com/youtube/v3/playlistItems'
    const apiKey = process.env.VUE_APP_YOUTUBE_API_KEY
    const playlistID = process.env.VUE_APP_YOUTUBE_PLAYLIST_ID
    const part = 'contentDetails'
    const fields = 'items(contentDetails(videoId)),pageInfo(totalResults),nextPageToken'

    const query = `
      ${apiURL}
      ?key=${apiKey}
      &playlistId=${playlistID}
      &maxResults=${perPage}
      &pageToken=${nextPage || ''}
      &part=${part}
      &fields=${fields}
    `.replace(/\s/g, '')

    const response = await axios.get<YTPlaylistResponse>(query)
    
    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }
}
