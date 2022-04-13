import { IPagination } from './Global'

type NewsPage = {
  id: number
  dates: string
  title: string
  description: string
  price: string
  isFree: boolean
  imageUrl: string | undefined
  siteUrl: string
}

type NewsPageResponse = {
  docs: NewsPage[]
  pagination: IPagination
}

export {
  NewsPage,
  NewsPageResponse
}
