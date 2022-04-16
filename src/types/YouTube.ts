type YTPlaylistResponseItem = {
  contentDetails: {
    videoId: string
  }
}

type YTPlaylistResponse = {
  nextPageToken: string
  items: YTPlaylistResponseItem[]
  pageInfo: {
    totalResults: number
  }
}

export {
  YTPlaylistResponseItem,
  YTPlaylistResponse
}
