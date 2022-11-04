export const slugify = (str: string) => (
  str.toLowerCase()
    .replace(/[^a-zа-я0-9\s]+/g, '').trim()
    .replace(/\s+/g, '-').trim()
)
