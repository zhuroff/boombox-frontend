import { h } from 'vue'
import { RouterLink } from 'vue-router'
import { formatDate } from '~shared/utils'
import { useLocalization } from '~shared/model'
import type { DiscogsCollectionRow, DiscogsReleaseRow } from '~features/discogs'

const renderCollectionRelease = (release: DiscogsReleaseRow) => {
  const { localize, currentLocale } = useLocalization()

  return h(
    'li',
    {
      class: 'collection-release'
    },
    [
      h('img', {
        src: release.thumb,
        class: 'collection-release__cover'
      }),
      h('div', {
        class: 'collection-release__main'
      }, [
        h(
          'a',
          {
            class: 'collection-release__title',
            href: release.release_url,
            target: '_blank'
          },
          release.artists.map(({ name }) => name).join(', ') + ' – ' + release.title
        ),
        h(
          'div',
          {
            class: 'collection-release__info'
          },
          release.styles.map((name) => name).join(', ')
        ),
        h(
          'div',
          {
            class: 'collection-release__info'
          },
          release.labels.map(({ name, catno }) => `${name} – ${catno}`).join(', ') +
          (release.year ? `; ${release.year}` : '')
        ),
        h(
          'div',
          {
            class: 'collection-release__info'
          },
          release.formats.map(({ name, descriptions }) => (
            `${name}: ${descriptions.join(', ')}`
          )).join(', ')
        ),
        h(
          'div',
          {
            class: 'collection-release__info'
          },
          `${localize('release.added')}: ${formatDate(release.date_added, currentLocale.value)}`
        ),
        release.melodymap_link
          ? h(
              'div',
              {
                class: 'collection-release__info'
              },
              [
                h(
                  'span',
                  `${localize('release.listen')}: `
                ),
                release.melodymap_link.split(';')
                  .flatMap((link, index, array) => {
                    const linkElement = h(
                      RouterLink,
                      { to: link.trim() },
                      () => index + 1
                    )
                    
                    if (index < array.length - 1) {
                      return [linkElement, ', ']
                    }
                    return [linkElement]
                  })
              ]
            )
          : null
      ])
    ]
  )
}

export const renderCollection = (collection: DiscogsCollectionRow) => {
  const { releases, pagination } = collection

  return h(
    'section',
    {
      class: 'collection'
    },
    [
      releases.map(renderCollectionRelease)
    ]
  )
}
