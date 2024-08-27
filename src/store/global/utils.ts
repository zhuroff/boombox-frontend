export const findLocaleLangValue = (path: string[], dict?: LocaleDictionary): string | null => {
  const value = dict?.[path[0]]
  if (!value) {
    return null
  }
  if (typeof value === 'string') {
    return path.length === 1 ? value : null
  }
  path.splice(0, 1)
  return findLocaleLangValue(path, value)
}
