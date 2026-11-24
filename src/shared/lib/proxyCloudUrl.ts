import { hostString } from '~shared/utils'

export const proxyCloudUrl = (url?: string): string | undefined => {
  if (!url) return url

  const isPCloud = url.includes('pcloud.com') || url.includes('api.pcloud.com')
  const isYandexDownload = url.includes('downloader.disk.yandex.ru')

  if (isPCloud || isYandexDownload) {
    return hostString(`/api/proxy?url=${encodeURIComponent(url)}`)
  }

  return url
}
